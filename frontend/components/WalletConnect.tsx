'use client';

import React, { useState, useEffect } from 'react';
import { WalletManager, getWalletManager, WalletState, SUPPORTED_NETWORKS } from '@/lib/wallet';

interface WalletConnectProps {
  onConnect?: (state: WalletState) => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function WalletConnect({ onConnect, onDisconnect, onError }: WalletConnectProps) {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    provider: null,
    signer: null,
    walletType: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const walletManager = getWalletManager();

  // Subscribe to wallet state changes
  useEffect(() => {
    const unsubscribe = walletManager.subscribe((newState) => {
      setWalletState(newState);
    });
    return () => unsubscribe();
  }, [walletManager]);

  // Handle MetaMask connection
  const handleConnectMetaMask = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error(
          'MetaMask not installed. Please install MetaMask browser extension from https://metamask.io'
        );
      }

      const state = await walletManager.connectMetaMask();
      setWalletState(state);
      onConnect?.(state);
      setShowMenu(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect MetaMask';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle WalletConnect connection
  const handleConnectWalletConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
      if (!projectId) {
        throw new Error('WalletConnect project ID not configured');
      }

      const state = await walletManager.connectWalletConnect({
        projectId,
        chains: Object.keys(SUPPORTED_NETWORKS).map((id) => parseInt(id)),
        methods: [
          'eth_sendTransaction',
          'eth_signTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
        ],
        events: ['chainChanged', 'accountsChanged'],
      });

      setWalletState(state);
      onConnect?.(state);
      setShowMenu(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect WalletConnect';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle hardware wallet connection
  const handleConnectHardwareWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
      if (!projectId) {
        throw new Error('WalletConnect project ID not configured');
      }

      const state = await walletManager.connectHardwareWallet({
        projectId,
        chains: Object.keys(SUPPORTED_NETWORKS).map((id) => parseInt(id)),
        methods: [
          'eth_sendTransaction',
          'eth_signTransaction',
          'eth_sign',
          'personal_sign',
          'eth_signTypedData',
        ],
        events: ['chainChanged', 'accountsChanged'],
      });

      setWalletState(state);
      onConnect?.(state);
      setShowMenu(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect hardware wallet';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle network switch
  const handleSwitchNetwork = async (chainId: number) => {
    try {
      setError(null);
      const state = await walletManager.switchNetwork(chainId);
      setWalletState(state);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch network';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      setError(null);
      await walletManager.disconnect();
      setWalletState({
        address: null,
        isConnected: false,
        chainId: null,
        provider: null,
        signer: null,
        walletType: null,
      });
      onDisconnect?.();
      setShowMenu(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  const shortAddress = walletState.address
    ? `${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}`
    : null;

  const networkName = walletState.chainId
    ? SUPPORTED_NETWORKS[walletState.chainId]?.name || 'Unknown Network'
    : null;

  const isUnsupportedNetwork =
    walletState.chainId && !SUPPORTED_NETWORKS[walletState.chainId];

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          walletState.isConnected
            ? `${
                isUnsupportedNetwork
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          'Connecting...'
        ) : walletState.isConnected ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-current"></div>
            {shortAddress}
          </div>
        ) : (
          'Connect Wallet'
        )}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {walletState.isConnected ? (
            <div className="p-4">
              {/* Connected Status */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Connected Wallet</p>
                <p className="font-mono text-sm font-semibold mb-2">{shortAddress}</p>

                {/* Wallet Type */}
                <p className="text-xs text-gray-500 capitalize mb-3">
                  {walletState.walletType === 'metamask' && '🦊 MetaMask'}
                  {walletState.walletType === 'walletconnect' && '📱 WalletConnect'}
                  {walletState.walletType === 'hardware' && '🔐 Hardware Wallet'}
                </p>

                {/* Network Status */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isUnsupportedNetwork ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  ></div>
                  <span className="text-sm font-medium">{networkName}</span>
                </div>

                {isUnsupportedNetwork && (
                  <p className="text-xs text-red-600 mb-3">⚠️ Unsupported network</p>
                )}
              </div>

              {/* Network Switcher */}
              {!isUnsupportedNetwork && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Switch Network</p>
                  <div className="space-y-2">
                    {Object.entries(SUPPORTED_NETWORKS).map(([chainId, config]) => (
                      <button
                        key={chainId}
                        onClick={() => handleSwitchNetwork(parseInt(chainId))}
                        disabled={
                          parseInt(chainId) === walletState.chainId || isLoading
                        }
                        className={`w-full px-3 py-2 text-sm rounded text-left transition-colors ${
                          parseInt(chainId) === walletState.chainId
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {config.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* MetaMask Option */}
              <button
                onClick={handleConnectMetaMask}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🦊</span>
                MetaMask
              </button>

              {/* WalletConnect Option */}
              <button
                onClick={handleConnectWalletConnect}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📱</span>
                WalletConnect
              </button>

              {/* Hardware Wallet Option */}
              <button
                onClick={handleConnectHardwareWallet}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🔐</span>
                Hardware Wallet (Ledger/Trezor)
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border-t border-red-200">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
