const ethers = require('ethers');

async function checkTokenStatus() {
    try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(process.env.P2P_PRIVATE_KEY, provider);
        const signerAddress = await signer.getAddress();

        console.log('Checking status for address:', signerAddress);

        // Token contract address
        const tokenAddress = '0x8Ec17bf427556c3972540aAc01adb6367E32d5D3';
        const tokenAbi = require('./contract-address/msq-token-abi.json');
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

        // Check balance
        const balance = await tokenContract.balanceOf(signerAddress);
        console.log('Token Balance:', ethers.utils.formatUnits(balance, 18));

        // Check allowance for multisend contract
        const multisendAddress = process.env.MULTISEND_ADDRESS;
        const allowance = await tokenContract.allowance(signerAddress, multisendAddress);
        console.log('Allowance for Multisend:', ethers.utils.formatUnits(allowance, 18));

        // Check if address is blacklisted
        try {
            const isBlacklisted = await tokenContract.isBlacklisted(signerAddress);
            console.log('Is address blacklisted:', isBlacklisted);
        } catch (e) {
            console.log('isBlacklisted function not available');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkTokenStatus(); 
