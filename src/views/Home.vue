<template>
  <div class="about">
    <v-header/>

    <!--        <v-sidebar />-->
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <!--            <v-tags></v-tags>-->
      <div class="content">
        <router-view v-slot="{ Component }">
<!--          <transition name="move" mode="out-in">-->
            <component :is="Component"/>
<!--          </transition>-->
        </router-view>
        <!-- <el-backtop target=".content"></el-backtop> -->
      </div>
    </div>
  </div>
</template>
<script>
import vHeader from "../components/Header";
import vSidebar from "../components/Sidebar";
import vTags from "../components/Tags.vue";
import {loadWeb3} from "@/utils/contractMethods";

export default {
  components: {
    vHeader,
    vSidebar,
    vTags
  },
  computed: {
    tagsList() {
      return this.$store.state.tagsList.map(item => item.name);
    },
    collapse() {
      return this.$store.state.collapse;
    }
  },

  // initialize web3
  beforeCreate() {
    this.$store.dispatch('registerWeb3');
  }
};
</script>

<style scoped>

</style>
