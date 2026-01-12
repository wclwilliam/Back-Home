<script setup>
import { ref } from 'vue';
import LightboxModal from '@/components/guide/LightboxModal.vue'; 
import { cardData } from '@/components/guide/threatenData'; 

</script>
<template>
    <section class="flexCard container">
        <div 
        v-for="item in cardData" 
        :key="item.id" 
        class="bottomcard">
            <img :src="item.image">

            <div class="overlay">
                <div class="overlayContent">
                    <h3>{{ item.title }}</h3>
                    <p v-html="item.title2"></p>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.flexCard {
    margin: 67px auto;
    display: flex;
    width: 100%;
    height: 400px;
    overflow: hidden;
}

.bottomcard {
    flex: 1;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &:hover {
        flex: 1.5;

        .overlay {
            opacity: 1;
        }
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s ease;
    background: rgba(0, 0, 0, 0.6);
    padding: 20px;
    box-sizing: border-box;
}

.overlayContent {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: white;
    z-index: 100;

    h3 {
        font-size: $d-size-tertiary;
        font-weight: bold;
    }

    p {
        font-size: $size-body;
        font-weight: bold;
        line-height: 1.5;
        text-align: center;
    }
}
</style>