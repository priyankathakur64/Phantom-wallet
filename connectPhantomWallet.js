const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { PhantomWalletAdapter } = require('@solana/wallet-adapter-phantom');

const network = clusterApiUrl('mainnet-beta');  // or 'devnet' for development
const connection = new Connection(network, 'confirmed');

async function connectWallet() {
    const wallet = new PhantomWalletAdapter();
    await wallet.connect();
    const publicKey = wallet.publicKey;
    console.log(`Connected to wallet: ${publicKey.toBase58()}`);

    // You can now use `wallet` and `publicKey` for further interactions
}

connectWallet().catch(err => console.error(err));
