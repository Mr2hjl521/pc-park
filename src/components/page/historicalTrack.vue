<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 历史轨迹表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <!-- <el-button type="primary" icon="el-icon-search" @click="search(1)" class="sousuo">搜索</el-button> -->
        <el-date-picker
            v-model="valueA"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
            <el-date-picker
            style="margin:0px 10px 0px 10px"
            v-model="valueB"
            type="date"
            placeholder="选择日期">
       </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="onsearch(1)" class="icon-search">查询</el-button>
         <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index"  align="center" label="序号" width="100px" class-name="table"></el-table-column>
       
        <el-table-column prop="htCreatTime" label="时间" align="center"   class-name="table"></el-table-column>
        <el-table-column prop="htLincensePlateId" label="车牌号" align="center"  class-name="table"></el-table-column>
        <el-table-column prop="jaName" label="摄像机"  align="center" class-name="table"></el-table-column>
         <el-table-column prop="htStatus" label="轨迹信息"  align="center" class-name="table"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cur_page"
          :page-size="pagesize"
          :total="totalRecords"
          :page-sizes="[50,100]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
   
  </div>
</template>
<script>
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "carManager",
  data() {
    return {
      cur_page: 1,//分页
      pagesize: 50,//分页
      tableData:[],
      select_word:"",
      valueA:"",//开始时间
      valueB:"",//结束时间
      totalRecords:0,
      numberer:0,
      condition:0,
    }
  },
  created() {
    this.getData();
  },
  methods: {
    refresh(){
      this.getData();
      this.select_word=""
    },
    //每页显示个数改变
    handleSizeChange(val) {
       if (this.numberer == 0) {
        this.pagesize = val;
        console.log(val);
        this.getData(1);
      } else if(this.numberer==1){
        this.pagesize = val;
        this.search(1);
      }else {
        this.pagesize = val;
        this.onsearch(1);
      }
    },
    // 分页导航
    handleCurrentChange(val) {
        if(this.numberer==0){
          this.cur_page = val;
          this.getData()
      }else if(this.numberer==1){
          this.cur_page = val;
          this.search(2)
      }else{
        this.cur_page = val;
        this.onsearch(2)
      }
    },
    //table 表格
    handleSelectionChange(){

    },
    //获取所有数据
    getData(value){
       if(value==1){
        this.cur_page=1
      }
      this.numberer=0
       var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
      var nowDate = year + "-" + month + "-" + day;
      this.valueA=nowDate
      this.valueB=nowDate

        var res = this;
        this.$axios({
            url: "jinshiHistoricalTrack/selectHistoricalTrackAll",
            method: "post",
            data: { pageNum: res.cur_page, pageSize: res.pagesize, parkId: window.localStorage.getItem("parkId")}
        })
        .then(function(response) {
          if (response.status <= 200) {
              res.tableData=[]
             for(var i=0;i<response.data.HistoricalTrackData.length;i++){
                let date = new Date(response.data.HistoricalTrackData[i].htCreatTime);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                let tempDate = Y + M + D + H + Mi + S;
                response.data.HistoricalTrackData[i].htCreatTime=tempDate
          }
             res.tableData=response.data.HistoricalTrackData
             res.totalRecords=response.data.HistoricalTrackRecords
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    
    //搜索
    // search(value){
    //   this.numberer=1
    
    //   if(value==1){
    //      this.cur_page=1
    //   }
    //     var res = this;
    //     this.$axios({
    //         url: "jinshiHistoricalTrack/searchHistoricalTrack",
    //         method: "post",
    //         data: { pageNum: res.cur_page, pageSize: res.pagesize,keyWord:res.select_word,parkId: window.localStorage.getItem("parkId")}
    //     })
    //     .then(function(response) {
    //       if (response.status <= 200) {
    //          console.log(response,"123456");
    //           res.tableData=[]
    //           for(var i=0;i<response.data.HistoricalTrackData.length;i++){
    //             let date = new Date(response.data.HistoricalTrackData[i].htCreatTime);
    //             let Y = date.getFullYear() + '-';
    //             let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    //             let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    //             let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    //             let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    //             let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    //             let tempDate = Y + M + D + H + Mi + S;
    //             response.data.HistoricalTrackData[i].htCreatTime=tempDate
    //           }
    //           res.tableData=response.data.HistoricalTrackData
    //           res.totalRecords=response.data.HistoricalTrackRecords
    //       }
    //     })
    //     .catch(function(error) {
    //       res.$message.error("查询失败: " + error);
    //       console.log(error);
    //     });
    // },
    //查询
    onsearch(value){
      if(value==1){
        this.cur_page=1
      }
      this.numberer=2
        var res = this;
        console.log(typeof(res.valueB))
        this.$axios({
            url: "jinshiHistoricalTrack/selectHistoricalTrackByTime",
            method: "post",
            data: { keyWord:res.select_word,pageNum: res.cur_page, pageSize: res.pagesize, startTime:res.valueA, endTime:res.valueB,parkId: window.localStorage.getItem("parkId")}
        })
        .then(function(response) {
          if (response.status <= 200) {
             console.log(response,"456")
              res.tableData=[]
              for(var i=0;i<response.data.HistoricalTrackData.length;i++){
                let date = new Date(response.data.HistoricalTrackData[i].htCreatTime);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
                let tempDate = Y + M + D + H + Mi + S;
                response.data.HistoricalTrackData[i].htCreatTime=tempDate
              }
              res.tableData=response.data.HistoricalTrackData
              res.totalRecords=response.data.HistoricalTrackRecords
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    }
  }
};
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
.tianjia {
  margin-left: 10px;
}
.sousuo {
  margin-right: 10px;
}
.handle-box {
  margin-bottom: 20px;
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
  margin-left: 10px;
  margin-top: 3px;
}
.upload-demo {
  height: 30px;
  width: 100px;
  display: inline-block;
  margin-left: 10px;
}
.inup {
  margin-top: 10px;
}
</style>
<style>
.el-upload--text {
  width: 60px;
  height: 30px;
  display: inline-block;
  border: 0;
  overflow: visible;
}
.el-table--border {
  border: 1px solid black;
}
.el-table--border,
.el-table--border th,
.el-table td,
.el-table th {
  border-right: 1px solid black;
  border-bottom-color: black;
  border-left-color: black;
}
.table {
  border-bottom-color: black !important;
  border-left-color: black !important;
}
.nserder{
 text-align: center
}
</style>

