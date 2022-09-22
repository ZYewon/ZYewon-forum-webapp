<template>
  <ul class="scroll collect-list" v-if="collectList && collectList.length > 0">
    <li v-for="item in collectList">
      <div class="user">
        <img
          class="avatar"
          :src="
            item.tid
              ? item.tid.uid
                ? item.tid.uid.pic
                : `/img/bear-200-200.jpg`
              : `/img/bear-200-200.jpg`
          "
          alt=""
        />
        <span class="nickname">{{
          item.tid
            ? item.tid.uid
              ? item.tid.uid.nickname
              : "未知用户"
            : "未知用户"
        }}</span>
      </div>
      <div class="title">{{ item.title }}</div>
      <div class="desc">{{ item.tid ? item.tid.content : "" }}</div>
      <div class="other">
        <div class="hands icons">
          <van-icon name="chat-o" size="4.5vw" />
          <span>{{ item.tid ? item.tid.answer : "0" }}</span>
        </div>
        <div class="reads icons">
          <van-icon name="eye-o" size="4.5vw" />
          <span>{{ item.tid ? item.tid.reads : "0" }}</span>
        </div>
        <div class="delete" @click="deleteClick(item.tid ? item.tid._id : '')">
          <van-icon name="delete-o" size="4.5vw" />
        </div>
      </div>
    </li>
    <slot></slot>
  </ul>
  <div class="van-empty f-color" v-else>没有收藏记录</div>
</template>

<script setup lang="ts">
defineProps(["collectList"]);
const emit = defineEmits(["deleteClick"]);
const deleteClick = (id: string) => {
  emit("deleteClick", id);
};
</script>

<style scoped lang="scss">
.collect-list {
  padding: 20px;
  box-sizing: border-box;

  li {
    display: flex;
    flex-direction: column;
    gap: 20px;

    border-bottom: 1px solid #f1f2f3;
    padding: 40px 0;
    &:first-child {
      padding-top: 0;
    }
    &:last-of-type {
      border-bottom: none;
    }

    .user {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 28px;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .nickname {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .title {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .desc {
      font-size: 24px;
      color: #777777;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .other {
      width: 100%;
      display: flex;
      gap: 20px;
      font-size: 24px;
      color: #999;
      position: relative;
      .delete {
        position: absolute;
        right: 12px;
        top: 0px;
      }
      .icons {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }
  }
}
.f-color {
  color: #999;
  font-size: 28px;
}
</style>
