<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="form-edit">
        <paper-header :back="returnBack">
            <template v-slot:title>表单编辑</template>
            <template v-slot:button>
                <el-button size="mini">刷新</el-button>
                <el-button type="primary" size="small">表单设置</el-button>
            </template>
        </paper-header>
        <div class="content" :style="{width:(width+180)+'px',height:(height-52)+'px'}">
            <div class="form-config-left" :style="{width:'260px'}">
                <el-collapse v-model="activeComponentsName" accordion>
                    <el-collapse-item v-for="(group,index) in FormComponents" :key="index" :name="group.component_group">
                        <template slot="title">
                            <span v-text="group.component_group" style="font-weight:bold;"></span>
                        </template>
                        <draggable v-model="group.component_list" class="config-filter"
                                   :options="{group:{ name:'labelList',  pull:'clone', put:false },
                                              ghostClass:'form-config-center-row-ghost',
                                              sort:false,
                                              animation:300}">
                            <div v-for="(component, _index) in group.component_list" :key="_index" class="form-config-left-item">
                                <span v-text="component.label_name_chs"></span>
                            </div>
                        </draggable>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="form-config-center" :style="{width:(width-590)+'px'}">
                <el-tabs v-model="labelActiveName" class="form-label-type-tab">
                    <el-tab-pane label="控件标签" name="control"></el-tab-pane>
                    <el-tab-pane label="变量标签" name="variable"></el-tab-pane>
                    <el-tab-pane label="条件标签" name="condition"></el-tab-pane>
                </el-tabs>
                <div class="form-config-content" id="FormContent">
                    <vue-scrollbar classes="form-label-scrollbar" id="FormLabelContent" ref="FormLabelScrollbar">
                        <div class="scroll-me">
                            <draggable v-model="setLableList" v-on:update="updateData" v-on:add="addData"
                                       :options="{group:{ name:'labelList',  pull:false, put:true },
                                       disabled:labelActiveName === 'variable' || labelActiveName === 'condition',
                                       ghostClass:'form-config-center-row-ghost',animation:300}" style="min-height:500px;">
                                <div v-for="(label,index) in setLableList" :key="index"
                                     v-on:click="settingData(index)"
                                     :class="['form-config-center-row',index===currentLabelindex?'row-active':'']">
                                    <div v-if="labelActiveName === 'control'">
                                        <div v-if="label.label_type === LabelType.control">
                                            <div v-if="label.label_config.control_config.control_type==='map_gis'">
                                                <label-template :lable-type="label.control_type" class="form-config-center-control" style="margin-left:2.5%;"></label-template>
                                            </div>
                                            <div v-else-if="label.label_config.control_config.control_type==='map_baidu'">
                                                <label-template :lable-type="label.control_type" class="form-config-center-control" style="margin-left:2.5%;"></label-template>
                                            </div>
                                            <div v-else-if="label.label_config.control_config.control_type==='rtf'">
                                                <label-template :lable-type="label.control_type" class="form-config-center-control" style="margin-left:2.5%;"></label-template>
                                            </div>
                                            <el-row v-else>
                                                <el-col :span="6">
                                                    <label class="form-config-center-label">{{label.label_name_chs}}</label>
                                                </el-col>
                                                <el-col :span="18">
                                                    <label-template :lable-type="label.label_config.control_config.control_type" class="form-config-center-control"></label-template>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                    <div v-else-if="labelActiveName === 'variable'">
                                        <div v-if="label.label_type === LabelType.variable" style="padding:20px 20px;">
                                            {{label.label_name_chs}}
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="label.label_type === LabelType.condition" style="padding:20px 20px;">
                                            {{label.label_name_chs}}
                                        </div>
                                    </div>
                                </div>

                            </draggable>
                        </div>
                    </vue-scrollbar>

                </div>
            </div>
            <div class="form-config-right" id="FormRight" :style="{width:'450px'}">
                <div v-if="labelEditChange">
                    <div v-if="currentLabelData.label_type===LabelType.control">
                        <div class="form-config-right-content-btn">
                            <el-button type="danger" v-on:click="removeLabel" size="mini" circle title="删除"><i class="iconfont icon-huishouzhan"></i></el-button>
                            <el-button type="primary" v-on:click="saveLabelConfig" size="mini" circle title="保存"><i class="iconfont icon--baocun"></i></el-button>
                        </div>
                        <el-tabs v-model="tabActiveName" v-if="currentLabelData.label_config.control_config.control_type==='input_base'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="占位文本">
                                        <el-input v-model="getLabelConfigItem('placeholder').value" placeholder="请输入占位文本"></el-input>
                                    </el-form-item>
                                    <el-form-item label="是否可清空">
                                        <el-radio-group v-model="getLabelConfigItem('clearable').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator">

                            </el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate">

                            </el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='input_autocomplete'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="占位文本">
                                        <el-input v-model="getLabelConfigItem('placeholder').value" placeholder="请输入占位文本"></el-input>
                                    </el-form-item>
                                    <el-form-item label="是否可清空">
                                        <el-radio-group v-model="getLabelConfigItem('clearable').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="激活即列出数据">
                                        <el-radio-group v-model="getLabelConfigItem('trigger-on-focus').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator">
                                <el-card shadow="hover" style="margin-bottom:20px;">
                                    <div slot="header" class="clearfix">
                                        <span>不为空验证</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">删除</el-button>
                                    </div>
                                    <el-row>
                                        <el-col :span="6" style="font-size:13px;">错误提示</el-col><el-col :span="18"  style="font-size:14px;">楼盘地址不能为空</el-col>
                                    </el-row>
                                </el-card>
                                <el-card shadow="hover" style="margin-bottom:20px;">
                                    <div slot="header" class="clearfix">
                                        <span>字符长度验证</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">删除</el-button>
                                    </div>
                                    <el-row>
                                        <el-col :span="6" style="font-size:13px;">最小长度</el-col><el-col :span="18"  style="font-size:14px;">0</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6" style="font-size:13px;">最大长度</el-col><el-col :span="18"  style="font-size:14px;">50</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6" style="font-size:13px;">错误提示</el-col><el-col :span="18"  style="font-size:14px;">长度在50个字符以内</el-col>
                                    </el-row>
                                </el-card>
                                <el-button type="primary" v-on:click="validatorAddDialog = true" style="width:100%;"><i class="el-icon-plus"></i></el-button>
                                <el-dialog title="新增验证" :visible.sync="validatorAddDialog" v-on:close="validatorAddDialogClose" width="50%">
                                    <el-form ref="ValidatorAddForm" :model="validatorAddForm" label-width="120px">
                                        <el-form-item prop="validatorName" label="验证名称" :rules="[{required: true, message: '请输入验证名称', trigger: 'blur'}]">
                                            <el-input v-model="validatorAddForm.validatorName" placeholder="验证名称"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="validatorType" label="验证类型" :rules="[{required: true, message: '请选择验证类型', trigger: 'change'}]">
                                            <el-select v-model="validatorAddForm.validatorType" clearable placeholder="验证类型">
                                                <el-option v-for="(value,key) in ValidatorType" :key="value"
                                                           :label="key" :value="value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <div v-if="validatorAddForm.validatorType === ValidatorType.数字大小">
                                            <el-form-item label="数字最小值">
                                                <el-input v-model="validatorAddForm.numberMin"></el-input>
                                            </el-form-item>
                                            <el-form-item label="数字最大值">
                                                <el-input v-model="validatorAddForm.numberMax"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div v-else-if="validatorAddForm.validatorType === ValidatorType.字符长度">
                                            <el-form-item label="长度最小值">
                                                <el-input v-model="validatorAddForm.lengthMin"></el-input>
                                            </el-form-item>
                                            <el-form-item label="长度最大值">
                                                <el-input v-model="validatorAddForm.lengthMax"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div v-else-if="validatorAddForm.validatorType === ValidatorType.比较">
                                            <el-form-item label="比较对象">
                                                <el-input v-model="validatorAddForm.compareTarget"></el-input>
                                            </el-form-item>
                                            <el-form-item label="比较类型">
                                                <el-input v-model="validatorAddForm.compareType"></el-input>
                                            </el-form-item>
                                        </div>
                                        <el-form-item v-else-if="validatorAddForm.validatorType === ValidatorType.正则" label="正则配置">
                                            <el-input v-model="validatorAddForm.regular" placeholder="正则表达式"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="errorMessage" label="错误提示" :rules="[{required: true, message: '请输入错误提示', trigger: 'blur'}]">
                                            <el-input v-model="validatorAddForm.errorMessage" placeholder="错误提示"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button v-on:click="validatorAddDialog = false">取 消</el-button>
                                        <el-button type="primary" v-on:click="validatorAdd">确 定</el-button>
                                    </span>
                                </el-dialog>
                            </el-tab-pane>
                            <el-tab-pane label="数据源" name="data">
                                <div>
                                    <span>数据源类型</span>
                                    <el-select v-model="tempDataSourceConfig.data_source_type" v-on:change="handledDataTypeChange" clearable placeholder="请选择">
                                        <el-option v-for="(value,key) in DataSourceType" :key="value"
                                                   :label="key"
                                                   :value="value">
                                        </el-option>
                                    </el-select>
                                </div>

                                <el-card v-if="tempDataSourceConfig.data_source_type===DataSourceType.Dict" class="f-label-config-data-type" shadow="always">
                                    <div>
                                        <span>字典类型</span>
                                        <el-select v-model="tempDataSourceConfig.dic_type_id" v-on:change="handledDictTypeChange" filterable clearable placeholder="请选择">
                                            <el-option v-for="(dict,index) in dictList" :key="index"
                                                       :label="dict.dic_par_name"
                                                       :value="dict.dic_par_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="tempDataSourceConfig.dic_type_id!==''&&dictPars.length>0" style="margin-top:10px;">
                                        <div>
                                            <el-checkbox :indeterminate="dictIndeterminate" v-model="dictIndeterminateCheckAll" v-on:change="handleDictIndeterminateCheckAll">全选</el-checkbox>
                                        </div>
                                        <div class="f-label-config-data-dic-checkbox">
                                            <el-checkbox-group v-model="dictChecked" v-on:change="handledDictCheckedChange">
                                                <el-checkbox v-for="par in dictPars" :label="par.dic_par_id" :key="par.dic_par_id">{{par.dic_par_name}}</el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                    </div>
                                </el-card>
                                <el-card v-else-if="tempDataSourceConfig.data_source_type===DataSourceType.Custom" class="f-label-config-data-type" shadow="always">
                                    <el-form :model="tempDataSourceConfig" ref="dynamicValidateForm" label-width="80px">
                                        <el-form-item prop="value"
                                                      label="数据值"
                                                      :rules="[{ required: true, message: '请输入数据值', trigger: 'blur' }]">
                                            <el-input v-model="tempDataSourceConfig.value" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="separator"
                                                      label="分割符"
                                                      :rules="[{ required: true, message: '请输入分割符', trigger: 'blur' }]">
                                            <el-input v-model="tempDataSourceConfig.separator"></el-input>
                                        </el-form-item>
                                        <el-form-item label="结果预览">
                                            <span v-text="getDataSourceConfigCustomResult()"></span>
                                        </el-form-item>
                                    </el-form>
                                </el-card>
                                <el-card v-else-if="tempDataSourceConfig.data_source_type===DataSourceType.DataApi" class="f-label-config-data-type" shadow="always">
                                    <div>
                                        <span>数据源</span>
                                        <el-select v-model="tempDataSourceConfig.api_id" v-on:change="handledDataApiChange" clearable placeholder="请选择">
                                            <el-option v-for="(api,index) in dataApis" :key="index"
                                                       :label="api.api_name"
                                                       :value="api.api_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="tempDataSourceConfig.api_id!==''">
                                        <el-row v-for="(param,index) in tempDataApiParam" :key="index" style="margin-top:10px;">
                                            <el-col :span="8" style="text-align:right;height:40px;line-height:40px;font-size:13px;">
                                                <span v-text="param.parameter_name_chs"></span>
                                            </el-col>
                                            <el-col :span="4" style="text-align:center;height:40px;line-height:40px;">
                                                <i class="iconfont icon-zhixiang" style="font-size:24px;"></i>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-select v-model="param.parameter_value" clearable filterable placeholder="请选择">
                                                    <el-option v-for="(label,index) in setLableList" :key="index"
                                                               :label="label.label_name_chs" :value="label.label_name_chs+''"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="2" style="text-align:center;height:40px;line-height:40px;">
                                                <span v-if="param.is_required" style="color:#ff0000;">*</span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-card>
                            </el-tab-pane>
                            <el-tab-pane label="关联" name="relate">
                                <el-card shadow="hover">
                                    <div slot="header" class="clearfix">
                                        <span>卡片名称</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                                    </div>
                                    <div v-for="o in 4" :key="o" class="text item">
                                        {{'列表内容 ' + o }}
                                    </div>
                                </el-card>
                                <el-button type="primary" v-on:click="relateAddDialog = true" style="width:100%;"><i class="el-icon-plus"></i></el-button>
                                <el-dialog title="新增关联" :visible.sync="relateAddDialog" v-on:close="relateAddDialogClose" width="30%">
                                    <el-form ref="RelateAddForm" :model="relateAddForm" label-width="80px">
                                        <el-form-item prop="relateName" label="关联名称" :rules="[{required: true, message: '请输入关联名称', trigger: 'blur'}]">
                                            <el-input v-model="relateAddForm.relateName" placeholder="关联名称"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="relate_type" label="关联类型" :rules="[{required: true, message: '请选择关联类型', trigger: 'change'}]">
                                            <el-select v-model="relateAddForm.relate_type" clearable placeholder="关联类型">
                                                <el-option v-for="(value,key) in RelateType" :key="value"
                                                           :label="key" :value="value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="condition_expr" label="条件表达式" :rules="[{required: true, message: '请输入条件表达式', trigger: 'blur'}]">
                                            <el-input v-model="relateAddForm.condition.condition_expr" placeholder="条件表达式"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="value_method" label="取值方式" :rules="[{required: true, message: '请选择取值方式', trigger: 'change'}]">
                                            <el-select v-model="relateAddForm.condition.condition_item.value_method" clearable placeholder="取值方式">
                                                <el-option v-for="(value,key) in ValueMethod" :key="value"
                                                           :label="key" :value="value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="inner_value" label="替换值">
                                            <el-input v-model="relateAddForm.condition.condition_item.inner_value" placeholder="替换值"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button v-on:click="relateAddDialog = false">取 消</el-button>
                                        <el-button type="primary" v-on:click="relateAdd">确 定</el-button>
                                    </span>
                                </el-dialog>
                                @*<el-table :data="currentLabelData.label_config.relate_config?currentLabelData.label_config.relate_config.relate_list:[]" style="width: 100%">
                                <el-table-column prop="relate_name"
                                                 label="关联名称"
                                                 align="center"
                                                 width="120">
                                </el-table-column>
                                <el-table-column prop="operator_str"
                                                 label="关联操作"
                                                 align="center"
                                                 width="120">
                                    <template slot-scope="scope">
                                        <span v-text="getRelateRuleProp(scope.row.operator_str)"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="label"
                                                 align="center"
                                                 label="关联标签">
                                    <template slot-scope="scope">
                                        <span v-text="scope.row.label.label_name_chs"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作"
                                                 align="center"
                                                 width="60">
                                    <template slot-scope="scope">
                                        <el-button type="text" v-on:click="relateDelete(scope.$index)"><i class="el-icon-delete"></i></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                                <div style="text-align:right;padding:10px;">
                                    <el-button type="primary" icon="el-icon-plus" title="新增" v-on:click="relateAddDialog = true" circle></el-button>
                                </div>
                                <el-dialog title="新增关联" :visible.sync="relateAddDialog" v-on:close="relateAddDialogClose" width="30%">
                                    <el-form ref="RelateAddForm" :model="relateAddForm" label-width="80px">
                                        <el-form-item prop="relateName" label="关联名称" :rules="[{required: true, message: '请输入关联名称', trigger: 'blur'}]">
                                            <el-input v-model="relateAddForm.relateName" placeholder="关联名称"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="operatorStr" label="关联操作" :rules="[{required: true, message: '请选择关联操作', trigger: 'change'}]">
                                            <el-select v-model="relateAddForm.operatorStr" clearable placeholder="关联操作">
                                                <el-option v-for="(value,key) in RelateRule" :key="value"
                                                           :label="key" :value="value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="label" label="关联标签" :rules="[{required: true, message: '请选择关联标签', type:'number', trigger: 'change'}]">
                                            <el-select v-model="relateAddForm.label" clearable placeholder="关联标签">
                                                <el-option v-for="(item,index) in getLabelsExceptSelf()" :key="index"
                                                           :label="item.label_name_chs" :value="item.label_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
                <el-button v-on:click="relateAddDialog = false">取 消</el-button>
                <el-button type="primary" v-on:click="relateAdd">确 定</el-button>
            </span>
                                </el-dialog>*@
                            </el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='input_textarea'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="占位文本">
                                        <el-input v-model="getLabelConfigItem('placeholder').value" placeholder="请输入占位文本"></el-input>
                                    </el-form-item>
                                    <el-form-item label="内容高度">
                                        <el-slider v-model="getLabelConfigItem('autosize').value" range show-stops :min="1" :max="10"></el-slider>
                                    </el-form-item>
                                    <el-form-item label="缩放">
                                        <el-radio-group v-model="getLabelConfigItem('resize').value">
                                            <el-radio label="none">无</el-radio>
                                            <el-radio label="both">二者都</el-radio>
                                            <el-radio label="horizontal">横向</el-radio>
                                            <el-radio label="vertical">纵向</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否可清空">
                                        <el-radio-group v-model="getLabelConfigItem('clearable').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate">

                            </el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='select'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="占位文本">
                                        <el-input v-model="getLabelConfigItem('placeholder').value" placeholder="请输入占位文本"></el-input>
                                    </el-form-item>
                                    <el-form-item label="是否可清空">
                                        <el-radio-group v-model="getLabelConfigItem('clearable').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否可搜索">
                                        <el-radio-group v-model="getLabelConfigItem('filterable').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data">
                                <div>
                                    <span>数据源类型</span>
                                    <el-select v-model="tempDataSourceConfig.data_source_type" v-on:change="handledDataTypeChange" clearable placeholder="请选择">
                                        <el-option v-for="(value,key) in DataSourceType" :key="value"
                                                   :label="key"
                                                   :value="value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-if="tempDataSourceConfig.data_source_type===DataSourceType.Dict" class="f-label-config-data-type">
                                    <div>
                                        <span>字典类型</span>
                                        <el-select v-model="tempDataSourceConfig.dic_type_id" v-on:change="handledDictTypeChange" filterable clearable placeholder="请选择">
                                            <el-option v-for="(dict,index) in dictList" :key="index"
                                                       :label="dict.dic_par_name"
                                                       :value="dict.dic_par_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="tempDataSourceConfig.dic_type_id!==''" style="margin-top:10px;">
                                        <el-checkbox :indeterminate="dictIndeterminate" v-model="dictIndeterminateCheckAll" v-on:change="handleDictIndeterminateCheckAll">全选</el-checkbox>
                                    </div>
                                    <div class="f-label-config-data-dic-checkbox">
                                        <el-checkbox-group v-model="dictChecked" v-on:change="handledDictCheckedChange">
                                            <el-checkbox v-for="par in dictPars" :label="par.dic_par_id" :key="par.dic_par_id">{{par.dic_par_name}}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                                <div v-else-if="tempDataSourceConfig.data_source_type===DataSourceType.Custom" class="f-label-config-data-type">
                                    <el-form :model="tempDataSourceConfig" ref="dynamicValidateForm" label-width="80px">
                                        <el-form-item prop="value"
                                                      label="数据值"
                                                      :rules="[{ required: true, message: '请输入数据值', trigger: 'blur' }]">
                                            <el-input v-model="tempDataSourceConfig.value" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="separator"
                                                      label="分割符"
                                                      :rules="[{ required: true, message: '请输入分割符', trigger: 'blur' }]">
                                            <el-input v-model="tempDataSourceConfig.separator"></el-input>
                                        </el-form-item>
                                        <el-form-item label="结果预览">
                                            <span v-text="getDataSourceConfigCustomResult()"></span>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div v-else-if="tempDataSourceConfig.data_source_type===DataSourceType.DataApi" class="f-label-config-data-type">
                                    <div>
                                        <span>数据源</span>
                                        <el-select v-model="tempDataSourceConfig.api_id" v-on:change="handledDataApiChange" clearable placeholder="请选择">
                                            <el-option v-for="(api,index) in dataApis" :key="index"
                                                       :label="api.api_name"
                                                       :value="api.api_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="tempDataSourceConfig.api_id!==''" style="margin-top:10px;">
                                        <el-row v-for="(param,index) in tempDataApiParam" :key="index">
                                            <el-col :span="8" style="text-align:right;height:40px;line-height:40px;">
                                                <span v-text="param.parameter_name_chs+' ('+(param.is_required?'必填':'选填')+')'"></span>
                                            </el-col>
                                            <el-col :span="4" style="text-align:center;height:40px;line-height:40px;">
                                                <i class="iconfont icon-zhixiang" style="font-size:24px;"></i>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-select v-model="param.parameter_value" clearable filterable placeholder="请选择">
                                                    <el-option v-for="(label,index) in getLabelsExceptSelf()" :key="index"
                                                               :label="label.label_name_chs" :value="label.label_id+''"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="2" style="text-align:center;height:40px;line-height:40px;">
                                                <span v-if="param.is_required" style="color:#ff0000;">*</span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='radio'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否有边框">
                                        <el-radio-group v-model="getLabelConfigItem('border').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data">
                            </el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='checkbox'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否有边框">
                                        <el-radio-group v-model="getLabelConfigItem('border').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data">

                            </el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='time'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="占位文本">
                                        <el-input v-model="getLabelConfigItem('placeholder').value" placeholder="请输入占位文本"></el-input>
                                    </el-form-item>
                                    <el-form-item label="是否可清空">
                                        <el-radio-group v-model="getLabelConfigItem('clearable').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='date'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="占位文本">
                                        <el-input v-model="getLabelConfigItem('placeholder').value" placeholder="请输入占位文本"></el-input>
                                    </el-form-item>
                                    <el-form-item label="是否可清空">
                                        <el-radio-group v-model="getLabelConfigItem('clearable').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='switch'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="打开文字">
                                        <el-input v-model="getLabelConfigItem('active-text').value" placeholder="请输入打开时的文字"></el-input>
                                    </el-form-item>
                                    <el-form-item label="关闭文字">
                                        <el-input v-model="getLabelConfigItem('inactive-text').value" placeholder="请输入关闭时的文字"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='input_number'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="占位文本">
                                        <el-input v-model="getLabelConfigItem('placeholder').value" placeholder="请输入占位文本"></el-input>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="按钮位置">
                                        <el-radio-group v-model="getLabelConfigItem('controls-position').value">
                                            <el-radio label="normal">常规</el-radio>
                                            <el-radio label="right">靠右</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="数值精度">
                                        <el-input v-model="getLabelConfigItem('precision').value" placeholder="请输入数值精度"></el-input>
                                    </el-form-item>
                                    <el-form-item label="最小值">
                                        <el-input v-model="getLabelConfigItem('min').value" placeholder="请输入最小值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="最大值">
                                        <el-input v-model="getLabelConfigItem('max').value" placeholder="请输入最大值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="步长">
                                        <el-input v-model="getLabelConfigItem('step').value" placeholder="请输入步长"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='slider'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="最小值">
                                        <el-input v-model="getLabelConfigItem('min').value" placeholder="请输入最小值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="最大值">
                                        <el-input v-model="getLabelConfigItem('max').value" placeholder="请输入最大值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="步长">
                                        <el-input v-model="getLabelConfigItem('step').value" placeholder="请输入步长"></el-input>
                                    </el-form-item>
                                    <el-form-item label="是否显示断点">
                                        <el-radio-group v-model="getLabelConfigItem('show-stops').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否显示提示">
                                        <el-radio-group v-model="getLabelConfigItem('show-tooltip').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="格式化提示">
                                        <el-input v-model="getLabelConfigItem('format-tooltip').value" placeholder="请输入格式化提示"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='rate'">
                            <el-tab-pane label="常规" name="normal">
                                <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                                    <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                        <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分组名称">
                                        <el-input v-model="currentLabelData.label_config.control_config.group_name" placeholder="请输入分组名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="默认值">
                                        <el-input v-model="currentLabelData.default_value" placeholder="请输入默认值"></el-input>
                                    </el-form-item>
                                    <el-form-item label="数据类型">
                                        <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                            <el-option v-for="(value,key) in DataType" :key="value"
                                                       :label="key" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="是否只读">
                                        <el-radio-group v-model="getLabelConfigItem('readonly').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="是否可半选">
                                        <el-radio-group v-model="getLabelConfigItem('allow-half').value">
                                            <el-radio :label="false">否</el-radio>
                                            <el-radio :label="true">是</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="最大值">
                                        <el-input v-model="getLabelConfigItem('max').value" placeholder="请输入最大值"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='map_baidu'">
                            <el-tab-pane label="常规" name="normal"></el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                        <el-tabs v-model="tabActiveName" v-else-if="currentLabelData.label_config.control_config.control_type==='map_gis'">
                            <el-tab-pane label="常规" name="normal"></el-tab-pane>
                            <el-tab-pane label="验证" name="validator"></el-tab-pane>
                            <el-tab-pane label="数据源" name="data"></el-tab-pane>
                            <el-tab-pane label="关联" name="relate"></el-tab-pane>
                            <el-tab-pane label="格式化" name="format"></el-tab-pane>
                        </el-tabs>
                    </div>
                    <div v-else-if="currentLabelData.label_type===LabelType.variable">
                        <div class="form-config-right-content-btn">
                            <el-button type="danger" v-on:click="removeLabel" size="mini" circle title="删除"><i class="iconfont icon-huishouzhan"></i></el-button>
                            <el-button type="primary" v-on:click="saveLabelConfig" size="mini" circle title="保存"><i class="iconfont icon--baocun"></i></el-button>
                        </div>
                        <div class="form-config-right-edit-top-border"></div>
                        <el-form :ref="'Form'+currentLabelData.label_id" :model="currentLabelData" label-width="120px">
                            <el-form-item label="标签中文名" prop="label_name_chs" :rules="[{ required: true, message: '请输入标签中文名', trigger: 'blur' }]">
                                <el-input v-model="currentLabelData.label_name_chs" placeholder="请输入标签中文名"></el-input>
                            </el-form-item>

                            <el-form-item label="数据类型">
                                <el-select v-model="currentLabelData.data_type" placeholder="请选择数据类型">
                                    <el-option v-for="(value,key) in DataType" :key="value"
                                               :label="key" :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否传出参数">
                                <el-radio-group v-model="currentLabelData.label_config.is_parameter">
                                    <el-radio :label="false">否</el-radio>
                                    <el-radio :label="true">是</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="取值方式">
                                <el-select v-model="currentLabelData.label_config.value_method">
                                    <el-option v-for="(value,key) in ValueMethod" :key="value"
                                               :label="key" :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="值" v-if="currentLabelData.label_config.value_method===ValueMethod.Const">
                                <el-input v-model="currentLabelData.default_value" placeholder="请输入内容" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="值" v-else>
                                <el-input placeholder="请输入内容"
                                          v-model="currentLabelData.default_value"
                                          v-on:focus="formulaDataVisible=true"
                                          clearable
                                          style="width:270px;"></el-input>
                                <el-button type="text" v-on:click="formulaExampleDataVisible=true">点击参考</el-button>
                            </el-form-item>
                        </el-form>
                        <el-dialog title="设置公式"
                                   :visible.sync="formulaDataVisible"
                                   width="50%">
                            <div style="display:flex;">
                                <div style="flex:0 0 220px;">
                                    <div>
                                        <el-button style="margin:0 0 10px 10px;" v-on:click="formulaDataOperation(Operation.Plus)">
                                            <i class="iconfont icon-yunsuan-jia"></i>
                                        </el-button>
                                        <el-button style="margin:0 0 10px 10px;" v-on:click="formulaDataOperation(Operation.Minus)">
                                            <i class="iconfont icon-yunsuan-jian"></i>
                                        </el-button>
                                        <el-button style="margin:0 0 10px 10px;" v-on:click="formulaDataOperation(Operation.Multiply)">
                                            <i class="iconfont icon-yunsuan-cheng"></i>
                                        </el-button>
                                    </div>
                                    <div>
                                        <el-button style="margin:0 0 10px 10px;" v-on:click="formulaDataOperation(Operation.Divide)">
                                            <i class="iconfont icon-yunsuan-chu"></i>
                                        </el-button>
                                        <el-button style="margin:0 0 10px 10px;" v-on:click="formulaDataOperation(Operation.LeftParentheses)">
                                            <i class="iconfont icon-yunsuan-zuokuohao"></i>
                                        </el-button>
                                        <el-button style="margin:0 0 10px 10px;" v-on:click="formulaDataOperation(Operation.RightParentheses)">
                                            <i class="iconfont icon-yunsuan-youkuohao"></i>
                                        </el-button>
                                    </div>
                                    <div>
                                        <vue-scrollbar classes="formula-data-scrollbar" ref="FormulaDataScrollbar">
                                            <div class="scroll-me">
                                                <div v-for="(item,index) in getLabelsExceptSelf()" :key="index"
                                                     v-on:click="formulaDataLabelClick(item)"
                                                     style="padding:5px 10px;cursor:pointer;">
                                                    <span style="color:#e6a23c;">@@</span><span v-text="item.label_name_chs"></span>
                                                </div>
                                            </div>
                                        </vue-scrollbar>
                                    </div>
                                </div>
                                <div style="flex:1">
                                    <div style="text-align:right;margin-bottom:10px;">
                                        <el-button title="清除" type="warning" style="font-size:17px;" v-on:click="formulaDataClear">C</el-button>
                                        <el-button title="撤回" v-on:click="formulaDataReturnBack">
                                            <i class="iconfont icon-chexiao"></i>
                                        </el-button>
                                    </div>
                                    <el-input type="textarea"
                                              :autosize="{ minRows: 8, maxRows: 12}"
                                              resize="none"
                                              placeholder="请输入公式"
                                              v-on:change="formulaDataChange"
                                              v-model="currentLabelData.default_value">
                                    </el-input>
                                </div>
                            </div>
                        </el-dialog>
                        <el-dialog title="参考公式"
                                   :visible.sync="formulaExampleDataVisible"
                                   width="50%">
                            <el-table :data="formulaExampleData"
                                      border
                                      style="width: 100%">
                                <el-table-column prop="name"
                                                 label="名称"
                                                 width="180">
                                </el-table-column>
                                <el-table-column prop="example"
                                                 label="例子">
                                </el-table-column>
                            </el-table>
                        </el-dialog>
                    </div>
                    <div v-else-if="currentLabelData.label_type===LabelType.condition">
                        <div class="form-config-right-content-btn">
                            <el-button type="danger" v-on:click="removeLabel" size="mini" circle title="删除"><i class="iconfont icon-huishouzhan"></i></el-button>
                            <el-button type="primary" v-on:click="saveLabelConfig" size="mini" circle title="保存"><i class="iconfont icon--baocun"></i></el-button>
                        </div>
                        <div class="form-config-right-edit-top-border"></div>
                    </div>
                    <div v-else style="padding:150px 0;text-align:center;color:#808080;">
                        请选择一个标签进行编辑
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>

<script>
    import PaperHeader from '../components/PaperHeader'
    import LabelTemplate from '../components/LabelTemplate'
    import draggable from 'vuedraggable'
    import vue2Scrollbar from 'vue2-scrollbar'
    import {mapGetters} from 'vuex'
    import {FormComponents,DataType,LabelType,RelateRule,ValueMethod,DataSourceType,RelateType,ValidatorType,Operation,FormulaExampleData} from '../config/emnu'
    import {getPropByValue,clone}from '../utils/tools'
    export default {
        name: "formEdit",
        components:{
            'paper-header':PaperHeader,
            'label-template':LabelTemplate,
            'draggable':draggable,
            'vue-scrollbar':vue2Scrollbar
        },
        computed:{
            ...mapGetters(['width','height']),
            dictParIds() {
                let result = []
                this.dictPars.forEach(item => {
                    result.push(item.dic_par_id)
                })
                return result
            },
        },
        data(){
            return{
                FormComponents: FormComponents,
                DataType: DataType,
                LabelType: LabelType,
                RelateRule: RelateRule,
                ValueMethod: ValueMethod,
                DataSourceType: DataSourceType,
                RelateType: RelateType,
                ValidatorType: ValidatorType,
                Operation: Operation,
                activeComponentsName: '表单标签',
                setLableList: [],
                currentLabelData: {},
                currentLabelindex: -1,
                oldLabelData: {},
                oldIndex: -1,
                labelActiveName: 'control',
                tabActiveName: 'normal',
                labelEditChange: true,
                formId: parseInt(this.$route.params.id),

                //添加关联dialog
                relateAddDialog: false,
                //添加关联form
                relateAddForm: {
                    relateName: '',
                    relate_type: RelateType.combine,
                    condition: {
                        condition_expr: '',
                        condition_item: {
                            value_method: '',
                            inner_value:''
                        }
                    }
                },
                //添加验证dialog
                validatorAddDialog: false,
                //添加验证form
                validatorAddForm: {
                    validatorName: '',
                    validatorType: '',
                    numberMin: '',
                    numberMax: '',
                    lengthMin: '',
                    lengthMax: '',
                    compareTarget: '',
                    compareType: '',
                    regular: '',
                    errorMessage:''
                },
                //临时的数据源设置
                tempDataSourceConfig: {
                    data_source_type: '',
                    dic_type_id: '',
                    dic_par_ids: '',
                    separator: '',
                    value: '',
                    api_id: '',
                    api_name: '',
                    request_parameter_map: []
                },
                tempApiIdBak:'',
                dictIndeterminate: false,
                dictIndeterminateCheckAll: false,
                dictChecked: [],
                //Dict数据源
                dictList: [],
                dictPars:[],
                //Api数据源
                dataApis: [],
                //临时的数据源api参数设置
                tempDataApiParam: [],
                formulaExampleData: FormulaExampleData,
                formulaExampleDataVisible: false,
                formulaDataVisible: false,
                formulaDataBak: [],
            }
        },
        methods:{
            returnBack(){
                this.$router.back()
            },
            //更新Label
            updateData(evt) {
                this.updateSort()
                console.log(this.setLableList)
            },
            //新增Label
            addData(evt) {
                this.setLableList = clone(this.setLableList)
                for (let i = 0; i < this.setLableList.length; i++) {
                    if (this.setLableList[i].label_id === 0) {
                        this.setLableList[i].form_id = this.formId
                        this.$post('/api/Form/AddLabel', this.setLableList[i], () => {
                            this.setLableList.splice(i, 1)
                        }).then(
                            res => {
                                this.setLableList[i].label_id = res
                                this.updateSort()
                            }
                        )
                    }
                }
                console.log(this.setLableList)
            },
            //更新排序
            updateSort() {
                let sort=0
                this.setLableList.forEach(item => {
                    if (item.label_type === LabelType.control) {
                        if (item.label_config.label_sort !== sort) {
                            item.label_sort = sort
                            this.saveLabel(item)
                        }
                        sort++
                    }

                })
            },
            //保存Label
            saveLabel(label) {
                this.$post('/api/Form/SaveLabel', label).then(
                    res => {
                        console.log('保存Label', res)
                        this.oldLabelData = clone(label)
                    }
                )
            },
            //选择Label
            settingData(index) {
                if (this.currentLabelindex !== -1 && JSON.stringify(this.oldLabelData) !== JSON.stringify(this.currentLabelData)) {
                    this.$confirm('未保存, 继续将不会保存更改！', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.setLableList[this.oldIndex] = this.oldLabelData
                        this.currentLabelindex = index
                        this.currentLabelData = this.setLableList[index]
                        this.oldIndex = index
                        this.oldLabelData = clone(this.currentLabelData)
                        this.tabActiveName='normal'
                        this.labelEditChange = false
                        setTimeout(() => { this.labelEditChange = true }, 0)
                    }).catch(() => {
                    })
                } else {
                    this.currentLabelindex = index
                    this.currentLabelData = this.setLableList[index]
                    this.oldIndex = index
                    this.oldLabelData = clone(this.currentLabelData)
                    this.labelEditChange = false
                    this.tabActiveName = 'normal'
                    setTimeout(() => { this.labelEditChange = true }, 0)
                }
                this.initDataSourceConfig()
            },
            //初始化DataSourceConfig
            initDataSourceConfig() {
                this.dictPars.splice(0, this.dictPars.length)
                if (this.currentLabelData.label_config.data_source) {
                    for (let pro in this.currentLabelData.label_config.data_source) {
                        if (pro === 'dic_par_ids') {
                            this.dictChecked = this.currentLabelData.label_config.data_source[pro].split(',').map(Number)
                            this.dictIndeterminateCheckAll = this.dictChecked.length === this.dictPars.length
                        } else {
                            this.tempDataSourceConfig[pro] = this.currentLabelData.label_config.data_source[pro]
                        }
                    }
                    if (this.tempDataSourceConfig.api_id) {
                        this.handledDataApiChange(this.tempDataSourceConfig.api_id)
                    }
                    if (this.tempDataSourceConfig.dic_type_id) {
                        this.getDictPars()
                    }
                } else {
                    this.tempDataSourceConfig = {
                        data_source_type: '',
                        dic_type_id: '',
                        dic_par_ids: '',
                        separator: '',
                        value: '',
                        api_id: '',
                        api_name: '',
                        parameter_list: []
                    }
                }
            },
            //数据源类型更改回调
            handledDataTypeChange(val) {
                this.tempDataSourceConfig = {
                    data_source_type: val,
                    dic_type_id: '',
                    dic_par_ids: '',
                    separator: '',
                    value: '',
                    api_id: '',
                    api_name: '',
                    request_parameter_map: []
                }
                this.tempDataApiParam.splice(0, this.tempDataApiParam.length)
            },
            //数据源类型-字典类型更改回调
            handledDictTypeChange(val) {
                this.getDictPars(() => {
                    this.dictChecked.splice(0, this.dictChecked.length)
                    if (this.currentLabelData.label_config.data_source.dic_type_id === val) {
                        this.dictChecked = this.currentLabelData.label_config.data_source.dic_par_ids.split(',').map(Number)
                    }
                    this.dictIndeterminateCheckAll = this.dictChecked.length === this.dictPars.length
                })
            },
            //数据源类型-字典类型-全选点击
            handleDictIndeterminateCheckAll(val) {
                this.dictChecked = val ? this.dictParIds : []
                this.dictIndeterminate = false
            },
            //数据源类型-字典类型-复选框更改回调
            handledDictCheckedChange(value) {
                let checkedCount = value.length
                this.dictIndeterminateCheckAll = checkedCount === this.dictPars.length
                this.dictIndeterminate = checkedCount > 0 && checkedCount < this.dictPars.length
            },
            //数据源类型-自定义类型-结果预览
            getDataSourceConfigCustomResult() {
                let result=''
                if (this.tempDataSourceConfig.value !== '' && this.tempDataSourceConfig.separator !== '') {
                    let arr = this.tempDataSourceConfig.value.split(this.tempDataSourceConfig.separator)
                    arr.forEach(item => {
                        if (result === '') {
                            result += '"' + item + '"'
                        } else {
                            result += ',"' + item + '"'
                        }

                    })
                }
                return '[' + result+']'
            },
            //数据源类型-api类型更改回调
            handledDataApiChange(val) {
                this.tempDataApiParam.splice(0, this.tempDataApiParam.length)
                this.dataApis.forEach(item => {
                    if (item.api_id === val) {
                        if (this.currentLabelData.label_config.data_source &&
                            this.currentLabelData.label_config.data_source.api_id &&
                            this.currentLabelData.label_config.data_source.api_id === val) {
                            item.request_parameter_list.forEach(_item => {
                                this.tempDataApiParam.push({
                                    parameter_name: _item.parameter_name,
                                    parameter_name_chs: _item.parameter_name_chs,
                                    is_required: _item.is_required,
                                    parameter_value: this.currentLabelData.label_config.data_source.request_parameter_map[_item.parameter_name]
                                })
                            })
                        } else {
                            item.request_parameter_list.forEach(_item => {
                                this.tempDataApiParam.push({
                                    parameter_name: _item.parameter_name,
                                    parameter_name_chs: _item.parameter_name_chs,
                                    is_required: _item.is_required,
                                    parameter_value: ''
                                })
                            })
                        }
                    }
                })
            },
            getApiName(api_id) {
                let result=''
                this.dataApis.forEach(item => {
                    if (item.api_id === api_id) {
                        result=item.api_name
                    }
                })
                return result
            },
            //获取标签项
            getLabelConfigItem(attr) {
                let option = null
                this.currentLabelData.label_config.control_config.control_options.forEach(item => {
                    if (item.key === attr) {
                        option = item
                    }
                })
                return option
            },
            //保存标签配置
            saveLabelConfig() {
                this.$refs['Form' + this.currentLabelData.label_id].validate((valid) => {
                    if (valid) {
                        this.currentLabelData.label_config.data_source = null
                        let errMessage=''
                        if (this.tempDataSourceConfig.data_source_type === DataSourceType.Custom) {
                            this.$refs.dynamicValidateForm.validate(valid => {
                                if (valid) {
                                    this.currentLabelData.label_config.data_source = {
                                        data_source_type: this.tempDataSourceConfig.data_source_type,
                                        separator: this.tempDataSourceConfig.separator,
                                        value: this.tempDataSourceConfig.value
                                    }
                                } else {
                                    errMessage='自定义数据源配置错误！'
                                }
                            })

                        } else if (this.tempDataSourceConfig.data_source_type === DataSourceType.Dict) {
                            if (this.tempDataSourceConfig.dic_type_id !== '' && this.dictChecked.length > 0) {
                                this.currentLabelData.label_config.data_source = {
                                    data_source_type: this.tempDataSourceConfig.data_source_type,
                                    dic_type_id: this.tempDataSourceConfig.dic_type_id,
                                    dic_par_ids: this.dictChecked.join(',')
                                }
                            } else {
                                errMessage = '字典数据源配置错误！'
                            }
                        } else if (this.tempDataSourceConfig.data_source_type === DataSourceType.DataApi) {
                            if (this.tempDataSourceConfig.api_id !== '') {
                                let flag = true
                                let parameter_list = {}
                                this.tempDataApiParam.forEach(item => {
                                    if (item.is_required && item.parameter_value === '') {
                                        flag = false
                                    }
                                    parameter_list[item.parameter_name] = item.parameter_value
                                })
                                if (!flag) {
                                    errMessage = 'Api数据源配置错误！'
                                } else {
                                    this.currentLabelData.label_config.data_source = {
                                        data_source_type: this.tempDataSourceConfig.data_source_type,
                                        api_id: this.tempDataSourceConfig.api_id,
                                        api_name: this.getApiName(this.tempDataSourceConfig.api_id),
                                        request_parameter_map: parameter_list
                                    }
                                }
                            } else {
                                errMessage = 'Api数据源配置错误！'
                            }
                        }
                        if (errMessage !== '') {
                            this.$message({
                                type:'error',
                                message:errMessage
                            })
                        } else {
                            this.saveLabel(this.currentLabelData)
                        }
                    }
                })
            },
            //删除标签
            removeLabel() {
                this.$confirm('此操作将移除该组件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        labelId: this.currentLabelData.label_id
                    }
                    this.$get('/api/Form/DelLabel', param).then(
                        res => {
                            console.log('删除标签', res)
                            this.currentLabelindex = -1
                            this.currentLabelData = {}
                            this.getLabelList()
                        }
                    )
                }).catch(() => {
                })
            },
            //获取LabelList
            getLabelList() {
                let param = {
                    formId: this.formId
                }
                this.$get('/api/Form/GetLabelList', param).then(
                    res => {
                        console.log('获取LabelList',res)
                        this.setLableList=res
                    }
                )
            },
            //获取Form
            getForm() {
                let param = {
                    formId: this.formId
                }
                this.$get('/api/Form/Get', param).then(
                    res => {
                        console.log('获取Form',res)
                    }
                )
            },
            //获取除了自己的所有标签
            getLabelsExceptSelf() {
                let result=[]
                this.setLableList.forEach(item => {
                    if (item.label_id !== this.currentLabelData.label_id) {
                        result.push(item)
                    }
                })
                return result
            },
            //根据label_id获取标签
            getLabelByLabelId(label_id) {
                let result = null
                this.setLableList.forEach(item => {
                    if (item.label_id === label_id) {
                        result = item
                    }
                })
                return result
            },
            //添加验证dialog关闭回调
            validatorAddDialogClose() {
                this.$refs.ValidatorAddForm.resetFields()
            },
            //新增验证关联
            validatorAdd() {
                this.$refs.ValidatorAddForm.validate(valid => {
                    if (valid) {

                    }
                })
            },
            //添加关联dialog关闭回调
            relateAddDialogClose() {
                this.$refs.RelateAddForm.resetFields()
            },
            //新增关联
            relateAdd() {
                this.$refs.RelateAddForm.validate(valid => {
                    if (valid) {
                        let relate = {
                            label_id: this.currentLabelData.label_id,
                            relate_name: this.relateAddForm.relateName,
                            operator_str: this.relateAddForm.operatorStr,
                            label: this.getLabelByLabelId(this.relateAddForm.label)
                        }
                        if (this.currentLabelData.label_config.relate_config) {
                            this.currentLabelData.label_config.relate_config.relate_list.push(relate)
                        } else {
                            this.currentLabelData.label_config.relate_config = {
                                relate_list: [relate]
                            }
                        }
                        this.relateAddDialog = false
                    }
                })
            },
            //删除关联
            relateDelete(index) {
                this.currentLabelData.label_config.relate_config.relate_list.splice(index,1)
            },
            //获取关联操作名称
            getRelateRuleProp(val) {
                return getPropByValue(this.RelateRule, val)
            },
            //获取数据源
            getDataApi() {
                let param = { name: '' }
                this.$get('/api/DataApi/Index', param).then(
                    res => {
                        this.dataApis = res
                        console.log('DataApi',res)
                    }
                )
            },
            //变量公式取值-公式撤回
            formulaDataReturnBack() {
                this.currentLabelData.default_value = ''
                if (this.formulaDataBak.length > 0) {
                    this.formulaDataBak.splice(this.formulaDataBak.length - 1, 1)
                }
                if (this.formulaDataBak.length > 0) {
                    this.currentLabelData.default_value = this.formulaDataBak[this.formulaDataBak.length - 1]
                }

            },
            //变量公式取值-公式按钮
            formulaDataOperation(operation) {
                let str=''
                switch (operation) {
                    case Operation.Plus:
                        str = '+'
                        break;
                    case Operation.Minus:
                        str = '-'
                        break;
                    case Operation.Multiply:
                        str = '*'
                        break;
                    case Operation.Divide:
                        str = '/'
                        break;
                    case Operation.LeftParentheses:
                        str = '('
                        break;
                    case Operation.RightParentheses:
                        str = ')'
                        break;
                }
                if (this.currentLabelData.default_value) {
                    this.currentLabelData.default_value += str
                } else {
                    this.currentLabelData.default_value = str
                }
                this.formulaDataBak.push(this.currentLabelData.default_value)
            },
            //变量公式取值-变量
            formulaDataLabelClick(item) {
                if (this.currentLabelData.default_value) {
                    this.currentLabelData.default_value += ' @' + item.label_name_chs + ' '
                } else {
                    this.currentLabelData.default_value = ' @' + item.label_name_chs + ' '
                }
                this.formulaDataBak.push(this.currentLabelData.default_value)
            },
            //变量公式取值-清除
            formulaDataClear() {
                this.currentLabelData.default_value = ''
                this.formulaDataBak.splice(0,this.formulaDataBak.length)
            },
            //变量公式取值-更新
            formulaDataChange(value) {
                this.formulaDataBak.push(this.currentLabelData.default_value)
            },
            //获取字典
            getDictList() {
                this.$get('/api/Data/GetDictTypeList').then(
                    res => {
                        this.dictList=res
                        console.log('dictList', res)
                    }
                )
            },
            getDictPars(callBack) {
                let param = {
                    dicTypeId: this.tempDataSourceConfig.dic_type_id
                }
                this.$get('/api/Data/GetDictList',param).then(
                    res => {
                        this.dictPars = res
                        console.log('dictPars', res)
                        if (callBack)
                            callBack()
                    }
                )
            },
            //初始化界面样式
            initStyle() {
                document.getElementById('FormLabelContent').style.maxHeight = (height - 106) + 'px'
            },
        },
        mounted() {
            this.getForm()
            this.getLabelList()
            //this.getRetrieve()
            // this.initStyle()
            this.getDataApi()
            this.getDictList()
        }
    }
</script>

<style lang="less" scoped>
    .content{
        padding: 0 20px;
        overflow-y: auto;
    }
    .form-config-left{
        float: left;
        .form-config-left-item {
            width:116px;
            padding: 8px 0;
            text-align: center;
            border: 2px solid #bbbabb;
            border-radius: 4px;
            font-size: 14px;
            margin: 5px;
            cursor: grab;
            float:left;
        }
    }
    .form-config-center{
        float: left;
        padding: 10px;
        margin: 0 10px;
        border: 1px solid #bbbabb;
        .form-config-center-row-ghost {
            border: 1px dashed #ff714b;
            height: 40px;
        }
        .form-config-center-row {
            cursor: move;
        }

        .form-config-center-row:hover {
            background: #f5f7fa;
        }

        .form-config-center-row .form-config-center-label, .form-config-center-row .form-config-center-control {
            width: 95%;
            line-height: 36px;
            padding: 10px 0;
            vertical-align: middle;
            display: inline-block;
        }

        .form-config-center-row .form-config-center-label {
            width: 90%;
            text-align: right;
            cursor: move;
        }

        .row-active {
            background: #ecf5ff;
        }
    }
    .form-config-right{
        float: left;
        position: relative;
    }
    .f-data-show-model {
        font-size: 12px;
        color: #606266;
        margin: 0 10px;
    }

    .f-data-show-model label {
        margin-right: 10px;
    }
    .f-param-set {
        font-size: 12px;
        color: #606266;
        display: inline-block;
        margin: 0 10px;
    }

    .form-config-right-content-btn {
        position: absolute;
        top: 0;
        right: 0;
        text-align: right;
        z-index: 999;
    }
    .form-config-right-edit-top-border{
        height: 38px;
        margin: 0 0 15px;
        border-bottom: 2px solid #e4e7ed;
    }
    .f-label-config-data-type {
        margin:20px 5px;
    }
    .f-label-config-data-dic-checkbox .el-checkbox {
        margin-top: 10px;
        margin-left: 30px;
        margin-right:0;
    }

    .form-label-type-tab {
        margin:0 3px;
    }
    .form-label-type-tab .el-tabs__header {
        margin:0;
    }
    .formula-data-scrollbar {
        height:200px;
    }
</style>