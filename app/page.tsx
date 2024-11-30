// app/page.tsx
'use client';

import { useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
// import OKXWalletSDK from 'okx-wallet-sdk'; // 如果需要使用 OKX 錢包 SDK
export default function Home() {
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [walletType, setWalletType] = useState<string>(''); 
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  
  const connectMetaMask = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const newProvider = new BrowserProvider((window as any).ethereum);
        await newProvider.send('eth_requestAccounts', []);
        setProvider(newProvider);
        setWalletType('MetaMask');
        setWalletConnected(true);
        alert('錢包連接成功！');
        // 取得錢包地址
        const signer = await newProvider.getSigner();
        const address = await signer.getAddress();
        // 取得錢包餘額
        const balance = await newProvider.getBalance(address);
        // 顯示錢包地址和餘額
        setAddress(address);
        setBalance(balance);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('請安裝MetaMask或其他以太坊錢包擴展。');
    }
  };

  const connectWalletConnect = async () => {
    try {
      const walletConnectProvider = await WalletConnectProvider.init({
        projectId: 'abc6b0686c028daa288bd7c010df5dda',
        chains: [56, 66, 1, 137], // 支持BSC, OKB, ETH, SOL
        showQrModal: true,
      });

      await walletConnectProvider.connect();

      const newProvider = new BrowserProvider(walletConnectProvider);
      setProvider(newProvider);
      setWalletType('WalletConnect');
      setWalletConnected(true);
      // 取得錢包地址
      const signer = await newProvider.getSigner();
      const address = await signer.getAddress();
      // 取得錢包餘額
      const balance = await newProvider.getBalance(address);
      // 顯示錢包地址和餘額
      setAddress(address);
      setBalance(balance);

      alert('錢包連接成功！');
    } catch (error) {
      console.error(error);
    }
  };

  // const connectOKXWallet = async () => {
  //   try {
  //     const okxWallet = new OKXWalletSDK();
  //     const accounts = await okxWallet.enable();
  //     setProvider(okxWallet);
  //     setWalletConnected(true);
  //     setWalletType('OKXWallet');
  //     alert('OKX 錢包連接成功！');
  //     // 取得錢包地址
  //     const signer = await okxWallet.getSigner();
  //     const address = await signer.getAddress();
  //     // 取得錢包餘額
  //     const balance = await okxWallet.getBalance(address);
  //     // 顯示錢包地址和餘額
  //     setAddress(address);
  //     setBalance(balance);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

 // 斷開錢包連接的函數
 const disconnectWallet = async () => {
  if (provider && walletType === 'WalletConnect') {
    // 如果使用 WalletConnect，需要關閉連接
    await provider.provider.disconnect();
  }
  // 清除狀態
  setProvider(null);
  setWalletConnected(false);
  setWalletType('');
  alert('錢包已斷開連接');
};

  return (
    <div>
      <h1>Telegram Mini App 加密貨幣錢包連接範例</h1>
      <button onClick={connectMetaMask}>連接 MetaMask</button>
      <button onClick={connectWalletConnect}>使用 WalletConnect 連接錢包</button>
      {/* <button onClick={connectOKXWallet}>連接 OKX 錢包</button> */}
      <button onClick={disconnectWallet}>斷開錢包</button>
      <div>
        <h2>錢包地址: {address}</h2>
        <h2>錢包餘額: {balance ? ethers.formatEther(balance) : '0'} ETH</h2>
      </div>
    </div>
  );
}
