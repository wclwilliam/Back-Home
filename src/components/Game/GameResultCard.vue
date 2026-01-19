<script setup>
    import { computed } from 'vue'
    import { parsePublicFile } from '@/utils/parseFile'

    const props = defineProps({
        roleId: {
            type: String,
            required: true
        },
        node: {
            type: Object,
            required: true
        },
        health: {
            type: Number,
            default: 100
        },
        maxHealth: {
            type: Number,
            default: 100
        },
    })

    const emit = defineEmits(['next'])

const imageMap = {
  baby: 'game/turtle-baby.png',
  teen: 'game/turtle-teen.png',
  adult: 'game/turtle-adult.png',
}

const imageSrc = computed(() => parsePublicFile(imageMap[props.roleId]))

const title = computed(() => props.node?.[`${props.roleId}_title`] ?? '')

const survivalPercent = computed(() =>
  Math.max(0, Math.min(100, Math.round((props.health / props.maxHealth) * 100)))
)

const next = () => emit('next', props.node?.nextId)
</script>
<template>
  <section class="game-result-card" role="dialog" aria-modal="true">
    

    <div class="game-result-card__content">
        <img :src="imageSrc" alt="" class="game-result-card__img" />
    <h3 class="game-result-card__title">{{ title }}</h3>

    <p class="game-result-card__rate">
      生存機率：{{ survivalPercent }}%
    </p>

    <button type="button" class="next-btn" @click="next">
        <span class="material-symbols-outlined icon-arrow">
            arrow_drop_down
        </span>
    </button>
    </div>

  </section>
</template>
<style lang="scss" scoped>
    .game-result-card__content{
        position: relative;
        background-color: $card-color;
        width: min(420px, 86vw);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
        @include font-body-l-bold;
        padding: 48px 24px 24px; 
        margin: 0 auto;
        opacity: 0.9;
    }
    .next-btn {
        position: absolute;
        right: 16px;
        bottom: 12px;
    }
    .icon-arrow{
        @include icon-style($size: 40px);
    }
    .game-result-card__img {
        width: clamp(120px, 32vw, 260px);
        height: auto;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 50%;
        --inside: clamp(48px, 10vw, 80px);
        --offset: 20px;
        transform: translateX(-50%) translateY(calc(-1 * (var(--inside) + var(--offset))));
    }
</style>