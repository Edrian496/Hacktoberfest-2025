interface Window {
    ethereum?: import("ethers").ExternalProvider & {
        isMetaMask?: boolean;
    };
}
