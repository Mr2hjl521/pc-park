<template>
  <div class="inOutRecord">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 在场记录
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
        <span> 车辆总数：{{all.plate}}辆</span>
      </div>

      <!-- 手动清除div -->
      <div class="handle-box">
        <el-date-picker
          style="width:144px"
          v-model="valueerA"
          type="date"
          placeholder="开始时间">
        </el-date-picker>

         <el-date-picker
         
          style="margin:0px 10px 0px 10px;width:144px"
          v-model="valueesB"
          type="date"
          placeholder="结束时间">
        </el-date-picker>

        <el-button type="primary" icon="el-icon-search" @click="adddelete" class="sousuo">手动清除</el-button>
        <el-button type="primary" icon="el-icon-search" @click="refresh" style="margin-left:0px" class="sousuo">刷新</el-button>
      </div>

      <el-table
        :data="inOutTableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <!--<el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column> -->
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="lpId" label="id" class-name="table" align="center" v-if="false"></el-table-column>
        <el-table-column prop="lpLincensePlateIdCar" label="车牌号" align="center" width="120" class-name="table"></el-table-column>
        <el-table-column prop="lpOrderState" label="收费类型" align="center" width="200" class-name="table"></el-table-column>
         <el-table-column prop="lpCarType" label="区域" width="220" align="center" class-name="table"></el-table-column>
        <el-table-column
          prop="lpInboundTime"
          :formatter="dateFormatter"
          align="center"
          label="入场时间"
          width="210"
          class-name="table"
        ></el-table-column>
        <!-- 
        <el-table-column
          prop="lpDepartureTime"
          :formatter="dateFormatterexpirationTime"
          label="出场时间"
          width="210"
          class-name="table"
        ></el-table-column>
        <el-table-column prop="lpOrderId" label="订单id" class-name="table"></el-table-column>
        <el-table-column prop="lpCarType" label="车辆类型" class-name="table"></el-table-column>-->
        <!--<el-table-column prop="lpCarColor" label="车辆颜色" class-name="table"></el-table-column>-->
        <el-table-column prop="lpLincenseType" align="center" label="车辆类型" class-name="table" :formatter="cartypeFormatter"></el-table-column>
        <!--<el-table-column prop="lpParkingOften" label="停车时长" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingCost" label="停车费用" class-name="table"></el-table-column>
        <el-table-column prop="lpOrderState" label="订单状态" class-name="table"></el-table-column>
        <el-table-column prop="lpPaymentType" label="支付类型" class-name="table"></el-table-column>-->
        <el-table-column prop="lpInboundCname" align="center" label="进场口名称" class-name="table"></el-table-column>
        <el-table-column prop="lpLgName" align="center" label="车牌组" class-name="table"></el-table-column>

        <el-table-column prop="companyName" align="center" label="公司名" class-name="table"></el-table-column>
        <el-table-column prop="departmentName" align="center" label="部门名" class-name="table"></el-table-column>

        <el-table-column prop="lpLgTypeName" align="center" label="进场类型" class-name="table"></el-table-column>
        <el-table-column prop="lpOrderId" align="center" label="订单编号" class-name="table"></el-table-column>
        <!--<el-table-column prop="lpPepartureCname" label="出场口名" class-name="table"></el-table-column>-->
                <el-table-column label="操作"  width="180" align="center" class-name="table">
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
          :total="totalRecords"
          :page-sizes="[50,100]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
   
  </div>
</template>

<script>
import { constants } from 'crypto';
export default {
  inject:['reload'], 
  name: "inOutRecord",
    //注入reload方法
  data() {
    return {
      all:{plate:"未查询"},
      datetimers:"",
      datetimess:"",
      options: [],
      valueerA:"",//手动清除的时间段   开始
      valueesB:"",//手动清除的时间段   结束
      value:'',
      inOutTableData: [],
      cur_page: 1,
      pagesize: 50,
      totalRecords: 0,
      numberer:0,
      condition:0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      valueer:"",
      valuees:"",
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      idx: -1,
      id: -1,
      datetimersA:"",
      datetimessB:""
    };
  },
  created() {
    this.getData();

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
    handleSelectionChange(){

    },
    refresh(){
        this.getData();
        this.select_word="",
        this.valueerA="",
        this.valueesB=""
    },
    //时间段搜索
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
          url: "lincensePlate/selectPlateInRocordByTime",
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
              res.inOutTableData=response.data.lincenseData
             console.log(response,"123")
              res.totalRecords = response.data.lincenseTotalRecords; //总条数
              res.all.plate=response.data.countInRocord
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    getnew() {
      console.log(this.value)
       var res = this;
      this.$axios({
        url: "lincensePlate/selectLincenseInRocordByCalendar",
        method: "post",
        data: { type: res.value, pageNum: res.cur_page, pageSize: res.pagesize,parkId: localStorage.getItem('parkId') }
      })
        .then(function(response) {
          console.log(response.data);
            res.inOutTableData = response.data.lincenseData;
            res.totalRecords = response.data.lincenseCountList[0]; //总条数
            res.all.plate=response.data.lincenseCountList[0]
        })
        .catch(function(error) {
          // res.$message.error('添加失败: '+error);
          console.log(error);
        });
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.lpId;
      this.delVisible = true;
    },
        // 确定删除
    deleteRow() {
      var res = this;
      console.log(this.id);
      this.$axios({
        url: "lincensePlate/deleteAndInsertByPrimaryKey",
        method: "post",
        data: { lpId: res.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.delVisible = false;
            if (res.inOutTableData[res.idx].id === res.id) {
              res.inOutTableData.splice(res.idx, 1);
            } else {
              for (let i = 0; i < res.inOutTableData.length; i++) {
                if (res.inOutTableData[i].id === res.id) {
                  res.inOutTableData.splice(i, 1);
                  return;
                }
              }
            }
          }
        })
        .catch(function(error) {
          res.$message.success("查询失败！");
          console.log(error);
        });
    },
    cartypeFormatter(row, column){
      let cartype = row.lpLincenseType;
      if(cartype==1){
        return '汽油车'
      }else if(cartype==11){
        return '能源车'
      }else if(cartype==2){
        return '蓝牌能源车'
      }else if(cartype==3){
        return '黄牌车'
      }else{
        '未知车牌'
      }
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
    //手动清除
    adddelete(){
      var  res=this
        var d = new Date(this.valueerA);
        this.datetimersA=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        var c = new Date(res.valueesB);
        this.datetimessB=c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate()
       this.$axios({
         url:"lincensePlate/updatePlateInRocordToHistory",
         method:"post",
         data:{
              parkId:localStorage.getItem('parkId'),
              startTime:this.datetimersA,
              endTime:this.datetimessB
         }
       }) 
       .then(function(response) {
          if (response.status <= 200) {
               res.$message.success("清除成功");
                res.getData()
          }
        })
        .catch(function(error) {
          res.$message.error("清除失败");
          console.log(error);
        });
    },
    // 获取 easy-mock 的模拟数据
    getData(value) {
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
      this.valueer=nowDate
      this.valuees=nowDate


      var res = this;
      this.$axios({
        url: "lincensePlate/selectPlateInRocord",
        method: "post",
        data: { pageNum: res.cur_page, pageSize: res.pagesize ,parkId:localStorage.getItem('parkId')}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.inOutTableData=[]
            res.inOutTableData = response.data.lincenseData;
            res.totalRecords = response.data.lincenseTotalRecords; //总条数
            res.all.plate=response.data.countInRocord
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    // search(value) {
    //   this.numberer=1
    //   this.is_search = true;
    //   var res = this;
    
    //   if(value==1){
    //       this.cur_page=1
    //   }
    //   this.$axios({
    //     url: "lincensePlate/searchLincense",
    //     method: "post",
    //     data: {
    //       keyWord: res.select_word,
    //       pageNum: res.cur_page,
    //       pageSize: res.pagesize,
    //       parkId:localStorage.getItem('parkId')
    //     }
    //   })
    //     .then(function(response) {
    //       console.log(response,"123")
    //       if (response.status <= 200) {
    //         res.inOutTableData = response.data.lincenseData;
    //         res.totalRecords = response.data.lincenseTotalRecords; //总条数
    //          res.all.plate=response.data.lincenseTotalRecords
    //       }
    //     })
    //     .catch(function(error) {
    //       res.$message.error("查询失败: " + error);
    //       console.log(error);
    //     });
    // },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
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
.sousuo{
    margin-right: 10px;
}
.daochu{
    margin-left: 10px;
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
.adders{
  position: relative;
  bottom:0px;
  text-align: center;
}
.nserder{
  text-align: center
}
</style>
