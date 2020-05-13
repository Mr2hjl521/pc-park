<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 车场模式</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                 <el-form ref="form" :model="modeForm" label-width="100px">
                    <el-form-item label="场地免费模式">
                        <el-switch v-model="modeForm.freeMode"></el-switch>
                    </el-form-item>
                    <el-form-item label="场地抬杆模式">
                        <el-switch v-model="modeForm.openMode"></el-switch>
                    </el-form-item>
                    <el-form-item label="场地关闭模式">
                        <el-switch v-model="modeForm.closeMode"></el-switch>
                    </el-form-item>
                    <el-form-item label="场地禁入模式">
                        <el-switch v-model="modeForm.noEnterMode"></el-switch>
                    </el-form-item>
                    <el-form-item label="场地禁出模式">
                        <el-switch v-model="modeForm.noOutMode"></el-switch>
                    </el-form-item>
                     <el-form-item label="纳入车位统计">
                        <el-switch v-model="modeForm.nocar"></el-switch>
                    </el-form-item>
                     <el-form-item label="允许负车位">
                        <el-switch v-model="modeForm.nocarmodule"></el-switch>
                    </el-form-item>
                    <el-form-item label="无效卡放行">
                        <el-switch v-model="modeForm.invalidRelease" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                    <el-button type="primary" @click="saveMode">保存</el-button>
                </el-form> 
                <!--<el-checkbox v-model="checked">场地免费模式</el-checkbox>
                <br>
                <br>
                <br>
                 <el-checkbox v-model="checked">场地抬杆模式</el-checkbox>
                <br>
                <br>
                <br>
                 <el-checkbox v-model="checked">场地关闭模式</el-checkbox>
                <br>
                <br>
                <br>
                 <el-checkbox v-model="checked">场地禁入模式</el-checkbox>
                <br>
                <br>
                <br>
                 <el-checkbox v-model="checked">场地禁出模式</el-checkbox>
                <br>
                <br>
                <br>
                 <el-checkbox v-model="checked">纳入车位统计</el-checkbox>
                <br>
                <br>
                <br> 
                <el-checkbox v-model="checked">允许负车位</el-checkbox>
                <br>
                <br>
                <br>
                <el-checkbox v-model="checked">无效卡放行</el-checkbox>
                <br>
                <br>
                <br>
                <el-button type="primary" @click="saveMode">保存</el-button>-->
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'baseform',
        data: function(){
            return {
                modeForm:{
                    freeMode: false,
                    openMode: false,
                    closeMode: false,
                    noEnterMode: false,
                    noOutMode: false,
                    invalidRelease: false,
                    nocar:false,
                    nocarmodule:false
                }
            }
        },
        created(){
            this.getModeDate();
        },
        methods: {
            saveMode() {
                var res = this;
                this.$axios({
                    url: 'parking/saveMode',
                    method: 'post',
                    data:res.modeForm
                }).then(function (response) {
                    console.log(response);
                if (response.status <= 200) {
                    res.$message.success('执行成功!');
                }
                }).catch(function (error) {
                    res.$message.error('执行失败: '+error);
                    console.log(error);
                });
            },
            getModeDate(){
                var res = this;
                this.$axios({
                    url: 'parking/getModeDate',
                    method: 'post'
                }).then(function (response) {
                    console.log(response);
                if (response.status <= 200) {
                    console.log(response.data)
                    res.modeForm = response.data;
                }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
</script>
<style  scoped>
   .nserder{
 text-align: center
}
</style>