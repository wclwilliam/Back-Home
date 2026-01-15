<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  roleId: {
    type: String,
    required: true,
  },
  node: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['next'])

const description = computed(() =>
  props.node?.[`${props.roleId}_description`] ?? ''
)

</script>

<template>
     <section class="game-action-card" role="dialog" aria-modal="true">
    <div class="game-action-card__content">
      <p class="game-action-card__description">
        {{ description }}
      </p>

      <div class="game-action-card__actions">
        <button
          type="button"
          class="btn btn-solid btn-xl"
          @click="router.push({name: 'donation'})"
        >支持捐款計畫
        </button>
        <button
          type="button"
          class="btn btn-outline btn-xl"
          @click="router.push({name:'activity'})"
        >加入保育志工
        </button>
      </div>
      <button type="button" class="start-btn" @click="emit('next', 'start')">
        <span class="material-symbols-outlined icon-arrow">
        play_circle
        </span>
        <p>開始旅程</p>
    </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.game-action-card {
  height: 100%;
  display: grid;
  place-items: center;
  position: relative;
}
.game-action-card__content {
  width: min(480px, 86vw);
  background-color: $card-color;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 24px;
  opacity: 0.9;
}
.game-action-card__description {
  @include font-body-l-bold;
}
.game-action-card__actions {
  display: flex;
  gap: 32px;
  justify-content: center;
}
.start-btn{
  color: $text-color;
  position: absolute;
  top: 16px;
  right: 16px;
}
p{
  @include font-body-l-bold;
}
.icon-arrow{
  @include icon-style($size: 40px);
}
</style>