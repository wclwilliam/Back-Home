<script setup>
import { ref } from 'vue'

const parseAssets = (fileName) => {
  return new URL(`../../assets/image/about/partners/${fileName}`, import.meta.url).href
}

const partners = ref([
  { id: 1, name: 'Pacific', logo: 'partner_pacific.png', size: 'lg' }, // 太平洋海事 (中間最大)
  { id: 2, name: 'Nebula', logo: 'partner_nebula.png', size: 'md' }, // 左上
  { id: 3, name: 'Gaiya', logo: 'partner_gaiya.png', size: 'lg' }, // 中間蓋亞
  { id: 4, name: 'Vantage', logo: 'partner_vantage.png', size: 'sm' }, // 上方小
  { id: 5, name: 'BlueCore', logo: 'partner_bluecore.png', size: 'sm' }, // 右上
  { id: 6, name: 'Vercel', logo: 'partner_vercel.png', size: 'sm' }, // 右邊威速
  { id: 7, name: 'Aether', logo: 'partner_aether.png', size: 'md' }, // 右下
  { id: 8, name: 'Titan', logo: 'partner_titan.png', size: 'sm' }, // 下方泰坦
  { id: 9, name: 'Sterling', logo: 'partner_sterling.png', size: 'md' }, // 下方 Sterling
  { id: 10, name: 'Meridian', logo: 'partner_meridian.png', size: 'md' }, // 左下
  { id: 11, name: 'Quantum', logo: 'partner_quantum.png', size: 'sm' }, // 左邊 Quantum
])
</script>
<template>
  <div class="container">
    <h2>企業合作夥伴</h2>
    <div class="partnerCloud_wrapper">
      <div
        v-for="(item, index) in partners"
        :key="item.id"
        class="bubble"
        :class="`size-${item.size} pos-${index + 1}`"
        :style="{ backgroundImage: `url(${parseAssets(item.logo)})` }"
      ></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
h2 {
  @include font-secondary;
  width: 100%;
  text-align: center;
  display: block;
  margin: 0 0 2rem;
}

.partnerCloud_wrapper {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 532px; // 手機版高度

  // 桌機版：改用寬螢幕比例
  @media (min-width: 768px) {
    height: auto;
    aspect-ratio: 16 / 9;
    max-width: 1200px; // 限制最大寬度以免氣泡太散
  }
}

.bubble {
  position: absolute;
  border-radius: 50%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translate(-50%, -50%);
  aspect-ratio: 1 / 1;
}

// 1. 手機版：維持 PX (因為手機寬度窄，用 px 比較能確保最小可視度)
.size-lg {
  width: 30%; // 當容器變小時，18% 也會變小，就不會擠在一起
  height: auto; // 高度交給 aspect-ratio 自動計算
}
.size-md {
  width: 25%;
  height: auto;
}
.size-sm {
  width: 20%;
  height: auto;
}

// 2. 桌機版：改用百分比 % (RWD 核心)
// 這裡的 % 是相對於父容器 (partnerCloud_wrapper) 的寬度
// 算法參考：原本 220px / 1200px(最大寬) ≈ 18%
@media (min-width: 768px) {
  .size-lg {
    width: 18%; // 當容器變小時，18% 也會變小，就不會擠在一起
    height: auto; // 高度交給 aspect-ratio 自動計算
  }
  .size-md {
    width: 15%;
    height: auto;
  }
  .size-sm {
    width: 13%;
    height: auto;
  }
}

// 4. 定位設定 (Position Map)
// 這裡需要稍微「手工」對照一下你的 Figma 座標
// left: 50% top: 50% 代表容器的正中心
// translate(-50%, -50%) 是為了讓圓心對準座標點

// --- 手機版位置 (Vertical Layout) ---

// 太平洋海事
.pos-1 {
  top: 44%;
  left: 15%;
}

// Nebula AI
.pos-2 {
  top: 10%;
  left: 18%;
}

// 蓋亞
.pos-3 {
  top: 35%;
  left: 35%;
}

// Vantage
.pos-4 {
  top: 25%;
  left: 52%;
}

// BlueCore
.pos-5 {
  top: 12%;
  left: 66%;
}

// 威速
.pos-6 {
  top: 30%;
  left: 83%;
}

// Aether
.pos-7 {
  top: 67%;
  left: 80%;
}

// 泰坦
.pos-8 {
  top: 75%;
  left: 64%;
}

// Sterling
.pos-9 {
  top: 60%;
  left: 50%;
}

// Meridian
.pos-10 {
  top: 70%;
  left: 33%;
}

// Quantum
.pos-11 {
  top: 53%;
  left: 18%;
}

// --- 桌機版位置 (Landscape Layout) ---
@media (min-width: 768px) {
  // 太平洋海事 (中間大)
  .pos-1 {
    top: 44%;
    left: 67%;
  }

  // Nebula AI (左上)
  .pos-2 {
    top: 20%;
    left: 18%;
  }

  // 蓋亞 (中間左)
  .pos-3 {
    top: 35%;
    left: 35%;
  }

  // Vantage (中上)
  .pos-4 {
    top: 25%;
    left: 52%;
  }

  // BlueCore (右上)
  .pos-5 {
    top: 12%;
    left: 66%;
  }

  // 威速 (右邊)
  .pos-6 {
    top: 30%;
    left: 83%;
  }

  // Aether (右下)
  .pos-7 {
    top: 67%;
    left: 80%;
  }

  // 泰坦 (下中)
  .pos-8 {
    top: 75%;
    left: 64%;
  }

  // Sterling (中下)
  .pos-9 {
    top: 60%;
    left: 50%;
  }

  // Meridian (左下)
  .pos-10 {
    top: 70%;
    left: 33%;
  }

  // Quantum (左邊)
  .pos-11 {
    top: 53%;
    left: 18%;
  }
}
</style>
