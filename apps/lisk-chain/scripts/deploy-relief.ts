import { ethers } from "hardhat";

async function main() {
    console.log("🚀 Starting deployment of Relief Platform contracts...\n");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📍 Deploying with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

    // Deploy ReliefDonation contract
    console.log("1️⃣ Deploying ReliefDonation contract...");
    const ReliefDonation = await ethers.getContractFactory("ReliefDonation");
    const reliefDonation = await ReliefDonation.deploy();
    await reliefDonation.waitForDeployment();
    const reliefAddress = await reliefDonation.getAddress();
    console.log("✅ ReliefDonation deployed to:", reliefAddress);

    // Deploy DonationNFT contract
    console.log("\n2️⃣ Deploying DonationNFT contract...");
    const DonationNFT = await ethers.getContractFactory("DonationNFT");
    const donationNFT = await DonationNFT.deploy(reliefAddress);
    await donationNFT.waitForDeployment();
    const nftAddress = await donationNFT.getAddress();
    console.log("✅ DonationNFT deployed to:", nftAddress);

    // Setup initial roles (example)
    console.log("\n3️⃣ Setting up initial roles...");

    // Register deployer as first NGO for testing
    const NGO_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NGO_ROLE"));
    await reliefDonation.grantRole(NGO_ROLE, deployer.address);
    console.log("✅ Granted NGO role to deployer");

    // Register deployer as verifier for testing
    const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
    await reliefDonation.grantRole(VERIFIER_ROLE, deployer.address);
    console.log("✅ Granted Verifier role to deployer");

    console.log("\n🎉 Deployment completed successfully!");
    console.log("=====================================");
    console.log("📝 Contract Addresses:");
    console.log("ReliefDonation:", reliefAddress);
    console.log("DonationNFT:", nftAddress);
    console.log("=====================================");

    // Save deployment info
    const deploymentInfo = {
        network: "lisk-sepolia",
        contracts: {
            ReliefDonation: reliefAddress,
            DonationNFT: nftAddress
        },
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };

    // Save to file
    const fs = require("fs");
    fs.writeFileSync(
        "deployment.json",
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to deployment.json");

    // Explorer links
    console.log("\n🔍 View on Explorer:");
    console.log(`ReliefDonation: https://sepolia-blockscout.lisk.com/address/${reliefAddress}`);
    console.log(`DonationNFT: https://sepolia-blockscout.lisk.com/address/${nftAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });