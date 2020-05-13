<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 关注记录
        </el-breadcrumb-item>
      </el-breadcrumb>
       
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <!-- <el-button type="primary" icon="el-icon-search" @click="search(1)" class="sousuo">搜索</el-button> -->
        <el-date-picker
          v-model="valueer"
          type="date"
          placeholder="开始时间">
        </el-date-picker>


         <el-date-picker
          style="margin:0px 10px 0px 10px"
          v-model="valuees"
          type="date"
          placeholder="结束时间">
        </el-date-picker>

        <el-button type="primary" icon="el-icon-search" @click="searchers(1)" class="sousuo">查询</el-button>
         <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo" style="margin-top:20px">刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column label="操作" width="180" align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="jaPlate" label="车牌号" class-name="table"></el-table-column>
        <el-table-column prop="jaInboundTime" label="进场时间" class-name="table"></el-table-column>
        <el-table-column prop="jaDepartureTime" label="出场时间" class-name="table"></el-table-column>
        <el-table-column prop="jaInboundCname" label="进场口" class-name="table"></el-table-column>
        <el-table-column prop="jaDepartureCname" label="出场口" class-name="table"></el-table-column>
        <el-table-column prop="jaOrderId" label="订单号" class-name="table"></el-table-column>
        <el-table-column prop="jaRealCost" label="实收费用" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingCost" label="备注" class-name="table"></el-table-column>
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
      tableData: [],
      cur_page: 1,
      pagesize: 50,
      totalRecords: 0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      valuees:"",
      valueer:"",
      startTime:"",
      endTime:"",
      idx: -1,
      id: -1,
      select_word:""
    };
  },
  created() {
    this.getData();
     var day1 = new Date();
     console.log(day1)
     this.valuees=day1
     this.valueer=day1
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    //删除
    handleDelete(index, row){
      console.log(row)
       var res = this;
      this.$axios({
        url: "JinshiAttentionRecord/deleteByPrimaryKey",
        method: "post",
        data: { id: row.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.getData()
          }
        })
        .catch(function(error) {
          res.$message.success("查询失败！");
          console.log(error);
        });
    },
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
        this.searchers(1);
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
        this.searchers(2)
      }

      
    },
    //查询
    searchers(value){
        if(value==1){
        this.cur_page=1
      }
        this.numberer=2
         console.log(this.numberer)
        this.is_search = true;
        var res = this;
        var itemes= window.localStorage.getItem('parkId')
        this.itemsr=itemes
        if(this.valueer==null){
          this.datetimers=null
        }
        else{
           var d = new Date(this.valueer);
        this.datetimers=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        } 
         
         if(res.valuees==null){
           this.datetimess=null
         }else{
            var c = new Date(res.valuees);
        this.datetimess=c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate()
         }
          console.log(typeof(this.datetimers))
        this.$axios({
          url: "JinshiAttentionRecord/selectByTime",
          method: "post",
          data: {
            keyWord: res.select_word,
            pageNum: res.cur_page,
            pageSize: res.pagesize,
            parkId:localStorage.getItem('parkId'),
            startTime:this.datetimers,
            endTime:this.datetimess
          }
        })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response)
             res.tableData=[]
             for(var i=0;i<response.data.attentionRecordData.length;i++){
              if(response.data.attentionRecordData[i].jaInboundTime){
                  response.data.attentionRecordData[i].jaInboundTime=res.addwes(response.data.attentionRecordData[i].jaInboundTime)
              }else{
                 response.data.attentionRecordData[i].jaInboundTime=""
              }
              if(response.data.attentionRecordData[i].jaDepartureTime){
                response.data.attentionRecordData[i].jaDepartureTime=res.addwes(response.data.attentionRecordData[i].jaDepartureTime)
              }else{
                 response.data.attentionRecordData[i].jaDepartureTime=""
              }
              
            }
             res.tableData = response.data.attentionRecordData;
             res. totalRecords = response.data.attentionRecords
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    refresh(){
      this.getData();
    },
    dateFormatterexpirationTime(row, column) {
      let datetime = row.lpDepartureTime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        var hours =
          datetime.getHours() < 10
            ? "0" + datetime.getHours()
            : datetime.getHours();
        var minutes =
          datetime.getMinutes() < 10
            ? "0" + datetime.getMinutes()
            : datetime.getMinutes();
        var seconds =
          datetime.getSeconds() < 10
            ? "0" + datetime.getSeconds()
            : datetime.getSeconds();
        return y + mon + d + " " + hours + ":" + minutes + ":" + seconds;
      }
      return "";
    },
    dateFormatter(row, column) {
      let datetime = row.lpInboundTime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        var hours =
          datetime.getHours() < 10
            ? "0" + datetime.getHours()
            : datetime.getHours();
        var minutes =
          datetime.getMinutes() < 10
            ? "0" + datetime.getMinutes()
            : datetime.getMinutes();
        var seconds =
          datetime.getSeconds() < 10
            ? "0" + datetime.getSeconds()
            : datetime.getSeconds();
        return y + mon + d + " " + hours + ":" + minutes + ":" + seconds;
      }
      return "";
    },
    //每页显示个数改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    addwes(timeStamp){
        
    var date = new Date();
    date.setTime(timeStamp);
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;    

    },
    // 获取 easy-mock 的模拟数据
    getData() {
      var res = this;
      this.$axios({
        url: "JinshiAttentionRecord/selectAttentionRecord",
        method: "post",
        data: { pageNum: res.cur_page, pageSize: res.pagesize ,parkId:String(localStorage.getItem('parkId'))}
      })
        .then(function(response) {
          res.tableData=[]
          if (response.status <= 200) {
            for(var i=0;i<response.data.attentionRecordData.length;i++){
              if(response.data.attentionRecordData[i].jaInboundTime){
                  response.data.attentionRecordData[i].jaInboundTime=res.addwes(response.data.attentionRecordData[i].jaInboundTime)
              }else{
                 response.data.attentionRecordData[i].jaInboundTime=""
              }
              if(response.data.attentionRecordData[i].jaDepartureTime){
                response.data.attentionRecordData[i].jaDepartureTime=res.addwes(response.data.attentionRecordData[i].jaDepartureTime)
              }else{
                 response.data.attentionRecordData[i].jaDepartureTime=""
              }
              
            }
            res.tableData = response.data.attentionRecordData;
             res. totalRecords = response.data.attentionRecords
            console.log(response.data.attentionRecordData);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.success("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style scoped>
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
</style>
<style>
.el-upload--text {
  width: 60px;
  height: 30px;
  display: inline-block;
  border: 0;
  overflow: visible;
}
.nserder{
  text-align: center
}
</style>

