<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="form-preview">
        <paper-header :back="returnBack">
            <template v-slot:title>表单预览</template>
            <template v-slot:button>
                <el-button type="primary" size="small" @click="previewFormSetVisible=true">表单样式</el-button>
                <el-button type="primary" size="small" @click="submitPreviewForm">提交测试</el-button>
            </template>
        </paper-header>
        <div class="content" :style="{width:(width-40)+'px',height:(height-52)+'px'}">
            <dynamic-form ref="DynamicForm"
                          :form-id="formId"
                          :label-width="labelWidth"
                          :label-align="align"
                          :form-column="column"
                          :base-config="{userId:1,customerId:1,pcaCode:'4307'}"
                          :on-success="onSuccess"
                          :on-error="onError"
                          :on-empty="onEmpty">
            </dynamic-form>
            <el-dialog title="表单样式"
                       :visible.sync="previewFormSetVisible"
                       top="20vh"
                       width="40%">
                <el-form label-width="120px">
                    <el-form-item label="标签宽度">
                        <el-input-number v-model="labelWidth" :min="40" :max="200" :step="10"></el-input-number>
                    </el-form-item>
                    <el-form-item label="排列样式">
                        <el-radio-group v-model="column">
                            <el-radio :label="1">一列</el-radio>
                            <el-radio :label="2">两列</el-radio>
                            <el-radio :label="3">三列</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="对齐方式">
                        <el-radio-group v-model="align">
                            <el-radio label="right">右对齐</el-radio>
                            <el-radio label="left">左对齐</el-radio>
                            <el-radio label="top">顶部对齐</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import PaperHeader from '../components/PaperHeader'
    import DynamicForm from '../components/DynamicForm'
    import {mapGetters} from 'vuex'
    export default {
        name: "formPreview",
        components:{
            'paper-header':PaperHeader,
            'dynamic-form':DynamicForm
        },
        computed:{
            ...mapGetters(['width','height'])
        },
        data(){
            return{
                labelWidth:120,
                column: 1,
                align: 'right',
                formId:parseInt(this.$route.params.id),
                previewFormSetVisible:false,

            }
        },
        methods:{
            returnBack(){
                this.$router.back()
            },
            //表单加载完成回调
            onSuccess() {
                console.log('加载成功')
            },
            //表单加载错误回调
            onError(err) {
                console.log(err)
            },
            //空表单回调
            onEmpty() {
                console.log('空表单')
            },
            //提交表单
            submitPreviewForm() {
                this.$refs.DynamicForm.submitForm(() => {
                    console.log('表单提交完成')
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .content{
        padding: 0 20px;
        overflow-y: auto;
    }
</style>