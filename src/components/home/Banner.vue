<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// 註冊 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger)

// 圖片路徑
const plasticBag = new URL(
  '@/assets/image/home/banner/ChatGPT Image Jan 20, 2026, 05_27_11 PM.png',
  import.meta.url,
).href
const fishingNet = new URL(
  '@/assets/image/home/banner/ChatGPT Image Jan 20, 2026, 05_33_05 PM.png',
  import.meta.url,
).href
const brick = new URL(
  '@/assets/image/home/banner/ChatGPT Image Jan 20, 2026, 08_25_38 PM.png',
  import.meta.url,
).href
const turtleModelPath = new URL(
  '@/assets/image/home/banner/model_72b_-_juvenile_green_sea_turtle.glb',
  import.meta.url,
).href
const oceanBg = new URL(
  '@/assets/image/home/banner/u9296394725_Prompt_Vertical_scrollytelling_background._A_tiny_s_aca6ac48-c9e3-4260-b767-a41c78175a9d_waifu2x_noise0_scale4x.png',
  import.meta.url,
).href

const containerRef = ref(null)
const bgImageElRef = ref(null)
const isLoading = ref(true)
const turtleCanvasRef = ref(null)

// Three.js 相關變數
let scene, camera, renderer, turtleModel, pivotGroup, mixer, clock
let animationFrameId = null

onMounted(() => {
  // 初始化 Three.js 場景
  initThreeJS()

  // 初始化 Three.js 場景
  initThreeJS()

  // 等待資源加載 (字體 + 圖片)
  waitResourcesLoaded()
})

const waitResourcesLoaded = async () => {
  // 1. 等待字體載入 (包含 Google Icons)
  try {
    await document.fonts.ready
  } catch (e) {
    console.warn('字體載入等待失敗', e)
  }

  // 2. 等待背景圖片
  const bgImg = bgImageElRef.value
  if (bgImg && !bgImg.complete) {
    await new Promise((resolve) => {
      bgImg.addEventListener('load', () => resolve())
      bgImg.addEventListener('error', () => resolve()) // 失敗也視為完成，避免卡住
    })
  }

  // 全部完成
  onImageLoaded()
}

// 計算響應式尺寸的輔助函數
const getResponsiveTurtleSize = () => {
  const screenWidth = window.innerWidth
  // 400px (≤400px) → 600px (≥1280px) 線性插值
  if (screenWidth <= 400) return 400
  if (screenWidth >= 1280) return 600
  // 線性插值：400 + (screenWidth - 400) / (1280 - 400) * (600 - 400)
  return 400 + ((screenWidth - 400) / 880) * 200
}

const initThreeJS = () => {
  if (!turtleCanvasRef.value) return

  // 創建場景
  scene = new THREE.Scene()

  // 計算響應式尺寸
  const turtleSize = getResponsiveTurtleSize()

  // 創建相機 (使用正交相機以獲得更好的 2D 效果)
  const aspect = 1
  // 根據尺寸調整視野：小螢幕稍微放大視野
  const frustumSize = turtleSize < 500 ? 4.0 : 3.5
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000,
  )
  camera.position.z = 5

  // 創建渲染器 - 使用響應式尺寸
  renderer = new THREE.WebGLRenderer({
    canvas: turtleCanvasRef.value,
    alpha: true, // 透明背景
    antialias: true, // 抗鋸齒
  })
  renderer.setSize(turtleSize, turtleSize) // 響應式渲染尺寸
  // 小螢幕降低 pixelRatio 提升性能
  const adaptivePixelRatio =
    turtleSize < 500 ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio
  renderer.setPixelRatio(adaptivePixelRatio)

  // 添加燈光
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  const directionalLight2 = new THREE.DirectionalLight(0x4fb3d4, 0.2)
  directionalLight2.position.set(-5, -5, 5)
  scene.add(directionalLight2)

  // 載入 GLB 模型
  const loader = new GLTFLoader()
  clock = new THREE.Clock()

  loader.load(
    turtleModelPath,
    (gltf) => {
      turtleModel = gltf.scene

      // 調整模型大小和位置
      const box = new THREE.Box3().setFromObject(turtleModel)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2.5 / maxDim
      turtleModel.scale.setScalar(scale)

      // 創建 Pivot Group (旋轉軸心組)
      pivotGroup = new THREE.Group()
      scene.add(pivotGroup)

      // 將模型置中
      box.setFromObject(turtleModel)
      const center = box.getCenter(new THREE.Vector3())
      turtleModel.position.sub(center)

      // 🎯 (暫時不加偏移，只用 Group 包果)
      // turtleModel.position.x += 1.0

      // 稍微旋轉讓海龜看起來更立體 (這是模型的初始姿態，不動)
      turtleModel.rotation.y = Math.PI * 0.5
      turtleModel.rotation.z = Math.PI * 0.1 // 修正：改回 0.1，配合動態動畫的初始狀態 (Y=0, Z=+0.1)

      // 將海龜加入 Pivot Group，而不是直接加入 Scene
      pivotGroup.add(turtleModel)

      // 遍歷所有材質並調整顏色
      turtleModel.traverse((child) => {
        if (child.isMesh) {
          // 方法 1: 整體調色
          //child.material.color.setHex(0x4fb3d4) // 藍綠色

          // 方法 2: 保留原色但調整亮度
          child.material.emissive.setHex(0x003030) // 微微發光
          child.material.emissiveIntensity = 0.5

          // 方法 3: 調整透明度
          //child.material.opacity = 0.9
          //child.material.transparent = true
        }
      })

      // 檢查是否有內建動畫
      if (gltf.animations && gltf.animations.length > 0) {
        console.log(
          '✅ 模型包含 ' + gltf.animations.length + ' 個動畫:',
          gltf.animations.map((a) => a.name),
        )
        mixer = new THREE.AnimationMixer(turtleModel)

        // 播放所有動畫
        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip)
          action.play()
        })
      } else {
        console.log('ℹ️ 模型沒有內建動畫')
      }

      // 模型載入完成，開始渲染
      animate()

      console.log('🐢 海龜 GLB 模型載入成功！')
    },
    (progress) => {
      console.log('載入進度:', ((progress.loaded / progress.total) * 100).toFixed(2) + '%')
    },
    (error) => {
      console.error('載入 GLB 模型時出錯:', error)
    },
  )
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  // 如果有動畫混合器，更新它
  if (mixer) {
    const delta = clock.getDelta()
    mixer.update(delta)
  }

  // 渲染場景
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const onImageLoaded = () => {
  isLoading.value = false
  // 稍微延遲以確保 DOM 更新
  setTimeout(() => {
    initAnimation()
  }, 100)
}

const initAnimation = () => {
  console.log('🚀 initAnimation 啟動！正在初始化動畫...')
  // ==================== 1. 設定初始狀態 (重點修改) ====================

  // 垃圾預設隱藏
  gsap.set('.trash-item', { opacity: 0 })

  // 【修改點 A】文字一：直接設為顯示，不用等滾動才淡入
  // 這樣使用者一進來就看得到，且不會有 "太晚出現" 的感覺
  gsap.set('.text-stage-1', { opacity: 1, y: 0 })

  // 文字二、三：預設隱藏，往下移一點點準備浮上來
  gsap.set('.text-stage-2, .text-stage-3', { opacity: 0, y: 50 })

  // ==================== 2. 獨立的海龜游動動畫 (大幅修改) ====================
  // 根據螢幕寬度線性調整游泳速度，螢幕越寬游得越慢
  const screenWidth = window.innerWidth
  const minWidth = 400 // 最小螢幕寬度（手機）
  const maxWidth = 2560 // 最大螢幕寬度（大螢幕）

  // 計算縮放比例（0-1 之間）
  const widthRatio = Math.min(Math.max((screenWidth - minWidth) / (maxWidth - minWidth), 0), 1)

  // 根據比例線性計算時間（大幅增加大螢幕時間，讓速度變慢）
  const swimRightDuration = 12 + widthRatio * 18 // 12秒（400px）→ 30秒（2560px）
  const swimLeftDuration = 12 + widthRatio * 18 // 12秒（400px）→ 30秒（2560px）
  const floatDuration = 4 + widthRatio * 4 // 4秒（400px）→ 8秒（2560px）
  const depthDuration = 5 + widthRatio * 5 // 5秒（400px）→ 10秒（2560px）

  // 計算海龜容器的實際寬度（使用響應式尺寸函數）
  let turtleWidthPx = getResponsiveTurtleSize()

  // 再乘以 GSAP scale (0.7)
  turtleWidthPx *= 0.7

  // 轉換成 vw 單位（海龜寬度 / 視窗寬度 × 100）
  const turtleWidthVw = (turtleWidthPx / screenWidth) * 100

  // 🎯 確保整個海龜都在畫面外
  // 海龜中心點 x = 0 (畫面中心)
  // 畫面右邊緣 x = 50vw
  // 海龜完全離開右邊緣條件: x - (海龜寬度/2) > 50vw
  // 所以 x > 50 + (海龜寬度/2)
  // 🎯 確保整個海龜都在畫面外
  // 加大 buffer (5vw) 避免轉身時因為長度問題閃現到畫面內
  const swimRangeX = 50 + turtleWidthVw / 2 + 5

  // 🔍 調試：顯示海龜尺寸
  console.log('🐢 海龟尺寸:', {
    螢幕: screenWidth + 'px',
    海龜px: turtleWidthPx.toFixed(1) + 'px',
    海龜vw: turtleWidthVw.toFixed(1) + 'vw',
    游動範圍: swimRangeX.toFixed(1) + 'vw',
    中心位置: swimRangeX.toFixed(1) + 'vw',
    海龜左邊緣: (swimRangeX - turtleWidthVw / 2).toFixed(1) + 'vw',
  })

  // 海龜初始位置（使用動態計算的值）
  gsap.set('.turtle-wrapper', {
    xPercent: -50, // 水平居中（替代 CSS transform: translateX(-50%)）
    yPercent: -50, // 垂直居中（替代 CSS transform: translateY(-50%)）
    y: '15vh', // 往下移 15vh，避免擋住文字
    x: `-${swimRangeX}vw`, // 從畫面外開始，配合游動範圍
    scale: 0.7, // 整體縮放
    opacity: 1,
    // rotationY: 0, // ❌ 改用 Internal Rotation，不設定 CSS rotation
  })

  // 代理對象控制：val=Y軸旋轉, tilt=Z軸傾斜
  // 初始向右游(Y=0)，需要正傾斜(+0.1)才能露背
  const rotProxy = { val: 0, tilt: Math.PI * 0.1 }

  if (pivotGroup) {
    pivotGroup.rotation.y = 0
    if (turtleModel) turtleModel.rotation.z = rotProxy.tilt
  }

  const turtleSwim = gsap.timeline({ repeat: -1 })

  // 確保每次循環開始時，回復到初始狀態 (Y=0, Z=+0.1)
  turtleSwim.set(rotProxy, {
    val: 0,
    tilt: Math.PI * 0.1,
    onUpdate: () => {
      if (pivotGroup) pivotGroup.rotation.y = rotProxy.val
      if (turtleModel) turtleModel.rotation.z = rotProxy.tilt
    },
  })

  turtleSwim
    // --- 往右游 ---
    .to('.turtle-wrapper', {
      x: `${swimRangeX}vw`,
      rotation: 5,
      rotationX: 3,
      rotationZ: 2,
      duration: swimRightDuration,
      ease: 'linear',
    })
    // 添加微幅的Y軸擺動（與往右游同步）
    .to(
      '.turtle-wrapper',
      {
        y: '+=3vh', // 輕微向上擺動
        duration: swimRightDuration / 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1, // 一個來回
      },
      '<', // 與上一個動畫同時開始
    )
    // 添加輕微的身體翻滾（模擬划水）
    .to(
      '.turtle-wrapper',
      {
        rotation: '+=3', // 微幅旋轉擺動
        duration: swimRightDuration / 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2, // 兩個來回
      },
      '<',
    )
    // 添加側身翻滾（3D 感）
    .to(
      '.turtle-wrapper',
      {
        rotationX: '+=8', // 側向翻滾增加 3D 感
        duration: swimRightDuration / 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      '<',
    )
    // --- 瞬間翻轉（Animating Proxy Object -> Apply to Group）---
    .to('.turtle-wrapper', {
      rotation: 0, // 修正：翻轉時把身體擺正 (Z軸旋轉)
      rotationX: 0, // 修正：翻轉時把身體擺平 (X軸旋轉)
      duration: 0.1,
    })
    .to(
      rotProxy,
      {
        val: Math.PI, // Y軸：轉 180 度向左
        tilt: Math.PI * -0.1, // Z軸：轉為負值，因為 Y 轉了 180，Z 也要反向才能維持露背
        duration: 0.1,
        onUpdate: () => {
          if (pivotGroup) pivotGroup.rotation.y = rotProxy.val
          if (turtleModel) turtleModel.rotation.z = rotProxy.tilt
        },
        onStart: () => {
          const x = gsap.getProperty('.turtle-wrapper', 'x')
          console.log(`🔄 右側翻轉 (3D Proxy)！Y:0->PI, Z: + -> -`)
        },
      },
      '<',
    )
    // --- 往左游 (翻轉後) ---
    .to('.turtle-wrapper', {
      x: `-${swimRangeX}vw`,
      rotation: 5,
      rotationX: 3,
      rotationZ: 2,
      duration: swimLeftDuration,
      ease: 'linear',
    })
    // 添加微幅的Y軸擺動（與往左游同步）
    .to(
      '.turtle-wrapper',
      {
        y: '-=3vh', // 輕微向下擺動
        duration: swimLeftDuration / 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      '<',
    )
    // 添加輕微的身體翻滾（模擬划水）
    .to(
      '.turtle-wrapper',
      {
        rotation: '+=3',
        duration: swimLeftDuration / 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2,
      },
      '<',
    )
    // 添加側身翻滾（3D 感）
    .to(
      '.turtle-wrapper',
      {
        rotationX: '-=8', // 側向翻滾增加 3D 感（反向）
        duration: swimLeftDuration / 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      '<',
    )
    // --- 瞬間翻回正面（Continous Rotation: PI -> 2PI）---
    .to('.turtle-wrapper', {
      rotation: 0,
      rotationX: 0,
      duration: 0.1,
    })
    .to(
      rotProxy,
      {
        val: Math.PI * 2, // 繼續轉一圈回到正面 (360度)
        tilt: Math.PI * 0.1, // Z軸：轉回正值，準備下一輪右游
        duration: 0.1,
        onUpdate: () => {
          if (pivotGroup) pivotGroup.rotation.y = rotProxy.val
          if (turtleModel) turtleModel.rotation.z = rotProxy.tilt
        },
        onStart: () => {
          const x = gsap.getProperty('.turtle-wrapper', 'x')
          console.log(`🔄 左側翻轉 (3D Proxy)！Y:PI->2PI, Z: - -> +`)
        },
        // 移除 onComplete 重置，改用 timeline 開頭的 set
      },
      '<',
    )

  // 🔍 動態位置監控（每秒回報位置，確保動畫活著）
  setInterval(() => {
    const el = document.querySelector('.turtle-wrapper')
    if (el) {
      const x = gsap.getProperty('.turtle-wrapper', 'x')
      const rotY = pivotGroup ? ((pivotGroup.rotation.y * 180) / Math.PI).toFixed(0) : 0
      // 為了不洗版，只在接近邊緣時印出，或每 2 秒印一次
      console.log(
        `📍 海龜存活確認 | x: ${typeof x === 'number' ? x.toFixed(1) : x}, rotY(3D): ${rotY}`,
      )
    }
  }, 1000)

  // 上下浮動動畫（模擬海龜在水中起伏）- 降低幅度避免與游動擺動衝突
  gsap.to('.turtle-wrapper', {
    y: '+=8vh', // 降低幅度：15vh -> 8vh
    duration: floatDuration, // 根據螢幕大小調整速度
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // 新增：微小的前後深度變化（增加 3D 感）- 增強幅度
  gsap.to('.turtle-wrapper', {
    z: 80, // 增加深度變化：30 -> 80
    duration: depthDuration, // 根據螢幕大小調整速度
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // ==================== 3. 主滾動時間軸 (重點修改) ====================
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.ocean-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2, // 增加到 2，創造「水阻感」，讓動畫更滑順不抖動
    },
  })

  // 海龜變慢 (保持不變)
  gsap.to(turtleSwim, {
    timeScale: 0.5,
    scrollTrigger: {
      trigger: '.ocean-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
    },
  })

  // ==================== 定義時間軸節點 (關鍵修改) ====================
  // 把總時長拉得更長 (30單位)，讓每個階段的過渡更從容

  tl.addLabel('start', 0)
    .addLabel('text1_fade', 3) // 讓第一段字停留久一點再消失
    .addLabel('stage2_enter', 6) // 垃圾進場
    .addLabel('text2_in', 9) // 第二段字出現
    .addLabel('text2_out', 13) // 第二段字消失 (停留時間加長)
    .addLabel('deep_sea', 16) // 進入深海
    .addLabel('text3_in', 22) // 最終文字出現
    .addLabel('end', 30)

  // ---------------- [階段一：美好瞬間] ----------------
  tl.to(
    '.text-stage-1',
    {
      opacity: 0,
      y: -50, // 往上飄走，視覺引導更好
      duration: 2, // 持續時間加長
      ease: 'power1.out',
    },
    'text1_fade',
  )

  // ---------------- [階段二：危機入侵] ----------------
  // 背景變暗
  tl.to('.bg-gradient', { opacity: 0.8, duration: 4 }, 'stage2_enter')

  // 垃圾漂入 (使用 ease: 'power1.out' 讓垃圾有「被水流推過來然後慢慢減速」的自然感)
  tl.to('#trash-1', { opacity: 0.8, x: '10vw', duration: 4, ease: 'power1.out' }, 'stage2_enter')
    .to(
      '#trash-2',
      { opacity: 0.7, x: '-15vw', duration: 4, ease: 'power1.out' },
      'stage2_enter+=1',
    )
    .to(
      '#trash-3',
      { opacity: 0.75, x: '8vw', y: '-10vh', duration: 4, ease: 'power1.out' },
      'stage2_enter+=2',
    )

  // 第二段文字：進場 -> 停留 -> 離場
  tl.to(
    '.text-stage-2',
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
    },
    'text2_in',
  )

  tl.to(
    '.text-stage-2',
    {
      opacity: 0,
      y: -30,
      duration: 1.5,
    },
    'text2_out',
  )

  // ---------------- [階段三：深海與絕望] ----------------
  // 更多垃圾
  tl.to(
    '#trash-4',
    { opacity: 0.8, x: '-12vw', y: '-8vh', duration: 4, ease: 'power1.out' },
    'deep_sea',
  )
    .to(
      '#trash-5',
      { opacity: 0.7, x: '-18vw', y: '12vh', duration: 4, ease: 'power1.out' },
      'deep_sea+=1',
    )
    .to(
      '#trash-6',
      { opacity: 0.75, x: '15vw', y: '15vh', duration: 4, ease: 'power1.out' },
      'deep_sea+=2',
    )

  // 環境變更暗
  tl.to('.bg-gradient', { opacity: 0.95, duration: 5 }, 'deep_sea').to(
    '.ocean-overlay',
    { opacity: 0.6, duration: 5 },
    'deep_sea',
  )

  // 【關鍵修正】海龜變暗但保持細節
  // 移除 contrast(0.7)，改用 brightness(0.6) contrast(1.1) sepia(0.2)
  // 這樣海龜會變暗融入深海，但保留龜殼紋路細節，不會變成灰色剪影
  tl.to(
    '.turtle-wrapper',
    {
      filter: 'brightness(0.6) contrast(1.1) sepia(0.2)',
      duration: 5,
    },
    'deep_sea',
  )

  // 第三段文字 (最終警語)
  tl.to(
    '.text-stage-3',
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 3,
      ease: 'back.out(1.2)', // 彈跳效果稍微減輕，更優雅
    },
    'text3_in',
  )

  // 額外效果：海龜隨深度壓迫感 (ScrollTrigger 單獨控制)
  // 只保留縮放效果，filter 交給主時間軸控制，避免動畫衝突
  // 已移除縮放效果，讓海龜保持原始大小
  // gsap.to('.turtle-wrapper', {
  //   scale: '-=0.1', // 縮小幅度稍微加大，更有深淵感
  //   scrollTrigger: {
  //     trigger: '.ocean-container',
  //     start: '60% top',
  //     end: 'bottom bottom',
  //     scrub: 2,
  //   },
  // })
}

// 處理視窗大小變化
const handleResize = () => {
  if (!renderer || !camera) return

  const newSize = getResponsiveTurtleSize()

  // 更新渲染器尺寸
  renderer.setSize(newSize, newSize)

  // 更新 pixelRatio（小螢幕降低以提升性能）
  const adaptivePixelRatio =
    newSize < 500 ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio
  renderer.setPixelRatio(adaptivePixelRatio)

  // 更新相機視野
  const frustumSize = newSize < 500 ? 4.0 : 3.5
  camera.left = (frustumSize * 1) / -2
  camera.right = (frustumSize * 1) / 2
  camera.top = frustumSize / 2
  camera.bottom = frustumSize / -2
  camera.updateProjectionMatrix()

  console.log(`🔄 視窗調整: ${newSize}px, frustum: ${frustumSize}`)
}

// 組件掛載時添加 resize 監聽
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 移除 resize 監聽
  window.removeEventListener('resize', handleResize)

  // 清理 Three.js 資源
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  if (renderer) {
    renderer.dispose()
  }

  if (turtleModel) {
    scene.remove(turtleModel)
  }

  // 清理 ScrollTrigger 實例
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})
</script>

<template>
  <div class="ocean-container" ref="containerRef">
    <!-- 載入中的 Loading 動畫 -->
    <Teleport to="body">
      <div class="loading-screen" :class="{ 'fade-out': !isLoading }">
        <div class="loading-content">
          <div class="loading-turtle">
            <div class="loading-spinner"></div>
          </div>
          <!-- <div class="loading-waves">
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
          </div> -->
          <p class="loading-text">海洋正在等待你...</p>
        </div>
      </div>
    </Teleport>

    <!-- 背景漸變層 -->
    <div class="bg-gradient"></div>
    <div class="ocean-overlay"></div>

    <!-- 背景圖片 -->
    <div class="bg-image" :class="{ loaded: !isLoading }">
      <img :src="oceanBg" alt="ocean background" ref="bgImageElRef" />
    </div>

    <!-- Sticky 視窗層 - 在 banner 區域內固定，離開時跟隨滾動 -->
    <div class="sticky-viewport">
      <!-- 海龜主體層 (3D Canvas) -->
      <div class="turtle-wrapper">
        <canvas ref="turtleCanvasRef" class="turtle-canvas"></canvas>
      </div>

      <!-- 垃圾層 -->
      <div class="trash-layer">
        <!-- 階段二的垃圾 -->
        <img :src="plasticBag" alt="塑膠袋" class="trash-item" id="trash-1" />
        <img :src="fishingNet" alt="漁網" class="trash-item" id="trash-2" />

        <!-- 階段三的垃圾 -->
        <img :src="brick" alt="磚塊" class="trash-item" id="trash-3" />
        <img :src="plasticBag" alt="塑膠袋" class="trash-item" id="trash-4" />
        <img :src="fishingNet" alt="漁網" class="trash-item" id="trash-5" />
        <img :src="brick" alt="磚塊" class="trash-item" id="trash-6" />
      </div>

      <!-- 文字敘事層 -->
      <div class="text-layer">
        <div class="text-stage-1">
          <h2>海洋是牠們的家...</h2>
          <p>蔚藍的世界，寧靜而廣闊</p>
        </div>

        <div class="text-stage-2">
          <h2>但危機正在靠近</h2>
          <p>人類的垃圾開始出現在海洋</p>
        </div>

        <div class="text-stage-3">
          <h2>家園變成了危險的地方</h2>
          <p>生存不應該這麼困難</p>
        </div>
      </div>

      <!-- 氣泡裝飾 -->
      <div class="bubbles">
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
      </div>
    </div>
    <!-- /Sticky 視窗層 -->
  </div>
</template>

<style lang="scss" scoped>
.ocean-container {
  position: relative;
  width: 100%;
  height: 600vh; // 增加高度讓滾動節奏更優雅，使用者有更多時間體驗動畫
  min-height: 100vh; // 確保至少有一個視窗高度
  overflow-x: clip; // 使用 clip 代替 hidden，防止雙重垂直卷軸
  isolation: isolate; // 創建新的層疊上下文，不影響外部
}

// 載入中的 Loading 動畫
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(79, 179, 212, 0.95) 0%,
    rgba(42, 122, 158, 0.95) 50%,
    rgba(26, 77, 92, 0.95) 100%
  );
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.6s ease;

  &.fade-out {
    opacity: 0;
    pointer-events: none;
  }
}

.loading-content {
  text-align: center;
  position: relative;
}

.loading-turtle {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-top: 8px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-waves {
  position: relative;
  width: 200px;
  height: 40px;
  margin: 0 auto 1.5rem;
}

.wave {
  position: absolute;
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: wave-pulse 1.5s ease-in-out infinite;

  &.wave1 {
    animation-delay: 0s;
  }

  &.wave2 {
    animation-delay: 0.3s;
    opacity: 0.7;
  }

  &.wave3 {
    animation-delay: 0.6s;
    opacity: 0.5;
  }
}

@keyframes wave-pulse {
  0%,
  100% {
    transform: scaleX(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scaleX(1.2);
    opacity: 0.8;
  }
}

.loading-text {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: text-fade 2s ease-in-out infinite;
}

@keyframes text-fade {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

// Sticky 視窗層 - 在 banner 區域內保持固定
.sticky-viewport {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  pointer-events: none;
  overflow: hidden; // 隱藏所有溢出，防止出現卷軸
}

// 背景圖片層（主要底圖）
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.8s ease;

  &.loaded {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

// 背景漸變層（覆蓋在背景圖上，用於顏色變化）
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(79, 179, 212, 0.3) 0%,
    rgba(42, 122, 158, 0.5) 50%,
    rgba(26, 77, 92, 0.7) 100%
  );
  z-index: 2;
  transition:
    opacity 0.8s ease,
    background 0.8s ease;
}

// 海洋混濁覆蓋層
.ocean-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 20%, rgba(13, 38, 48, 0.6) 100%);
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

// 海龜主體 (3D Canvas) - 響應式設計
.turtle-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  // transform: translate(-50%, -50%); // ❌ 移除 CSS transform，改由 GSAP xPercent/yPercent 控制
  z-index: 10;
  // 響應式尺寸：400px (≤400px) → 600px (≥1280px)
  // 公式：400px + ((100vw - 400px) / (1280px - 400px)) * (600px - 400px)
  // 簡化：400px + ((100vw - 400px) / 880px) * 200px
  // 使用 clamp 實現：clamp(400px, calc(400px + (100vw - 400px) * 0.227), 600px)
  width: clamp(400px, calc(400px + (100vw - 400px) * 0.227), 600px);
  height: clamp(400px, calc(400px + (100vw - 400px) * 0.227), 600px);
  will-change: transform, filter;
  pointer-events: auto;
  transition: filter 0.3s ease;
  overflow: visible; // 確保內容不會被裁切

  .turtle-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
}

// 垃圾層
.trash-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  pointer-events: none;

  .trash-item {
    position: absolute;
    width: clamp(80px, 15vw, 200px);
    height: auto;
    opacity: 0;
    will-change: transform, opacity;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4));
    animation: float-gentle 6s ease-in-out infinite;

    // 初始位置（從左右兩邊）
    &#trash-1 {
      bottom: 15%;
      right: 4%;
    }

    &#trash-2 {
      top: 10%;
      right: 30%;
    }

    &#trash-3 {
      bottom: 10%;
      left: 20%;
    }

    &#trash-4 {
      top: 20%;
      left: 15%;
    }

    &#trash-5 {
      bottom: 30%;
      left: 5%;
    }

    &#trash-6 {
      top: 30%;
      right: 10%;
    }
  }
}

// 文字敘事層
.text-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  pointer-events: none;

  [class^='text-stage-'] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
    width: 90%;
    max-width: 800px;

    h2 {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      color: #ffffff;
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.5),
        0 0 30px rgba(79, 179, 212, 0.3);
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
    }

    p {
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      line-height: 1.6;
    }
  }

  .text-stage-1 {
    top: 45%;
  }

  .text-stage-2 {
    top: 50%;
  }

  .text-stage-3 {
    top: 55%;

    h2 {
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.7),
        0 0 40px rgba(255, 107, 107, 0.4);
    }
  }
}

// 氣泡裝飾
.bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;

  .bubble {
    position: absolute;
    bottom: -100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
    border-radius: 50%;
    animation: float-up 8s infinite ease-in;

    &:nth-child(1) {
      left: 10%;
      width: 30px;
      height: 30px;
      animation-delay: 0s;
      animation-duration: 8s;
    }

    &:nth-child(2) {
      left: 25%;
      width: 20px;
      height: 20px;
      animation-delay: 2s;
      animation-duration: 10s;
    }

    &:nth-child(3) {
      left: 50%;
      width: 40px;
      height: 40px;
      animation-delay: 4s;
      animation-duration: 12s;
    }

    &:nth-child(4) {
      left: 70%;
      width: 25px;
      height: 25px;
      animation-delay: 1s;
      animation-duration: 9s;
    }

    &:nth-child(5) {
      left: 85%;
      width: 35px;
      height: 35px;
      animation-delay: 3s;
      animation-duration: 11s;
    }
  }
}

@keyframes float-up {
  0% {
    bottom: -100px;
    opacity: 0;
  }

  10% {
    opacity: 0.6;
  }

  90% {
    opacity: 0.6;
  }

  100% {
    bottom: 110vh;
    opacity: 0;
  }
}

@keyframes float-gentle {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-10px) rotate(2deg);
  }

  50% {
    transform: translateY(-5px) rotate(-2deg);
  }

  75% {
    transform: translateY(-15px) rotate(1deg);
  }
}

// 響應式優化
@media (max-width: 768px) {
  .ocean-container {
    height: 400vh; // 移動端有足夠的滾動路徑體驗動畫
  }

  // turtle-wrapper 現在固定為 600x600，不需要手機版覆寫
  // .turtle-wrapper {
  //   width: clamp(200px, 35vw, 300px);
  //   height: clamp(200px, 35vw, 300px);
  // }

  .trash-layer .trash-item {
    width: clamp(60px, 20vw, 150px);
  }

  .text-layer [class^='text-stage-'] {
    width: 85%;

    h2 {
      font-size: clamp(1.5rem, 6vw, 2.5rem);
    }

    p {
      font-size: clamp(0.875rem, 3.5vw, 1.125rem);
    }
  }
}

// 性能優化
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
