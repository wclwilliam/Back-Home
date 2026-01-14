<script setup>
defineProps(['title', 'size'])
</script>

<template>
  <button :class="size">{{ title }}</button>

  <div class="card">
    <div>header</div>
    <slot name="title"></slot>
    <div>footer</div>
  </div>
</template>
<style lang="scss" scoped>
button {
  background-color: red;
  height: 20px;
  width: 200px;
  &.large {
    width: 20rem;
    height: 10rem;
  }
  &.small {
    width: 10rem;
  }
}

.card {
  border: 1px solid #444;
}
</style>
