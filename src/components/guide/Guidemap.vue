<script setup>
import { ref, computed, onMounted, watch, toRaw } from 'vue'
import { allTurtles } from './turtleData.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import "@bepo65/leaflet.fullscreen/Control.FullScreen";
import "@bepo65/leaflet.fullscreen/Control.FullScreen.css";

const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
    return `${base}${imgURL}`
}

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
    currentLayer = L.geoJSON(rawGeometry, {
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
        maxBoundsViscosity: 1.0,

        // 直接在這裡加入全螢幕控制
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: "topright", // 將位置改為右上角
            title: "進入全螢幕",
            titleCancel: "離開全螢幕",
            forceSeparateButton: true,
            forcePseudoFullscreen: false,
        }
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

    // new L.Map(mapContent.value, {

    // });
});


// currentId 改變重畫地圖
watch(currentId, () => {
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
                    <img :src="parsePublicFile(turtle.img)" :alt="turtle.nameCN" class="turtleMapImg">
                </div>
            </div>

            <div class="map-section">
                <div id="map"></div>

                <div id="mapInfo">
                    <h2 v-if="currentTurtleInfo.nameCN">
                        {{ currentTurtleInfo.nameCN }} ({{ currentTurtleInfo.nameEN }})
                    </h2>


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
    @include font-secondary-md;
    color: $primary-color;
    font-weight: bold;
    text-align: center;
    margin-bottom: 50px;
}

.profileList {
    display: flex;
    gap: 15px;
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


.map-section {
    display: flex;
    height: 500px;
    gap: 20px;

    @media (max-width: 992px) {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 400px;
         height: auto;
    }
}

#map {
    width: 70%;
    height: 80%;

    @media (max-width: 992px) {
        width: 100%;
        //min-height: 350px;
        height: 40vh; 
    }
}

#mapInfo {
    @include font-body-l;
    width: 30%;
    height: 80%;
    padding: 20px;
    background: #E3D5CA;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);

    h2 {
        font-weight: bold;
    }

    @media (max-width: 992px) {
        display: grid;
        width: 90%;
        height: 300px;
        gap: 2px;
        margin: auto auto 20px auto;

    }

}

.mapLabel {
    display: flex;
    flex-direction: column;
    //gap: 30px;
}

:deep(.leaflet-control-zoom-fullscreen),
:deep(.leaflet-control-zoom-fullscreen:focus) {
    background-color: $highlight-color1;
    width: 50px !important;
    height: 50px !important;
    background-size: 40px 40px !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
    border: none;
}

:deep(.leaflet-control-zoom-fullscreen:hover) {
    background-color: $highlight-color2;
}
</style>