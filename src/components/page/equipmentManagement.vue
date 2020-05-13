<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 设备管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
       <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>
      <el-row  class="icon-elrow">
        <div class="icon-headDiv" v-if="cache=='admin'">昆山</div>
          <el-col :span="7"   class="icon-el-col" v-for="(item,index) in this.tabal" :key="item.index">
            <div class="handle-box">
              <div class="icon-div">
                  <p style="margin-top:3px" :class="[item.jcAccess=='进口'?'addclass':'addclassA']">名称：{{item.jcName}}</p>
                  <p>编号：{{item.jcCamerasId}}</p>
                  <p>状态：{{item.jcCode}}</p>
                  <p>异常：<span :class="{'active':item.jcIpAddress=='error'}">{{item.jcIpAddress}}</span></p>
              </div>
              <div class="icon-divv">
                  <p><el-button type="primary" @click="addlift(index)">抬杆</el-button></p>
                  <p><el-button type="primary" @click="addfall(index)">落杆</el-button></p>
                  <p><el-button type="primary">重启</el-button></p>  
              </div>
          </div>
          </el-col>
        <div class="icon-headDiv" v-if="cache=='admin'">吴江</div>
            <el-col :span="7"   class="icon-el-col" v-for="(item,index) in this.tableData" :key="item.index">
            <div class="handle-box">
              <div class="icon-div">
                  <p style="margin-top:3px">名称：{{item.jcName}}</p>
                  <p>编号：{{item.jcCamerasId}}</p>
                  <p>状态：{{item.jcCode}}</p>
                  <p>异常：<span :class="{'active':item.jcIpAddress=='error'}">{{item.jcIpAddress}}</span></p>
              </div>
              <div class="icon-divv">
                  <p><el-button type="primary" @click="addlift(index)">抬杆</el-button></p>
                  <p><el-button type="primary" @click="addfall(index)">落杆</el-button></p>
                  <p><el-button type="primary">重启</el-button></p> 
              </div>
          </div>
          </el-col>
      </el-row>
    </div>
   
  </div>
</template>

<script>
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "carManager",
  data() {
     return{
        tabal:[],
        tableData:[],
        cache:localStorage.getItem("ms_username")
     }
  },
  created() {
    this.getdata()
  },
  
  methods: {
    refresh(){
       this.getdata()
    },
    //落竿
    addfall(value){
        var res=this
        var thandle=Number(this.tabal[value].jcThandle)
        var jcParking=this.tabal[value].jcParking
       this.$axios({
         url:"jinshiCameras/closeGateSend?thandle="+thandle+"&jcParking="+jcParking,
         method:"get",
       }).then(function(response){
          res.$message.success("落杆成功")
         
       }).catch(function(error){
           res.$message.error("抬杆成功")
       })
    },
    //抬竿
    
    addlift(value){
        var res=this
       
        var thandle=Number(this.tabal[value].jcThandle)
        var jcParking=this.tabal[value].jcParking
       this.$axios({
         url:"jinshiCameras/openGateSend?thandle="+thandle+"&jcParking="+jcParking,
         method:"get",
       }).then(function(response){
           res.$message.success("抬杆成功")
         
       }).catch(function(error){
           res.$message.error("抬杆成功")
       })
    },
    //查询所有数据
     getdata(){
       console.log(this.cache)
       var res=this
       var self=this
       this.$axios({
         url:"jinshiCameras/selectCameras",
         method:"post",
         data:{
            username:localStorage.getItem("ms_username")
         }
       }).then(function(response){
          console.log(response)
          if(res.cache=="admin"){
              res.tabal=response.data.parkKS
              res.tableData=response.data.parkWJ
          }else{
              res.tabal=response.data.park
          }
          
          setTimeout(function() {
              self.getdata();
            }, 3000);
       }).catch(function(error){
          console.log(error)
       })
     }
    //每页显示个数改变
  }
}
</script>

<style scoped>
.huizong {
  height: 30px;
  width: 400px;
  position: relative;
}
.huizong span {
  height: 30px;
  width: 400px;
  position: absolute;
  bottom: -60px;
  z-index: 999;
}
.sousuo {
  margin-right: 10px;
}
.handle-box {
  width:100%;
  height: 200px;
  margin-bottom:30px;
  border: 1px solid black;
   border-radius: 10px;
}
.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.outup {
  font-size: 12px;
  color: #fff;
  background-color: #409eff;
  display: inline-block;
  border-radius: 3px;
  padding: 8px 15px;
  margin-left: 5px;
}
.upload-demo {
  height: 30px;
  width: 100px;
  display: inline-block;
}
.inup {
  margin-top: 10px;
}
.el-upload--text {
  width: 60px;
  height: 30px;
  display: inline-block;
  border: 0;
  overflow: visible;
}
.huizong>span{
  word-spacing: 20px;
}
.nesper{
  word-spacing: 15px;
}
.nserder{
  text-align: center
}
.icon-div{
    width: 70%;
    height: 150px;
    float: left;
}
.icon-divv{
     width: 30%;
    text-align: center;
    line-height: 68px;
    height: 150px;
    float: left;
}
.icon-div{
    line-height: 49px;
    font-size: 16px;
}
.icon-div>p{
    margin-left: 10px;
}
.addclass{
    color: red;
}
.addclassA{
    color: green;
}
.el-button--small, .el-button--small.is-round{
  padding: 9px 29px;
}
.el-button--mini, .el-button--small{
  font-size: 14px;
}
.carManager{
  width: 100%;
  height: 100%;
}.active{
  color: #ff0000;
}
.icon-elrow{
  display: flex;
  justify-content:flex-start;
  flex-wrap:wrap;
}
.icon-el-col{
  margin-right: 4%;
}
.icon-headDiv{
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 30px;
}
.el-button--small, .el-button--small.is-round {
    padding: 9px 19px;
}
</style>

