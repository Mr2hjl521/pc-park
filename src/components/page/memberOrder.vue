<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 车主订单管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(1)" class="sousuo">搜索</el-button>
        <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo" style="margin-left:0px">刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index"  align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="jmoMemberId" label="会员名" align="center"   class-name="table"></el-table-column>
        <el-table-column prop="jmoLincensePlate" label="车牌号" align="center"   class-name="table"></el-table-column>
        <el-table-column prop="jmoServiceNumber" label="会员预存" align="center"  class-name="table"></el-table-column>
        <el-table-column prop="jmoServiceType" label="会员类型"  align="center" class-name="table"></el-table-column>
        <el-table-column prop="jmoJoinTime" label="开始时间"  width="150px" align="center" class-name="table"  :formatter="dateFormatter"></el-table-column>
        <el-table-column prop="jmoExpirationTime" label="结束时间" width="150px" align="center"  :formatter="dateFormatterA"  class-name="table"></el-table-column>
        <el-table-column prop="jmoCreatTime" label="创建时间" width="150px" align="center" :formatter="dateFormatterB"  class-name="table"></el-table-column>
        <el-table-column prop="jmoPayable" label="应收收费"  align="center" class-name="table"></el-table-column>
        <el-table-column prop="jmoActualCost" label="实收费用"  align="center" class-name="table"></el-table-column>
        <el-table-column prop="jmoPhoneNumber" label="手机号" width="130px" align="center"   class-name="table"></el-table-column>
        <el-table-column prop="jmoAreaName" label="区域" align="center"  class-name="table"></el-table-column>
        <el-table-column prop="jmoEnterUser" label="录入账号"  align="center" class-name="table"></el-table-column>
        <el-table-column label="操作" width="180" align="center"  class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cur_page"
          :page-size="pagesize"
          :page-sizes="[50,100]"
          :total="totalRecords"
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
       condition:0
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
    getData(value) {
      if(value==1){
        this.cur_page=1
      }
     this.numberer=0
       console.log(window.localStorage.getItem("parkId"))
      var res = this;
      res.tableData.length = 0;
      this.$axios({
        url: 'JinshiMemberOrder/selectMemberOrder',
        method: "post",
        data: {
          pageNum: res.cur_page,
          pageSize: res.pagesize,
           parkId: window.localStorage.getItem("parkId")
        }
      })
        .then(function(response) {
          console.log(response,"成功")
          res.tableData = response.data.MemberOrderData                                                                                                                                                                                                                                                                                                      
          res.totalRecords=response.data.MemberOrderRecords
        })
        .catch(function(error) {
          console.log(error);
        });
    }, 
   
    //搜索
    search(value){
      this.numberer=1
      if(value==1){
        this.cur_page=1
      }
        var res = this;
        this.$axios({
            url: "JinshiMemberOrder/searchMemberOrder",
            method: "post",
            data: { pageNum: res.cur_page, pageSize: res.pagesize,keyWord:res.select_word,parkId: window.localStorage.getItem("parkId")}
        })
        .then(function(response) {
          if (response.status <= 200) {
             res.tableData=[]
             res.tableData = response.data.MemberOrderData                                                                                                                                                                                                                                                                                                      
             res.totalRecords=response.data.MemberOrderRecords
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
   
       dateFormatter(row, column) {
    //updateTime 是你后端返回给前端的字段,
    //row代表每一行
    let datetime = row.jmoJoinTime;
    if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "年";
        let mon = datetime.getMonth() + 1 + "月";
        let d = datetime.getDate() + "日";
        return y + mon + d;
    }
    },
    dateFormatterA(row, column) {
    //updateTime 是你后端返回给前端的字段,
    //row代表每一行
    let datetime = row.jmoExpirationTime;
    if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "年";
        let mon = datetime.getMonth() + 1 + "月";
        let d = datetime.getDate() + "日";
        return y + mon + d;
    }
    },
    dateFormatterB(row, column) {
    //updateTime 是你后端返回给前端的字段,
    //row代表每一行
    let datetime = row.jmoCreatTime;
    if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "年";
        let mon = datetime.getMonth() + 1 + "月";
        let d = datetime.getDate() + "日";
        return y + mon + d;
    }
    },
    //删除
    handleDelete(index,row){
        var  res=this
        console.log(row)
        var jmoId=Number(row.jmoId)
        var res=this
        this.$axios({
            url:"JinshiMemberOrder/deleteByPrimaryKey",
            method:"post",
            data:{
                jmoId:jmoId
            }
        }).then(function(response){
           res.$message.success("删除成功")
           res. getData()
        }).catch(function(error){
            res.$message.success("删除失败")
        })
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

