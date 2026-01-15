<script setup>
import { computed } from 'vue'

const { text, buttonText, roleId } = defineProps({
  text: { type: String, default: '' },
  buttonText: { type: String, default: '我知道了，繼續前進' },
  roleId: { type: String, default: '' }, // 用來決定左邊圖片要放哪隻海龜（可選）
})

const emit = defineEmits(['next'])

const imageSrc = computed(() => {
  const map = {
    baby: '/game/turtle-baby_swim.png',
    teen: '/game/turtle-teen_swim.png',
    adult: '/game/turtle-adult_swim.png',
  }
  return map[roleId] ?? ''
})
</script>
<template>
    <div class="dialog-card-container">
    <p>【科普知識】</p>
    <div class="dialog-card">
        <div class="dialog-card__content">
           <div class="knowledge-text">
          {{ text }}
            </div>
            <button type="button" @click="emit('next')">
          {{ buttonText }}
        </button>
        </div>       
    </div>
    </div>
</template>
<style lang="scss" scoped>
.dialog-card__content{
    position: relative;
    background-color: $card-color;
    opacity: 0.9;
    width: 100%;
    height: 100%;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    @include font-body-bold;
    justify-content: center;
    align-items: center;
    padding: 38px 32px 16px;
}
button{
    @include font-body-l-bold;
    justify-self: end;
    align-self: end;
    color: $secondary-color;
    text-decoration: underline;
    text-underline-offset: 6px;
    text-decoration-thickness: 2px;
}
p{
    @include font-quaternary;
    background-color: $game-line-color;
    color: $text-white;
    padding: 4px 8px;  
    grid-column: 3 / 4;
    grid-row: 1 / 2; 
    justify-self: start;
    align-self: end;
    margin-left: 16px;
    margin-bottom: -22px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}
</style>