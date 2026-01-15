<script setup>
  const props = defineProps({
    label : {
      type : String,
      required: true
    },
    required: {
      type : Boolean,
      default : false
    },
    error : {
      type : String,
      default: ''
    },
    htmlFor: {
      type : String,
      default : ''
    }
  })
</script>

<template>
  <div class="formItem col-sm-4 col-md-10 col-lg-9">
    <label :for="htmlFor" class="formLabel col-sm-4 col-md-2 col-lg-4">
      {{ label }}
      <span v-if="required" class="requiredMark">*</span>
    </label>

    <div class="formContent col-sm-4 col-md-10 col-lg-10">
      <slot></slot>
      <p v-if="error" class="errorMessage">{{ error }}</p>
      <div v-if="$slots.message"  class="message">
        <slot name="message"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .formItem {
  flex-direction: column;
  margin-bottom: 24px;
}

.formLabel {
  @include font-quaternary;
}

.requiredMark {
  color: $highlight-color2;
  margin-left: 4px;
}

.message{
  @include font-caption;
}
@media (min-width: 768px) {
  .formItem{
    display: flex;
    flex-direction: row;
    align-self: flex-start;
  }
}
</style>