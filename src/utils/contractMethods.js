
let contractInstance;
let account;
let balance;


/**
 *  This methods js file is the collection of methods for ppswap only
 */

export function loadWeb3(){
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        console.log("web loaded")
    }
}

export function getContractInstance(myABI, contractAddress){
    contractInstance = new web3.eth.Contract(myABI,  contractAddress);
}

export async function connectToWallet(){
    try {
        await ethereum.enable();
        let accounts = await web3.eth.getAccounts();
        account = accounts[0];
        connected = true;
        balance = await web3.eth.getBalance(account);
    }catch (error){

    }
}


/**
 * Get total supply of ppswap contract
 * @returns {Promise<*>}
 */
export async function getTotalSupply(){
    return await contractInstance.methods.totalSupply().call();
}
