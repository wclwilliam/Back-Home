export const storyData = {
  // --- 初始選擇角色 ---
  start: {
    question: '你的旅程將從哪裡開始？',
    type: 'selection', // 標記這是一個選擇角色的關卡
    options: [
      { id: 'baby', text: '幼龜', nextId: 'baby_q1' },
      { id: 'teen', text: '少年海龜', nextId: 'teen_q1' },
      { id: 'adult', text: '成年母龜', nextId: 'adult_q1' },
    ],
  },

  // --- 幼龜分支：問題 1 ---
  baby_q1: {
    question:
      '剛破殼的妳，看見一隻大手伸向眼前。是要接受那份香甜誘人的加工肉塊？還是選擇只在遠處靜靜待著？',
    progress: 1,
    options: [
      {
        id: 'accept',
        text: '接受肉塊',
        nextId: 'baby_q1_bad',
      },
      {
        id: 'stay',
        text: '待在遠處',
        nextId: 'baby_q1_good',
      },
    ],
  },

  // 幼龜 Q1 - 選「接受肉塊」的後果
  baby_q1_bad: {
    feedback: '糟糕！依賴餵食會讓妳失去獵食本能。人類眼中的善意，對妳來說卻是生存的毒藥。',
    warningText: '⚠️ 獵食本能下降，生存機率下降 20%',
    healthChange: -1, // 右側愛心扣一格
    nextId: 'baby_q1_knowledge',
  },

  // 幼龜 Q1 - 選「待在遠處」的後果
  baby_q1_good: {
    feedback: '聰明的選擇！不打擾是最好的愛。保持安全距離，妳才能學會獨立與大海搏鬥！',
    warningText: '',
    healthChange: 0,
    nextId: 'baby_q1_knowledge',
  },

  // 幼龜 Q1 - 共通的科普知識
  baby_q1_knowledge: {
    knowledge: '在台灣，騷擾或餵食保育類海龜是違反《野生動物保育法》的，最高可罰款 30 萬元。',
    buttonText: '我知道了，繼續前進',
    nextId: 'baby_q2', // 導向幼龜的下一個問題
  },

  // --- 幼龜分支：問題 2 ---
  baby_q2: {
    question:
      '海中黑影幢幢，妳急需藏身之處。前方是雜亂漂浮的棕色藻叢，另一側則是視野清晰的純淨深海，妳要往哪鑽？',
      progress: 2,
    options: [
      {
        id: 'move_to_open',
        text: '游向空曠處',
        nextId: 'baby_q1_bad',
      },
      {
        id: 'dive_to_deep',
        text: '潛入深海',
        nextId: 'baby_q1_good',
      },
    ],
  },

  // 幼龜 Q2 - 選「游向空曠處」的後果
  baby_q2_bad: {
    feedback: '糟糕！妳完全暴露在掠食者的視線中了。漂亮的深藍海域，對你來說其實是危險的競技場。',
    warningText: '⚠️ 被大型魚類攻擊，生存機率下降 20%',
    healthChange: -1, // 右側愛心扣一格
    nextId: 'baby_q2_bad_knowledge',
  },

  // 幼龜 Q2 - 選「潛入深海」的後果
  baby_q2_good: {
    feedback: '太棒了！妳找到了專屬的海上育嬰室。這裡有吃又有躲，讓妳在最脆弱的時候能平安長大。',
    warningText: '',
    healthChange: 0,
    nextId: 'baby_q2_good_knowledge',
  },

  // 幼龜 Q2 - 選「游向空曠處」的科普知識
  baby_q2_bad_knowledge: {
    knowledge:
      '清澈海域雖然「視野好」，但也代表小海龜完全暴露在掠食者（如大型魚類、海鳥）的視線中。',
    buttonText: '我知道了，繼續前進',
    nextId: 'baby_q3', // 導向幼龜的下一個問題
  },

  // 幼龜 Q2 - 選「潛入深海」的科普知識
  baby_q2_good_knowledge: {
    knowledge: '藻叢是幼龜的「漂浮育嬰室」，雖然視覺上雜亂，卻能提供隱蔽與食物。',
    buttonText: '我知道了，繼續前進',
    nextId: 'baby_q3', // 導向幼龜的下一個問題
  },

  // --- 幼龜分支：問題 3 ---
  baby_q3: {
    question:
      '游累了，妳需要歇腳。遠處有一塊平坦穩固的白色浮島，近處則是隨波起伏、糾結雜亂的天然浮木。妳要爬上哪一個？',
      progress: 3,
    options: [
      {
        id: 'board_white_island',
        text: '登上平穩白色浮島',
        nextId: 'baby_q3_bad',
      },
      {
        id: 'hide_in_driftwood',
        text: '靠向雜亂天然浮木',
        nextId: 'baby_q3_good',
      },
    ],
  },

  // 幼龜 Q3 - 選「登上平穩白色浮島」的後果
  baby_q3_bad: {
    feedback: '危險！那是保麗龍殘骸。妳不只會誤食它，完全暴露的平地也讓妳成了海鳥的現成點心！',
    warningText: '⚠️ 誤食海洋漂浮垃圾，生存機率下降 20%',
    healthChange: -1, // 右側愛心扣一格
    nextId: 'baby_q3_knowledge',
  },

  // 幼龜 Q3 - 選「靠向雜亂天然浮木」的後果
  baby_q3_good: {
    feedback: '選得好！雜亂的浮木是完美的秘密基地。它能幫妳擋住天敵，讓妳安穩地睡個好覺。',
    warningText: '',
    healthChange: 0,
    nextId: 'baby_q3_knowledge',
  },
  // 幼龜 Q3 - 共通的科普知識
  baby_q3_knowledge: {
    knowledge:
      '海洋中 80% 的保麗龍垃圾常被誤認為浮木。它不僅容易被誤食導致中毒，平坦的表面更讓幼龜失去遮蔽，成為海鳥俯衝攻擊的活靶。',
    buttonText: '我知道了，繼續前進',
    nextId: 'game_result', // 導向結算頁面
  },

  // --- 生存結算畫面 ---
  game_result: {
    type: 'result', // 標記這是一個結算頁面，方便 Vue 切換不同的 Layout
    title: '恭喜你奇蹟生還！',
    survivalRate: '生存機率:', // 這裡可以直接由程式計算
    feedback: '在每千隻海龜中，只有一隻能長大成年。妳的謹慎讓妳跨越了第一道難關！',
    buttonText: 'arrow_forward',
    nextId: 'call_to_action', // 導向行動呼籲頁面
  },

  // --- 行動呼籲頁面 ---
  call_to_action: {
    type: 'action',
    description: '海龜的生存之路不該如此艱難，你的參與能讓奇蹟延續。',
    options: [
      { id: 'donate', text: '支持保育計畫', nextId: 'donation_page' },
      { id: 'volunteer', text: '加入保育志工', nextId: 'volunteer_page' },
      { id: 'restart', text: '開始旅程', nextId: 'start' }
    ]
  }
}
