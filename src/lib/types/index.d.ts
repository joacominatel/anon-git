// Declaración para TypeScript - Phantom Wallet
declare global {
    interface Window {
      phantom?: {
        solana?: {
          isPhantom?: boolean;
          connect: () => Promise<{ publicKey: { toString: () => string } }>;
          signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
        };
      };
    }
  }

  export {};