<script setup>
import { ref, reactive, computed } from 'vue';
// Import VueDatePicker
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// 定義對外發送的事件
const emit = defineEmits(['search', 'filter']);

// 篩選功能
const isFilterOpen = ref(false);

const filterOptions = {
  topics: ['淨灘', '巡守', '照護'],
  locations: ['北部', '中部', '南部', '東部', '離島'],
  times: ['本月', '下個月']
}
// 使用者選取的狀態
const selectedFilters = reactive({
  topics: [],
  locations: [],
  times: [],
  dateRange: null // 2. 新增一個欄位存日期區間
})


const dateButtonText = computed(() => {
  const dates = selectedFilters.dateRange

  // 檢查是否有選取日期 (必須是陣列且有兩個值)
  if (Array.isArray(dates) && dates[0] && dates[1]) {
    const start = new Date(dates[0])
    const end = new Date(dates[1])

    // 格式化日期為 YYYY/MM/DD
    const formatDate = (d) => {
      const y = d.getFullYear()
      const m = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      return `${y}/${m}/${day}`
    }
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return '自訂日期範圍'
})

//選了自訂日期，就不能選其他時間
const toggleOption = (category, value) => {
  const list = selectedFilters[category]
  const index = list.indexOf(value)

  if (category === 'times') {
    // 如果點了「本月」或「下個月」，要清空「自訂日期」
    selectedFilters.dateRange = null
  }

  if (index === -1) {
    list.push(value)
  } else {
    list.splice(index, 1)
  }
}

// 當日期改變時
const onDateChange = (val) => {
  if (val) {
    // 如果選了日期，要清空「本月/下個月」的選項 
    selectedFilters.times = []
  }
}

//關鍵字搜索
const searchQuery = ref('');
const handleSearch = () => {
  emit('search', searchQuery.value)
}

const resetFilter = () => {
  selectedFilters.topics = []
  selectedFilters.locations = []
  selectedFilters.times = []
  selectedFilters.dateRange = null
}

const confirmFilter = () => {
  // 發送拷貝的資料給父層，避免後續修改影響
  emit('filter', JSON.parse(JSON.stringify(selectedFilters)))
  isFilterOpen.value = false // 關閉選單
}

</script>
<template>
  <div class="searchBar col-sm-4 col-md-12 col-lg-12">
    <div class="search-section  col-md-6">
      <div class="search-input ">
        <span class="material-symbols-outlined search-icon-desktop" @click="handleSearch">search</span>
        <input type="text" v-model="searchQuery" class="keywordSearch" placeholder="搜尋活動關鍵字..."
          @keyup.enter="handleSearch">
  
      </div>
      <button class="mobile-search-btn btn-outline btn" @click="handleSearch ">搜尋</button>
    </div>
    <div class="filter-section">
      <button class="filter-btn btn btn-outline " :class="{'active' : isFilterOpen}"
        @click="isFilterOpen = !isFilterOpen">
        篩選
        <span class="material-symbols-outlined filter-icon">filter_alt</span>
      </button>
      <div v-show="isFilterOpen" class="filterList">
        <div class="filter-row">
          <span class="label col-sm-1">主題</span>
          <div class="option col-sm-3">
            <span v-for="topic in filterOptions.topics" :key="topic" class="tag"
              :class="{'is-selected': selectedFilters.topics.includes(topic)}" @click="toggleOption('topics', topic)">{{
              topic }}</span>
          </div>
        </div>
        <div class="filter-row">
          <span class="label col-sm-1">地點</span>
          <div class="option col-sm-3">
            <span v-for="location in filterOptions.locations" :key="location" class="tag"
              :class="{'is-selected': selectedFilters.locations.includes(location)}"
              @click="toggleOption('locations', location)">{{ location }}</span>
          </div>
        </div>
        <div class="filter-row">
          <span class="label col-sm-1">時間</span>
          <div class="option col-sm-3">
            <span v-for="time in filterOptions.times" :key="time" class="tag"
              :class="{'is-selected': selectedFilters.times.includes(time)}" @click="toggleOption('times', time)">{{ time
              }}</span>
  
            <vueDatePicker v-model="selectedFilters.dateRange" range :enable-time-picker="false" auto-apply
              :partial-range="false" teleport="body" @update:model-value="onDateChange" class="custom-date-picker">
              <template #trigger>
                <span class="tag" :class="{'is-selected' : selectedFilters.dateRange}">
                  {{ dateButtonText }}
                </span>
              </template>
            </vueDatePicker>
  
          </div>
        </div>
  
        <div class="filter-actions col-sm-4">
          <button class="btn-confirm btn btn-xl btn-solid" @click="confirmFilter">確認篩選</button>
          <button class="btn-reset btn btn-xl btn-outline" @click="resetFilter">清除重設</button>
        </div>
      </div>
    </div>
  
  </div>
</template>
<style lang="scss" scoped>
.searchBar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  justify-content: space-between;
  margin-bottom: 40px;

  .search-section {
    order: 1;
    gap: 8px;
    display: flex;
    width: 100%;

    .search-input {
      position: relative;
      flex-grow: 1;
      border: 2px solid $secondary-color;
      display: flex;
      align-items: center;

      .search-icon-desktop {
        display: none;
      }
    }

    .keywordSearch {
      border: none;
      outline: none;
      @include font-body;
      padding: 8px 12px;
      width: 100%;
    }

    .mobile-search-btn {
      white-space: nowrap;
      /* 防止文字換行 */
    }

  }

  .filter-section {
    order: 2;
    position: relative;

    .filterList {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 10;
      width: 100%;
      max-width: 400px;
      padding: 16px;
      background-color: $text-white;
      border: 1px solid $secondary-color;

      .filter-row {
        display: flex;
        align-items: flex-start;
        flex-shrink: 0;
        margin-bottom: 16px;

        .label {
          @include font-body-l;
          margin-bottom: 16px;
        }

        .option {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          @include font-body;

          .tag {
            padding: 8px 16px;
            border: 1px solid $secondary-color;
            cursor: pointer;
            transition: all 0.4s;
            white-space: nowrap;
            margin-bottom: 8px;

            &:hover {
              background-color: $highlight-color2;
              border-color: $highlight-color2;
              color: $text-white;
            }

            &.is-selected {
              background-color: $secondary-color;
              color: $text-white;
              border-color: $secondary-color;
            }
          }

          .custom-date-picker {

            // 確保 trigger 區域也是 pointer
            :deep(.dp__pointer) {
              border: none;
              padding: 0;
            }
          }
        }

        .date-wrapper {
          position: relative;
          display: inline-block;
        }

        .hidden-picker {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .filter-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: space-around;

          button{
            flex: 1;
          }
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .searchBar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .filter-section {
      order: 1;
    }

    .search-section {
      order: 2;
      width: auto;

      .search-input {
        width: 300px;
        padding: 0 32px 0 8px;

        .search-icon-desktop {
          display: block;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: $secondary-color;
        }
      }

      .mobile-search-btn {
        display: none;
      }
    }

    .filterList {
      min-width: 500px;
      /* 桌機版下拉寬度 */
      max-width: none;
    }
  }
}

:root {
  --dp-primary-color: #0E6872;
  /* $secondary-color */
}
</style>
