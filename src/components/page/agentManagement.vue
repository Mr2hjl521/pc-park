<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 代理商管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
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
        <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120" class-name="table"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" width="120" class-name="table"></el-table-column>
        <el-table-column prop="province" label="省份" width="120" class-name="table"></el-table-column>
        <el-table-column prop="city" label="城市" width="100" class-name="table"></el-table-column>
        <el-table-column prop="district" label="区县" width="100" class-name="table"></el-table-column>
        <el-table-column prop="rentalTerm" label="服务年限" width="120" class-name="table"></el-table-column>
        <el-table-column prop="fixedPhone" label="固定电话" width="120" class-name="table"></el-table-column>
        <el-table-column prop="weChat" label="微信" width="100" class-name="table"></el-table-column>
        <el-table-column prop="qq" label="QQ" width="120" class-name="table"></el-table-column>
        <el-table-column prop="dividedRatio" label="分润比例" width="120" class-name="table"></el-table-column>
        <el-table-column label="操作"  align="center" class-name="table">
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="carFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
       
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="editForm.qq" placeholder="请输入QQ"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="weChat">
          <el-input v-model="editForm.weChat" placeholder="请输入微信"></el-input>
        </el-form-item>
        <el-form-item label="固定电话" prop="fixedPhone">
          <el-input v-model="editForm.fixedPhone" placeholder="请输入固定电话"></el-input>
        </el-form-item>
        <el-form-item label="分润比例" prop="dividedRatio">
          <el-input v-model="editForm.dividedRatio" placeholder="请输入分润比例"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber" placeholder="请输入phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-select v-model="editForm.province" placeholder="请选择省份" @change="handleCommandA">
            <el-option
              v-for="item in getProvince"
              :key="item.id"
              :label="item.province"
              :value="item.province"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-select v-model="editForm.city" placeholder="请选择城市" @change="handgetDesA">
            <el-option
              v-for="item in getCity"
              :key="item.city"
              :label="item.city"
              :value="item.city"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区县" prop="district">
          <el-select v-model="editForm.district" placeholder="请选择区县">
            <el-option
              v-for="item in getdistrict"
              :key="item.district"
              :label="item.district"
              :value="item.district"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务年限" prop="rentalTerm">
          <el-input v-model="editForm.rentalTerm" placeholder="请输入服务年限"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="carFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
      
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="addForm.qq" placeholder="请输入QQ账号"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="weChat">
          <el-input v-model="addForm.weChat" placeholder="请输入微信号"></el-input>
        </el-form-item>
        <el-form-item label="固定电话" prop="fixedPhone">
          <el-input v-model="addForm.fixedPhone" placeholder="请输入固定电话"></el-input>
        </el-form-item>
        <el-form-item label="分润比例" prop="dividedRatio">
          <el-input v-model="addForm.dividedRatio" placeholder="请输入分润比例"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="addForm.phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-select v-model="addForm.province" placeholder="请选择省份" @change="handleCommand">
            <el-option
              v-for="item in getProvince"
              :key="item.id"
              :label="item.province"
              :value="item.province"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-select v-model="addForm.city" placeholder="请选择城市" @change="handgetDes">
            <el-option
              v-for="item in getCity"
              :key="item.city"
              :label="item.city"
              :value="item.city"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区县" prop="district">
          <el-select v-model="addForm.district" placeholder="请选择区县">
            <el-option
              v-for="item in getdistrict"
              :key="item.district"
              :label="item.district"
              :value="item.district"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务年限" prop="rentalTerm">
          <el-input v-model="addForm.rentalTerm" placeholder="请输入服务年限"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
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
      getdistrict: [],
      getCity: [],
      getProvince: [],
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      condition:0,
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      numberer:0,
      editForm: {
        district: "",
        dividedRatio: "0.001",
        weChat: "",
        qq: "",
        loginName: "",
        fixedPhone: "",
        id: "",
        username: "",
        phoneNumber: "",
        rentalTerm: "",
        remainingTime: "",
        city: "",
        province: "",
        state: "",
        parkingNumbers: ""
      },
      addForm: {
        district: "",
        dividedRatio: "0.001",
        weChat: "",
        qq: "",
        loginName: "",
        fixedPhone: "",
        id: "",
        username: "",
        phoneNumber: "",
        city: "",
        province: "",
        rentalTerm: "一年",
        remainingTime: "",
        state: "",
        parkingNumbers: ""
      },
      carFormRules: {
        //用户名/登录名
        username: [
          { message: "用户名不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应在1-10个字符之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        phoneNumber: [
          { message: "手机号不能为空", required: true },
          {
            min: 11,
            max: 11,
            message: "请输入11位手机号"
          }
        ],
        qq: [
          {
            min: 1,
            max: 20,
            message: "长度应在1-20个字符之间",
            trigger: "blur"
          },
          { pattern: /^[0-9]+$/, message: "只允许输入数字" }
        ],
        weChat: [
          {
            min: 1,
            max: 20,
            message: "长度该在1-20个字符之间",
            trigger: "blur"
          },
          { pattern: /^[0-9a-zA-Z]+$/, message: "不允许输入汉字" }
        ],
        fixedPhone: [
          {
            min: 5,
            max: 10,
            message: "长度应在5-10个字符之间",
            trigger: "blur"
          }
        ],
        rentalTerm: [
          {
            min: 1,
            max: 10,
            message: "长度应在1-10个字符之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        loginName: [
          { message: "登录名不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应在1-10个字符之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ]
      },
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData();
    this.getJur();
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
      this.getJur();
      this.editForm={},
      this.select_word="",
      this.addForm={
        district: "",
        dividedRatio: "0.001",
        weChat: "",
        qq: "",
        loginName: "",
        fixedPhone: "",
        id: "",
        username: "",
        phoneNumber: "",
        city: "",
        province: "",
        rentalTerm: "一年",
        remainingTime: "",
        state: "",
        parkingNumbers: ""
      }
    },
    //添加接口获取市级
    handleCommand() {
      var res = this;
      res.getCity = [];
      this.$axios({
        url: "sharea/selectcity",
        method: "post",
        data: { name: res.addForm.province }
      })
        .then(function(response) {
          console.log(response,"市");
          if (response.status <= 200) {
            for (var i = 0; i < response.data.shareaData[0].length; i++) {
              res.getCity.push({
                city: response.data.shareaData[0][i].name
              });
            }
            console.log(res.getCity);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //添加接口获取区县
    handgetDes() {
      var res = this;
      res.getdistrict = [];
      this.$axios({
        url: "sharea/selectDistrict",
        method: "post",
        data: { name: res.addForm.city }
      })
        .then(function(response) {
          console.log(response,"区");
          if (response.status <= 200) {
            for (var i = 0; i < response.data.shareaData[0].length; i++) {
              res.getdistrict.push({
                district: response.data.shareaData[0][i].name
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑接口获取市级
    handleCommandA() {
      var res = this;
      res.getCity = [];
      this.$axios({
        url: "sharea/selectcity",
        method: "post",
        data: { name: res.editForm.province }
      })
        .then(function(response) {
          console.log(response.data.shareaData);
          if (response.status <= 200) {
            for (var i = 0; i < response.data.shareaData[0].length; i++) {
              res.getCity.push({
                city: response.data.shareaData[0][i].name
              });
            }
            console.log(res.getCity);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑接口获取区县
    handgetDesA() {
      var res = this;
      res.getdistrict = [];
      this.$axios({
        url: "sharea/selectDistrict",
        method: "post",
        data: { name: res.editForm.city }
      })
        .then(function(response) {
          console.log(response.data.shareaData);
          if (response.status <= 200) {
            for (var i = 0; i < response.data.shareaData[0].length; i++) {
              res.getdistrict.push({
                district: response.data.shareaData[0][i].name
              });
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getJur() {
      var res = this;
      this.$axios({
        url: "sharea/selects",
        method: "post",
        data: {}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.getProvince=[]
            for (var i = 0; i < response.data.shareaData.length; i++) {
              res.getProvince.push({
                id: response.data.shareaData[i].id,
                province: response.data.shareaData[i].name
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
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
      if(this.numberer==0){
        this.pagesize = val;
        this.getData(1)
      }else{
        this.pagesize = val;
        this.search(1)
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
      var res = this;
      this.numberer=0;
      this.$axios({
        url: "agent/selectAgentAll ",
        method: "post",
        data: { 
                pageNum: res.cur_page, pageSize: res.pagesize, 
                agentId:String(localStorage.getItem("agentId")),
                roleName:localStorage.getItem("roleName") 
            }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData=[]
            res.tableData = response.data.AgentData;
            res.totalRecords = response.data.AgentRecords; //总条数
            console.log(response.data.AgentData);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    search(value) {
      this.is_search = true;
      this.numberer=1;
      if(value==1){
        this.cur_page=1
      }
      var res = this;
      this.$axios({
        url: "agent/searchAgent",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData = response.data.AgentData;
            res.totalRecords = response.data.AgentRecords; //总条数
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
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.id;
      this.editForm = {
        id: row.id,
        username: row.username,
        phoneNumber: row.phoneNumber,
        site: row.site,
        rentalTerm: row.rentalTerm,
        remainingTime: row.remainingTime,
        state: row.state,
        parkingNumbers: row.parkingNumbers,
        province: row.province,
        city: row.city,
        district: row.district,
        dividedRatio: "0.001",
        weChat: row.weChat,
        qq: row.qq,
        loginName: row.loginName,
        fixedPhone: row.fixedPhone
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.id;
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
    // 保存编辑
    saveEdit() {
      var res = this;
      var setData = this.editForm;
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "agent/updateByPrimaryKey",
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
    // 添加
    saveAdd() {
      var res = this;
      var setData = this.addForm;
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "agent/insert",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.addVisible = false;
                res.$message.success("添加成功");
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.error("添加失败！");
              console.log(error);
            });
        }
      });
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url: "agent/deleteByPrimaryKey",
        method: "post",
        data: { id: res.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
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
.nserder {
  text-align: center;
}
.container {
  width: 97%;
  height: 100%;
}
</style>

