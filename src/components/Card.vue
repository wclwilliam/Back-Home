<script setup>
  //列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
const props = defineProps({
  title: String,
  imageSrc: String,
  dateTime: String,
  location: String,
  status: String, // 例如：'closed', 'open', 'notify'
  type: String,   // 例如：'巡守', '淨灘', '照護'
  progress: Number, // 0-40，如果有值則顯示進度條
  isNews: Boolean // 是否為新聞卡片
})

const statusTxt = {
  closed: {text: "已結束", class: 'is-closed'},
  notify: {text: "異動通知" , class: 'is-notify'}
}

const currentStatus = computed(() => statusTxt[props.status])

</script>
<template>
  
  <div class="card-container">
    <div class="card-pic">
      <img :src="imageSrc" :alt="title"/>
      <div class="status-badge">
        <i class="fa-solid fa-tag"></i>
        {{ currentStatus.text }}
      </div>
      <div class="type-badge">
        <i class="fa-solid fa-tag"></i>
        {{type}}
      </div>
      
    </div>
    <div class="card-info">
      <div class="card-title">
        <span>{{title}}</span>
        <i class="bookmark-icon material-symbols-outlined">
        </i>
      </div>
      <div class="line"></div>
      <div class="dateTime">
        <i class="fa-solid fa-tag"></i>
        <h4>{{dateTime}}</h4>
      </div>
      <div class="location">
        <i class="fa-solid fa-tag"></i>
        <h4>{{location}}</h4>
      </div>
      <div class="signUpNum">
        <i class="fa-solid fa-tag"></i>
        <div>{{progress}}</div>
        <div>20/40</div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/scss/component/_card.scss" lang="scss" scoped></style>