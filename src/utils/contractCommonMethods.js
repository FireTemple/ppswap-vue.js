/**
 * This js file is a collection of methods for all the token contracts
 **/
// import ppswap address and KovanAddress
import {address, kovanAddress} from "@/utils/constants/contract";



/**
 * get contract instance by contract index
 * @param index
 * @returns {null|actions.state.web3.eth.Contract|*}
 */
export function getContractInstanceByIndex(index , state) {

    if (index === 2) {
        return state.WEENUSInstance;
    } else if (index === 3) {
        return state.XEENUSInstance;
    } else {
        alert("develop stage only support WEENUS and XEENUS");
        return;
    }
}

/**
 * query the allowance
 * @param index
 * @param tokenOwner
 * @returns {Promise<*>}
 */
export async function checkAllowance(index, tokenOwner, state) {
    // 1. get instance first
    let instance = getContractInstanceByIndex(index, state);
    // 2. check allowance
    return await instance.methods.allowance(
        tokenOwner,
        address
    ).call();
}

/**
 * query the balance
 * @param index
 * @param tokenOwner
 * @returns {Promise<*>}
 */
export async function checkBalance(index, tokenOwner, state){
    // 1. get instance first
    let instance = getContractInstanceByIndex(index, state);
    // 2. check blance
    return await instance.methods.balanceOf(
        tokenOwner,
    ).call();
}


/**
 * Get Decimal
 * @param index
 * @param tokenOwner
 * @param state
 * @returns {Promise<void>}
 */
export async function getDecimal(index, state){
    // 1. get instance first
    let instance = getContractInstanceByIndex(index, state);
    // 2. get decimals
    return await instance.methods.decimals().call();
}
