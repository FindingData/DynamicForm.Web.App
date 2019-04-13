<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="data-source">
        <paper-header>
            <template v-slot:title>数据源列表</template>
            <template v-slot:button>
                <el-button size="mini" @click="getDataApiList()">刷新</el-button>
                <el-button type="primary" size="small" @click="handleAdd()">新建数据源</el-button>
            </template>
        </paper-header>
        <div class="content" :style="{width:(width-40)+'px',height:(height-52-42)+'px'}">
            <!--表单列表-->
            <el-table :data="dataApiListPage" :height="height-52-52">
                <el-table-column prop="api_id"
                                 label="数据源ID"
                                 width="120">
                </el-table-column>
                <el-table-column prop="api_name"
                                 label="数据源名称"
                                 width="200">
                </el-table-column>
                <el-table-column prop="api_desc"
                                 label="描述">
                </el-table-column>
                <el-table-column label="操作"
                                 width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination class="pagination"
                background
                layout="prev, pager, next"
                :total="dataApiList.length"
                :currentPage.sync="currentPage"
                style="text-align: right;">
        </el-pagination>
    </div>
</template>

<script>
    import PaperHeader from '../components/PaperHeader'
    import {mapGetters} from 'vuex'
    export default {
        name: "dataSource",
        components:{
            'paper-header':PaperHeader
        },
        computed:{
            ...mapGetters(['width','height']),
            dataApiListPage(){
                return this.dataApiList.slice((this.currentPage-1)*10,this.currentPage*10)
            }
        },
        data(){
            return{
                dataApiList: [],
                currentPage:1,
            }
        },
        methods: {
            //获取表单列表
            getDataApiList() {
                let param = {
                    name: ''
                }
                this.$get('/api/DataApi/Index', param).then(
                    res => {
                        console.log('数据源列表', res)
                        this.dataApiList = res
                    }
                )
            },

            //删除数据源
            handleDelete(row) {
                this.$confirm('此操作将删除该数据源, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('/api/DataApi/Del', { apiId: row.api_id }).then(
                        res => {
                            this.getDataApiList()
                        }
                    )
                }).catch(()=>{})

            },
            //编辑数据源
            handleEdit(row) {
                this.$router.push({path:`/DataSourceEdit/${row.api_id}`})
            },
            handleAdd(){
                this.$router.push({path:`/DataSourceAdd`})
            }
        },
        mounted() {
            this.getDataApiList()
        }

    }
</script>

<style lang="less" scoped>
    .content{
        padding: 0 20px;
    }
    .pagination{
        padding: 0 20px;
        text-align: right;
    }
</style>