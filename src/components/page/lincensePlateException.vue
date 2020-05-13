<template>
  <div class="inOutRecord">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 异常纪录
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(1)" class="sousuo">搜索</el-button>
        <el-select v-model="value" placeholder="条件查询" @change="getnew()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
         <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>
      </div>
      <el-table
        :data="inOutTableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
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
        <el-table-column prop="lpOrderId" label="订单id" class-name="table"></el-table-column>
        <el-table-column prop="lpCarType" label="车辆类型" class-name="table"></el-table-column>
        <el-table-column prop="lpCarColor" label="车辆颜色" class-name="table"></el-table-column>
        <el-table-column prop="lpLincenseType" label="车牌类型" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingOften" label="停车时长" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingCost" label="停车费用" class-name="table"></el-table-column>
        <el-table-column prop="lpOrderState" label="订单状态" class-name="table"></el-table-column>
        <el-table-column prop="lpPaymentType" label="支付类型" class-name="table"></el-table-column>
        <el-table-column prop="lpInboundCname" label="入场口名" class-name="table"></el-table-column>
        <el-table-column prop="lpPepartureCname" label="出场口名" class-name="table"></el-table-column>
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
          :page-sizes="[5, 10, 20, 40]"
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
        },
        {
          value: "1",
          label: "今日"
        }
      ],
      value: "",
      inOutTableData: [],
      cur_page: 1,
      pagesize: 20,
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
      numberer:0,
      condition:0,
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
      this.value=""
     
    },
      getnew() {
      console.log(this.value)
       var res = this;
      this.$axios({
        url: "lincensePlate/selectLincenseOutRocordByCalendar",
        method: "post",
        data: { type: res.value, pageNum: res.cur_page, pageSize: res.pagesize }
      })
        .then(function(response) {
          console.log(response.data.lincenseData);
            res.inOutTableData = response.data.lincenseData;
            res.totalRecords = response.data.lincenseCountList[0]; //总条数
            res.all.plate=response.data.lincenseCountList[0]
        })
        .catch(function(error) {
          // res.$message.error('添加失败: '+error);
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
        console.log(val);
        this.getData(1);
      } else {
        this.pagesize = val;
        this.search(1);
      }
    },
    // 分页导航
    handleCurrentChange(val) {
     if(this.numberer==0){
            this.cur_page = val;
            this.getData()
        }
        else{
            this.cur_page = val;
            this.search(2)
        }
    },
    // 获取 easy-mock 的模拟数据
    getData(value) {
       if(value==1){
        this.cur_page=1
      }
      this.numberer=0
      var res = this;
      this.$axios({
        url: "lincensePlateException/selectLincenseAll",
        method: "post",
        data: { pageNum: res.cur_page, pageSize: res.pagesize }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.inOutTableData = response.data.lincenseData;
            res.totalRecords = response.data.lincenseTotalRecords; //总条数
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    search(value) {
      this.numberer=1
    
      if(value==1){
         this.cur_page=1
      }
      this.is_search = true;
      var res = this;
      this.$axios({
        url: "lincensePlate/searchLincense",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.inOutTableData = response.data.lincenseData;
            res.totalRecords = response.data.lincenseTotalRecords; //总条数
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
