import { ethers } from "hardhat";

async function main() {
  // Get signer
  const [sender] = await ethers.getSigners();

  console.log("Sender address:", sender.address);

  // Check balance
  const balance = await ethers.provider.getBalance(sender.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  // Send a small transaction to yourself
  console.log("Sending 0.0001 ETH to self...");

  const tx = await sender.sendTransaction({
    to: sender.address,
    value: ethers.parseEther("0.0001"), // 0.0001 ETH
  });

  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();

  console.log("✅ Transaction confirmed!");
  console.log("Block number:", receipt?.blockNumber);
  console.log("Gas used:", receipt?.gasUsed.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });