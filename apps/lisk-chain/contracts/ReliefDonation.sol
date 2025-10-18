// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ReliefDonation
 * @dev Main contract for disaster relief donations with full transparency
 */

 
contract ReliefDonation is AccessControl, ReentrancyGuard, Pausable {
    // Roles
    bytes32 public constant NGO_ROLE = keccak256("NGO_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Structs
    struct Campaign {
        uint256 id;
        string name;
        string description;
        address ngoAddress;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 disbursedAmount;
        uint256 startTime;
        uint256 endTime;
        bool isVerified;
        bool isActive;
        string ipfsMetadata; // IPFS hash for detailed info
    }

    struct Donation {
        address donor;
        uint256 campaignId;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    struct Disbursement {
        uint256 campaignId;
        uint256 amount;
        address recipient;
        string purpose;
        string proofOfUse; // IPFS hash for receipts/photos
        uint256 timestamp;
        bool isVerified;
    }

    struct DonorReceipt {
        uint256 donationId;
        uint256 campaignId;
        uint256 amount;
        uint256 timestamp;
        bytes32 receiptHash;
    }

    // State variables
    uint256 public campaignCounter;
    uint256 public donationCounter;
    uint256 public disbursementCounter;
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation) public donations;
    mapping(uint256 => Disbursement) public disbursements;
    mapping(address => uint256[]) public donorToCampaigns;
    mapping(address => DonorReceipt[]) public donorReceipts;
    mapping(uint256 => uint256[]) public campaignDisbursements;
    
    // Milestone-based release
    mapping(uint256 => uint256[]) public campaignMilestones; // percentages at which funds unlock
    mapping(uint256 => uint256) public campaignMilestoneIndex;

    // Events
    event CampaignCreated(uint256 indexed campaignId, string name, address indexed ngo);
    event CampaignVerified(uint256 indexed campaignId, address indexed verifier);
    event CampaignUpdated(uint256 indexed campaignId, string name, address indexed ngo);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event FundsDisbursed(uint256 indexed disbursementId, uint256 campaignId, uint256 amount, string purpose);
    event DisbursementVerified(uint256 indexed disbursementId, address indexed verifier);
    event ReceiptGenerated(address indexed donor, uint256 donationId, bytes32 receiptHash);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create a new relief campaign
     */
    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _duration,
        string memory _ipfsMetadata,
        uint256[] memory _milestones
    ) external onlyRole(NGO_ROLE) {
        campaignCounter++;
        
        Campaign storage newCampaign = campaigns[campaignCounter];
        newCampaign.id = campaignCounter;
        newCampaign.name = _name;
        newCampaign.description = _description;
        newCampaign.ngoAddress = msg.sender;
        newCampaign.targetAmount = _targetAmount;
        newCampaign.startTime = block.timestamp;
        newCampaign.endTime = block.timestamp + _duration;
        newCampaign.isActive = true;
        newCampaign.ipfsMetadata = _ipfsMetadata;
        
        // Set milestones for conditional fund release
        if (_milestones.length > 0) {
            campaignMilestones[campaignCounter] = _milestones;
        }
        
        emit CampaignCreated(campaignCounter, _name, msg.sender);
    }

    /**
     * @dev Update an existing campaign
     */
    function updateCampaign(
        uint256 _id,
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _duration,
        string memory _ipfsMetadata,
        uint256[] memory _milestones
    ) external onlyRole(NGO_ROLE) {
        Campaign storage campaign = campaigns[_id];
        require(campaign.id != 0, "Campaign does not exist");
        require(campaign.isActive, "Campaign is not active");
        require(campaign.ngoAddress == msg.sender, "Not campaign owner");

        campaign.name = _name;
        campaign.description = _description;
        campaign.targetAmount = _targetAmount;
        campaign.endTime = block.timestamp + _duration;
        campaign.ipfsMetadata = _ipfsMetadata;

        if (_milestones.length > 0) {
            campaignMilestones[_id] = _milestones;
        }
        
        emit CampaignUpdated(_id, _name, msg.sender);
    }

    /**
     * @dev Verify a campaign (by authorized verifier)
     */
    function verifyCampaign(uint256 _campaignId) external onlyRole(VERIFIER_ROLE) {
        require(campaigns[_campaignId].id != 0, "Campaign does not exist");
        campaigns[_campaignId].isVerified = true;
        emit CampaignVerified(_campaignId, msg.sender);
    }

    /**
     * @dev Make a donation to a campaign
     */
    function donate(uint256 _campaignId, string memory _message) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.id != 0, "Campaign does not exist");
        require(campaign.isActive, "Campaign is not active");
        require(campaign.isVerified, "Campaign not verified");
        require(block.timestamp <= campaign.endTime, "Campaign has ended");
        require(msg.value > 0, "Donation must be greater than 0");

        donationCounter++;
        
        // Record donation
        Donation storage newDonation = donations[donationCounter];
        newDonation.donor = msg.sender;
        newDonation.campaignId = _campaignId;
        newDonation.amount = msg.value;
        newDonation.timestamp = block.timestamp;
        newDonation.message = _message;
        
        // Update campaign
        campaign.raisedAmount += msg.value;
        
        // Track donor's campaigns
        donorToCampaigns[msg.sender].push(_campaignId);
        
        // Generate receipt
        bytes32 receiptHash = keccak256(
            abi.encodePacked(
                msg.sender,
                _campaignId,
                msg.value,
                block.timestamp,
                donationCounter
            )
        );
        
        DonorReceipt memory receipt = DonorReceipt({
            donationId: donationCounter,
            campaignId: _campaignId,
            amount: msg.value,
            timestamp: block.timestamp,
            receiptHash: receiptHash
        });
        
        donorReceipts[msg.sender].push(receipt);
        
        emit DonationReceived(_campaignId, msg.sender, msg.value);
        emit ReceiptGenerated(msg.sender, donationCounter, receiptHash);
    }

    /**
     * @dev Disburse funds from campaign (milestone-based or direct)
     */
    function disburseFunds(
        uint256 _campaignId,
        uint256 _amount,
        address _recipient,
        string memory _purpose,
        string memory _proofOfUse
    ) external onlyRole(NGO_ROLE) nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.ngoAddress == msg.sender, "Not campaign owner");
        require(campaign.raisedAmount - campaign.disbursedAmount >= _amount, "Insufficient funds");
        
        // Check milestone requirements if set
        uint256[] memory milestones = campaignMilestones[_campaignId];
        if (milestones.length > 0) {
            uint256 currentMilestoneIndex = campaignMilestoneIndex[_campaignId];
            require(currentMilestoneIndex < milestones.length, "All milestones completed");
            
            uint256 allowedAmount = (campaign.raisedAmount * milestones[currentMilestoneIndex]) / 100;
            require(campaign.disbursedAmount + _amount <= allowedAmount, "Exceeds milestone limit");
        }
        
        disbursementCounter++;
        
        // Record disbursement
        Disbursement storage newDisbursement = disbursements[disbursementCounter];
        newDisbursement.campaignId = _campaignId;
        newDisbursement.amount = _amount;
        newDisbursement.recipient = _recipient;
        newDisbursement.purpose = _purpose;
        newDisbursement.proofOfUse = _proofOfUse;
        newDisbursement.timestamp = block.timestamp;
        
        campaign.disbursedAmount += _amount;
        campaignDisbursements[_campaignId].push(disbursementCounter);
        
        // Transfer funds
        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "Transfer failed");
        
        emit FundsDisbursed(disbursementCounter, _campaignId, _amount, _purpose);
    }

    /**
     * @dev Verify a disbursement with proof
     */
    function verifyDisbursement(uint256 _disbursementId) external onlyRole(VERIFIER_ROLE) {
        require(disbursements[_disbursementId].campaignId != 0, "Disbursement does not exist");
        disbursements[_disbursementId].isVerified = true;
        
        // Check if milestone should be advanced
        uint256 campaignId = disbursements[_disbursementId].campaignId;
        uint256[] memory milestones = campaignMilestones[campaignId];
        if (milestones.length > 0) {
            campaignMilestoneIndex[campaignId]++;
        }
        
        emit DisbursementVerified(_disbursementId, msg.sender);
    }

    /**
     * @dev Get campaign disbursement history
     */
    function getCampaignDisbursements(uint256 _campaignId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return campaignDisbursements[_campaignId];
    }

    /**
     * @dev Get donor's donation history
     */
    function getDonorReceipts(address _donor) 
        external 
        view 
        returns (DonorReceipt[] memory) 
    {
        return donorReceipts[_donor];
    }

    /**
     * @dev Get donor's supported campaigns
     */
    function getDonorCampaigns(address _donor) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return donorToCampaigns[_donor];
    }

    /**
     * @dev Verify a donation receipt
     */
    function verifyReceipt(
        address _donor,
        uint256 _donationId,
        bytes32 _receiptHash
    ) external view returns (bool) {
        DonorReceipt[] memory receipts = donorReceipts[_donor];
        for (uint i = 0; i < receipts.length; i++) {
            if (receipts[i].donationId == _donationId && 
                receipts[i].receiptHash == _receiptHash) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant NGO role
     */
    function registerNGO(address _ngo) external onlyRole(ADMIN_ROLE) {
        grantRole(NGO_ROLE, _ngo);
    }

    /**
     * @dev Grant verifier role
     */
    function registerVerifier(address _verifier) external onlyRole(ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, _verifier);
    }
}