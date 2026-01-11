<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { allTurtles } from './turtleData.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// --- 資料狀態 ---
const currentId = ref(1)
let map = null;
let currentLayer = null; // 用來存目前畫在地圖上的那一層，方便等一下刪除

// 計算目前選中的海龜資料
const currentTurtleInfo = computed(() => {
    return allTurtles.find(t => t.id === currentId.value) || {}
})

// 切換海龜
const selectTurtle = (id) => {
    currentId.value = id
}

// --- 核心邏輯：畫出單隻海龜的圖層 ---
// 這個函式就是原本你那「一大段」的精簡版，改成只畫一隻
const drawTurtleLayer = (turtle) => {
    // 1. 如果地圖上已經有舊的圖層，先移除它 (不然會越疊越多)
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }


    // 3. 建立新的 GeoJSON 圖層
    currentLayer = L.geoJSON(turtle.geometry, {
        style: {
            fillColor: turtle.color || '#153450',
            weight: 2,
            color: 'white',
            fillOpacity: 0.5
        }
    }).addTo(map);


    map.fitBounds(currentLayer.getBounds());
}


onMounted(() => {
    // 1. 建立地圖框
    map = L.map('map', {
    // 加入這行：限制使用者不能縮太小，避免看到邊界
    minZoom: 2, 
    // 建議加上這個：限制最大邊界，不讓使用者拖到太誇張的地方
    maxBounds: [[-90, -180], [90, 180]], 
    maxBoundsViscosity: 1.0
}).setView([20, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        noWrap: true,
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // 2. 解決地圖載入不完全的問題
    setTimeout(() => {
        map.invalidateSize();
        // 網頁剛進來時，手動畫一次第一隻海龜
        if (currentTurtleInfo.value) {
            drawTurtleLayer(currentTurtleInfo.value);
        }
    }, 200);
});

// --- 監聽器 ---
// 當 currentId 改變時 (使用者點頭像)，自動重畫地圖
watch(currentId, () => {
    // 因為 currentTurtleInfo 會隨著 ID 自動更新，我們直接拿它來畫
    drawTurtleLayer(currentTurtleInfo.value);
});

</script>

<template>
    <section class="turtleMap">
        <div class="container">
            <h1>海龜棲息地圖</h1>
            <div class="profileList">
                <div v-for="turtle in allTurtles" :key="turtle.id" class="turtleProfile"
                    :class="{ active: currentId === turtle.id }" @click="selectTurtle(turtle.id)">
                    <img :src="turtle.img" :alt="turtle.nameCN" class="turtleMapImg">
                </div>
            </div>

            <div class="map-section">
                <div id="map"></div>

                <div id="mapInfo">
                    <h2 v-if="currentTurtleInfo.nameCN">
                        {{ currentTurtleInfo.nameCN }} ({{ currentTurtleInfo.nameEN }})
                    </h2>
                    <!-- <h2 v-else>請選擇海龜</h2> -->

                    <div v-if="currentTurtleInfo.nameCN">
                        <p><span class="label">學名：</span> {{ currentTurtleInfo.ScientificName }}</p>
                        <p><span class="label">分布範圍：</span> {{ currentTurtleInfo.range }}</p>
                        <p><span class="label">棲息地：</span> {{ currentTurtleInfo.habitat }}</p>

                    </div>

                </div>
            </div>

        </div>
    </section>


</template>

<style scoped>
.profileList {
    display: flex;
    gap: 37px;
    padding: 20px 0;
    flex-wrap: wrap;
}

.turtleProfile {
    width: 104px;
    height: 104px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid transparent;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
}

.turtleMapImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 85%;
    display: block;
}


.turtleProfile:hover,
.turtleProfile.active {
    border-color: #E14720;
    transform: scale(1.1);
}

/* 下半部：地圖與資訊區塊 */
.map-section {
    display: flex;
    /* flex: 1; /* 佔據剩餘空間 */
    /* position: relative; 為了地圖定位 */
    /* overflow: hidden;  */
    height: 500px;
    gap: 20px;
}

#map {
    width: 70%;
    height: 100%;
    /* 關鍵修改：把背景改成跟地圖海洋一樣的顏色 */
    background: #aad3df; 
    z-index: 1;
}

#mapInfo {
    width: 30%;
    height: 50%;
    padding: 20px;
    background: #E3D5CA;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 2;
}

.label {
    font-weight: bold;
    color: #555;
}
</style>