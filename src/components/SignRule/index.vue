<template>
  <table class="table" border>
    <thead>
      <tr class="table-title">
        <th>连续签到天数</th>
        <th>每天活动积分</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>小于5天</td>
        <td>5积分</td>
      </tr>
      <tr>
        <td>大于或等于5天</td>
        <td>10积分</td>
      </tr>
      <tr>
        <td>大于或等于15天</td>
        <td>15积分</td>
      </tr>
      <tr>
        <td>大于或等于30天</td>
        <td>20积分</td>
      </tr>
      <tr>
        <td>大于或等于100天</td>
        <td>30积分</td>
      </tr>
      <tr>
        <td>大于或等于365天</td>
        <td>50积分</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.table {
  border-collapse: collapse;
  border-color: #f1f9f2;
  width: 100%;
  margin-bottom: 20px;
  thead {
    tr {
      background-color: #efefef;
      th {
        font-weight: normal;
        font-size: 28px;
        padding: 20px 0;
        color: #666;
      }
    }
  }
  tbody {
    td {
      padding: 20px 0;
      text-align: center;
      color: #666;
      font-size: 28px;
    }
  }
}
</style>
