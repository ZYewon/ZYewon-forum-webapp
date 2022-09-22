<template>
  <li class="list-box">
    <div class="list-head" @click="goDetail(item._id)">
      <div class="title">
        <span class="type" :class="['type-' + item.catalog]">{{
          formatCatalog(item.catalog)
        }}</span>
        <span class="ellipsis">
          {{ item.title }}
        </span>
      </div>
    </div>
    <div class="author" v-if="item.uid" @click.stop="goUser(item.uid._id)">
      <img :src="item.uid.pic || 'img/bear-200-200.jpg'" class="head" />
      <span class="name">{{ item.uid.nickname }}</span>
      <i class="vip" v-if="item.uid.isVip && +item.uid.isVip !== 0"
        >VIP{{ item.uid.isVip }}</i
      >
    </div>
    <div class="list-body" @click="goDetail(item._id)">
      <div class="info">
        <span v-html="escapeHtml(item.content)"> </span>
        <!--        <img src="../../assets/vue.svg" class="fmt" />-->
      </div>
    </div>
    <div class="list-footer" @click="goDetail(item._id)">
      <div class="left">
        <span>{{ item.answer }}回复</span>
        <span>{{ formatDay(item.created) }}</span>
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import formatDay from "@/utils/formatDay";
import escapeHtml from "@/utils/escapeHtml";
import formatCatalog from "@/utils/formatCatalog";
// const CATALOG_TYPE: any = {
//   share: "分享",
//   ask: "提问",
//   discuss: "讨论",
//   advice: "建议",
// };
// const formatCatalog = (catalog: string) => {
//   return CATALOG_TYPE[catalog];
// };
const props = defineProps(["item"]);

const emit = defineEmits(["onShowUser", "onShowDetail"]);
const goDetail = (tid: string) => {
  emit("onShowDetail", tid);
};
const goUser = (uid: string) => {
  emit("onShowUser", uid);
};
</script>

<style scoped lang="scss">
@import "./listitem.scss";
</style>
