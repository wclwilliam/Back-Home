<script setup>
    import { useUserStore } from '@/stores/user';
    const userStore = userStore()

    import { ref } from 'vue';
    const account = ref('')
    const password = ref('')
    const login = () => {
        userStore.log(account.value, password.value)
    }
    

</script>

<template>
    <h1>會員登入</h1>
    <div>
        <input type="text" v-model="account"/>
        <br/>
        <input type="password" v-model="password"/>
        <br/>
        {{ userStore.isLogin ? 1:0 }}
        <button @click="login">登入</button>
    </div>
</template>

<style  scoped>
    a{
        display: block;
    }

</style>