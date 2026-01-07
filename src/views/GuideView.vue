<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const productlist = ref([])

// 渲染頁面抓資料
onMounted(() => {
  // 按門鈴去請求資料
  axios
    .get('https://fakestoreapi.com/products')
    .then((response) => {
      //console.log('資料回傳:', response.data) 
      productlist.value = response.data
    })
})
</script>

<template>
  <main>
    <h1>海龜圖鑑列表 (商品列表)</h1>

    <ul v-if="productlist.length > 0">
      <li v-for="item in productlist" :key="item.id">
        <router-link :to="{ name: 'GuideInfo', params: { id: item.id } }">
          {{ item.title }} - ${{ item.price }}
        </router-link>
      </li>
    </ul>
    <button class="btn btn-solid">確定確定確定確定確定</button>
    <button class="btn btn-outline">取消</button>
    <button class="btn btn-outline btn-s">取消</button>
    <br>
     <button class="btn btn-solid btn-xxl">加入保育志工</button>
     <button class="btn btn-outline-game btn-xxl">加入保育志工</button>
     <button class="btn btn-outline-white btn-xxl">成為志工，加入我們的行列</button>
      <button class="btn btn-outline-game btn-xxl">goodgoododdo</button>
    <li>列表一
      <a href="">測試測試</a>
    </li>

    <!-- <p v-else>載入中...</p> -->
  </main>
</template>

<style lang="scss" scoped>
h1 {
  color: $primary-color;
  font-weight: bold;
}

li {
  margin-bottom: 10px;

  a {
    color: $highlight-color3;
    text-decoration: none;

    &:hover {
      color: $highlight-color2;
      /* SCSS 的巢狀寫法 */
    }
  }
}
</style>