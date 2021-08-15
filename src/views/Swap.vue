<template>
  <div class="swap-body">
    <div class="nav-line">

    </div>
    <!-- swap box -->
    <div class="swap-box">
      <div class="title">
        <div class="left" @click="test">Swap</div>
      </div>
      <div class="from-box">
        <div class="up-box">
          <div class="left">
            From
          </div>
<!--          <div class="right">-->
<!--            <el-dropdown @command="selectFromDecimal">-->
<!--              <span style="font-size: 18px">unit: {{ fromDecimal }}<i-->
<!--                  class="el-icon-arrow-down el-icon&#45;&#45;right"></i></span>-->
<!--              <template #dropdown>-->
<!--                <el-dropdown-menu>-->
<!--                  <el-dropdown-item v-for="decimal in decimals" :command="decimal">{{ decimal }}</el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
<!--              </template>-->
<!--            </el-dropdown>-->
<!--          </div>-->
        </div>
        <div class="number-token-selector-selection">
          <div class="left">
            <el-input v-model="fromNumber" placeholder="0.0" type="number"></el-input>
          </div>
          <div class="right">
            <el-button type="text" @click="openSelectPanel('from')" class="select-text">
              <div style="width: 100px">
                <div class="right" style="height: 100%; line-height: 100%;vertical-align:middle">
                  {{ fromTokenName }}
                </div>
              </div>
            </el-button>
          </div>
        </div>
      </div>

      <div class="arrow-box">
        <i class="el-icon-bottom"></i>
      </div>

      <div class="to-box">
        <div class="up-box">
          <div class="left">to</div>
          <div class="right">
<!--            <div class="right">-->
<!--              <el-dropdown @command="selectToDecimal">-->
<!--                <span style="font-size: 18px">unit: {{ toDecimal }}<i-->
<!--                    class="el-icon-arrow-down el-icon&#45;&#45;right"></i></span>-->
<!--                <template #dropdown>-->
<!--                  <el-dropdown-menu>-->
<!--                    <el-dropdown-item v-for="decimal in decimals" :command="decimal">{{ decimal }}</el-dropdown-item>-->
<!--                  </el-dropdown-menu>-->
<!--                </template>-->
<!--              </el-dropdown>-->
<!--            </div>-->
          </div>
        </div>
        <div class="number-token-selector-selection">
          <div class="left">
            <el-input v-model="toNumber" type="number" placeholder="0.0"></el-input>
          </div>
          <div class="right">
            <el-button type="text" @click="openSelectPanel('to')" class="select-text">
              <div style="width: 100px">
                <!--                <div class="left">-->
                <!--                  <img :src="ToTokenIcon" style="width: 24px;height: 24px" alt="">-->
                <!--                </div>-->
                <div class="right" style="height: 100%; line-height: 100%;vertical-align:middle">
                  {{ ToTokenName }}
                  <!--                  <i class="icon el-icon-caret-bottom"></i>-->
                </div>
              </div>

            </el-button>
          </div>
        </div>
      </div>
      <div class="footer-box">
        <el-button class="swap-btn" type="primary" round @click="makeOffer"> Make a swap offer</el-button>
        <a href="">(2-step confirmation)</a>
      </div>
    </div>
  </div>

  <!-- select token pop out window -->
  <el-dialog
      title="Select a token"
      v-model="centerDialogVisible"
      width="30%"
      center>
    <token-select-box :token-list="tokenList" @tokenSelect="tokenSelect"/>

    <template #footer>

      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
      </span>

    </template>

  </el-dialog>

</template>

<script>
import TokenSelectBox from "@/components/token/TokenSelectBox";
import {kovanAddress} from "@/utils/constants/contract";
import {ElMessage} from 'element-plus';
import {requestPromise} from "@/network";
import {dealWithDecimals} from "@/utils/numberUtils";
import {apiBaseUrl} from "@/utils/constants/network";

export default {
  name: "Swap",
  components: {TokenSelectBox},
  data() {
    return {
      // flag for dialog
      centerDialogVisible: false,
      // currentIndex: 0,
      input: 0.0,
      fromIndex: 0,
      toIndex: 1,

      // swap information
      selectType: null,
      toToken: null,
      toTokenAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      fromToken: null,
      fromTokenAddress: '0xa36085F69e2889c224210F603D836748e7dC0088',
      fromNumber: null,
      toNumber: null,


      tokenList: [
        {
          name: "ETH",
          iconUrl: '@/assets/img/token/Ethereum-ETH-icon.png',
        },
        {
          name: "USDC",
          iconUrl: '@/assets/img/token/usdc-logo.png'
        },
        {
          name: "WEENUS",
          iconUrl: '@/assets/img/token/USDT-logo.png'
        },
        {
          name: "XEENUS",
          iconUrl: '@/assets/img/token/WBTC-icon.png'
        }
      ],

      activeName: 'first',

      // data for decimal selection
      decimals: ['10⁶', '10⁸', '10¹⁸'],
      fromDecimal: '10¹⁸',
      toDecimal: '10¹⁸',
    }
  },
  methods: {


    // select the decimal, default is 18
    selectFromDecimal(command) {
      this.fromDecimal = command;
    },
    selectToDecimal(command) {
      this.toDecimal = command;
    },

    // testing use
    test() {


    },

    // open select panel
    openSelectPanel(type) {
      this.centerDialogVisible = true;
      this.selectType = type === 'from' ? 0 : 1;
    },

    // select token
    tokenSelect(index) {
      let addresses = kovanAddress;
      let contract = addresses[index];

      // check this selection is for from token or to token.
      if (this.selectType === 0) {
        this.fromIndex = index;
        this.fromToken = contract.name;
        this.fromTokenAddress = contract.address;
      } else {
        this.toIndex = index;
        this.toToken = contract.name;
        this.toTokenAddress = contract.address;
      }
      this.centerDialogVisible = false;

    },


    // make offer
    makeOffer() {
      const loading = this.$loading({
        lock: true,
        text: 'Please wait',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.$store.dispatch('makeOffer', {
        fromTokenAddress: this.fromTokenAddress,
        toTokenAddress: this.toTokenAddress,
        fromIndex: this.fromIndex,
        // check the decimal
        amtA:this.fromNumber,
        amtB: this.toNumber,
      }).then(res => {
        loading.close();
        if (res) {
          // get offer id
          let offerId = res.events.MakeOffer.returnValues[0];
          ElMessage.success({
            message: 'You successfully posted an offer',
            type: "success"
          })
          // add offer record to database
          requestPromise({
            url: apiBaseUrl + '/api/offer',
            method: 'post',
            data: {
              id: offerId,
              accounta: localStorage.getItem('account'),
              tokena: this.fromTokenAddress,
              tokenb: this.toTokenAddress,
              amta: this.fromNumber,
              amtb: this.toNumber,
              status: 1
            }
          }).then(res => {
            // update allowance
            if (res.data.code === 0){
                //1. query allowance first

            }
          }).catch(error => {
            console.log(error);
          })
        }
      }).catch(error => {
        loading.close();
        console.log(error);
        console.log("user cancel")
      });
    },
  },
  computed: {

    fromTokenName() {
      return this.tokenList[this.fromIndex].name;
    },
    fromTokenIcon() {
      return this.tokenList[this.fromIndex].iconUrl;
    },
    ToTokenName() {
      return this.tokenList[this.toIndex].name;
    },
    ToTokenIcon() {
      return this.tokenList[this.toIndex].iconUrl;
    },
    getEthBalance() {
      return localStorage.getItem('balance') ? localStorage.getItem('balance') : 0;
    }

  },
}
</script>

<style scoped>

.left {
  float: left;
}

.right {
  float: right;
}

.swap-box {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid;
  border-radius: 25px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.swap-box > div {
  width: 80%;
  margin: 10px auto;
}

.from-box {
  /*border-style:solid;*/
  /*border-width:1px;*/
  /*border-color: #2c2e36;*/
  /*width: 80%;*/
  /*height: 50px;*/
  /*background-color: red;*/
  height: 100px;
  border: 1px solid;
  border-radius: 10px;
  border-color: #FFFFFF;
  padding: 6px;
}

.title {
  /*background-color: blue;*/
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  margin-bottom: 20px !important;
}

.to-box {
  /*background-color: pink;*/
  height: 100px;
  border: 1px solid;
  border-radius: 10px;
  border-color: #FFFFFF;
  padding: 6px;
}

.arrow-box {
  /*background-color: #FFFFFF;*/
  height: 30px;
  text-align: center;
  color: #1a6e60;
  font-size: 25px;
}

.footer-box {
  /*background-color: grey;*/
  height: 100px;
  text-align: center;
}

.up-box {
  height: 50%;
}

.number-token-selector-selection {
  height: 50%;

}


.swap-btn {
  width: 100%;
  height: 80%;
  font-size: 24px;
}

.select-text {
  font-size: 18px;
  /*垂直居中 */
  vertical-align: middle;
  /*水平居中*/
  text-align: center;
  line-height: 18px;
}

</style>
