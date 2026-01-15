<script>

</script>

<template>
    <div class="searchBox">
        <input type="text" placeholder="請輸入關鍵字...">
        <button class="searchIcon">
            <span class="material-symbols-outlined ">
                Search
            </span>
        </button>
    </div>

</template>

<style lang="scss">
.searchBox {
    width: 33%;
    height: 48px;
    border: 1px solid $secondary-color;
    margin-bottom: 24px;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    input {
        border: none;
        background: none;
        outline: none;
        height: 100%;
        flex-grow: 1;
        min-width: 0;
        padding: 0 10px;
        font-size: 16px;

        &::placeholder {
            color: $secondary-color;
            opacity: 0.6;
        }
    }

    .searchIcon {
        border: none;
        background: transparent;
        padding-right: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;

        span {
            color: $secondary-color;
        }
    }
}
</style>