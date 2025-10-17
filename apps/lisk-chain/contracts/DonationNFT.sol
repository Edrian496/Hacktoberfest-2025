// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DonationNFT
 * @dev NFT receipts for donations with impact tracking
 */
contract DonationNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    address public reliefContract;
    
    struct DonationMetadata {
        uint256 donationId;
        uint256 campaignId;
        uint256 amount;
        uint256 timestamp;
        string campaignName;
        string impactDescription;
    }
    
    mapping(uint256 => DonationMetadata) public tokenMetadata;
    mapping(address => uint256[]) public donorTokens;
    
    // Badge levels based on total donations
    enum BadgeLevel { Bronze, Silver, Gold, Platinum, Diamond }
    mapping(address => uint256) public donorTotalContributions;
    mapping(address => BadgeLevel) public donorBadges;
    
    event DonationNFTMinted(address indexed donor, uint256 tokenId, uint256 amount);
    event BadgeUpgraded(address indexed donor, BadgeLevel newLevel);
    
    constructor(address _reliefContract) ERC721("Relief Donation Receipt", "RDR") {
        reliefContract = _reliefContract;
    }
    
    modifier onlyReliefContract() {
        require(msg.sender == reliefContract, "Only relief contract");
        _;
    }
    
    /**
     * @dev Mint NFT receipt for donation
     */
    function mintDonationNFT(
        address _donor,
        uint256 _donationId,
        uint256 _campaignId,
        uint256 _amount,
        string memory _campaignName,
        string memory _tokenURI
    ) external onlyReliefContract returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(_donor, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        // Store metadata
        tokenMetadata[tokenId] = DonationMetadata({
            donationId: _donationId,
            campaignId: _campaignId,
            amount: _amount,
            timestamp: block.timestamp,
            campaignName: _campaignName,
            impactDescription: ""
        });
        
        donorTokens[_donor].push(tokenId);
        
        // Update total contributions and badge
        donorTotalContributions[_donor] += _amount;
        _updateBadge(_donor);
        
        emit DonationNFTMinted(_donor, tokenId, _amount);
        
        return tokenId;
    }
    
    /**
     * @dev Update impact description after funds are used
     */
    function updateImpact(uint256 _tokenId, string memory _impact) external onlyReliefContract {
        require(_exists(_tokenId), "Token does not exist");
        tokenMetadata[_tokenId].impactDescription = _impact;
    }
    
    /**
     * @dev Update donor badge based on contributions
     */
    function _updateBadge(address _donor) private {
        uint256 total = donorTotalContributions[_donor];
        BadgeLevel currentLevel = donorBadges[_donor];
        BadgeLevel newLevel;
        
        if (total >= 10 ether) {
            newLevel = BadgeLevel.Diamond;
        } else if (total >= 5 ether) {
            newLevel = BadgeLevel.Platinum;
        } else if (total >= 2 ether) {
            newLevel = BadgeLevel.Gold;
        } else if (total >= 0.5 ether) {
            newLevel = BadgeLevel.Silver;
        } else {
            newLevel = BadgeLevel.Bronze;
        }
        
        if (newLevel > currentLevel) {
            donorBadges[_donor] = newLevel;
            emit BadgeUpgraded(_donor, newLevel);
        }
    }
    
    /**
     * @dev Get all NFTs owned by a donor
     */
    function getDonorNFTs(address _donor) external view returns (uint256[] memory) {
        return donorTokens[_donor];
    }
    
    /**
     * @dev Get badge name
     */
    function getBadgeName(address _donor) external view returns (string memory) {
        BadgeLevel level = donorBadges[_donor];
        if (level == BadgeLevel.Diamond) return "Diamond Donor";
        if (level == BadgeLevel.Platinum) return "Platinum Donor";
        if (level == BadgeLevel.Gold) return "Gold Donor";
        if (level == BadgeLevel.Silver) return "Silver Donor";
        return "Bronze Donor";
    }
    
    // ================================================================
    // =============== Overrides required by Solidity =================
    // ================================================================

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
