<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="form-list">
        <paper-header>
            <template v-slot:title>表单列表</template>
            <template v-slot:button>
                <el-button size="mini" @click="getFormList">刷新</el-button>
                <el-button type="primary" size="small" @click="formAddVisible=true">新建表单</el-button>
            </template>
        </paper-header>
        <div class="content" :style="{width:(width-40)+'px',height:(height-52-42)+'px'}">
            <!--表单列表-->
            <el-table :data="formListPage" :height="height-52-52">
                <el-table-column prop="form_id"
                                 label="表单ID"
                                 width="120">
                </el-table-column>
                <el-table-column prop="form_name"
                                 label="表单名称"
                                 width="200">
                </el-table-column>
                <el-table-column prop="form_desc"
                                 label="描述">
                </el-table-column>
                <el-table-column label="操作"
                                 width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="handlePreview(scope.row)">预览</el-button>
                        <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--新增表单-->
            <el-dialog title="新增表单" :visible.sync="formAddVisible" v-on:close="formAddClose">
                <el-form :model="customerForm" :rules="customerFormRules" ref="CustomerForm" label-width="100px">
                    <el-form-item label="表单名称" prop="form_name">
                        <el-input v-model="customerForm.form_name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="form_desc">
                        <el-input type="textarea" v-model="customerForm.form_desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="addForm">确定</el-button>
                        <el-button v-on:click="formAddVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <el-pagination class="pagination"
                background
                layout="prev, pager, next"
                :total="formList.length"
                :currentPage.sync="currentPage" >
        </el-pagination>
    </div>
</template>

<script>
    import PaperHeader from '../components/PaperHeader'
    import {mapGetters} from 'vuex'
    export default {
        name: "formList",
        components:{
            'paper-header':PaperHeader
        },
        computed:{
            ...mapGetters(['width','height']),
            formListPage(){
                return this.formList.slice((this.currentPage-1)*10,this.currentPage*10)
            }
        },
        data(){
            return{
                formList:[],
                currentPage:1,
                formAddVisible:false,
                customerForm: {
                    form_name: '',
                    form_desc: ''
                },
                customerFormRules: {
                    form_name: [{ required: true, message: '请输入表单名称', trigger: 'blur' }]
                },
            }
        },
        methods:{
            //获取表单列表
            getFormList() {
                let param = {
                    name: ''
                }
                this.$get('/api/Form/Index', param).then(
                    res => {
                        console.log('表单列表',res)
                        this.formList = res
                    }
                )
            },
            //新增表单
            addForm() {
                this.$refs.CustomerForm.validate((valid) => {
                    if (valid) {
                        this.$post('/api/Form/Add', this.customerForm).then(
                            res => {
                                console.log('新增表单',res)
                                this.getFormList()
                                this.formAddVisible = false
                            }
                        )
                    }
                })
            },
            //编辑表单
            handleEdit(row) {
                this.$router.push({path:`/FormEdit/${row.form_id}`})
            },
            //表单预览
            handlePreview(row) {
                this.$router.push({path:`/FormPreview/${row.form_id}`})
            },
            //删除表单
            handleDelete(row) {
                this.$confirm('此操作将删除该表单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'info',
                        message: '待开发'
                    })
                }).catch(()=>{})
            },
            //关闭弹框清空表单信息
            formAddClose() {
                this.$refs.CustomerForm.resetFields()
            },
        },
        mounted() {
            this.getFormList()
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