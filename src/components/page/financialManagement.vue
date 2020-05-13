<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 财务管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <!-- <el-button
          type="primary"
          icon="el-icon-search"
          @click="search(1)"
          class="sousuo"
          style="margin-right:10px"
        >搜索</el-button> -->
        <el-date-picker v-model="valueAA" type="date" placeholder="开始时间"></el-date-picker>

        <el-date-picker
          v-model="valueBB"
          type="date"
          style="margin:0px 20px 0px 10px"
          placeholder="结束时间"
        ></el-date-picker>

        <el-button type="primary" icon="el-icon-search" @click="onesearch(1)" class="sousuo">查询</el-button>

        <el-select
          v-model="valueapp"
          placeholder="请选择"
          @change="addselect"
          style="width:100px;margin-right:10px"
        >
          <el-option
            v-for="item in lister"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>

        <span class="nesper">应收费用：{{all.price}}元 实收费用:{{all.realPrice}}元 车辆总数:{{all.plate}}辆</span>

        <!-- 
        <el-select v-model="value" placeholder="条件查询" @change="getnew()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="lpLincensePlateIdCar" label="车牌号" align="center" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingOften" label="停车时间" align="center" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingCost" label="应收费用" align="center" class-name="table"></el-table-column>
        <el-table-column
          prop="lpDepartureTime"
          label="出场时间"
          align="center"
          :formatter="dateFormatterexpirationTime"
          class-name="table"
        ></el-table-column>
        <el-table-column prop="lpPaymentType" label="出场类型" align="center" class-name="table"></el-table-column>
        <el-table-column prop="lpParkingRealCost" label="实收费用" align="center" class-name="table"></el-table-column>
        <el-table-column prop="lpCarType" label="区域" align="center" class-name="table"></el-table-column>
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
      all: { price: "", plate: "", realPrice: "" },
      valueapp: "当天",
      lister: [
        {
          value: 1,
          label: "前一天"
        },
        {
          value: 2,
          label: "当天"
        },
        {
          value: 3,
          label: "当月"
        }
      ],
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
      itemsr: "",
      valueAA: "",
      valueBB: "",
      value: "",
      tableData: [],
      cur_page: 1,
      pagesize: 50,
      totalRecords: 0,
      numberer: 0,
      condition: 0,
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
      datetime: "",
      datetimes: "",
      datetimers: "",
      datetimess: ""
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
    //下拉框
    refresh() {
      this.getData();
      this.editForm = "",
      this.select_word = "",
      this.addForm = {},
      this.valueapp = "当天";
    },
    addselect(value) {
      var res = this;
      console.log(value);
      this.$axios({
        url:
          "lincensePlatess/selectByPeriod",
        method: "post",
        data: {
          parkId: String(localStorage.getItem("parkId")),
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          period: Number(value)
        }
      })
        .then(function(response) {
          var aller = response.data.lincensessData;
          for (var i = 0; i < aller.length; i++) {
            if (aller[i].lpParkingCost) {
              aller[i].lpParkingCost = aller[i].lpParkingCost + "元";
            }
            if (aller[i].lpParkingOften) {
              aller[i].lpParkingOften = aller[i].lpParkingOften + "分钟";
            }
            if (aller[i].lpParkingRealCost) {
              aller[i].lpParkingRealCost = aller[i].lpParkingRealCost + "元";
            }
          }
          res.tableData = response.data.lincensessData;
          res.all = response.data.lincenseCountList[0];
          res.totalRecords = response.data.lincensessTotalRecords;
        })
        .catch(function(err) {
          console.log("shibai");
        });
    },
    //查询

    onesearch(value) {
      var res = this;
      var itemes = window.localStorage.getItem("parkId");
      if (value == 1) {
        this.cur_page = 1;
      }
      this.numberer = 2;
      this.itemsr = itemes;

      var d = new Date(this.valueAA);

      this.datetimers =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

      var c = new Date(res.valueBB);

      this.datetimess =
        c.getFullYear() + "-" + (c.getMonth() + 1) + "-" + c.getDate();
      this.$axios({
        url:
          "lincensePlatess/selectByTime",
        method: "post",
        data: {
          parkId: res.itemsr,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          startTime: res.datetimers,
          endTime: res.datetimess,
          keyWord: res.select_word,
        }
      })
        .then(function(response) {
          console.log(response, "748789789");

          var aller = response.data.lincensessData;
          for (var i = 0; i < aller.length; i++) {
            if (aller[i].lpParkingCost) {
              aller[i].lpParkingCost = aller[i].lpParkingCost + "元";
            }
            if (aller[i].lpParkingOften) {
              aller[i].lpParkingOften = aller[i].lpParkingOften + "分钟";
            }
            if (aller[i].lpParkingRealCost) {
              aller[i].lpParkingRealCost = aller[i].lpParkingRealCost + "元";
            }
          }
          res.tableData = response.data.lincensessData;
          res.all = response.data.lincenseCountList[0];
          res.totalRecords = response.data.lincensessTotalRecords; //总条数
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
    getnew() {
      console.log(this.value);
      var res = this;
      this.$axios({
        url:
          "lincensePlate/selectLincenseByCalendar",
        method: "post",
        data: { type: res.value, pageNum: res.cur_page, pageSize: res.pagesize }
      })
        .then(function(response) {
          console.log(response.data);
          res.tableData = response.data.lincenseData;
          res.totalRecords = response.data.lincenseCountList[0].plate; //总条数
          res.all.price = response.data.lincenseCountList[0].price;
          res.all.plate = response.data.lincenseCountList[0].plate;
        })
        .catch(function(error) {
          // res.$message.error('添加失败: '+error);
          console.log(error);
        });
    },
    //每页显示个数改变
    handleSizeChange(val) {
      if (this.numberer == 0) {
        this.pagesize = val;
        this.getData(1);
      } else if (this.numberer == 1) {
        this.pagesize = val;
        this.search(1);
      } else {
        this.pagesize = val;
        this.onesearch(1);
      }
    },
    // 分页导航
    handleCurrentChange(val) {
      if (this.numberer == 0) {
        this.cur_page = val;
        this.getData();
      } else if (this.numberer == 1) {
        this.cur_page = val;
        this.search(2);
      } else {
        this.cur_page = val;
        this.onesearch(2);
      }
    },
    // 获取 easy-mock 的模拟数据
    getData(value) {
      if (value == 1) {
        this.cur_page = 1;
      }
      this.numberer = 0;
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
      this.valueAA = nowDate;
      this.valueBB = nowDate;

      var res = this;
      this.$axios({
        url:
          "lincensePlatess/selectss",
        method: "post",
        data: {
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: localStorage.getItem("parkId")
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData = [];
            var aller = response.data.lincensessData;
            for (var i = 0; i < aller.length; i++) {
              if (aller[i].lpParkingCost) {
                aller[i].lpParkingCost = aller[i].lpParkingCost + "元";
              }
              if (aller[i].lpParkingOften) {
                aller[i].lpParkingOften = aller[i].lpParkingOften + "分钟";
              }
              if (aller[i].lpParkingRealCost) {
                aller[i].lpParkingRealCost = aller[i].lpParkingRealCost + "元";
              }
            }
            res.tableData = response.data.lincensessData;
            res.totalRecords = response.data.lincensessTotalRecords; //总条数
            console.log(response, "获取所有数据");
            res.all = response.data.lincenseCountList[0];
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    search(value) {
      this.numberer = 1;
      if (value == 1) {
        this.cur_page = 1;
      }
      this.is_search = true;
      var res = this;
      this.$axios({
        url:
          "lincensePlatess/searchLincense",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: localStorage.getItem("parkId")
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            var aller = response.data.lincensessData;
            for (var i = 0; i < aller.length; i++) {
              if (aller[i].lpParkingCost) {
                aller[i].lpParkingCost = aller[i].lpParkingCost + "元";
              }
              if (aller[i].lpParkingOften) {
                aller[i].lpParkingOften = aller[i].lpParkingOften + "分钟";
              }
              if (aller[i].lpParkingRealCost) {
                aller[i].lpParkingRealCost = aller[i].lpParkingRealCost + "元";
              }
            }
            res.tableData = response.data.lincensessData;
            res.totalRecords = response.data.lincensessTotalRecords; //总条数
            console.log(response);
            res.all = response.data.lincenseCountList[0];
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
.huizong > span {
  word-spacing: 20px;
}
.nesper {
  word-spacing: 15px;
}
.nserder {
  text-align: center;
}
</style>

