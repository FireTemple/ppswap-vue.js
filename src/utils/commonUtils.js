/**
 * common utils
 **/

import {kovanAddress} from "@/utils/constants/contract";


/**
 * Get contract name by address
 */
export function getNameByContractAddress(address){
    return  kovanAddress.find(contract => {
        if (contract.address === address) return contract;
    }).token;
}
