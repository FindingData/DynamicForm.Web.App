<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="data-source-add">
        <paper-header :back="returnBack">
            <template v-slot:title>新增数据源</template>
            <template v-slot:button>
                <el-button type="primary" size="small" @click="save">保存</el-button>
            </template>
        </paper-header>
        <div class="content" :style="{width:(width-40)+'px',height:(height-52)+'px'}">
            <el-form :model="customerForm" ref="CustomerForm" label-width="100px">
                <el-form-item label="数据源名称" prop="api_name"
                              :rules="[{ required: true, message: '请输入数据源名称', trigger: 'blur' }]">
                    <el-input v-model="customerForm.api_name"></el-input>
                </el-form-item>
                <el-form-item label="SQL语句" prop="sql_content"
                              :rules="[{ required: true, message: '请输入SQL语句', trigger: 'blur' }]">
                    <div style="position:relative;">
                        <el-input type="textarea"
                                  :autosize="{ minRows: 6, maxRows: 10}"
                                  v-model="customerForm.sql_content"></el-input>
                        <el-button title="格式化" type="text"
                                   v-on:click="sqlContentFromat"
                                   style="position:absolute;right:20px;bottom:0;">
                            <i class="iconfont icon-format_icon" style="font-size:24px;"></i>
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="请求参数" prop="request_parameter_list" v-if="customerForm.request_parameter_list.length>0" >
                    <el-row style="text-align:center;">
                        <el-col :span="6">参数名称</el-col>
                        <el-col :span="6">参数中文名称</el-col>
                        <el-col :span="6">数据类型</el-col>
                        <el-col :span="6">是否必填</el-col>
                    </el-row>
                    <el-row v-for="(param,index) in customerForm.request_parameter_list" :key="index" :gutter="10" style="text-align:center;padding:5px 0;">
                        <el-col :span="6">{{param.parameter_name}}</el-col>
                        <el-col :span="6">
                            <el-input v-model="param.parameter_name_chs" placeholder="请输入内容"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-select v-model="param.data_type" placeholder="请选择">
                                <el-option v-for="(value,key) in DataType"
                                           :key="value"
                                           :label="key"
                                           :value="value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-switch v-model="param.is_required"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949">
                            </el-switch>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="返回参数" prop="response_parameter_list" v-if="customerForm.response_parameter_list.length>0" >
                    <el-row style="text-align:center;">
                        <el-col :span="6">参数名称</el-col>
                        <el-col :span="6">参数中文名称</el-col>
                        <el-col :span="6">数据类型</el-col>
                        <el-col :span="6">是否必填</el-col>
                    </el-row>
                    <el-row v-for="(param,index) in customerForm.response_parameter_list" :key="index" :gutter="10" style="text-align:center;padding:5px 0;">
                        <el-col :span="6">{{param.parameter_name}}</el-col>
                        <el-col :span="6">
                            <el-input v-model="param.parameter_name_chs" placeholder="请输入内容"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-select v-model="param.data_type" placeholder="请选择">
                                <el-option v-for="(value,key) in DataType"
                                           :key="value"
                                           :label="key"
                                           :value="value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="描述" prop="api_desc">
                    <el-input type="textarea" v-model="customerForm.api_desc"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import PaperHeader from '../components/PaperHeader'
    import {mapGetters} from 'vuex'
    import {DataType} from "../config/emnu";
    export default {
        name: "dataSourceAdd",
        components:{
            'paper-header':PaperHeader
        },
        data(){
            return{
                DataType:DataType,
                customerForm: {
                    api_id: '',
                    api_name: '',
                    api_desc: '',
                    api_url: '',
                    sql_content: '',
                    fsq_db_name: '',
                    request_parameter_list: [],
                    response_parameter_list:[]
                },
            }
        },
        computed:{
            ...mapGetters(['width','height'])
        },
        methods:{
            returnBack(){
                this.$router.back()
            },
            //格式化SQL
            sqlContentFromat() {
                if (this.customerForm.sql_content !== '') {
                    let param = {
                        sql: this.customerForm.sql_content.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '')
                    }
                    this.$get('/api/DataApi/ParseSql', param).then(
                        res => {
                            console.log('SQL格式化', res)
                            this.customerForm.request_parameter_list = res.requestList
                            this.customerForm.response_parameter_list = res.respList
                        }
                    )
                    this.customerForm.sql_content = this.customerForm.sql_content.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '')
                    console.log(this.customerForm.sql_content)
                    this.customerForm.sql_content = this.customerForm.sql_content
                        .replace(/SELECT/g, 'SELECT\r\n\t')
                        .replace(/FROM/g, '\r\nFROM\n\t')
                        .replace(/WHERE/g, '\r\nWHERE\n\t')
                        .replace(/select/g, 'SELECT\r\n\t')
                        .replace(/where/g, '\r\nWHERE\n\t')
                        .replace(/from/g, '\r\nFROM\n\t')

                }

            },
            save(){
                this.$refs.CustomerForm.validate(valid => {
                    if (valid) {
                        console.log(this.customerForm)
                        this.$post('/api/DataApi/Add', this.customerForm).then(
                            res => {
                                console.log('新增数据源', res)
                            }
                        )
                    }
                })
            },
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .content{
        padding: 0 20px;
        overflow-y: scroll;
    }
</style>