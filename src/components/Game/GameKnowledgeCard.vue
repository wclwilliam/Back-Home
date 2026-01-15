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

        <div class="dialog-card__content">
           <div class="knowledge-text">
          {{ text }}
            </div>
            <button type="button" @click="emit('next')">
          {{ buttonText }}
        </button>
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
    @include font-body-l-bold;
    justify-content: center;
    align-items: center;
    padding: 38px 32px 24px;
}
button{
    @include font-body-bold;
    justify-self: end;
    align-self: end;
    color: $secondary-color;
    text-decoration: underline;
    text-underline-offset: 6px;
    text-decoration-thickness: 2px;
    padding-top: 16px;
}
p{
    @include font-body-l-bold;
    color: $text-white;
    background-color: $game-line-color;
    padding: 4px 8px;  
    position: absolute;
    top: 0;
    left: 16px;
    transform: translateY(-50%);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
    z-index: 1;
}
</style>