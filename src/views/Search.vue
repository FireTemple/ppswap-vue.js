<template>
  <!--  <div class="searchBox">-->
  <el-row class="searchBox" type="flex" align="middle" justify="center">
    <el-col :span="2" class="mid">
      <el-dropdown @command="selectFromToken">
        <el-button type="primary">
          {{ fromTokenInfo.token }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
                v-for="(token, index) in tokenList" :command="index">{{ token.token }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <el-col :span="1" class="mid">
      <i class="icon el-icon-right"></i>
    </el-col>
    <el-col :span="2" class="mid">
      <el-dropdown @command="selectToToken">
        <el-button type="primary">
          {{ toTokenInfo.token }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(token, index) in tokenList" :command="index">{{ token.token }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>

    <el-col :span="3" class="mid">
      <el-button type="primary" icon="el-icon-search" @click="searchResult">Search Result</el-button>
    </el-col>
  </el-row>
  <!--  </div>-->


  <div class="search-result">

    <el-row type="flex" align="middle" justify="center">
      <el-col :span="16">

        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column
              show-tooltip-when-overflow
              prop="id"
              label="id"
              width="100">
          </el-table-column>
          <el-table-column
              show-tooltip-when-overflow
              prop="createTime"
              label="date"
              width="180">
          </el-table-column>
          <el-table-column
              show-tooltip-when-overflow
              prop="accounta"
              label="account"
              width="180">
          </el-table-column>
          <el-table-column
              label="Amount of token A"
              prop="amta" width="210">
          </el-table-column>
          <el-table-column
              label="Amount of token B"
              prop="amtb" width="210">
          </el-table-column>
          <!--          <el-table-column-->
          <!--              prop="to"-->
          <!--              label="to">-->
          <!--          </el-table-column>-->
          <!--          <el-table-column-->
          <!--              prop="toAmount"-->
          <!--              label="amount">-->
          <!--          </el-table-column>-->
          <el-table-column
              align="right">
            <!--            <template #header>-->
            <!--              <el-input-->
            <!--                  v-model="search"-->
            <!--                  size="mini"-->
            <!--                  />-->
            <!--            </template>-->
            <template #default="scope">
              <el-button
                  size="mini"
                  type="success"
                  @click="openConfirmBox(scope.$index)">accept
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>


    <!-- confirm dialog -->
    <el-dialog
        title="Please confirm the offer information"
        v-model="confirmBoxVisible"
        width="30%"
        :before-close="handleClose">
      <p>From token: {{ fromTokenInfo.token }}. The amount would be: {{ tableData[selectedOfferIndex].amta }}</p>
      <p>to token: {{ toTokenInfo.token }} The amount would be: {{ tableData[selectedOfferIndex].amtb }}</p>
      <p style="color: red" v-if="isOfferValid === true">Please click the 'check' button below to check if this offer still valid</p>
      <p style="color: red" v-if="isOfferValid === false"><b><i>{{resultAfterCheck}}</i></b></p>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="confirmBoxVisible = false">cancel</el-button>
      <el-button @click="checkOfferValidation">check</el-button>
      <el-button type="primary" @click="acceptOffer(selectedOfferIndex)" v-if="isOfferValid">confirm</el-button>
    </span>
      </template>
    </el-dialog>
  </div>


</template>

<script>
import TokenSelectBox from "@/components/token/TokenSelectBox";
import {requestPromise} from "@/network";
import {kovanAddress} from "@/utils/constants/contract";
import {apiBaseUrl} from "@/utils/constants/network";

export default {
  name: "Search",
  components: {TokenSelectBox},
  data() {
    return {
      centerDialogVisible: false,

      fromTokenInfo: {},
      toTokenInfo: {},
      fromIndex: 0,
      toIndex: 1,

      tokenList: [],
      tableData: [],
      selectedOfferIndex: 0,

      confirmBoxVisible: false,

      // flag for checking offer status
      isOfferValid: true,
      resultAfterCheck: '',

    }
  },
  methods: {
    // initailize the data table
    initTableData() {
      this.tokenList = kovanAddress;
      // the default token is eth
      this.fromTokenInfo = this.tokenList[0];
      this.toTokenInfo = this.tokenList[1];
    },
    // handle token selection
    selectFromToken(index) {
      this.fromTokenInfo = this.tokenList[index];
      this.fromIndex = index;
    },
    selectToToken(index) {
      this.toTokenInfo = this.tokenList[index];
      this.toIndex = index;
    },

    // search result
    searchResult() {

      requestPromise({
        url: apiBaseUrl + '/offer/search',
        method: 'post',
        data: {
          tokenA: this.fromTokenInfo.address,
          tokenB: this.toTokenInfo.address
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.data;
      }).catch(error => {
        console.log(error);
      })
    },

    // all accept offer
    acceptOffer(index) {

      const loading = this.$loading({
        lock: true,
        text: 'Please wait',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.$store.dispatch('acceptOffer', {
        toIndex: this.toIndex,
        toTokenAddress: this.toTokenInfo.address,
        offerId: this.tableData[this.selectedOfferIndex].id,
        amtB: this.tableData[index].amtb,
      }).then(res => {
        // close loading and dialog
        loading.close();
        this.confirmBoxVisible = false;

        if (res) {
          console.log(res);
        }
        // add data to the database
        requestPromise({
          url: apiBaseUrl+'/api/offer',
          method: 'put',
          data: {
            id: this.tableData[index].id,
            status: 2,
          }
        }).then(res => {
          if (res.data.code === 0) {
            this.$message.success("OK!");
          }
          // refresh table
          this.searchResult();
        }).catch(res => {
          console.log(res);
        })
      }).catch(error => {
        loading.close();
        console.log(error)
      })
    },
    // check if offer could be done
    checkOfferValidation(){
      // get information
      let offer = this.tableData[this.selectedOfferIndex];
      // console.log( localStorage.getItem('account'));
      this.$store.dispatch('validateInfo', {
        tokenAIndex: this.fromIndex,
        tokenBIndex: this.toIndex,
        tokenAOwner: offer.accounta,
        tokenBOwner: localStorage.getItem('account'),
        tokenAAmt: offer.amta,
        tokenBAmt: offer.amtb,
      }).then(res => {
        if (res === 4){
          this.$message.success("This offer is valid!")
        }else {

          this.isOfferValid = false;
          if (res === 0){
            this.resultAfterCheck = 'offer maker\'s allowance is not enough';
          }else if (res === 1){
            this.resultAfterCheck = 'offer taker\'s allowance is not enough';
          }else if (res === 2){
            this.resultAfterCheck = 'offer maker\'s balance for tokenA is not enough';
          }else {
            this.resultAfterCheck = 'offer taker\'s balance for tokenB is not enough';
          }
        }
      });
    },

    openConfirmBox(index) {
      this.isOfferValid = true;
      this.selectedOfferIndex = index;
      this.confirmBoxVisible = true;
    },

  },
  computed: {},
  created() {
    this.initTableData();
  }
}
</script>

<style scoped>
.searchBox {
  /*background-color: forestgreen;*/
  height: 100px;
  margin-top: 50px;

}

.mid {
  display: flex;
  justify-content: center; /*主轴上居中*/
  align-items: center; /*侧轴上居中*/
}

.search-result {
  height: 500px;
}

</style>
