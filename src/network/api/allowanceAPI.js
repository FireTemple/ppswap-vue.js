/**
 * This js file is a collection api of allowance-related apis
 **/

import {requestPromise} from "@/network";
import {apiBaseUrl} from "@/utils/constants/network";


/**
 * This method is for either add or update the allowance for ppswap
 * @param allowance
 * @returns {Promise | Promise<unknown>}
 */
export function addOrUpdateAllowance(allowance){
   return  requestPromise({
        url: apiBaseUrl + '/allowance/update',
        method: 'post',
        data: {
            allowance
        }
    })
}

/**
 * This method is using for querying allowance amount for users with specific token
 * @param account
 * @param token
 * @returns {Promise | Promise<unknown>}
 */
export function queryAllowance(account,token){
    return  requestPromise({
        url: apiBaseUrl + '/allowance/query',
        method: 'post',
        data: {
            account,
            token
        }
    })
}
