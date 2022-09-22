<template>
  <div class="content" :style="innerHeight">
    <NavBar :title="postDetail.title" left-arrow @click-left="router.back">
    </NavBar>

    <div class="wrapper" v-if="postDetail.uid" ref="wrapper">
      <div class="detail-head">{{ postDetail.title }}</div>
      <div class="detail-info">
        <div class="detail-info-head">
          <div class="avatar">
            <img :src="postDetail.uid.pic" class="avatar" />
          </div>
          <div class="cont">
            <p class="name">{{ postDetail.uid.nickname }}</p>
            <p class="time">{{ formatDay(postDetail.created) }}</p>
          </div>
        </div>

        <div
          class="detail-info-body"
          v-html="escapeHtml(postDetail.content)"
        ></div>
        <div class="detail-info-foot">{{ postDetail.reads }} 阅读</div>
      </div>

      <div class="comments">
        <div class="title">评论</div>
        <ul class="comments-lists">
          <li
            class="item"
            v-for="(item, index) in commentsList"
            :key="'comments-' + index"
          >
            <div class="detail-info-head">
              <div class="user">
                <div class="avatar">
                  <img :src="item.cuid && item.cuid.pic" alt="" />
                </div>
                <div class="cont">
                  <p class="name">{{ item.cuid && item.cuid.nickname }}</p>
                  <p class="time">{{ formatDay(item.created) }}・评论了帖子</p>
                </div>
              </div>
              <div class="hands">
                <van-icon name="good-job-o" class="svg-icon" size="5vw" />
                <span>{{ item.hands }}</span>
              </div>
            </div>
            <div class="detail-body" v-html="escapeHtml(item.content)"></div>
          </li>
        </ul>
        <div class="info" v-if="commentsList && commentsList.length === 0">
          暂无评论，赶紧来抢沙发吧~~~
        </div>
        <Loading
          v-if="!isEnd"
          ref="loadingRef"
          style="text-align: center"
        ></Loading>
        <div v-if="isEnd" class="info">没有更多了~~~</div>
        <!--      <div class="loading" v-if="loading">-->
        <!--        <mt-spinner type="fading-circle"></mt-spinner>加载中...-->
        <!--      </div>-->
        <!--      <div class="info" v-if="isEnd">没有更多了~~~</div>-->
      </div>

      <div class="detail-bottom" ref="detailBottom">
        <span class="bottom-input-wrap">
          <van-icon name="edit" class="svg-icon face" />
          <input class="input" type="text" placeholder="写评论" />
        </span>
        <ul class="bottom-right">
          <li :class="{ row: !showText }">
            <van-icon name="comment-o" class="svg-icon" size="5vw" />
            <p>
              <span v-show="showText">评论</span>
              {{ postDetail.answer }}
            </p>
          </li>
          <li :class="{ row: !showText }">
            <van-icon
              name="star-o"
              class="svg-icon"
              size="5vw"
              style="margin-top: -2px"
            />
            <p>
              <span v-show="showText">{{
                postDetail.isFav ? "取消收藏" : "收藏"
              }}</span>
            </p>
          </li>
          <!--        <li :class="{ row: !showText }">-->
          <!--          <van-icon name="good-job-o" class="svg-fav" />-->
          <!--          <p>-->
          <!--            <span v-show="showText">赞</span>-->
          <!--            {{ postDetail.favs }}-->
          <!--          </p>-->
          <!--        </li>-->
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, nextTick, onMounted, ref } from "vue";
import formatDay from "@/utils/formatDay";
import escapeHtml from "@/utils/escapeHtml";
import { Toast, Loading, NavBar } from "vant";
import { useRouter } from "vue-router";
import { getDetail } from "api/content";
import { getComments } from "api/comments";
const props = defineProps(["tid"]);
const showText = ref(false);
const router = useRouter();
const innerHeight = ref("");
const wrapper = ref<HTMLDivElement>();
const postDetail = ref<any>({});
const loadingRef = ref<InstanceType<typeof Loading>>();
const commentsList = ref<any[]>([]);
const total = ref(0);
const isEnd = ref(false);
const detailBottom = ref<HTMLDivElement>();
const pager = {
  pageNum: 1,
  limit: 10,
};
const getCommentAsync = async () => {
  const commentsRes = await getComments({ ...pager, tid: props.tid });
  if (commentsRes.code === 200) {
    if (commentsList.value.length === 0) {
      commentsList.value = commentsRes.data;
    } else {
      commentsList.value.push(...commentsRes.data);
    }

    total.value = commentsRes.total;
    if (total.value > commentsList.value.length) {
      nextTick(() => {
        observer(loadingRef.value?.$el, handleCurrentPage);
      });
    } else {
      isEnd.value = true;
    }
  }
};
const getDetailAsync = async () => {
  const res = await getDetail(props.tid);

  if (res.code === 200) {
    postDetail.value = res.data;
  } else {
    Toast.fail({
      message: "加载失败",
    });
    setTimeout(() => {
      router.replace({
        name: "home-catalog",
      });
    }, 2000);
  }
};
// 翻页
const handleCurrentPage = () => {
  pager.pageNum++;
  getCommentAsync();
};
const observer = (el: HTMLElement, func: any) => {
  const ob = new IntersectionObserver((res) => {
    const item = res[0];
    // 看到了加载动画
    if (item.isIntersecting) {
      // 加载下一页的评论
      func();
    }
  });
  ob.observe(el);
};
onMounted(async () => {
  await getDetailAsync();
  await getCommentAsync();
  innerHeight.value = `height:calc(100vh - ${detailBottom.value?.offsetHeight}px)`;
});
</script>

<style scoped lang="scss">
@import "content.scss";
.content {
  display: flex;
  flex-direction: column;

  .wrapper {
    flex: 1;
    overflow: auto;
  }
}
</style>
