<template>
    <div :class="['hd',bottomLine?'bottom-line':'']">
        <div class="icon-return-back" v-show="backShow">
            <i class="iconfont icon-fanhui" @click="iconClick"></i>
        </div>
        <div class="text-title">
            <slot name="title"></slot>
        </div>
        <div class="action-button">
            <slot name="button"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PaperHeader",
        props:{
            bottomLine:true,
            back:Function
        },
        data(){
            return {
                backShow:false
            }
        },
        methods:{
            iconClick(){
                this.back()
            },
        },
        mounted() {
            if(this.back){
                this.backShow=true
            }
        }
    }
</script>

<style lang="less" scoped>
    .hd{
        padding: 10px 20px;
        height: 32px;
        .icon-return-back{
            float: left;
            font-size: 18px ;
            width: 30px;
            line-height: 32px;
            i{
                cursor: pointer;
            }
        }
        .text-title{
            height: 32px;
            line-height: 32px;
            float: left;
            font-size: 18px;
        }
        .action-button{
            float: right;
        }
    }
    .bottom-line{
        border-bottom: 1px solid #ebeef5;
    }
</style>