import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
    // Load deployment info
    const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
    const reliefAddress = deploymentInfo.contracts.ReliefDonation;

    console.log("📍 Using ReliefDonation contract at:", reliefAddress);

    // Get signer
    const [signer] = await ethers.getSigners();
    console.log("👤 Interacting as:", signer.address);

    // Get contract instance
    const ReliefDonation = await ethers.getContractFactory("ReliefDonation");
    const relief = ReliefDonation.attach(reliefAddress);

    // Example: Create a campaign
    console.log("\n📢 Creating a new relief campaign...");

    const campaignDetails = {
        name: "Typhoon Relief Fund 2025",
        description: "Emergency relief for typhoon victims in Northern Philippines",
        targetAmount: ethers.parseEther("100"), // 100 ETH target
        duration: 30 * 24 * 60 * 60, // 30 days
        ipfsMetadata: "QmExampleIPFSHashForCampaignDetails", // Replace with actual IPFS hash
        milestones: [25, 50, 75, 100] // Release funds at 25%, 50%, 75%, 100% milestones
    };

    const tx = await relief.createCampaign(
        campaignDetails.name,
        campaignDetails.description,
        campaignDetails.targetAmount,
        campaignDetails.duration,
        campaignDetails.ipfsMetadata,
        campaignDetails.milestones
    );

    await tx.wait();
    console.log("✅ Campaign created! Transaction hash:", tx.hash);

    // Get campaign ID (it should be 1 for first campaign)
    const campaignId = 1;

    // Verify the campaign (as verifier)
    console.log("\n🔍 Verifying campaign...");
    const verifyTx = await relief.verifyCampaign(campaignId);
    await verifyTx.wait();
    console.log("✅ Campaign verified!");

    // Make a test donation
    console.log("\n💰 Making a test donation...");
    const donationAmount = ethers.parseEther("0.01"); // 0.01 ETH
    const donateTx = await relief.donate(
        campaignId,
        "Supporting typhoon victims! Stay strong!",
        { value: donationAmount }
    );

    await donateTx.wait();
    console.log("✅ Donation successful! Amount:", ethers.formatEther(donationAmount), "ETH");

    // Check campaign details
    const campaign = await relief.campaigns(campaignId);
    console.log("\n📊 Campaign Status:");
    console.log("- Name:", campaign.name);
    console.log("- Raised:", ethers.formatEther(campaign.raisedAmount), "ETH");
    console.log("- Target:", ethers.formatEther(campaign.targetAmount), "ETH");
    console.log("- Verified:", campaign.isVerified);
}

// Function to make a donation
export async function makeDonation(campaignId: number, amount: string, message: string) {
    const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
    const reliefAddress = deploymentInfo.contracts.ReliefDonation;

    const [signer] = await ethers.getSigners();
    const ReliefDonation = await ethers.getContractFactory("ReliefDonation");
    const relief = ReliefDonation.attach(reliefAddress);

    const donationAmount = ethers.parseEther(amount);
    const tx = await relief.donate(campaignId, message, { value: donationAmount });

    await tx.wait();
    console.log(`✅ Donated ${amount} ETH to campaign ${campaignId}`);

    return tx.hash;
}

// Function to check donor's receipts
export async function checkDonorReceipts(donorAddress: string) {
    const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
    const reliefAddress = deploymentInfo.contracts.ReliefDonation;

    const ReliefDonation = await ethers.getContractFactory("ReliefDonation");
    const relief = ReliefDonation.attach(reliefAddress);

    const receipts = await relief.getDonorReceipts(donorAddress);

    console.log(`\n📜 Donation Receipts for ${donorAddress}:`);
    receipts.forEach((receipt: any, index: number) => {
        console.log(`\nReceipt #${index + 1}:`);
        console.log("- Donation ID:", receipt.donationId.toString());
        console.log("- Campaign ID:", receipt.campaignId.toString());
        console.log("- Amount:", ethers.formatEther(receipt.amount), "ETH");
        console.log("- Timestamp:", new Date(Number(receipt.timestamp) * 1000).toLocaleString());
        console.log("- Receipt Hash:", receipt.receiptHash);
    });

    return receipts;
}

// Run if called directly
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}