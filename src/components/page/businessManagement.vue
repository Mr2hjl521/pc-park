<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 商户管理
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
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="bcUsername" label="登录名" class-name="table"></el-table-column>
        <el-table-column prop="bcName" label="商户名" class-name="table"></el-table-column>
        <el-table-column prop="bcPhone" label="手机号" class-name="table"></el-table-column>
       
        <el-table-column prop="bcWechat" label="微信" class-name="table"></el-table-column>
        
        <el-table-column prop="bcContactsName" label="联系人" class-name="table"></el-table-column>
       
       
      
        <el-table-column prop="bcParkingName" label="停车场" class-name="table"></el-table-column>
        <el-table-column prop="bcAreaName" label="区域" class-name="table"></el-table-column>
         <el-table-column prop="bcRemarks" label="备注" class-name="table"></el-table-column>
        
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
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="carFormRules" label-width="100px">
        <el-form-item label="商户名" prop="bcName">
          <el-input v-model="addForm.bcName " placeholder="请填写商户名,此为必填项"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="bcUsername">
          <el-input v-model="addForm.bcUsername" placeholder="请填写登录名，用户商户登陆时的登录名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="bcPhone">
          <el-input v-model="addForm.bcPhone" placeholder="请填写手机号"></el-input>
        </el-form-item>
       
        <el-form-item label="微信" prop="bcWechat">
          <el-input v-model="addForm.bcWechat" placeholder="请输入微信号，如微信号为手机号可不填写"></el-input>
        </el-form-item>
        
        <el-form-item label="联系人姓名" prop="bcContactsName">
          <el-input v-model="addForm.bcContactsName" placeholder="请填写联系人姓名"></el-input>
        </el-form-item>

        <!-- <el-form-item label="密码" prop="bcPassword">
          <el-input v-model="addForm.bcPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordsure">
          <el-input v-model="addForm.passwordsure"></el-input>
        </el-form-item>-->
        <el-form-item label="备注" prop="bcRemarks">
          <el-input v-model="addForm.bcRemarks" placeholder="请填写备注"></el-input>
        </el-form-item>
        
        <el-form-item label="停车场" prop="bcParkingName">
          <el-select v-model="addForm.bcParkingName" disabled>
            <el-option
              v-for="item in parking"
              :key="item.bcParkingName"
              :label="item.bcParkingName"
              :value="item.bcParkingName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="bcAreaId">
          <el-select v-model="addForm.bcAreaName" placeholder="区域">
            <el-option
              v-for="item in area"
              :key="item.bcAreaName"
              :label="item.bcAreaName"
              :value="item.bcAreaName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="修改用户权限" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="商户名" prop="bcName " disabled>
          <el-input v-model="editForm.bcName" placeholder="请输入商户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="bcPhone">
          <el-input v-model="editForm.bcPhone" placeholder="请输入手机号"></el-input>
        </el-form-item>
      
        <el-form-item label="微信" prop="bcWechat">
          <el-input v-model="editForm.bcWechat" placeholder="请输入微信"></el-input>
        </el-form-item>
       
        <el-form-item label="联系人" prop="bcContactsName ">
          <el-input v-model="editForm.bcContactsName" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="bcUsername">
          <el-input v-model="editForm.bcUsername" disabled placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="bcPassword">
          <el-input v-model="editForm.bcPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordsure">
          <el-input v-model="editForm.passwordsure"></el-input>
        </el-form-item>-->
        <el-form-item label="备注" prop="bcRemarks">
          <el-input v-model="editForm.bcRemarks" placeholder="请输入备注"></el-input>
        </el-form-item>
        <!-- 
        <el-form-item label="代理商" prop="bcAgentName">
          <el-select v-model="editForm.bcAgentName" placeholder="代理商">
            <el-option
              v-for="item in agent"
              :key="item.bcAgentName"
              :label="item.bcAgentName"
              :value="item.bcAgentName"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="停车场" prop="bcParkingName">
          <el-select v-model="editForm.bcParkingName" disabled placeholder="请选择停车场">
            <el-option
              v-for="item in parking"
              :key="item.bcParkingName"
              :label="item.bcParkingName"
              :value="item.bcParkingName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="bcAreaName">
          <el-select v-model="editForm.bcAreaName" placeholder="请选择区域">
            <el-option
              v-for="item in area"
              :key="item.bcAreaName"
              :label="item.bcAreaName"
              :value="item.bcAreaName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 结束-->
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
      editVisible: false,
      addVisible: false,
      delVisible: false,
      addForm: {
        bcId: "",
        bcName: "",
        bcPhone: "",
        bcWechat: "",
        bcTel: "",
        bcQq: "",
        bcContactsName: "",
        bcUsername: "",
        bcPassword: "",
        bcRemarks: "",
        passwordsure: "",
        bcAgentName: "",
        bcParkingName: "",
        bcAreaName: ""
      },
      editForm: {
        bcId: "",
        bcName: "",
        bcPhone: "",
        bcWechat: "",
        bcTel: "",
        bcQq: "",
        bcContactsName: "",
        bcUsername: "",
        bcPassword: "",
        bcRemarks: "",
        passwordsure: "",
        bcAgentName: "",
        bcParkingName: "",
        bcAreaName: ""
      },
      options: [],
      value: "",
      carFormRules: {
        bcName: [
          { message: "商户名不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应在1到10个字之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        bcUsername: [
          { message: "请填写登录名", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应在1到10个字之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        bcPhone: [
          {
            min: 11,
            max: 11,
            message: "请输入11位手机号",
            trigger: "blur"
          },
          {
            pattern: /^[0-9]+$/,
            message: "请输入正确的手机号"
          }
        ],
        bcTel: [
          {
            min: 5,
            max: 10,
            message: "请输入正确的座机号",
            trigger: "blur"
          }
        ],
        bcQq: [
          {
            min: 3,
            max: 12,
            message: "请输入正确qq号",
            trigger: "blur"
          },
          {
            pattern: /^[0-9]+$/,
            message: "请输入正确的qq号"
          }
        ],
        bcContactsName: [
          {
            min: 2,
            max: 5,
            message: "联系人长度在2-5个字符之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        bcRemarks: [
          {
            min: 0,
            max: 10,
            message: "备注长度在0-10个字符之间",
            trigger: "blur"
          }
        ]
      },
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getAgent();
    this.getArea();
    this.getParking();
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
        url: "JinshiBusinessAccount/selectBusinessAccountAll",
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
            res.tableData = response.data.BusinessAccountData;
            console.log(response.data);
            res.totalRecords = response.data.BusinessAccountRecords; //总条数
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
              bcAgentName: response.data.agentNameData[i].username
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
        url: "jinshiArea/selectAreaNameAll?parkId="+ String(localStorage.getItem("parkId")),
        method: "get",
      })
        .then(function(response) {
          res.area = [];
          for (var i = 0; i < response.data.areaNameData.length; i++) {
            res.area.push({
              bcAreaName: response.data.areaNameData[i].areaName
            });
          }
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
              bcParkingName: response.data.parkingNameData[i].jpName
            });
            res.addForm.bcParkingName = response.data.parkingNameData[i].jpName;
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
    //修改
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.bcId;
      console.log(this.id);
      this.editForm = {
        bcId: row.bcId,
        bcName: row.bcName,
        bcPhone: row.bcPhone,
        bcWechat: row.bcWechat,
        bcTel: row.bcTel,
        bcQq: row.bcQq,
        bcContactsName: row.bcContactsName,
        bcUsername: row.bcUsername,
        bcPassword: row.bcPassword,
        bcRemarks: row.bcRemarks,
        passwordsure: row.passwordsure,
        bcAgentName: row.bcAgentName,
        bcParkingName: row.bcParkingName,
        bcAreaName: row.bcAreaName
      };
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      var res = this;
      var setData = this.editForm;
      // if(this.editForm.password==this.editForm.passwordsure)
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "JinshiBusinessAccount/updateByPrimaryKey",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.getData();
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
      this.id = row.bcId;
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
      // if (this.addForm.passwordsure == this.addForm.bcPassword) {
      var res = this;
      res.addForm.rolename = res.value;
      res.addForm.bcAgentName = localStorage.getItem("agentId");
      var setData = this.addForm;
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "JinshiBusinessAccount/insert",
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
      // } else {
      //   alert("两次密码不一致");
      // }
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url: "JinshiBusinessAccount/deleteByPrimaryKey?id=" + res.id,
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
.nserder {
  text-align: center;
}
</style>

