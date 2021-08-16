import {createStore} from 'vuex'
import {myABI, address, kovanAddress} from "@/utils/constants/contract";
import Web3 from "web3";
import {checkAllowance, checkBalance} from "@/utils/contractCommonMethods";
import {addOrUpdateAllowance, queryAllowance} from "@/network/api/allowanceAPI";
import {dealWithDecimals} from "@/utils/numberUtils";


export default createStore({
    state: {
        tagsList: [],
        collapse: false,
        // web3
        web3: null,
        contractInstance: null,
        account: null,
        connected: false,
        balance: null,
        WEENUSInstance: null,
        XEENUSInstance: null,
    },

    mutations: {
        //web3.js
        registerWeb3Instance(state, payload) {

        },
        // connect to wallet
        async connectToWallet() {
            try {
                await ethereum.enable();
                let accounts = await this.state.web3.eth.getAccounts();
                this.state.account = accounts[0];
                localStorage.setItem('account', this.state.account);
                this.state.connected = true;
                localStorage.setItem('connected', this.state.connected);
                this.state.balance = await this.state.web3.eth.getBalance(this.state.account);
                localStorage.setItem('balance', this.state.balance);
            } catch (error) {
                console.log(error);
            }
        },
        delTagsItem(state, data) {
            state
                .tagsList
                .splice(data.index, 1);
        },
        setTagsItem(state, data) {
            state
                .tagsList
                .push(data)
        },
        clearTags(state) {
            state.tagsList = []
        },
        closeTagsOther(state, data) {
            state.tagsList = data;
        },
        closeCurrentTag(state, data) {
            for (let i = 0, len = state.tagsList.length; i < len; i++) {
                const item = state.tagsList[i];
                if (item.path === data.$route.fullPath) {
                    if (i < len - 1) {
                        data
                            .$router
                            .push(state.tagsList[i + 1].path);
                    } else if (i > 0) {
                        data
                            .$router
                            .push(state.tagsList[i - 1].path);
                    } else {
                        data
                            .$router
                            .push("/");
                    }
                    state
                        .tagsList
                        .splice(i, 1);
                    break;
                }
            }
        },
        // 侧边栏折叠
        hadndleCollapse(state, data) {
            state.collapse = data;
        },
        // check if account changed
        isAccountChanged() {

        },
    },

    actions: {
        // initialize web3
        registerWeb3() {
            if (window.ethereum) {
                this.state.web3 = new Web3(ethereum);
                // create contract instance
                // 1. ppswap instance
                this.state.contractInstance = new this.state.web3.eth.Contract(myABI, address);
                // 2. token instances
                // TODO add more after testing
                kovanAddress.forEach(token => {
                    if (token.token === 'WEENUS') {
                        this.state.WEENUSInstance = new this.state.web3.eth.Contract(token.ABI, token.address);
                    } else if (token.token === 'XEENUS') {
                        this.state.XEENUSInstance = new this.state.web3.eth.Contract(token.ABI, token.address);
                    }
                })
            }
        },

        // test if user logout wallet
        isLogOut() {
            if (!this.state.web3.eth.coinbase) {

                window.alert('Please LOGIN MetaMask first.');

                return;

            } else {

                console.log('MetaMask is Login.')

            }
        },

        // create an offer
        async makeOffer(context, payload) {

            let fromIndex = payload.fromIndex;
            let fromTokenContractInstance;

            if (fromIndex === 2) {
                fromTokenContractInstance = this.state.WEENUSInstance;
            } else if (fromIndex === 3) {
                fromTokenContractInstance = this.state.XEENUSInstance;
            } else {
                alert("develop stage only support WEENUS and XEENUS");
                return;
            }

            // before approve allowance, we need to check the current allowance for other offers
            let currentAllowance = await checkAllowance(fromIndex, localStorage.getItem('account'), this.state);
            // convert  token
            let tokenA = this.state.web3.utils.toWei(payload.amtA.toString(), 'ether')
            let bnTokenAForProve = this.state.web3.utils.toBN((BigInt(tokenA) + BigInt(currentAllowance)).toString());
            let bnTokenA = this.state.web3.utils.toBN(tokenA);

            let tokenB = this.state.web3.utils.toWei(payload.amtB.toString(), 'ether')
            let bnTokenB = this.state.web3.utils.toBN(tokenB);

            // update allowance
            await fromTokenContractInstance.methods.approve(
                address,
                bnTokenAForProve,
            ).send({
                from: localStorage.getItem('account')
            })


            // if success then update database
            // let newAllowance = currentAllowance;
            // newAllowance.amount += add;
            // await addOrUpdateAllowance(newAllowance);

            return await this.state.contractInstance.methods.makeOffer(
                payload.fromTokenAddress,
                payload.toTokenAddress,
                bnTokenA,
                bnTokenB).send({
                from: localStorage.getItem('account')
            });
        },

        // get last offer id
        async getLastOfferId() {
            return await this.state.contractInstance.methods.lastOfferID().call();
        },

        // accept an offer
        async acceptOffer(context, payload) {
            let toIndex = payload.toIndex;

            // get the contract instance
            let toTokenContractInstance;
            if (toIndex === 2) {
                toTokenContractInstance = this.state.WEENUSInstance;
            } else if (toIndex === 3) {
                toTokenContractInstance = this.state.XEENUSInstance;
            } else {
                alert("develop stage only support WEENUS and XEENUS");
                return;
            }

            // convert  token
            let tokenB = this.state.web3.utils.toWei(payload.amtB.toString(), 'ether')
            let bnTokenB = this.state.web3.utils.toBN(tokenB);


            // approve allowance for ppswap
            await toTokenContractInstance.methods.approve(
                address,
                bnTokenB,
            ).send({
                from: localStorage.getItem('account')
            })

            let swapFee = await this.state.contractInstance.methods.getSwapfee(parseInt(payload.offerId)).call();

            return await this.state.contractInstance.methods.acceptOffer(
                parseInt(payload.offerId)
            ).send({
                from: localStorage.getItem('account'),
                value: swapFee
            });
        },

        // buy PPS
        async buyPpswap(context, payload){
            await this.state.contractInstance.methods.buyPPS(
                // payload.amount
            ).send({
                from: localStorage.getItem('account'),
                value: (dealWithDecimals(payload.amount, 18))
            })
        },



        // sell PPS
        async sellPPS(context, payload){
            console.log(payload.amount);
            // convert  token
            let tokens = this.state.web3.utils.toWei(payload.amount.toString(), 'ether')
            let bntokens = this.state.web3.utils.toBN(tokens);
            console.log(bntokens);
            return await this.state.contractInstance.methods.sellPPS(
                bntokens
            ).send({
                from: localStorage.getItem('account'),
            })
        },



        // cancel an offer
        async cancelOffer(context, payload){
            return await this.state.contractInstance.methods.cancelOffer(
                parseInt(payload.offerId)
            ).send({
                from: localStorage.getItem('account')
            });
        },




        // check current rate for buying ppswap
        async rateOfBuyingPpswap(context, payload){
           return  await this.state.contractInstance.methods.PPSPrice().call();
        },

        // validation method
        // here are 4 types invalid case (return value)
        // 0 : offer maker's allowance is not enough
        // 1 : offer taker's allowance is not enough // no need
        // 2 : offer maker's balance for tokenA is not enough
        // 3 : offer taker's balance for tokenB is not enough
        // 4 : pass the validation
        async validateInfo(context, payload) {
            // 1. check if offer maker approved enough allowance to ppswap
            let result = await checkAllowance(
                payload.tokenAIndex,
                payload.tokenAOwner,
                this.state
            );
            // if allowance smaller then the offer token, then return 0 to user
            if (result < payload.tokenAAmt) {
                return 0;
            } else {
                // // 2. check if offer taker approved enough allowance to ppswap
                // let result = await checkAllowance(
                //     payload.tokenBIndex,
                //     payload.tokenBOwner,
                //     this.state
                // );
                // // if allowance smaller then the offer token, then return 1 to user
                // if (result < payload.tokenBAmt) {
                //     return 1;
                // }else {
                // 3. check if offer maker have enough balance for swap
                let result = await checkBalance(
                    payload.tokenAIndex,
                    payload.tokenAOwner,
                    this.state
                );
                if (result < payload.tokenAAmt) {
                    return 2;
                } else {
                    // 4. check if offer taker have enough balance for swap
                    let result = await checkBalance(
                        payload.tokenBIndex,
                        payload.tokenBOwner,
                        this.state
                    );
                    if (result < payload.tokenBAmt) {
                        return 3;
                    } else return 4;
                }
                // }
            }


        },

        async test(context, payload) {

        },

        // when the allowance is not correct, user could update their token allowance to ppswap
        async updateTokenAllowance(context, payload) {
            await checkAllowance(
                payload.tokenAIndex,
                payload.tokenAOwner,
                this.state
            )
        },




    },
    modules: {},
    getters: {
        getWeb3(state) {
            return state.web3;
        },
        test(state){
            return 3;
        },
    },
})
