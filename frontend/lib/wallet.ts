// Wallet Connection Management
// Supports MetaMask, WalletConnect, and Hardware Wallets
// Handles wallet switching, network switching, and error handling

import { ethers } from 'ethers';

export interface WalletConnectConfig {
  projectId: string;
  chains: number[];
  methods: string[];
  events: string[];
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  walletType: 'metamask' | 'walletconnect' | 'hardware' | null;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Supported networks
export const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  11155111: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  80001: {
    chainId: 80001,
    name: 'Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

// Wallet Connection Manager
export class WalletManager {
  private state: WalletState;
  private listeners: Set<(state: WalletState) => void>;
  private walletConnectProvider: any;

  constructor() {
    this.state = {
      address: null,
      isConnected: false,
      chainId: null,
      provider: null,
      signer: null,
      walletType: null,
    };
    this.listeners = new Set();
  }

  /**
   * Get current wallet state
   */
  getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Subscribe to wallet state changes
   */
  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectMetaMask(): Promise<WalletState> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask browser extension.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const address = accounts[0];
      const chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16);

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Validate supported network
      if (!SUPPORTED_NETWORKS[chainId]) {
        throw new Error(
          `Network not supported. Supported networks: ${Object.values(SUPPORTED_NETWORKS)
            .map((n) => n.name)
            .join(', ')}`
        );
      }

      this.state = {
        address,
        isConnected: true,
        chainId,
        provider,
        signer,
        walletType: 'metamask',
      };

      this.setupMetaMaskListeners();
      this.notifyListeners();

      return this.getState();
    } catch (error) {
      throw this.formatWalletError(error, 'MetaMask');
    }
  }

  /**
   * Connect to WalletConnect
   */
  async connectWalletConnect(config: WalletConnectConfig): Promise<WalletState> {
    try {
      // Dynamic import to avoid build issues
      const EthereumProvider = (
        await import('@walletconnect/ethereum-provider')
      ).EthereumProvider;

      this.walletConnectProvider = await EthereumProvider.init({
        projectId: config.projectId,
        chains: config.chains,
        methods: config.methods,
        events: config.events,
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'light',
        },
      });

      // Connect
      await this.walletConnectProvider.connect();

      const accounts = await this.walletConnectProvider.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from WalletConnect');
      }

      const address = accounts[0];
      const chainId = this.walletConnectProvider.chainId;

      // Validate network
      if (!SUPPORTED_NETWORKS[chainId]) {
        throw new Error(
          `Network not supported. Supported networks: ${Object.values(SUPPORTED_NETWORKS)
            .map((n) => n.name)
            .join(', ')}`
        );
      }

      // Create ethers provider
      const provider = new ethers.BrowserProvider(this.walletConnectProvider);
      const signer = await provider.getSigner();

      this.state = {
        address,
        isConnected: true,
        chainId,
        provider,
        signer,
        walletType: 'walletconnect',
      };

      this.setupWalletConnectListeners();
      this.notifyListeners();

      return this.getState();
    } catch (error) {
      throw this.formatWalletError(error, 'WalletConnect');
    }
  }

  /**
   * Connect to hardware wallet (Ledger, Trezor via WalletConnect)
   */
  async connectHardwareWallet(config: WalletConnectConfig): Promise<WalletState> {
    try {
      const state = await this.connectWalletConnect(config);
      state.walletType = 'hardware';
      this.state = state;
      return this.getState();
    } catch (error) {
      throw this.formatWalletError(error, 'Hardware Wallet');
    }
  }

  /**
   * Switch network
   */
  async switchNetwork(chainId: number): Promise<WalletState> {
    try {
      if (!this.state.isConnected) {
        throw new Error('Wallet not connected');
      }

      const network = SUPPORTED_NETWORKS[chainId];
      if (!network) {
        throw new Error(`Network ${chainId} not supported`);
      }

      if (this.state.walletType === 'metamask') {
        try {
          // Try to switch to existing chain
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          // Chain not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: network.name,
                  rpcUrls: [network.rpcUrl],
                  blockExplorerUrls: [network.blockExplorerUrl],
                  nativeCurrency: network.nativeCurrency,
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      } else if (this.state.walletType === 'walletconnect' || this.state.walletType === 'hardware') {
        // Switch network in WalletConnect
        await this.walletConnectProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }

      this.state.chainId = chainId;
      this.notifyListeners();

      return this.getState();
    } catch (error) {
      throw this.formatWalletError(error, 'Network Switch');
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    try {
      if (this.state.walletType === 'walletconnect' || this.state.walletType === 'hardware') {
        if (this.walletConnectProvider) {
          await this.walletConnectProvider.disconnect();
          this.walletConnectProvider = null;
        }
      }

      this.state = {
        address: null,
        isConnected: false,
        chainId: null,
        provider: null,
        signer: null,
        walletType: null,
      };

      this.notifyListeners();
    } catch (error) {
      throw this.formatWalletError(error, 'Disconnect');
    }
  }

  /**
   * Get signer for transaction signing
   */
  getSigner(): ethers.Signer | null {
    if (!this.state.isConnected || !this.state.signer) {
      throw new Error('Wallet not connected');
    }
    return this.state.signer;
  }

  /**
   * Get provider for read-only calls
   */
  getProvider(): ethers.Provider | null {
    if (!this.state.provider) {
      throw new Error('Wallet not connected');
    }
    return this.state.provider;
  }

  /**
   * Check if connected to supported network
   */
  isSupportedNetwork(): boolean {
    return this.state.chainId !== null && SUPPORTED_NETWORKS[this.state.chainId] !== undefined;
  }

  /**
   * Get current network config
   */
  getNetworkConfig(): NetworkConfig | null {
    if (!this.state.chainId) {
      return null;
    }
    return SUPPORTED_NETWORKS[this.state.chainId] || null;
  }

  /**
   * Format wallet-specific errors
   */
  private formatWalletError(error: any, context: string): Error {
    let message = `${context} Error: `;

    if (error instanceof Error) {
      message += error.message;
    } else if (error.message) {
      message += error.message;
    } else if (error.code) {
      switch (error.code) {
        case 4001:
          message += 'User rejected the request';
          break;
        case 4002:
          message += 'Wallet provider not initialized';
          break;
        case 4100:
          message += 'Unauthorized - account not available';
          break;
        case 4200:
          message += 'Unsupported method';
          break;
        case 4900:
          message += 'Wallet disconnected';
          break;
        case 4901:
          message += 'Chain not connected';
          break;
        default:
          message += `Code ${error.code}: ${error.message || 'Unknown error'}`;
      }
    } else {
      message += 'Unknown error occurred';
    }

    return new Error(message);
  }

  /**
   * Setup MetaMask event listeners
   */
  private setupMetaMaskListeners(): void {
    if (!window.ethereum) return;

    // Account changed
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.state.address = accounts[0];
        this.notifyListeners();
      }
    });

    // Chain changed
    window.ethereum.on('chainChanged', (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      if (!SUPPORTED_NETWORKS[newChainId]) {
        console.warn(`Switched to unsupported network: ${newChainId}`);
      }
      this.state.chainId = newChainId;
      this.notifyListeners();
    });

    // Disconnect
    window.ethereum.on('disconnect', () => {
      this.disconnect();
    });
  }

  /**
   * Setup WalletConnect event listeners
   */
  private setupWalletConnectListeners(): void {
    if (!this.walletConnectProvider) return;

    this.walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.state.address = accounts[0];
        this.notifyListeners();
      }
    });

    this.walletConnectProvider.on('chainChanged', (chainId: number) => {
      if (!SUPPORTED_NETWORKS[chainId]) {
        console.warn(`Switched to unsupported network: ${chainId}`);
      }
      this.state.chainId = chainId;
      this.notifyListeners();
    });

    this.walletConnectProvider.on('disconnect', () => {
      this.disconnect();
    });
  }
}

// Global wallet manager instance
let walletManagerInstance: WalletManager | null = null;

export function getWalletManager(): WalletManager {
  if (!walletManagerInstance) {
    walletManagerInstance = new WalletManager();
  }
  return walletManagerInstance;
}

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
