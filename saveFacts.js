import fetch from "node-fetch";


// Array of facts about you
const myFacts = [
  "Bitcoin was the first cryptocurrency, created in 2009 by Satoshi Nakamoto.",
  "Ethereum is a blockchain platform that supports smart contracts.",
  "Cryptocurrencies are digital or virtual currencies secured by cryptography.",
  "Bitcoin has a limited supply of 21 million coins.",
  "Ethereum introduced decentralized applications (dApps) on its blockchain.",
  "Blockchain is a decentralized ledger technology.",
  "Altcoins refer to cryptocurrencies other than Bitcoin.",
  "Ripple (XRP) focuses on fast cross-border payments.",
  "Litecoin is designed for faster transaction confirmation times than Bitcoin.",
  "Dogecoin started as a meme cryptocurrency but gained popularity.",
  "Tether (USDT) is a stablecoin pegged to the US Dollar.",
  "Stablecoins maintain a stable value by being backed by assets.",
  "Smart contracts automatically execute agreements on the blockchain.",
  "Decentralized finance (DeFi) allows financial services without intermediaries.",
  "NFTs are unique digital assets representing ownership of items or art.",
  "Solana is known for its high-speed blockchain network.",
  "Cardano uses a proof-of-stake consensus mechanism.",
  "Proof-of-work requires miners to solve cryptographic puzzles.",
  "Proof-of-stake relies on validators staking coins to secure the network.",
  "Mining is the process of validating transactions on certain blockchains.",
  "Ethereum 2.0 aims to improve scalability and energy efficiency.",
  "Gas fees are transaction costs on the Ethereum network.",
  "The Lightning Network is a layer-2 solution for faster Bitcoin transactions.",
  "MetaMask is a popular cryptocurrency wallet for Ethereum-based assets.",
  "Hardware wallets like Ledger and Trezor store crypto offline securely.",
  "Decentralized exchanges (DEX) allow peer-to-peer crypto trading.",
  "Centralized exchanges (CEX) are managed by a central organization.",
  "Chainlink provides decentralized oracles for blockchain data.",
  "Bitcoin halving occurs approximately every four years to reduce supply growth.",
  "Polygon is a layer-2 scaling solution for Ethereum.",
  "Avalanche is a blockchain known for its high throughput.",
  "Polkadot enables interoperability between multiple blockchains.",
  "Staking rewards users for locking up their crypto in a network.",
  "Yield farming allows users to earn returns on crypto assets in DeFi.",
  "Liquidity pools facilitate decentralized trading on DEXs.",
  "Bitcoin transactions are pseudonymous but publicly visible on the blockchain.",
  "Ethereum allows issuing ERC-20 tokens for various projects.",
  "ERC-721 tokens represent non-fungible assets like NFTs.",
  "Decentralized autonomous organizations (DAO) operate via smart contracts.",
  "Crypto wallets can be hot (online) or cold (offline).",
  "Layer-1 blockchains are the main networks like Bitcoin or Ethereum.",
  "Layer-2 solutions improve speed and reduce fees on existing blockchains.",
  "Sharding splits blockchain data into smaller pieces to improve scalability.",
  "Consensus mechanisms validate transactions without a central authority.",
  "Bitcoin's market dominance often influences the price of other cryptocurrencies.",
  "Ethereum gas fees fluctuate based on network demand.",
  "Stablecoins can be fiat-collateralized, crypto-collateralized, or algorithmic.",
  "NFT marketplaces like OpenSea allow buying and selling digital collectibles.",
  "Wrapped tokens represent assets from one blockchain on another.",
  "Crypto lending platforms allow borrowing against crypto holdings.",
  "DeFi protocols use smart contracts to automate lending, borrowing, and trading.",
  "Initial coin offerings (ICO) were popular methods for fundraising in crypto projects.",
  "Security token offerings (STO) are regulated digital securities.",
  "Bitcoin uses the SHA-256 hashing algorithm.",
  "Ethereum uses the Ethash proof-of-work algorithm, now transitioning to proof-of-stake.",
  "Public blockchains are open for anyone to participate.",
  "Private blockchains restrict access to selected participants.",
  "Crypto airdrops distribute tokens to holders or new users.",
  "Flash loans are uncollateralized loans in DeFi that must be repaid within a single transaction.",
  "Decentralized identity (DID) projects aim to give users control over their personal data.",
  "Crypto wallets use public and private keys for transactions.",
  "Layer-2 rollups bundle transactions for cheaper and faster processing.",
  "Bitcoin's first block is called the Genesis Block.",
  "Hal Finney received the first Bitcoin transaction from Satoshi Nakamoto.",
  "Ethereum was proposed by Vitalik Buterin in 2013.",
  "The DeFi total value locked (TVL) measures funds in decentralized protocols.",
  "Crypto NFTs have expanded to art, music, gaming, and virtual real estate.",
  "Tokenomics defines the supply, distribution, and incentives of a cryptocurrency.",
  "Cold wallets protect crypto from online attacks but are less convenient.",
  "Hot wallets provide instant access but are more vulnerable to hacks.",
  "The crypto market is highly volatile, with rapid price swings.",
  "Layer-2 technologies like Optimistic and ZK Rollups improve Ethereum scalability.",
  "Bitcoin mining consumes significant electricity due to proof-of-work.",
  "Ethereum smart contracts can create decentralized apps (dApps) for finance, gaming, and social networks.",
  "Crypto price oracles provide external data to blockchains.",
  "DeFi insurance protocols protect against smart contract risks.",
  "Token swaps allow exchanging one cryptocurrency for another.",
  "Liquidity mining rewards users for providing assets to decentralized exchanges.",
  "Governance tokens give holders voting rights in crypto projects.",
  "Interoperability protocols connect different blockchain networks.",
  "Zero-knowledge proofs allow privacy-preserving verification on blockchain.",
  "Bitcoin is considered digital gold due to scarcity and store of value.",
  "Ethereum enables programmable money through smart contracts.",
  "Shiba Inu is an example of a meme cryptocurrency.",
  "Stablecoins like USDC and DAI maintain predictable value.",
  "Blockchain forks can split networks into two versions.",
  "Crypto NFTs can represent digital art, music, and in-game items.",
  "Decentralized storage projects like Filecoin store data securely on blockchain.",
  "Crypto adoption is increasing in finance, gaming, and social media.",
  "Token burning reduces the circulating supply to increase scarcity.",
  "The crypto ecosystem includes wallets, exchanges, mining, and DeFi protocols.",
  "Cross-chain bridges allow moving assets between blockchains.",
  "Proof-of-stake blockchains consume less energy than proof-of-work chains.",
  "Layer-1 blockchains like Ethereum, Solana, and Avalanche support dApps.",
  "NFTs can be fractionalized to allow shared ownership.",
  "Crypto regulatory frameworks vary by country and jurisdiction.",
  "Decentralized social platforms allow users to monetize content without intermediaries.",
  "Bitcoin ATMs allow converting cash to cryptocurrency.",
  "Ethereum's EIP-1559 introduced a fee-burning mechanism to reduce ETH supply.",
  "Smart contract audits reduce the risk of vulnerabilities and hacks.",
  "Wrapped Bitcoin (WBTC) allows BTC to be used on Ethereum.",
  "Crypto collectibles are increasingly popular in gaming and metaverse projects.",
  "Crypto wallets can be self-custodial or custodial.",
  "Decentralized exchanges like Uniswap and PancakeSwap operate without intermediaries.",
  "Initial DEX offerings (IDO) are fundraising methods in DeFi.",
  "Crypto staking can generate passive income through network participation.",
  "Layer-2 networks aim to reduce congestion and transaction costs.",
  "Privacy coins like Monero enhance anonymity in transactions.",
  "The Lightning Network enables instant Bitcoin payments.",
  "Ethereum Name Service (ENS) allows readable blockchain addresses.",
  "Token standards like ERC-20 and ERC-721 define cryptocurrency rules.",
  "Decentralized finance allows lending, borrowing, and earning yield without banks.",
  "Crypto gaming integrates tokens, NFTs, and blockchain for ownership.",
  "Blockchain explorers let users view all transactions on a network.",
  "Crypto wallets require secure management of private keys."
];





async function saveFacts(facts) {
  for (const fact of facts) {
    try {
      const res = await fetch("http://localhost:3000/api/search/addDoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fact })
      });
      const data = await res.json();
      console.log("Saved:", data);
    } catch (err) {
      console.error("Error saving fact:", fact, err);
    }
  }
}

// Call it
saveFacts(myFacts);
