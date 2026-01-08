<template>
  <LoginModal />

  <Layout>
    <router-view />
  </Layout>
</template>

<script setup>
import Layout from '@/layouts/index.vue';
import LoginModal from "@/components/auth/LoginModal.vue";
</script>
