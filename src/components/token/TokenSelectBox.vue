<template>
  <div class="token-box-body">
    <div class="search-area">
      <!--        <div>-->
      <!--          <p class="title-text"></p>-->
      <!--        </div>-->
      <div>
        <el-input
            class="searchClass"
            placeholder="Search name or paste address"
            v-model="input"
            clearable
            size="medium"
        >
        </el-input>
      </div>
    </div>
    <div class="token-list">
      <ul>
        <li class="token-li" v-for="(token, index) in tokenList">
          <el-row @click="tokenSelect(index)">
            <!--            <el-col :span="4">-->
            <!--              <img :src="token.iconUrl" style="width: 24px;height: 24px" alt="">-->
            <!--            </el-col>-->
            <el-col :span="4">
              {{ token.name }}
            </el-col>
            <el-col :span="4" :offset="12">
              {{ calBalance(balance[index]) }}
            </el-col>
          </el-row>
        </li>
      </ul>
    </div>
    <div class="footer">

    </div>
  </div>
</template>

<script>
import {checkBalance, getDecimal} from "@/utils/contractCommonMethods";
import {dealWithDecimals} from "@/utils/numberUtils";

export default {
  name: "TokenSelectBox",
  props: {
    input: {
      type: String,
      default: "",
    },
    tokenList: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      count: 45,
      balance: [],
    }
  },
  mounted() {
    this.getBalance();
    // let balance = checkBalance(3, localStorage.getItem('account'), this.$store.state);
    // console.log(balance)

    console.log(this.balance);
  },
  methods: {
    tokenSelect(index) {
      this.$emit('tokenSelect', index);
    },
    getBalance() {
      // TODO add more, current only support 2 ,3
      for (let i = 0; i < this.tokenList.length; i++) {
        if (i === 2 || i === 3) {
          // check balance first
          checkBalance(i, localStorage.getItem('account'), this.$store.state).then(res => {
            this.balance.push({
              balance: res
            })
            // then check decimal
            getDecimal(i, this.$store.state).then(res => {
              this.balance[i].decimals = res;
            })

          });

        } else {
          this.balance.push({});
        }
      }
    }
  },
  computed:{
    calBalance(){
      return function (token){
        if (!token || !token.balance) return 0;
        return dealWithDecimals(token.balance,- token.decimals).toString();
      }
    }
  }

}
</script>

<style scoped>
.token-box-body {
  background-color: #fff;
}

.title-text {
  font-size: 18px;
}

.token-list {
  overflow: scroll;
  height: 400px;
  margin: 20px auto;
}

.token-li {
  height: 50px;
  vertical-align: center;
  margin: 3px;
  /*background-color: black;*/
}

.token-li > div {

}

.token-li:hover {
  background-color: rgb(237, 238, 242);
}
</style>
