<template>
    <div class="head_nav">
        <div class="logo">
            <span>房典数据-表单工具</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: "headNav",
    }
</script>

<style lang="less" scoped>
    .head_nav{
        width: 100%;
        height: 40px;
        padding: 10px 0;
        background: #fff;
        box-shadow: 0 0 6px rgba(0,0,0,.1);
    }
    .logo{
        height: 40px;
        line-height: 40px;
        padding-left: 60px;
        float: left;
        margin-left: 10px;
        background: url(../assets/logo.png) no-repeat;
        background-size: 32px 32px;
        span{
            font-family: 黑体;
            font-size: 18px;
            color: #333;
        }
    }
</style>