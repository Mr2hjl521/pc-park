<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 收费设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo" style="margin:15px 0px 15px 15px">刷新</el-button>
<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-submenu index="1">
    <template slot="title">请选择收费类型</template>
    <el-menu-item index="11">小型车</el-menu-item>
    <el-menu-item index="12">中型车(黄牌)</el-menu-item>
    <el-menu-item index="13">大型车(黄牌)</el-menu-item>
    <el-menu-item index="14">新能源车</el-menu-item>   
    <el-menu-item index="15">特种车</el-menu-item>
  </el-submenu>
</el-menu>
<div class="line"></div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="180px" :rules="carFormRules">
                    <div>{{titleName}}</div>
                    <el-form-item label="免费时间(分钟)：" prop="freeTime">
                        <el-input v-model="form.freeTime" placeholder="请输入免费时间"></el-input>
                    </el-form-item>
                    <el-form-item label="首段时间(分钟)：" prop="firstTime">
                        <el-input v-model="form.firstTime" placeholder="请输入首段时间"></el-input>
                    </el-form-item>
                    <el-form-item label="首段收费(元):" prop="firstCharge">
                        <el-input v-model="form.firstCharge" placeholder="请输入首段收费"></el-input>
                    </el-form-item>
                    <el-form-item label="后续时间(分钟)：" prop="followTime">
                        <el-input v-model="form.followTime" placeholder="请输入后续时间"></el-input>
                    </el-form-item>
                    <el-form-item label="后续收费(元): " prop="followCharge">
                        <el-input v-model="form.followCharge" placeholder="请输入后续收费"></el-input>
                    </el-form-item>
                    <el-form-item label="24小时收费上限(元):" prop="allDayLimit">
                        <el-input v-model="form.allDayLimit" placeholder="请输入24小时收费上限"></el-input>
                    </el-form-item>
                    <el-form-item label="预付款后出场时间(分钟):" prop="payAdvanceOutTime">
                        <el-input v-model="form.payAdvanceOutTime" placeholder="预付款后出场时间"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
   
    </div>
    
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                form: {
                    freeTime: "",
                    firstTime: "",
                    firstCharge: "",
                    followTime: "",
                    followCharge: "",
                    allDayLimit: '',
                    payAdvanceOutTime: ''
                },
                activeIndex: 11,
                titleName:'小型车',
                carFormRules:{
                    freeTime:[
                         { message: "请输入免费时长", required: true, trigger: "blur" },
                         { pattern: /^[0-9]+$/, message: '只允许输入数字' }
                    ],
                    firstTime:[
                         { message: "请输入首段时间", required: true, trigger: "blur" },
                         { pattern: /^[0-9]+$/, message: '只允许输入数字' }
                    ],
                    firstCharge:[
                         { message: "请输入首段收费", required: true, trigger: "blur" },
                         { pattern: /^[0-9]+$/, message: '只允许输入数字' }
                    ],
                    followTime:[
                         { message: "请输入后续时长", required: true, trigger: "blur" },
                         { pattern: /^[0-9]+$/, message: '只允许输入数字' }
                    ],
                    followCharge:[
                         { message: "请输入后续收费", required: true, trigger: "blur" },
                         { pattern: /^[0-9]+$/, message: '只允许输入数字' }
                    ],
                    allDayLimit:[
                         { message: "请输入收费上限", required: true, trigger: "blur" },
                         { pattern: /^[0-9]+$/, message: '只允许输入数字' }
                    ],
                    payAdvanceOutTime:[
                         { message: "请输入出场时间", required: true, trigger: "blur" },
                         { pattern: /^[0-9]+$/, message: '只允许输入数字' }
                    ]
                }
            }
        },
        created(){
            var res = this;
            this.titleName = "小型车";
            this.$axios({
                url: 'JinshiParkSetting/getGlobalVariable',
                method: 'post',
                data:{"carType":"11"}
            }).then(function (response) {
                if (response.status <= 200) {
                    res.form = response.data;
                    console.log(response.data,"获取所有的");
                }
            }).catch(function (error) {
                res.$message.error(error);
                console.log(error);
            });
        },
        methods: {
            refresh(){
                 var res = this;
            this.titleName = "小型车";
            this.$axios({
                url: 'JinshiParkSetting/getGlobalVariable',
                method: 'post',
                data:{"carType":"11"}
            }).then(function (response) {
                res.form={}
                if (response.status <= 200) {
                    res.form = response.data;
                    console.log(response.data,"获取所有的");
                }
            }).catch(function (error) {
                res.$message.error(error);
                console.log(error);
            })
            this.form={}
            },
            onSubmit() {
                var res = this;
                console.log(res.activeIndex)
                this.$axios({
                    url: 'JinshiParkSetting/updateJinshiParkSetting',
                    method: 'post',
                    data:{"carType":res.activeIndex,
                            freeTime:String(res.form.freeTime),
                            firstTime:String(res.form.firstTime),
                            firstCharge: String(res.form.firstCharge),
                            followTime: String(res.form.followTime),
                            followCharge: String(res.form.followCharge),
                            allDayLimit: String(res.form.allDayLimit),
                            payAdvanceOutTime: String(res.form.payAdvanceOutTime)
                    }
                }).then(function (response) {
                    if (response.status <= 200) {
                        console.log(res.activeIndex,"提交");
                        res.$message.success('修改成功！');
                    }
                }).catch(function (error) {
                    res.$message.error('修改失败： '+error);
                    console.log(error);
                });
                
            },
            handleSelect(key, keyPath) {
                var res = this;
                if(key==11){
                    this.activeIndex = 11;
                    this.titleName = "小型车";
                    this.$axios({
                        url: 'JinshiParkSetting/getGlobalVariable',
                        method: 'post',
                        data:{"carType":key}
                    }).then(function (response) {
                        if (response.status <= 200) {
                            res.form = response.data;
                            console.log(response.data,"小型车");
                        }
                    }).catch(function (error) {
                        res.$message.error(error);
                        console.log(error);
                    });
                }else if(key==12){
                    this.activeIndex = 12;
                    this.titleName = "中型车(黄牌)";
                    this.$axios({
                        url: 'JinshiParkSetting/getGlobalVariable',
                        method: 'post',
                        data:{"carType":key}
                    }).then(function (response) {
                        if (response.status <= 200) {
                            res.form = response.data;
                            console.log(response.data,"中型车");
                        }
                    }).catch(function (error) {
                        res.$message.error(error);
                        console.log(error);
                    });
                }else if(key==13){
                    this.activeIndex = 13;
                    this.titleName = "大型车(黄牌)";
                    this.$axios({
                        url: 'JinshiParkSetting/getGlobalVariable',
                        method: 'post',
                        data:{"carType":key}
                    }).then(function (response) {
                        if (response.status <= 200) {
                            res.form = response.data;
                            console.log(response.data,"大型车");
                        }
                    }).catch(function (error) {
                        res.$message.error(error);
                        console.log(error);
                    });
                }else if(key==14){
                    this.activeIndex = 14;
                    this.titleName = "新能源车";
                    this.$axios({
                        url: 'JinshiParkSetting/getGlobalVariable',
                        method: 'post',
                        data:{"carType":key}
                    }).then(function (response) {
                        if (response.status <= 200) {
                            res.form = response.data;
                            console.log(response.data,"新能源车");
                        }
                    }).catch(function (error) {
                        res.$message.error(error);
                        console.log(error);
                    });
                }else if(key==15){
                    this.activeIndex = 15;
                    this.titleName = "特种车";
                    this.$axios({
                        url: 'JinshiParkSetting/getGlobalVariable',
                        method: 'post',
                        data:{"carType":key}
                    }).then(function (response) {
                        if (response.status <= 200) {
                            res.form = response.data;
                            console.log(response.data,"特种车");
                        }
                    }).catch(function (error) {
                        res.$message.error(error);
                        console.log(error);
                    });
                }
            }
        }
    }
</script>
<style  scoped>
    .nserder{
  text-align: center
}
</style>