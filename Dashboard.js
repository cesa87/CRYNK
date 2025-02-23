import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BrowserProvider, formatEther } from "ethers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import metamaskLogo from "../Metamask-logo.png";
import phantomLogo from "../Phantom-logo.png"; // Add Phantom logo

function Dashboard() {
  const location = useLocation();
  const walletAddress = location.state?.wallet || "Not Connected";
  const walletType = location.state?.walletType || "unknown";
  const [balance, setBalance] = useState("Loading...");

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletType === "metamask" && window.ethereum && walletAddress !== "Not Connected") {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const balanceWei = await provider.getBalance(signer.address);
          const balanceEth = formatEther(balanceWei);
          setBalance(balanceEth + " ETH");
        } catch (error) {
          setBalance("Error fetching balance");
        }
      } else if (walletType === "phantom" && walletAddress !== "Not Connected") {
        try {
          const connection = new Connection(clusterApiUrl("mainnet-beta")); // Use mainnet or devnet
          const publicKey = new PublicKey(walletAddress);
          const balanceLamports = await connection.getBalance(publicKey);
          const balanceSol = balanceLamports / 1e9; // Convert lamports to SOL
          setBalance(balanceSol + " SOL");
        } catch (error) {
          setBalance("Error fetching balance");
        }
      } else {
        setBalance("Wallet not connected");
      }
    };

    fetchBalance();
  }, [walletAddress, walletType]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p><strong>Wallet:</strong> {walletAddress}</p>
      <p><strong>Balance:</strong> {balance}</p>
      {walletType === "metamask" && (
        <img src={metamaskLogo} alt="Metamask" style={{ width: "100px" }} />
      )}
      {walletType === "phantom" && (
        <img src={phantomLogo} alt="Phantom" style={{ width: "100px" }} />
      )}
    </div>
  );
}

export default Dashboard;
