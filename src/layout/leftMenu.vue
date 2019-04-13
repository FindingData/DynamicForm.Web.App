<template>
    <div class="left_menu" :style="{'height':$store.state.page.win_content.height+'px'}">
        <div v-for="menu in menus" :class="['left_menu-item',menu.active?'active':'']" @click="menuClick(menu)">
            <span v-text="menu.name" class="left_menu-item-title"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "leftMenu",
        data(){
            return{
                menus:[
                    {
                        name:'表单',
                        path:'/FormList',
                        active:false
                    },
                    {
                        name:'数据源',
                        path:'/DataSource',
                        active:false
                    }
                ]
            }
        },
        methods:{
            menuClick(menu){
                console.log(menu)
                this.menus.forEach(item=>{
                    item.active=false
                })
                menu.active=true
                this.$router.replace(menu.path)
            },
        },
        mounted() {
            if(this.$route.path.indexOf('/DataSource')!==-1){
                this.menus[1].active=true
            }else{
                this.menus[0].active=true
            }
        }

    }
</script>

<style lang="less" scoped>
    .left_menu{
        margin-top: 20px;
        width: 240px;
        float: left;
        .left_menu-item{
            padding: 10px 0 20px 40px;
            cursor: pointer;
            .left_menu-item-title{
                margin-left: 10px;
            }
        }
        .active{
            background: #0dafff;
            color: #fff;
        }
    }
</style>