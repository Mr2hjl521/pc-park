<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../../assets/img/img.jpg" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{name}}</div>
              <div>{{role}}</div>
            </div>
          </div>
          <h3>在场车辆总数：{{number}}</h3>
        </el-card>
        <el-card shadow="hover" style="height:220px;">
          <div slot="header" class="clearfix">
            <span>新闻列表</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
          </div>
          <el-table
            :data="todoList"
            :show-header="false"
            height="304"
            style="width: 100%;font-size:14px;"
            class="imp"
          >
            <el-table-column class="imp">
              <template slot-scope="scope" class="imp">
                <div
                  class="todo-item is-empty"
                  :class="{'todo-item-del': scope.row.status}"
                >{{scope.row.title}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-tag type="success" class="day">当天数据</el-tag>
      <div></div>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-office-building grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{day.goout}}</div>
                  <div>进出场车辆</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-school grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{day.goin}}</div>
                  <div>付费总额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-claim grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{day.pay}}</div>
                  <div>付费车辆</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-tag type="success" class="day">本周数据</el-tag>
      <div></div>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-office-building grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{week.goout}}</div>
                  <div>进出场车辆</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-school grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{week.goin}}</div>
                  <div>付费总额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-claim grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{week.pay}}</div>
                  <div>付费车辆</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-tag type="success" class="day">本月数据</el-tag>
      <div></div>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-office-building grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{month.goout}}</div>
                  <div>进出场车辆</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-school grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{month.goin}}</div>
                  <div>付费总额</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-claim grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{month.pay}}</div>
                  <div>付费车辆</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="bar" class="schart" canvasId="bar" :data="a" type="bar" :options="options"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="line"
            class="schart"
            canvasId="line"
            :data="a"
            type="line"
            :options="options2"
          ></schart>
        </el-card>
      </el-col>
    </el-row>
    <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo" style="margin-left:20px">刷新</el-button>
  </div>
</template>

<script>
import Schart from "vue-schart";
import bus from "../common/bus";
export default {
  name: "dashboard",
  data() {
    return {
      line: [],
      day: {
        goin: "0",
        goout: "0",
        pay: "0"
      },
      week: {
        goin: "0",
        goout: "0",
        pay: "0"
      },
      month: {
        goin: "0",
        goout: "0",
        pay: "0"
      },
      name: localStorage.getItem("ms_username"),
      number: "",
      todoList: [
        {
          title: "2018年8月2日测试版本V1.05上线！",
          status: false
        }
      ],
      a: [
        {
          name: "2019-02-29",
          value: 8
        },
        {
          name: "2019-06-29",
          value: 3
        },
        {
          name: "2019-04-29",
          value: 11
        },
        {
          name: "2019-07-29",
          value: 13
        },
        {
          name: "2019-08-29",
          value: 15
        },
        {
          name: "2019-09-29",
          value: 20
        },
        {
          name: "2019-09-29",
          value: 8
        }
      ],
      options: {
        title: "进场车辆统计图",
        showValue: false,
        fillColor: "rgb(45, 140, 240)",
        bottomPadding: 30,
        topPadding: 30
      },
      options2: {
        title: "进场车辆走势图",
        fillColor: "#FC6FA1",
        axisColor: "#008ACD",
        contentColor: "#EEEEEE",
        bgColor: "#F5F8FD",
        bottomPadding: 30,
        topPadding: 30
      }
    };
  },
  components: {
    Schart
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  created() {
    this.handleListener();
    // // this.changeDate();
    this.getDay();
    this.getWeek();
    this.getMonth();
    this.getnumber();
    this.getdata();
  },
  activated() {
    this.handleListener();
  },
  deactivated() {
    window.removeEventListener("resize", this.renderChart);
    bus.$off("collapse", this.handleBus);
  },
  methods: {
    refresh(){
        this.handleListener();
    // // this.changeDate();
    this.getDay();
    this.getWeek();
    this.getMonth();
    this.getnumber();
    this.getdata();
    },
    getdata(){
      var res=this
      this.$axios({
         url:"lincensePlate/selectPlateVehicleChart",
         method:"post",
         data:{
           parkId:localStorage.getItem("parkId")
         }
      }).then(function(response){
        if(response.status <= 200){
            console.log(response,"折线图")
            res.a=response.data.reverse()
        }
      }).catch(function(err){

      })
    },
    //在场车辆总数
    getnumber() {
      console.log(localStorage.getItem("ms_username"));
      var res = this;
      this.$axios({
        url:
          "lincensePlate/selectCountPlateNumbers?username=" +
          localStorage.getItem("ms_username"),
        method: "get"
      }).then(function(response) {
        if (response.status <= 200) {
          console.log(response.data, "123");
          res.number = response.data;
        }
      });
    },
    getDay() {
      var res = this;
      this.$axios({
        url:
          "lincensePlateHistory/selectPlateByDay?username=" +
          localStorage.getItem("ms_username"),
        method: "get"
      }).then(function(response) {
        if (response.status <= 200) {
          console.log(response.data, "78574848545");
        //   if (!response.data.payFeeCount) {
        //     res.day.goin = 0;
        //   } else {
            res.day.goout = response.data.outInCount;
            res.day.goin = response.data.payFeeCount;
            res.day.pay = response.data.payCount;
        //   }
        }
      });
    },
    getWeek() {
      var res = this;
      this.$axios({
        url:
          "lincensePlateHistory/selectPlateByWeek?username=" +
          localStorage.getItem("ms_username"),
        method: "get",
        data: {}
      }).then(function(response) {
        if (response.status <= 200) {
          console.log(response.data, "789");
        //   if (!response.data.payFeeCount) {
        //     res.week.goin = 0; //付费总额
        //   } else {
            res.week.goout = response.data.outInCount;
            res.week.goin = response.data.payFeeCount; //付费总额
            res.week.pay = response.data.payCount; //付费车辆
        //   }
        }
      });
    },
    getMonth() {
      var res = this;
      this.$axios({
        url:
          "lincensePlateHistory/selectPlateByMonth?username=" +
          localStorage.getItem("ms_username"),
        method: "get",
        data: {}
      }).then(function(response) {
        if (response.status <= 200) {
          console.log(response.data, "78910");
        //   if (!response.data.payFeeCount) {
        //     res.month.goin = 0;
        //   } else {
            res.month.goout = response.data.outInCount;
            res.month.goin = response.data.payFeeCount;
            res.month.pay = response.data.payCount;
        //   }
        }
      });
    },
    // changeDate(){
    //     const now = new Date().getTime();
    //     this.data.forEach((item, index) => {
    //         const date = new Date(now - (6 - index) * 86400000);
    //         item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
    //     })
    // },
    handleListener() {
      bus.$on("collapse", this.handleBus);
      // 调用renderChart方法对图表进行重新渲染
      window.addEventListener("resize", this.renderChart);
    },
    handleBus(msg) {
      setTimeout(() => {
        this.renderChart();
      }, 300);
    },
    renderChart() {
      this.$refs.bar.renderChart();
      this.$refs.line.renderChart();
    }
  }
};
</script>


<style scoped>
.nserder{
 text-align: center
}
.imp {
  border-radius: none;
  border: none;
}
.day {
  height: 30px;
  width: 100px;
  text-align: center;
  line-height: 30px;
  margin-left: 20px;
  font-size: 16px;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
