<script setup>
import { ref, computed } from 'vue'
import { allTurtles } from '@/components/guide/turtleData'

const turtleSections = computed(() => {
    return [
        {
            id: 'sectionTw',
            title: '在台灣，我們有機會遇見這 5 位朋友',
            list: allTurtles.filter((t) => t.type === 'taiwan'),
        },
        {
            id: 'sectionRemote',
            title: '還有 2 位夥伴，生活在遙遠的彼端',
            list: allTurtles.filter((t) => t.type === 'remote'),
        },
    ]
})

// const parseAssetsIcon = (fileName) => { 
//     return new URL(`src/assets/${fileName}`, import.meta.url).href 
//     }
</script>

<template>


    <section class="GuideTitle">
        <h2>海龜圖鑑</h2>
        <div class="container">
            <section v-for="section in turtleSections" :key="section.id" class="groupSection">
                <h3 class="subTitle">{{ section.title }}</h3>
                <div class="row">
                    <div v-for="turtle in section.list" :key="turtle.id" class="col-sm-4 col-md-6 col-lg-4"
                        style="margin-bottom: 48px;">

                        <router-link :to="`/guide/${turtle.id}`">
                            <div class="turtleCard">

                                <div class="imgBox">
                                    <img :src="turtle.img" />
                                </div>
                                <div class="info">
                                    <h4>{{ turtle.nameCN }}</h4>
                                    <p>{{ turtle.nameEN }}</p>
                                </div>
                                <button class="btn btn-solid">
                                    <span class="material-symbols-outlined arrow">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </router-link>

                    </div>
                </div>
            </section>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.GuideTitle h2 {
    font-size: $d-size-secondary;
    color: $primary-color;
    text-align: center;
    font-weight: bold;
    margin-top: 67px;
}


.groupSection {
    margin-bottom: 60px;
}

.subTitle {
    @include font-secondary;
    color: $primary-color;
    margin-bottom: 50px;
    font-weight: bold;
    text-align: center;
}

.turtleCard {
    @include font-tertiary;
    color: $secondary-color;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    gap: 24px;
    cursor: pointer;
}

.imgBox {
    width: 100%;
    height: 100%;
}

.imgBox img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.btn {
    position: absolute;
    bottom: 0;
    right: 10px;
    width: 12%;
    aspect-ratio: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-top: 9%;
    clip-path: polygon(0% 100%, 100% 100%, 100% 0);

    .arrow {
        color: $text-white;
    }

    &:hover {
        background-color: $secondary-color;
        border: 2px solid $secondary-color;
    }

    @media (max-width: 768px) {
        padding-top: 5%;
        padding-left: 6%;
    }
}
</style>
