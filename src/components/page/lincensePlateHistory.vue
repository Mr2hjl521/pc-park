<template>
  <div class="inOutRecord">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 历史纪录
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


        <el-select v-model="lpPaymentType" placeholder="请选择">
          <el-option
            style="margin-left:30px"
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="onsearch(1)" class="sousuo" style="margin-left:10px">查询</el-button>

        <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo" style="margin-left:0px">刷新</el-button>

      </div>
      <el-table
        :data="inOutTableData"
        border
        class="table"
        ref="multipleTable"
      >
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="lpLincensePlateIdCar" label="车牌号" width="120" class-name="table"></el-table-column>
        <el-table-column
          prop="lpInboundTime"
          :formatter="dateFormatter"
          label="入场时间"
          width="210"
          class-name="table"
        ></el-table-column>
        <el-table-column
          prop="lpDepartureTime"
          :formatter="dateFormatterexpirationTime"
          label="出场时间"
          width="210"
          class-name="table"
        ></el-table-column>
        <!-- <el-table-column prop="lpOrderId" label="订单id" class-name="table"></el-table-column>-->
        <el-table-column prop="lpCarType" label="区域" class-name="table"></el-table-column>
        <el-table-column prop="lpLincenseType" label="车牌类型" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingOften" label="停车时长" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingRealCost" label="实收费用" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingCost" label="应收费用" class-name="table"></el-table-column>
        <el-table-column prop="lpOrderId" align="center" label="订单编号" class-name="table"></el-table-column>
        <el-table-column prop="lpOrderState" label="订单状态" class-name="table"></el-table-column>
        <el-table-column prop="lpPaymentType" label="出场类型" class-name="table"></el-table-column>
        <el-table-column prop="lpInboundCname" label="入场口名" class-name="table"></el-table-column>
        <el-table-column prop="lpDepartureCname" label="出场口名" class-name="table"></el-table-column>
        <el-table-column prop="lpPaymentType" label="付费类型" class-name="table"></el-table-column>
        <el-table-column prop="lpLgName" align="center" label="车牌组" class-name="table"></el-table-column>
        <el-table-column prop="lpLgTypeName" align="center" label="进场类型" class-name="table"></el-table-column>
      </el-table>
       <!-- <div class="huizong">
        <span> 车辆总数：{{all.plate}}辆</span>
      </div> -->
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
export default {
  name: "inOutRecord",
  data() {
    return {
       all:{plate:"未查询"},
      options: [
        {
          value: "4",
          label: "本年"
        },
        {
          value: "3",
          label: "本月"
        },
        {
          value: "2",
          label: "本周"
        }
      ],
      type: [{
         value: '无',
          label: '无'
        },
        {
          value: '手动删除',
          label: '手动删除'
        }, {
          value: '扫码支付出场',
          label: '扫码支付出场'
        }, {
          value: '人工收费出场',
          label: '人工收费出场'
        }, {
          value: '无效卡出场',
          label: '无效卡出场'
        }, {
          value: '免费时长内出场',
          label: '免费时长内出场'
        },
         {
          value: '月租车出场',
          label: '月租车出场'
        },
         {
          value: '异常数据',
          label: '异常数据'
        },
         {
          value: '预付款出场',
          label: '预付款出场'
        },
         {
          value: '优惠券出场',
          label: '优惠券出场'
        }, {
          value: '手动清除记录',
          label: '手动清除记录'
        }],
      value: "",
      valueA:"",
      valueB:'',
      inOutTableData: [],
      lpPaymentType:"全部",//按照出场类型或者付费类型查找
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
      idx: -1,
      id: -1,
      datetimers:"",
      datetimess:'',
      numberer:0,
      condition:0,
      small:""
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
    refresh(){
       this.getData();
       this.select_word="",
       this.lpPaymentType="全部"
    },
    //查询
    onsearch(value){
      if(value==1){
         this.cur_page=1
      }
       this.numberer=2
       var res = this;
        var itemes= window.localStorage.getItem('parkId')
        this.itemsr=itemes
         if(this.valueA==null){
          this.datetimers=null
        }
        else{
           var d = new Date(this.valueA);
        this.datetimers=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        } 
         
         if(res.valueB==null){
           this.datetimess=null
         }else{
            var c = new Date(res.valueB);
        this.datetimess=c.getFullYear() + '-' + (c.getMonth() + 1) + '-' + c.getDate()
         }
        if(this.lpPaymentType=="全部"||this.lpPaymentType=="无"){
            this.small=null
        }else{
           this.small=this.lpPaymentType
        }
        this.$axios({
            url: "lincensePlateHistory/selectLincenseAllByTime",
            method: "post",
            data: { 
              keyWord: res.select_word,
              pageNum: res.cur_page,
              pageSize: res.pagesize,
              startTime:res.datetimers, 
              endTime:res.datetimess,
              parkId:localStorage.getItem('parkId'),
              lpPaymentType: res.small,
              }
        })
        .then(function(response) {
         
          if (response.status <= 200) {
              console.log(response,"456456")
              var aller=response.data.lincenseData

                for(var i=0; i<aller.length;i++){
                  if(aller[i].lpParkingRealCost ){
                    aller[i].lpParkingRealCost  = parseInt(aller[i].lpParkingRealCost) +"元"
                  }
                  if(aller[i].lpParkingOften){
                      aller[i].lpParkingOften = aller[i].lpParkingOften+"分钟"
                  }
                  if(aller[i].lpParkingCost){
                      aller[i].lpParkingCost =parseInt(aller[i].lpParkingCost)+"元"
                  }
                  
                }

              for(var a=0;a<response.data.lincenseData.length;a++){
                if(response.data.lincenseData[a].lpInboundCname==""){
                    response.data.lincenseData[a].lpInboundCname=""
                }
               if(response.data.lincenseData[a].lpDepartureCname==""){
                    response.data.lincenseData[a].lpDepartureCname=""
                }
            }
               for(var i=0;i<response.data.lincenseData.length;i++){
                if(response.data.lincenseData[i].lpLincenseType==1 ){
      response.data.lincenseData[i].lpLincenseType="汽油车"
                
                }else if(response.data.lincenseData[i].lpLincenseType==11){
      response.data.lincenseData[i].lpLincenseType='能源车'

                }else if(response.data.lincenseData[i].lpLincenseType==2){
      response.data.lincenseData[i].lpLincenseType="蓝牌能源车"

                }else if(response.data.lincenseData[i].lpLincenseType==3){
                   response.data.lincenseData[i].lpLincenseType="黄牌车"
                }
        }
              res.inOutTableData=response.data.lincenseData
              res.totalRecords=response.data.lincenseTotalRecords
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
        url: "lincensePlateHistory/selectLincenseOutRocordByCalendar",
        method: "post",
        data: { type: res.value, pageNum: res.cur_page, pageSize: res.pagesize,parkId:localStorage.getItem('parkId') }
      })
        .then(function(response) {
          console.log(response.data.lincenseData);
            res.inOutTableData = response.data.lincenseData;
            res.totalRecords = response.data.lincenseCountList[0]; //总条数
            res.all.plate=response.data.lincenseCountList[0]
        })
        .catch(function(error) {
          console.log(error);
        });
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
    // 获取 easy-mock 的模拟数据
    getData(value) {
      var res = this;
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

      
      this.$axios({
        url: "lincensePlateHistory/selectLincenseAll",
        method: "post",
        data: { pageNum: res.cur_page, pageSize: res.pagesize ,parkId:localStorage.getItem('parkId') }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.inOutTableData=[]
            var aller=response.data.lincenseData
             for(var i=0; i<aller.length;i++){
                  if(aller[i].lpParkingRealCost ){
                    aller[i].lpParkingRealCost  = parseInt(aller[i].lpParkingRealCost) +"元"
                  }
                  if(aller[i].lpParkingOften){
                      aller[i].lpParkingOften = aller[i].lpParkingOften+"分钟"
                  }
                  if(aller[i].lpParkingCost){
                      aller[i].lpParkingCost = parseInt(aller[i].lpParkingCost)+"元"
                  }
                  
                }
            for(var a=0;a<response.data.lincenseData.length;a++){
                if(response.data.lincenseData[a].lpInboundCname==""){
                    response.data.lincenseData[a].lpInboundCname=""
                }
               if(response.data.lincenseData[a].lpDepartureCname==""){
                    response.data.lincenseData[a].lpDepartureCname=""
                }
            }
            res.inOutTableData = response.data.lincenseData;
            res.totalRecords = response.data.lincenseTotalRecords; //总条数
            console.log(response.data,"123")
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    // search(value) {
    //   this.numberer=1
   
    //   if(value==1){
    //      this.cur_page=1
    //   }
    //   this.is_search = true;
    //   var res = this;
    //   this.$axios({
    //     url: "lincensePlateHistory/searchLincense",
    //     method: "post",
    //     data: {
    //       keyWord: res.select_word,
    //       pageNum: res.cur_page,
    //       pageSize: res.pagesize,
    //       parkId:localStorage.getItem('parkId')
    //     }
    //   })
    //     .then(function(response) {
    //       console.log(response)
    //       if (response.status <= 200) {
    //         var aller=response.data.lincenseData
    //          for(var i=0; i<aller.length;i++){
    //               if(aller[i].lpParkingRealCost ){
    //                 aller[i].lpParkingRealCost  =parseInt(aller[i].lpParkingRealCost)  +"元"
    //               }
    //               if(aller[i].lpParkingOften){
    //                   aller[i].lpParkingOften = aller[i].lpParkingOften+"分钟"
    //               }
    //               if(aller[i].lpParkingCost){
    //                   aller[i].lpParkingCost = parseInt(aller[i].lpParkingCost)+"元"
    //               }
                  
    //             }
    //         res.inOutTableData = response.data.lincenseData;
    //         res.totalRecords = response.data.lincenseTotalRecords; //总条数
    //       }
    //     })
    //     .catch(function(error) {shi 
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
.nserder{
 text-align: center
}
</style>
