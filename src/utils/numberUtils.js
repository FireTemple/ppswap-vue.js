/**
 * This utils is using for dealing with numbers
 **/

/**
 * get number and decimal string, return real number (number * decimal)
 */
export function dealWithDecimals(number, decimal){
    return Math.pow(10, decimal) * number;
}
