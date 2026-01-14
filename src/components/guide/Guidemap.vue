<script setup>
import { ref, computed, onMounted, watch, toRaw } from 'vue'
import { allTurtles } from './turtleData.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const currentId = ref(1)
let map = null;
let currentLayer = null;

// 目前選中的海龜
const currentTurtleInfo = computed(() => {
    return allTurtles.find(t => t.id === currentId.value) || {}
})

// 切換海龜
const selectTurtle = (id) => {
    currentId.value = id
}


const drawTurtleLayer = (turtle) => {
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }
    const rawGeometry = toRaw(turtle.geometry);
    currentLayer = L.geoJSON(turtle.geometry, {
        style: {
            fillColor: turtle.color || '#153450',
            weight: 2,
            color: 'white',
            fillOpacity: 0.5
        }
    }).addTo(map);
    if (currentLayer.getBounds().isValid()) {
        map.fitBounds(currentLayer.getBounds());
    }
}


onMounted(() => {
    //建立地圖框
    map = L.map('map', {
        minZoom: 2,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([20, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        noWrap: true,
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);


    setTimeout(() => {
        map.invalidateSize();
        if (currentTurtleInfo.value) {
            drawTurtleLayer(currentTurtleInfo.value);
        }
    }, 200);
});


// 當 currentId 改變重畫地圖
watch(currentId, () => {
    // 因為 currentTurtleInfo 隨著 ID 自動更新，直接拿來畫
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

                    <div v-if="currentTurtleInfo.nameCN" class="mapLabel">
                        <p><span class="label">學名：</span> {{ currentTurtleInfo.ScientificName }}</p>
                        <p><span class="label">分布範圍：</span> {{ currentTurtleInfo.range }}</p>
                        <p><span class="label">棲息地：</span> {{ currentTurtleInfo.habitat }}</p>

                    </div>

                </div>
            </div>

        </div>
    </section>


</template>

<style lang="scss" scoped>
h1 {
    color: $primary-color;
    font-size: $d-size-secondary;
    font-weight: bold;
    text-align: center;
    margin-bottom: 50px;
}

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
    
    @media (max-width: 992px) {
        width: 70px;
        height: 70px;
    }
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
    height: 500px;
    gap: 20px;

    @media (max-width: 992px) {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 300px;
    }
}

#map {
    width: 70%;
    height: 100%;
    @media (max-width: 992px) {
        display: grid;
        //grid-column: 1;  
        width: 100%;
    }
}

#mapInfo {
    width: 30%;
    height: 60%;
    padding: 20px;
    background: #E3D5CA;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;   
    gap: 30px;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    font-size: $size-body-l;
    //font-weight: bold;
    color: $text-color;
    h2{
        font-weight: bold;
    }

    @media (max-width: 992px) {
        display: grid;
        width: 70%;
        height: 200px;
        font-size: $m-size-caption;
        gap: 2px;
        margin: auto;
       
    }

}

.mapLabel {
    display: flex;
    flex-direction: column;
    gap: 30px;
}
</style>