<script setup>
import Button from '../auth/Button.vue'
defineProps({
  modelValue: Boolean, // 控制顯示隱藏
  formData: Object, // 接收報名資料
})
defineEmits(['update:modelValue', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <!--確保燈箱位置在上層-->
    <Transition name="fade">
      <!--淡入淡出-->
      <div
        v-if="modelValue"
        class="lightbox-overlay"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="lightbox-content">
          <button class="close-btn" @click="$emit('update:modelValue', false)">✕</button>

          <div class="lightbox-main">
            <h2 class="title">請確認以下報名資料</h2>

            <div class="info-list">
              <div class="info-row">
                <span class="label">活動名稱：</span>
                <span class="value">{{
                  formData?.activityName || '2026 新年第一淨：萬里翡翠灣'
                }}</span>
              </div>

              <div class="info-row">
                <span class="label">活動時間：</span>
                <span class="value">{{
                  formData?.activityTime || '2025-04-10(日) 10:30 - 16:30'
                }}</span>
              </div>

              <div class="info-row">
                <span class="label">活動地點：</span>
                <span class="value">{{ formData?.location || '新北萬里翡翠灣' }}</span>
              </div>

              <div class="info-row">
                <span class="label">姓名：</span>
                <span class="value">{{ formData?.name || '王小明' }}</span>
              </div>

              <div class="info-row">
                <span class="label">手機號碼：</span>
                <span class="value">{{ formData?.phone || '0912-345-678' }}</span>
              </div>

              <div class="info-row">
                <span class="label">電子信箱：</span>
                <span class="value">{{ formData?.email || 'wanghsiaoming@gmail.com' }}</span>
              </div>

              <div class="info-row">
                <span class="label">身份證字號：</span>
                <span class="value">{{ formData?.idNumber || 'A123456789' }}</span>
              </div>

              <div class="info-row">
                <span class="label">出生年月日：</span>
                <span class="value">{{ formData?.birthDate || '1970/01/01' }}</span>
              </div>

              <div class="info-row">
                <span class="label">緊急聯絡人姓名：</span>
                <span class="value">{{ formData?.emergencyName || '王大壯' }}</span>
              </div>

              <div class="info-row">
                <span class="label">緊急聯絡人電話：</span>
                <span class="value">{{ formData?.emergencyPhone || '0923-456-789' }}</span>
              </div>
            </div>

            <div class="actions">
              <Button variant="primary" @click="$emit('confirm')">確認報名</Button>
              <Button variant="outline" @click="$emit('update:modelValue', false)">返回修改</Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.lightbox-content {
  background-color: #f0f2f5; // 灰底
  border: 1px solid $primary-color; // 外層深色邊框
  width: rem(800px);
  max-width: 90vw;
  padding: rem(50px) rem(40px);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.title {
  font-size: rem(26px);
  color: $primary-color;
  font-weight: bold;
  margin-bottom: rem(68px);
  text-align: center;
}

.info-list {
  margin-bottom: rem(30px);
  margin: 0 rem(16px) rem(70px);

  .info-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: rem(18px);
    line-height: 1.6;

    .label {
      @include font-body-l;
      color: $text-color;
      font-weight: 700;
      min-width: rem(180px);
      flex-shrink: 0;
    }

    .value {
      @include font-body-l;
      color: $text-color;
      flex: 1;
    }
  }
}

.actions {
  display: flex;
  justify-content: center;
  gap: rem(20px);
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 8px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: $primary-color;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
