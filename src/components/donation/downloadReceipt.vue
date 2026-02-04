<script setup>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ref,computed } from 'vue'
import MyButton from './MyButton.vue';
// import { useLocalStorage } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const receipt = ref(null);
const showModal = ref(false);

// const donationState = useLocalStorage('donationState',{})

const props = defineProps({
  donationId: {
    type: Number,
    default: 0
  },
  finalAmount: {
    // type: Number,
    // default: 0
  }
})


const closeModal = () =>{
  showModal.value = false
}
const openModal = () =>{
  showModal.value = true
  // donationState.value.currentStep=1 //開啟收據時把捐款步驟設為1
}
// 必須暴露出來，父組件才抓得到
defineExpose({ openModal });


const exportToPDF = async () => {
  // 1. 將 HTML 轉為 Canvas
  const canvas = await html2canvas(receipt.value, {
    scale: 2, // 提高清晰度
    useCORS: true, // 支援跨域圖片
    backgroundColor: '#ffffff',
  })
  showModal.value = false //跑完才關閉
  // 2. 獲取圖片數據
  const imgData = canvas.toDataURL('image/png')

  // 3. 建立 PDF 對象 (A4 紙張)
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  // 4. 加入圖片並儲存
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save('海龜協會_捐款收據.pdf')

  
}

const now = new Date();


const flowNum = computed(() =>{
  let time = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate())
  // let random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return time + '-' + props.donationId
})

</script>

<template>
  <Teleport to="body">
        <Transition name="fade"> <!--淡入淡出-->
        <div class="lightbox-overlay" v-if="showModal" @click.self="closeModal">
            <div class="receipt-modal">
              <div id="receipt-content" class="receipt-container" ref="receipt">
                <h1 class="main-title">捐款收據</h1>
                <div class="receipt-border">
                  <h2 class="org-name">龜途海龜保育協會</h2>
                  <div class="details">
                    <p><span>捐款編號：</span>{{ flowNum }}</p>
                    <p><span>捐款姓名：</span>{{ auth.user.name }}</p>
                    <p><span>捐款金額：</span>新台幣 {{ finalAmount }} 元</p>
                    <p><span>捐款日期：</span>{{`${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`}}</p>
                    <p><span>捐款用途：</span>海龜醫療救援與棲地巡邏</p>
                  </div>
                  <div class="signature-area">
                    <span>簽章</span>
                    <div class="seal-container">
                      <img src="@/assets/image/DonationView/stamp.png" alt="印章" class="seal-img" />
                      <div class="sig-line"></div>
                    </div>
                  </div>
                </div>
              </div>
              <MyButton class="btn-xxl" width="100%"  @click="exportToPDF">下載捐款收據 PDF</MyButton>
            </div>
        </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
  .lightbox-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex; justify-content: center; align-items: center;
    z-index: 2000;
}
.receipt-container {
  width: 595px; /* A4 寬度比例 */
  padding: 40px;
  background: white;
  margin: 0 auto;
}
.main-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
}
.receipt-border {
  border: 1px solid #000;
  padding: 40px;
  position: relative;
}
.org-name {
  text-align: center;
  font-size: 22px;
  margin-bottom: 40px;
}
.details p {
  margin: 20px 0;
  font-size: 16px;
  display: flex;
}
.details span {
  width: 100px;
  display: inline-block;
}

.signature-area {
  margin-top: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.seal-container {
  position: relative;
  width: 150px;
}
.seal-img {
  position: absolute;
  bottom: 5px;
  left: 32px;
  width: 80px; /* 調整印章大小 */
  opacity: 0.8;
}
.sig-line {
  border-bottom: 1px solid #000;
  width: 100%;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
