<script setup>
import { computed } from 'vue'
import Lightbox from '@/components/Lightbox.vue'
import Button from '@/components/auth/Button.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'confirm' // 'confirm' 或 'success'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
}

const title = computed(() => {
  return props.type === 'success' ? '已移出收藏' : '是否移出收藏夾？'
})

const message = computed(() => {
  return props.type === 'success' ? '該項目已從您的收藏清單中移除。' : '確定要將此活動從收藏夾中移除嗎？'
})
</script>

<template>
  <Lightbox :modelValue="modelValue" @update:modelValue="close">
    <template #title>
      <span>{{ title }}</span>
    </template>

    <div class="remove-favorite-lightbox-inner">
      <div class="text-message-wrap">
        <p>{{ message }}</p>
      </div>
    </div>

    <template #footer>
      <div class="remove-favorite-lightbox-actions">
        <Button v-if="type === 'success'" variant="primary" @click="close">確定</Button>
        <template v-else>
          <Button variant="primary" @click="handleConfirm">確定</Button>
          <Button variant="outline" @click="close">取消</Button>
        </template>
      </div>
    </template>
  </Lightbox>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/base/_var.scss";

.remove-favorite-lightbox-inner {
  color: $text-color;
}

.text-message-wrap {
  text-align: center;
  font-size: rem(18px);
  padding: 0;
  
  p {
    margin: rem(8px) 0;
  }
}

.remove-favorite-lightbox-actions {
  display: flex;
  justify-content: center;
  gap: rem(16px);
  margin-top: rem(10px);
}

@media (max-width: 768px) {
  .remove-favorite-lightbox-actions {
    flex-direction: column;
    gap: rem(8px);
  }

  .remove-favorite-lightbox-actions :deep(button) {
    width: 100%;
  }
}
</style>
