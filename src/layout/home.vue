<template>
    <div class="home">
        <head-nav></head-nav>
        <div>
            <left-menu v-show="leftMenuSlider"></left-menu>
            <div class="content_page" :style="{width:leftMenuSlider?width+'px':(width+221)+'px',height:height+'px',marginLeft:leftMenuSlider?'0px':'20px'}">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import headNav from './headNav'
    import leftMenu from './leftMenu'
    import {mapActions,mapGetters} from 'vuex'
    export default {
        name: "home",
        data(){
            return{

            }
        },
        components:{
            headNav,leftMenu
        },
        computed:{
            ...mapGetters(['width','height','leftMenuSlider'])
        },
        methods: {
            ...mapActions(['set_win_content']),
            setSize() {
                let win_size = {
                    height:document.body.clientHeight-101,
                    width:document.body.clientWidth-261
                }
                this.set_win_content(win_size)//触发动作，content部分的宽高也随即改变。
            },
        },
        created() {
            this.setSize();
        },
        mounted (){
            window.onresize = () => {
                this.setSize();
            }
        }
    }
</script>

<style lang="less" scoped>
    .content_page{
        float: left;
        margin-top: 20px;
        box-shadow: 0 0 6px rgba(0,0,0,.1);
        background: #fff;
    }
</style>