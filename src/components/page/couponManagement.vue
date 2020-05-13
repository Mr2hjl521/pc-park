<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 优惠券管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- 
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
        <el-button type="primary" icon="el-icon-search" @click="addVisible = true">添加</el-button>
        <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" class-name="table"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column label="操作" width="180" align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleadd(scope.$index, scope.row)"
            >充值</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="couponName" label="优惠券名称" class-name="table"></el-table-column>
    
        <el-table-column prop="couponCount" label="全免券总数量" class-name="table"></el-table-column>
        <el-table-column prop="couponDataA" label="全免券剩余数量" class-name="table"></el-table-column>
        <el-table-column prop="couponStarttime" label="开始时间" class-name="table"></el-table-column>
        <el-table-column prop="couponEndtime" label="结束时间" class-name="table"></el-table-column>
      
        <el-table-column prop="couponParkingName" label="停车场" class-name="table"></el-table-column>
        <el-table-column prop="couponBcName" label="商户" class-name="table"></el-table-column>
        <el-table-column prop="couponAreaName" label="区域" class-name="table"></el-table-column>


         <el-table-column prop="couponDataB" label="备注" class-name="table"></el-table-column>

      </el-table>
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
    <!-- 充值弹出框 -->
    <el-dialog title="充值" :visible.sync="addnewVisible" width="30%">
      <el-form ref="addnewForm" :model="addnewForm" :rules="carFormRulese" label-width="100px">
        <el-form-item label="需要充值的全免券数量" prop="couponCount">
          <el-input v-model="addnewForm.couponCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addnewVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="carFormRules" label-width="100px">
        <el-form-item label="优惠券名称" prop="couponName ">
          <el-input v-model="addForm.couponName " placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <!-- 
        <el-form-item label="类型" prop="couponType">
          <el-input v-model="addForm.couponType"></el-input>
        </el-form-item>-->
        <el-form-item label="全免券数量" prop="couponCount">
          <el-input v-model="addForm.couponCount" placeholder="请输入全免券数量"></el-input>
        </el-form-item>
        
        <el-form-item label="开始日期" prop="couponStarttime">
          <el-date-picker
            v-model="addForm.couponStarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="couponEndtime">
          <el-date-picker
            v-model="addForm.couponEndtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        
        <el-form-item label="停车场" prop="couponParkingName">
          <el-select v-model="addForm.couponParkingName" placeholder="停车场" disabled>
            <el-option
              v-for="item in parking"
              :key="item.couponParkingName"
              :label="item.couponParkingName"
              :value="item.couponParkingName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="couponAreaName">
          <el-select v-model="addForm.couponAreaName" placeholder="区域" @change="hand">
            <el-option
              v-for="item in area"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户" prop="couponBcName">
          <el-select v-model="addForm.couponBcName" placeholder="商户">
            <el-option
              v-for="item in bc"
              :key="item.couponBcName"
              :label="item.couponBcName"
              :value="item.couponBcName"
            ></el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="备注">
          <el-input v-model="addForm.couponDataB" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="修改用户权限" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" :rules="carFormRules" label-width="100px">
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="editForm.couponName" disabled placeholder="请输入优惠券名称" ></el-input>
        </el-form-item>
        <!--
        <el-form-item label="类型" prop="couponType">
          <el-input v-model="editForm.couponType"></el-input>
        </el-form-item>-->
        <el-form-item label="全免券数量" prop="couponCount">
          <el-input v-model="editForm.couponDataA " disabled placeholder="请输入全免券数量"></el-input>
        </el-form-item>
        
        <el-form-item label="开始日期" prop="couponStarttime">
          <el-date-picker
            v-model="editForm.couponStarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="couponEndtime">
          <el-date-picker
            v-model="editForm.couponEndtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        
        <el-form-item label="停车场" prop="couponParkingName">
          <el-select v-model="editForm.couponParkingName" placeholder="停车场" disabled>
            <el-option
              v-for="item in parking"
              :key="item.couponParkingName"
              :label="item.couponParkingName"
              :value="item.couponParkingName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="couponAreaName">
          <el-select v-model="editForm.couponAreaName" disabled placeholder="区域">
            <el-option
              v-for="item in area"
              :key="item.couponAreaName"
              :label="item.couponAreaName"
              :value="item.couponAreaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户" prop="couponBcName">
          <el-select v-model="editForm.couponBcName" placeholder="商户" disabled>
            <el-option
              v-for="item in bc"
              :key="item.couponBcName"
              :label="item.couponBcName"
              :value="item.couponBcName"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="备注">
          <el-input v-model="editForm.couponDataB" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "carManager",
  data() {
    return {
      bc: [],
      agent: [],
      area: [],
      parking: [],
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      addnewVisible: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      addForm: {
        couponId: "",
        couponName: "",
        couponType: "",
        couponCount: "",
        couponStarttime: "",
        couponEndtime: "",
        couponBcName: "",
      
        couponParkingName: "",
        couponAreaName: "",
        couponDataB:""
      },
      editForm: {
        couponId: "",
        couponName: "",
        couponType: "",
        couponCount: "",
        couponStarttime: "",
        couponEndtime: "",
        couponBcName: "",
        couponParkingName: "",
        couponAreaName: "",
        couponDataA: "",
        couponDataB:""
      },
      addnewForm: {
        couponId: "",
        couponCount: ""
      },
      carFormRules: {
        couponCount: [
          {
            pattern: /^[0-9]+$/,
            message: "只能输入数字"
          }
        ]
      },
      carFormRulese: {},
      options: [],
      value: "",
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getAgent();
    this.getArea();
    this.getParking();
    // this.getBc();
    var data=new Date()
    this.addForm.couponStarttime=data
    this.addForm.couponEndtime=data
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
    refresh() {
      this.getData();
      this.getAgent();
      this.getArea();
      this.getParking();
      (this.editForm = {}), (this.select_word = ""), (this.addForm = {});
    },
    //日期戳转换
    timestampToTime(timestamp) {
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D;
    },
    hand(value) {
      var res = this;
      this.$axios({
        url: "JinshiBusinessAccount/selectAllBusinessName",
        method: "post",
        data: {
          areaId: Number(value),
          parkId: String(localStorage.getItem("parkId"))
        }
      })
        .then(function(response) {
          console.log(response)
         res.bc=[]
          for (var i = 0; i < response.data.BusinessNameData.length; i++) {
            res.bc.push({
              couponBcName: response.data.BusinessNameData[i].bcName
            });
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    dateChangebirthdayC(val) {
      console.log(val);
      this.addForm.couponStarttime = val;
      this.editForm.couponStarttime = val;
    },
    dateChangebirthdayD(val) {
      console.log(val);
      this.editForm.couponEndtime = val;
    },
    dateFormatterexpirationTime(row, column) {
      let datetime = row.expirationTime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        return y + mon + d;
      }
      return "";
    },
    dateFormatter(row, column) {
      let datetime = row.joinTime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        return y + mon + d;
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
    // 获取数据
    getData() {
      var res = this;
      this.$axios({
        url: "JinshiCoupon/selectCouponAll",
        method: "post",
        data: {
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: String(localStorage.getItem("parkId"))
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            for (var i = 0; i < response.data.CouponData.length; i++) {
              if (response.data.CouponData[i].couponEndtime) {
                response.data.CouponData[i].couponEndtime = res.timestampToTime(
                  response.data.CouponData[i].couponEndtime
                );
              } else {
              }
              if (response.data.CouponData[i].couponStarttime) {
                response.data.CouponData[
                  i
                ].couponStarttime = res.timestampToTime(
                  response.data.CouponData[i].couponStarttime
                );
              } else {
              }
              res.tableData = response.data.CouponData;
              res.totalRecords = response.data.CouponRecords; //总条数
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    getAgent() {
      this.agent.length = 0;
      var res = this;
      this.$axios({
        url: "parkingJinshi/selectAllAgent",
        method: "post",
        data: {}
      })
        .then(function(response) {
          res.agent = [];
          for (var i = 0; i < response.data.agentNameData.length; i++) {
            res.agent.push({
              couponAgentName: response.data.agentNameData[i].username
            });
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    getArea() {
      this.area.length = 0;
      var res = this;
      this.$axios({
        url: "jinshiArea/selectAreaNameAll?parkId="+localStorage.getItem("parkId"),
        method: "get",
        data: {}
      })
        .then(function(response) {
          res.area = [];
          for (var i = 0; i < response.data.areaNameData.length; i++) {
            res.area.push({
              value: response.data.areaNameData[i].id,
              label: response.data.areaNameData[i].areaName
            });
          }
          console.log(res.area);
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    getParking() {
      this.parking.length = 0;
      var res = this;
      this.$axios({
        url: "parkingJinshi/selectAllParkingName",
        method: "post",
        data: {}
      })
        .then(function(response) {
          res.parking = [];
          for (var i = 0; i < response.data.parkingNameData.length; i++) {
            res.parking.push({
              couponParkingName: response.data.parkingNameData[i].jpName
            });
            res.addForm.couponParkingName =
              response.data.parkingNameData[i].jpName;
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    //充值
    handleadd(index, row) {
      this.idx = index;
      this.id = row.couponId;
      console.log("====", row.couponId);
      var idd = row.couponId;
      console.log(row.couponId);
      this.addnewForm = {
        couponId: idd,
        couponCount: this.addnewForm.couponCount
      };

      this.addnewVisible = true;
    },
    //修改
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.couponId;
      console.log(this.id);
      this.editForm = {
        couponId: row.couponId,
        couponName: row.couponName,
        couponType: row.couponType,
        couponCount: row.couponCount,
        couponStarttime: row.couponStarttime,
        couponEndtime: row.couponEndtime,
        couponBcName: row.couponBcName,
        couponAgentName: row.couponAgentName,
        couponParkingName: row.couponParkingName,
        couponAreaName: row.couponAreaName,
        couponDataA: row.couponDataA
      };
      this.editVisible = true;
    },
    addSure() {
      var res = this;
      var setData = this.addnewForm;
      // console.log(this.addnewForm)
      console.log(this.addnewForm);

      this.$refs.addnewForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "JinshiCoupon/updateCouponCount",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.addnewVisible = false;
                res.$message.success("充值成功");
                if (res.tableData[res.idx].id === res.id) {
                  res.$set(res.tableData, res.idx, res.addnewForm);
                } else {
                  for (let i = 0; i < res.tableData.length; i++) {
                    if (res.tableData[i].id === res.id) {
                      res.$set(res.tableData, i, res.addnewForm);
                      return;
                    }
                  }
                }
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.error("充值失败！");
              console.log(error);
            });
        }

        // 验证通过后的处理...
      });
    },
    // 保存编辑
    saveEdit() {
      var res = this;
      var setData = this.editForm;
      console.log(this.editForm);
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "JinshiCoupon/updateByPrimaryKey",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                res.$message.success("修改成功");
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                if (res.tableData[res.idx].id === res.id) {
                  res.$set(res.tableData, res.idx, res.editForm);
                } else {
                  for (let i = 0; i < res.tableData.length; i++) {
                    if (res.tableData[i].id === res.id) {
                      res.$set(res.tableData, i, res.editForm);
                      return;
                    }
                  }
                }
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success("修改失败！");
              console.log(error);
            });
        }

        // 验证通过后的处理...
      });
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.couponId;
      console.log(this.id);
      this.delVisible = true;
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
    },
    // 添加
    saveAdd() {
      console.log(this.addForm.passWord, this.addForm.passwordsure);
      if (this.addForm.passWord == this.addForm.passwordsure) {
        var res = this;
        res.addForm.rolename = res.value;
        res.addForm.couponAgentName = localStorage.getItem("agentId");
       
        for(var i=0;i<this.area.length;i++){
         if(this.area[i].value==this.addForm.couponAreaName){
             this.addForm.couponAreaName=this.area[i].label
         }
      }
       var setData = this.addForm;
       console.log(setData)
        this.$refs.addForm.validate(valid => {
          if (!valid) {
            res.$message.success("格式不正确");
          } else {
            this.$axios({
              url: "JinshiCoupon/insert",
              method: "post",
              data: setData
            })
              .then(function(response) {
                if (response.status <= 200) {
                  if (response.data.code == 1) {
                    res.$message.error("用户名已存在");
                  } else {
                    res.addVisible = false;
                    res.$message.success("添加成功");
                    res.getData();
                  }
                }
              })
              .catch(function(error) {
                res.$message.error("添加失败！");
                console.log(error);
              });
          }
        });
      } else {
        alert("两次密码不一致");
      }
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url: "JinshiCoupon/deleteByPrimaryKey?id=" + res.id,
        method: "post",
        data: { id: res.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.getData();
            res.delVisible = false;
            if (res.tableData[res.idx].id === res.id) {
              res.tableData.splice(res.idx, 1);
            } else {
              for (let i = 0; i < res.tableData.length; i++) {
                if (res.tableData[i].id === res.id) {
                  res.tableData.splice(i, 1);
                  return;
                }
              }
            }
          }
        })
        .catch(function(error) {
          res.$message.success("删除失败！");
          console.log(error);
        });
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
.nserder {
  text-align: center;
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
</style>

