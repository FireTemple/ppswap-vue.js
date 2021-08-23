<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <!--        <div class="collapse-btn" @click="collapseChage">-->
    <!--            <i v-if="!collapse" class="el-icon-s-fold"></i>-->
    <!--            <i v-else class="el-icon-s-unfold"></i>-->
    <!--        </div>-->
    <div class="logo information-title"><img
        src="../assets/img/token/ppswap_logo3.png"
        class="logo-img"
        alt=""></div>
    <div class="logo information-title" v-for="item in navList" :key="item.id" @click="nav(item.name)">{{
        item.name
      }}
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <el-button type="primary"
                   class="btn-connect-wallet"
                   @click="openWallet"
        >Connect to a wallet
        </el-button>
        <el-button
            type="primary"
            class="btn-connect-wallet"
            v-if="loginAccount != null"
        >{{ curAccount }}
        </el-button>
        <el-button type="primary"
                   class="btn-connect-wallet"
                   @click="openBuyPPswap"
        >Buy PPS
        </el-button>
        <el-button type="primary"
                   class="btn-connect-wallet"
                   @click="openSellPPS"
        >Sell PPS
        </el-button>
        <!--        <el-button type="primary"-->
        <!--                   class="btn-connect-wallet"-->
        <!--                   @click="isLogOut"-->
        <!--        >test-->
        <!--        </el-button>-->
        <!--        <el-button-->
        <!--            type="primary"-->
        <!--            icon="custom-icon el-icon-moon "-->
        <!--            class="header-btn"-->
        <!--            style="margin-right: 10px"-->
        <!--        ></el-button>-->

        <div class="dropdown-more">
          <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                         <el-button type="primary"
                                    class="header-btn"
                         >...</el-button>
                      <!--                        <i class="el-icon-caret-bottom"></i>-->
                    </span>
            <template #dropdown>
              <el-dropdown-menu class="dropdown-menu">
                <el-dropdown-item class="dropdown-menu" divided command="about"><i class="el-icon-warning-outline"></i>About
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-menu" divided command="docs"><i class="el-icon-notebook-2"></i>Docs
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-menu" divided command="code"><i class="el-icon-lx-apps"></i>Code
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-menu" divided command="discord"><i class="el-icon-chat-dot-round"></i>Discord
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-menu" divided command="analytics"><i class="el-icon-pie-chart"></i>Analytics
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-menu" divided command="activeOffer"><i class="el-icon-reading"></i>my
                  active offer
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>


      </div>


    </div>
  </div>

  <!-- connect wallet pannel -->
  <div>
    <el-dialog
        title="Connect to a wallet"
        v-model="walletDialogVisible"
        width="20%"
        center>
      <div>
        <div class="wallet-selection-div">
          <el-button class="wallet-selection" @click="connectWallet('metamask')">
            <div>
              <div class="wallet-left">MetaMask</div>
              <div class="wallet-right"><img src="../assets/img/metamask-icon.png" alt="Icon"></div>
            </div>
          </el-button>
        </div>
        <div class="wallet-selection-div">
          <el-button class="wallet-selection">
            <div>
              <div class="wallet-left">WalletConnect</div>
              <div class="wallet-right"><img src="../assets/img/WalletConnect-icon.png" alt="Icon"></div>
            </div>
          </el-button>
        </div>
        <div class="wallet-selection-div">
          <el-button class="wallet-selection">
            <div>
              <div class="wallet-left">Coinbase</div>
              <div class="wallet-right"><img src="../assets/img/Coinbase-Wallet-icon.png" alt="Icon"></div>
            </div>
          </el-button>
        </div>

      </div>

      <template #footer>
        <p>New to Ethereum? <span><a href="" style="color: #23876d ">Learn more about wallets</a></span></p>
      </template>
    </el-dialog>
  </div>

  <!-- ppswap buying window -->
  <div>
    <el-dialog
        v-model="ppswapBuyWindowVisible"
        width="35%"
        center>
      <div class="ppswap-swap-info">
        <!-- TODO add validation function -->
        <h4 class="title-buy-sell">From ETH</h4>
        <div class="right">
          <el-input
              v-model="ppswBuyAmount"
              placeholder="ETH (current maximum is 0.5)"
              type="number"
          ></el-input>
        </div>
        <div>
          <p><span class="swap-rate">1 (ETH) = {{ ppswapBuyRate }} (PPS).</span>
          </p>
          <!--          <p> <span class="swap-rate">you will get {{ ethAmount }} PPS </span></p>-->
        </div>
        <h4 class="title-buy-sell">To PPS</h4>
        <div class="right">
          <el-input v-model="ethAmount" placeholder="PPS you will get" type="number" disabled></el-input>
        </div>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ppswapBuyWindowVisible = false">cancel</el-button>
          <el-button type="primary" @click="buyppswap">Buy</el-button>
        </div>
      </template>
    </el-dialog>

  </div>

  <!-- ppswap selling window -->
  <div>
    <el-dialog
        v-model="ppswapSellWindowVisible"
        width="35%"
        center>
      <div class="ppswap-swap-info">
        <!-- TODO add validation function -->
        <h4 class="title-buy-sell">From PPS</h4>
        <div class="right">
          <el-input v-model="ppswapSellAmount" placeholder="Amount of PPS for selling" type="number"></el-input>
        </div>
        <div>
          <p><span class="swap-rate">1 (ETH) = {{ ppswapBuyRate }} (PPS).</span>
          </p>
          <!--          <p> <span class="swap-rate">you will get {{ ethAmount }} PPS </span></p>-->
        </div>


        <h4 class="title-buy-sell">to ETH</h4>
        <div class="right">
          <el-input v-model="ppsAmount" placeholder="ETH you will get" type="number" disabled></el-input>
        </div>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ppswapSellWindowVisible = false">cancel</el-button>
          <el-button type="primary" @click="sellPPS">Sell</el-button>
        </div>
      </template>
    </el-dialog>

  </div>


  <!-- cancel offer winow -->

  <div>
    <el-dialog
        title="Your current active offers"
        v-model="cancelTokenWinowVisible"
        width="45%"
        center>
      <el-table :data="activatedOffer">
        <el-table-column property="tokena" label="from token" width="150"></el-table-column>
        <el-table-column property="amta" label="amount" width="150"></el-table-column>
        <el-table-column property="tokenb" label="to token" width="200"></el-table-column>
        <el-table-column property="amtb" label="amount"></el-table-column>
        <el-table-column
            fixed="right"
            label="cancel"
            width="120">
          <template #default="scope">
            <el-button
                @click.prevent="cancelOffer(scope.$index)"
                type="text"
                size="small">
              cancel
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelTokenWinowVisible = false">cancel</el-button>
        </div>
      </template>
    </el-dialog>


  </div>

</template>
<script>
import {connectToWallet} from "@/utils/contractMethods";
import {dealWithDecimals} from "@/utils/numberUtils";
import {updateStatus} from "@/network/api/offerAPI";
import {selectAllActiveOffer} from "@/network/api/offerAPI";
import {getNameByContractAddress} from "@/utils/commonUtils";
import {ppswapUrl} from "@/utils/constants/network";
import {checkBalance} from "@/utils/contractCommonMethods";

export default {
  data() {
    return {
      walletDialogVisible: false,
      ppswapBuyWindowVisible: false,
      ppswapSellWindowVisible: false,
      fullscreen: false,
      ppswBuyAmount: null, // how many ethers that user would like to use for buying ppswap, max current is 0.5
      ppswapBuyRate: null, // current rate of swapping ether and ppswap

      ppswapSellAmount: null,// how many pps that user would like to use for selling

      activatedOffer: [],
      cancelTokenWinowVisible: false,
      name: "linxin",
      message: 2,
      loginAccount: localStorage.getItem('account'),

      navList: [
        {
          id: 1,
          name: 'Swap',
        },
        {
          id: 2,
          name: 'Search',
        },
        {
          id: 3,
          name: 'Exchange',
        },
        {
          id: 4,
          name: 'Vote',
        },
        {
          id: 5,
          name: 'Charts',
        },
      ],
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    },
    curAccount() {
      // get current login account
      this.loginAccount = localStorage.getItem('account');
      if (!this.loginAccount) {
        return '...';
      }
      return this.loginAccount.substring(0, 5) + '...' + this.loginAccount.substring(this.loginAccount.length - 3);
    },
    collapse() {
      return this.$store.state.collapse;
    },
    ethAmount() {
      return this.ppswBuyAmount * this.ppswapBuyRate;
    },
    ppsAmount() {
      return this.ppswapSellAmount / this.ppswapBuyRate;
    }
  },
  methods: {

    isLogOut() {
      let log = this.$store.dispatch('isLogOut');
    },

    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        this.$router.push("/login");
      } else if (command === 'activeOffer') {
        let currentAccount = localStorage.getItem('account');
        // check weather user is login
        if (!currentAccount) {
          this.$message.error("please connect to your wallet first!");
          return;
        }
        this.findAllActiveOffer();
        this.cancelTokenWinowVisible = true;
      } else if (command === 'about') {
        window.open(ppswapUrl)
      }
    },

    collapseChage() {
      this.$store.commit("hadndleCollapse", !this.collapse);
    },
    nav(route) {
      console.log(route)
      if (route === 'Swap') {
        this.$router.replace("/swap");
      } else if (route === 'Search') {
        this.$router.replace("/search");
      } else {
        this.$router.replace("/login");
      }
    },
    // connect to the Wallet
    connectWallet(type) {
      if (type === 'metamask') {
        this.$store.commit('connectToWallet');
        this.walletDialogVisible = false;
      }
    },
    // for buy ppswap
    async openBuyPPswap() {
      // check the current rate for buying ppswap
      this.ppswapBuyRate = await this.$store.dispatch('rateOfBuyingPpswap');
      this.ppswapBuyWindowVisible = true;
    },

    // for sell ppswap
    async openSellPPS() {
      // check the current rate for buying ppswap
      this.ppswapBuyRate = await this.$store.dispatch('rateOfBuyingPpswap');
      this.ppswapSellWindowVisible = true;
    },

    // query all active offer for current account
    findAllActiveOffer() {
      let currentAccount = localStorage.getItem('account');
      // get all active offer
      selectAllActiveOffer(currentAccount).then(res => {
        this.activatedOffer = res.data.data;
        // format address to token
        this.activatedOffer.forEach(offer => {
          offer.tokena = getNameByContractAddress(offer.tokena);
          offer.tokenb = getNameByContractAddress(offer.tokenb);
        })
      }).catch(error => {
        console.log(error);
      });
    },

    cancelOffer(index) {
      // TODO current don't remove user's allowance
      this.$confirm('Are you sure you want cancel this offer', 'Cancel offer', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      })
          .then(async () => {

            // get id
            let id = this.activatedOffer[index].id;
            console.log(id);
            // delete data from array
            this.activatedOffer.splice(index, 1);

            // call method from contract
            await this.$store.dispatch('cancelOffer', {
              offerId: id
            })

            // update data in database
            updateStatus(id, 3).then(res => {
              console.log(res)
            }).catch(error => {
              console.log(error);
            })
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: action === 'cancel'
                  ? 'user cancel'
                  : 'OK'
            })
          });
    },
    // buy ppswap
    async buyppswap() {
      let amount = this.ppswBuyAmount;
      // check amount
      if (amount < 0 || amount > 0.5) {
        this.$message.error("The number should in the range of 0 - 0.5")
        return;
      }

      // check if user already have too many PPS
      let buyingAmount = this.ppswBuyAmount * this.ppswapBuyRate;
      if(!await this.checkValidForBuy(buyingAmount)){
        this.$message.error("Currently user only allow to hold less then 1B PPS, please check your PPS amount")
        return;
      }

      // start loading
      const loading = this.$loading({
        lock: true,
        text: 'Please wait',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // call the buyppswap method of the contract
      this.$store.dispatch('buyPpswap', {amount: amount}).then(res => {
        loading.close();
        console.log(res);
        this.$message.success('OK');
        this.ppswapBuyWindowVisible = false;
      }).catch(error => {
        console.log(error)
        loading.close();
        this.$message.error('Error! see console');
      });
    },

    // check if user is valid to buy PPS
    async checkValidForBuy(plusAmount) {
      // 1. user should have less then 1B(1000000) PPS
      let balance = await checkBalance(-1, localStorage.getItem('account'), this.$store.state);
      // calculate real balance with decimal
      balance = dealWithDecimals(balance, -18);
      return balance + plusAmount <= Math.pow(10, 9);
    },

    //sell ppswap
    sellPPS() {
      let amount = this.ppswapSellAmount;

      // start loading
      const loading = this.$loading({
        lock: true,
        text: 'Please wait',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.$store.dispatch('sellPPS', {amount: amount}).then(res => {
        // stop loading
        loading.close();
        console.log(res);
        this.$message.success('OK');
        this.ppswapSellWindowVisible = false;
      }).catch(error => {
        // stop loading
        loading.close();
        console.log(error);
        this.$message.error('Error! see console');
      });
    },
    makeSwap() {

    },

    openWallet() {
      this.walletDialogVisible = true;
    },


  },
  mounted() {


    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }

    window.ethereum.on('accountsChanged', (account) => {
      if (!account.length) {
        this.loginAccount = null;
        localStorage.removeItem('account');
      } else {
        this.loginAccount = account;
        localStorage.setItem('account', account);
      }
    })
    // console.log(this.$store);
    //
    // setInterval(this.checkAccountState, 100);
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 20px;
  color: #fff;
  background-color: #191a53;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  /*width: 250px;*/
  line-height: 70px;
  margin-left: 20px;

}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.dropdown-more {
  margin-left: 20px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}

.btn-connect-wallet {
  background-color: #1c2e48;
  color: #FFFFFF;
}

.header-btn {
  background-color: #40444f;
}

.custom-icon {
  font-size: 2rem;
}


.information-title {
  font-size: 18px;
  cursor: pointer; /*鼠标悬停变小手*/
}

.logo-img {
  width: 72px;
  height: 57px;
  display: inline-block;
  vertical-align: middle;
}

.dropdown-menu {
  text-align: left;
}

.wallet-selection {
  width: 100%;
  vertical-align: middle;
  line-height: 40px;
  font-size: 20px;
  background-color: #1a6e60;
  color: #FFFFFF;
}

.wallet-selection-div {
  height: 15%;
  margin-bottom: 10px;
}

.wallet-selection-window {
  background-color: #2c2e36;
}

.wallet-right {
  float: right;
}

.wallet-left {
  float: left;

}

.wallet-right > img {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
}

.ppswap-swap-info > div {
  margin-bottom: 20px;
}

.swap-rate {
  color: #1a6e60;
  font-size: 18px;
}

.title-buy-sell {
  color: #1a6e60;
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
}

</style>
