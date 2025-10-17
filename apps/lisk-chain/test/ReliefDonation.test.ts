import { expect } from "chai";
import { ethers } from "hardhat";
import { ReliefDonation, DonationNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Relief Donation Platform", function () {
    let reliefDonation: ReliefDonation;
    let donationNFT: DonationNFT;
    let owner: SignerWithAddress;
    let ngo: SignerWithAddress;
    let verifier: SignerWithAddress;
    let donor1: SignerWithAddress;
    let donor2: SignerWithAddress;
    let recipient: SignerWithAddress;

    beforeEach(async function () {
        [owner, ngo, verifier, donor1, donor2, recipient] = await ethers.getSigners();

        // Deploy ReliefDonation contract
        const ReliefDonation = await ethers.getContractFactory("ReliefDonation");
        reliefDonation = await ReliefDonation.deploy();
        await reliefDonation.waitForDeployment();

        // Deploy DonationNFT contract
        const DonationNFT = await ethers.getContractFactory("DonationNFT");
        donationNFT = await DonationNFT.deploy(await reliefDonation.getAddress());
        await donationNFT.waitForDeployment();

        // Setup roles
        const NGO_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NGO_ROLE"));
        const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));

        await reliefDonation.grantRole(NGO_ROLE, ngo.address);
        await reliefDonation.grantRole(VERIFIER_ROLE, verifier.address);
    });

    describe("Campaign Management", function () {
        it("Should create a new campaign", async function () {
            const campaignName = "Typhoon Relief 2025";
            const description = "Emergency relief for typhoon victims";
            const targetAmount = ethers.parseEther("100");
            const duration = 30 * 24 * 60 * 60; // 30 days
            const ipfsMetadata = "QmTestIPFSHash";
            const milestones = [25, 50, 75, 100];

            await expect(
                reliefDonation.connect(ngo).createCampaign(
                    campaignName,
                    description,
                    targetAmount,
                    duration,
                    ipfsMetadata,
                    milestones
                )
            ).to.emit(reliefDonation, "CampaignCreated")
                .withArgs(1, campaignName, ngo.address);

            const campaign = await reliefDonation.campaigns(1);
            expect(campaign.name).to.equal(campaignName);
            expect(campaign.targetAmount).to.equal(targetAmount);
            expect(campaign.ngoAddress).to.equal(ngo.address);
            expect(campaign.isActive).to.be.true;
        });

        it("Should verify a campaign", async function () {
            // Create campaign first
            await reliefDonation.connect(ngo).createCampaign(
                "Test Campaign",
                "Test Description",
                ethers.parseEther("50"),
                30 * 24 * 60 * 60,
                "QmTest",
                []
            );

            // Verify campaign
            await expect(
                reliefDonation.connect(verifier).verifyCampaign(1)
            ).to.emit(reliefDonation, "CampaignVerified")
                .withArgs(1, verifier.address);

            const campaign = await reliefDonation.campaigns(1);
            expect(campaign.isVerified).to.be.true;
        });

        it("Should reject campaign creation from non-NGO", async function () {
            await expect(
                reliefDonation.connect(donor1).createCampaign(
                    "Unauthorized Campaign",
                    "Should fail",
                    ethers.parseEther("10"),
                    30 * 24 * 60 * 60,
                    "QmFail",
                    []
                )
            ).to.be.reverted;
        });
    });

    describe("Donations", function () {
        beforeEach(async function () {
            // Create and verify a campaign
            await reliefDonation.connect(ngo).createCampaign(
                "Test Campaign",
                "Test Description",
                ethers.parseEther("100"),
                30 * 24 * 60 * 60,
                "QmTest",
                [25, 50, 75, 100]
            );
            await reliefDonation.connect(verifier).verifyCampaign(1);
        });

        it("Should accept donations", async function () {
            const donationAmount = ethers.parseEther("1");

            await expect(
                reliefDonation.connect(donor1).donate(
                    1,
                    "Supporting the cause!",
                    { value: donationAmount }
                )
            ).to.emit(reliefDonation, "DonationReceived")
                .withArgs(1, donor1.address, donationAmount);

            const campaign = await reliefDonation.campaigns(1);
            expect(campaign.raisedAmount).to.equal(donationAmount);
        });

        it("Should generate donation receipt", async function () {
            const donationAmount = ethers.parseEther("0.5");

            await reliefDonation.connect(donor1).donate(
                1,
                "Keep up the good work!",
                { value: donationAmount }
            );

            const receipts = await reliefDonation.getDonorReceipts(donor1.address);
            expect(receipts.length).to.equal(1);
            expect(receipts[0].amount).to.equal(donationAmount);
            expect(receipts[0].campaignId).to.equal(1);
        });

        it("Should track donor's campaigns", async function () {
            await reliefDonation.connect(donor1).donate(
                1,
                "Test donation",
                { value: ethers.parseEther("0.1") }
            );

            const donorCampaigns = await reliefDonation.getDonorCampaigns(donor1.address);
            expect(donorCampaigns.length).to.equal(1);
            expect(donorCampaigns[0]).to.equal(1);
        });

        it("Should reject donation to unverified campaign", async function () {
            // Create unverified campaign
            await reliefDonation.connect(ngo).createCampaign(
                "Unverified Campaign",
                "Not verified",
                ethers.parseEther("10"),
                30 * 24 * 60 * 60,
                "QmUnverified",
                []
            );

            await expect(
                reliefDonation.connect(donor1).donate(
                    2,
                    "Should fail",
                    { value: ethers.parseEther("0.1") }
                )
            ).to.be.revertedWith("Campaign not verified");
        });
    });

    describe("Fund Disbursement", function () {
        beforeEach(async function () {
            // Create, verify campaign and add donations
            await reliefDonation.connect(ngo).createCampaign(
                "Disbursement Test",
                "Test Description",
                ethers.parseEther("10"),
                30 * 24 * 60 * 60,
                "QmTest",
                [25, 50, 75, 100] // Milestone-based release
            );
            await reliefDonation.connect(verifier).verifyCampaign(1);

            // Add donations
            await reliefDonation.connect(donor1).donate(
                1,
                "Donation 1",
                { value: ethers.parseEther("5") }
            );
            await reliefDonation.connect(donor2).donate(
                1,
                "Donation 2",
                { value: ethers.parseEther("3") }
            );
        });

        it("Should disburse funds within milestone limits", async function () {
            // First milestone allows 25% of raised amount (8 ETH * 25% = 2 ETH)
            const disbursementAmount = ethers.parseEther("2");

            await expect(
                reliefDonation.connect(ngo).disburseFunds(
                    1,
                    disbursementAmount,
                    recipient.address,
                    "First batch of supplies",
                    "QmProofOfUse1"
                )
            ).to.emit(reliefDonation, "FundsDisbursed");

            const campaign = await reliefDonation.campaigns(1);
            expect(campaign.disbursedAmount).to.equal(disbursementAmount);
        });

        it("Should reject disbursement exceeding milestone", async function () {
            // Try to disburse more than 25% (first milestone)
            const excessiveAmount = ethers.parseEther("3"); // More than 25% of 8 ETH

            await expect(
                reliefDonation.connect(ngo).disburseFunds(
                    1,
                    excessiveAmount,
                    recipient.address,
                    "Too much",
                    "QmProof"
                )
            ).to.be.revertedWith("Exceeds milestone limit");
        });

        it("Should advance milestone after verification", async function () {
            // First disbursement
            await reliefDonation.connect(ngo).disburseFunds(
                1,
                ethers.parseEther("2"),
                recipient.address,
                "First batch",
                "QmProof1"
            );

            // Verify disbursement to unlock next milestone
            await reliefDonation.connect(verifier).verifyDisbursement(1);

            // Now can disburse up to 50% (4 ETH total)
            await reliefDonation.connect(ngo).disburseFunds(
                1,
                ethers.parseEther("2"),
                recipient.address,
                "Second batch",
                "QmProof2"
            );

            const campaign = await reliefDonation.campaigns(1);
            expect(campaign.disbursedAmount).to.equal(ethers.parseEther("4"));
        });
    });

    describe("Receipt Verification", function () {
        it("Should verify authentic receipts", async function () {
            // Setup campaign and donation
            await reliefDonation.connect(ngo).createCampaign(
                "Receipt Test",
                "Test",
                ethers.parseEther("10"),
                30 * 24 * 60 * 60,
                "QmTest",
                []
            );
            await reliefDonation.connect(verifier).verifyCampaign(1);
            await reliefDonation.connect(donor1).donate(
                1,
                "Test",
                { value: ethers.parseEther("1") }
            );

            const receipts = await reliefDonation.getDonorReceipts(donor1.address);
            const receipt = receipts[0];

            const isValid = await reliefDonation.verifyReceipt(
                donor1.address,
                receipt.donationId,
                receipt.receiptHash
            );

            expect(isValid).to.be.true;
        });

        it("Should reject fake receipts", async function () {
            const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake"));

            const isValid = await reliefDonation.verifyReceipt(
                donor1.address,
                999,
                fakeHash
            );

            expect(isValid).to.be.false;
        });
    });

    describe("Emergency Controls", function () {
        it("Should pause and unpause contract", async function () {
            await reliefDonation.connect(owner).pause();

            // Try to donate while paused
            await expect(
                reliefDonation.connect(donor1).donate(
                    1,
                    "Should fail",
                    { value: ethers.parseEther("1") }
                )
            ).to.be.reverted;

            await reliefDonation.connect(owner).unpause();

            // Should work after unpause
            await reliefDonation.connect(ngo).createCampaign(
                "Test",
                "Test",
                ethers.parseEther("10"),
                30 * 24 * 60 * 60,
                "QmTest",
                []
            );
        });
    });
});