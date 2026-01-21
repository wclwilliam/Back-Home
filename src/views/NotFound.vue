<script setup>

</script>

<template>
    <div class="outer">
        <h1>404 Not Found</h1>

    </div>
</template>
    
    
<style scoped lang="scss">
    .outer {
        width: 100%;
        height: 100vw;
        background: url(@/assets/image/404/404bg.png) center / cover;
        display: flex;
        justify-content: center;
        h1 {
            @include font-giant;
            color: $primary-color;
            margin-top: 54px;
            @media (width< 768px) {
                font-size: 48px;
            }
        }
    }
</style>