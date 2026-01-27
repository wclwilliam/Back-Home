<!--上課測試用檔案-->
<script setup>
    //import { useUserStore } from '@/stores/user';
    //const userStore = userStore()

    import { ref, onMounted } from 'vue';
    // const account = ref('')
    // const password = ref('')
    // const login = () => {
    //     userStore.log(account.value, password.value)
    // }
    import { testApi, test2Api } from '@/utils/publicApi.js';
    const newData = ref(null)
    onMounted(() => {
        try {
            console.log(1)
            const res = test2Api.get('/login.php')
            if(res && res.data) {
                console(2)
                newData.value = res.data
            }
            console.log(3)
        } catch (error) {
            debugger
        } finally {
            console.log('end')
        }

        //testApi.get('/login.php')
        //.then(res => {
        // test2Api.get('/login.php')
        // .then(res => {
            // if(res) {
            //     newData.value = res.data ? res.data : null
            // }
        })
    // })

    //import Button from '@/components/auth/Button.vue';

</script>

<template>
    <h1>會員登入</h1>
    <div>{{ newData }}</div>
    <!-- <div>
        <input type="text" v-model="account"/>
        <br/>
        <input type="password" v-model="password"/>
        <br/>
        {{ userStore.isLogin ? 1:0 }}
        <Button @click="login">登入</Button>
    </div> -->
</template>

<style  scoped>
    a{
        display: block;
    }

</style>