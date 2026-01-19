<script setup>
import { computed } from 'vue'
import { allTurtles } from '@/components/guide/turtleData'


const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
    return `${base}${imgURL}`
}

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

                        <router-link :to="`/guide/${turtle.id}`" class="card-link-wrapper">             
                            <div class="cardContainer newsCard">
                                <div class="cardPic">
                                    <img :src="parsePublicFile(turtle.img)" :alt="turtle.nameCN" />
                                </div>
                                
                                <div class="cardInfo">
                                    <div class="cardTitle">
                                        {{ turtle.nameCN }}<br>{{ turtle.nameEN }}
                                    </div>
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
@import "@/assets/scss/component/_card.scss";

.GuideTitle h2 {
    @include font-secondary-md;
    color: $primary-color;
    text-align: center;
    font-weight: bold;
    margin: 67px 0;
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

.card-link-wrapper {
    display: block;
    text-decoration: none;
    height: 100%;
}

.newsCard {
  cursor: pointer;
  position: relative;
  overflow: hidden; 
  background-color: $text-white; 
  z-index: 1; 
  height: 100%; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); 


  
  &:hover:before {
    transform: scale(25); 
  }

  
  .cardInfo {
    position: relative;
    z-index: 2;
    margin: auto; 
    .cardTitle {
      @include font-tertiary; 
      font-weight: bold;
      color: $secondary-color; 
      display: -webkit-box;
      -webkit-box-orient: vertical;
      //-webkit-line-clamp: 2;
      overflow: hidden;
      text-align: center;
    
    }
  }
  
  
  .cardPic {
      width: 100%;
      aspect-ratio: 3/2; 
      overflow: hidden;
      
      img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
      }
  }
  
  &:hover .cardPic img {
      transform: scale(1.05);
  }

 
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 15%; 
    aspect-ratio: 1; 
    background-color: $secondary-color;
    clip-path: polygon(100% 0, 0% 100%, 100% 100%);
    z-index: 2;
    border: none;
    cursor: pointer;
    padding: 0; 
    transition: background-color 0.3s;

    .arrow {
      position: absolute;
      color: $text-white;
      top: 67%;  
      left: 67%;
      transform: translate(-50%, -50%);
      font-size: 1.2rem;
    }
  }
}
</style>