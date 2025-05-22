const ethers = require('ethers');
require('dotenv').config();

async function checkTokenState() {
    // Connect to Polygon Amoy testnet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    
    // Token contract address
    const tokenAddress = '0x8Ec17bf427556c3972540aAc01adb6367E32d5D3';
    
    // Basic ERC20 ABI with additional functions we want to check
    const abi = [
        // Standard ERC20 functions
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function allowance(address,address) view returns (uint256)",
        // Additional functions to check restrictions
        "function paused() view returns (bool)",
        "function isBlacklisted(address) view returns (bool)",
        "function owner() view returns (address)",
        "function maxTransferAmount() view returns (uint256)",
        "function transferLimit() view returns (uint256)"
    ];

    const contract = new ethers.Contract(tokenAddress, abi, provider);
    
    try {
        console.log('Checking token contract state...\n');
        
        // Basic token info
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        
        console.log('Token Information:');
        console.log('-----------------');
        console.log(`Name: ${name}`);
        console.log(`Symbol: ${symbol}`);
        console.log(`Decimals: ${decimals}`);
        console.log(`Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)}`);
        
        // Check if contract is paused
        try {
            const isPaused = await contract.paused();
            console.log(`\nContract Paused: ${isPaused}`);
        } catch (e) {
            console.log('\nContract does not have pause functionality');
        }
        
        // Check for blacklist
        const senderAddress = '0x91Fc7d8B83A6708f099779fe3c5Cb16B99CBFA6d';
        try {
            const isBlacklisted = await contract.isBlacklisted(senderAddress);
            console.log(`Sender Blacklisted: ${isBlacklisted}`);
        } catch (e) {
            console.log('\nContract does not have blacklist functionality');
        }
        
        // Check transfer limits
        try {
            const maxTransfer = await contract.maxTransferAmount();
            console.log(`\nMax Transfer Amount: ${ethers.utils.formatUnits(maxTransfer, decimals)}`);
        } catch (e) {
            console.log('\nContract does not have max transfer limit');
        }
        
        try {
            const transferLimit = await contract.transferLimit();
            console.log(`Transfer Limit: ${ethers.utils.formatUnits(transferLimit, decimals)}`);
        } catch (e) {
            console.log('\nContract does not have transfer limit');
        }
        
        // Check balances
        const senderBalance = await contract.balanceOf(senderAddress);
        console.log(`\nSender Balance: ${ethers.utils.formatUnits(senderBalance, decimals)}`);
        
        // Check owner
        try {
            const owner = await contract.owner();
            console.log(`\nContract Owner: ${owner}`);
        } catch (e) {
            console.log('\nContract does not have owner function');
        }
        
    } catch (error) {
        console.error('Error checking contract state:', error);












        
    }
}

checkTokenState().catch(console.error); 
