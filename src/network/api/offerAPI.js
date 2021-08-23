/**
 * This js file is a collection api of allowance-related apis
 **/

import {requestPromise} from "@/network";
import {apiBaseUrl} from "@/utils/constants/network";


/**
 *  Update an offer status
 * @param id
 * @param status 1 -> active 2 -> accept 3 -> cancel
 * @returns {Promise | Promise<unknown>}
 */
export function updateStatus(id,status){
    return  requestPromise({
        url: apiBaseUrl + '/offer',
        method: 'put',
        data: {
            id: id,
            status: status
        }
    })
}


/**
 *  query all active offers by account
 * @param id
 * @param account
 * @returns {Promise | Promise<unknown>}
 */
export function selectAllActiveOffer(account){
    return  requestPromise({
        url: apiBaseUrl + '/offer/' + account,
        method: 'get',
    })
}
