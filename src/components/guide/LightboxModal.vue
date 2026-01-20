<script setup>

const props = defineProps({
  isOpen: Boolean,      
  item: Object,
});


const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};

const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
    return `${base}${imgURL}`
}
</script>

<template>
  <Transition name="fade">

    <div v-if="isOpen" class="modalOverlay" @click.self="handleClose">

      <div class="modalCard">

        <button class="closeBtn" @click="handleClose">
          <span class="material-symbols-outlined">
            Close
          </span>
        </button>

        <div class="cardImage">
           <img :src="parsePublicFile(item.image)" :alt="item.title">
        </div>

        <div class="cardContent">
          <h3>{{ item.modalTitle || item.title }}</h3>
          <p v-html="item.modalDesc || item.desc"></p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}


.modalCard {
  background: $card-color;
  width: 70%;
  height: 60vh;
  border-radius: 12px;
  position: relative;
  display: flex;
  overflow: hidden;
}


.cardImage {
  flex: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}


.cardContent {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: $text-color;
  gap: 50px;

  h3 {
    font-size: $size-body-l;
    font-weight: bold;
    text-align: center;
  }

  p {
    font-size: $size-body;
    line-height: 1.5;
  }
}


.closeBtn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: $text-color;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>