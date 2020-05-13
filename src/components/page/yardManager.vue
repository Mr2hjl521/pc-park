<template>
  <div class="yardManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 车场管理
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
        <el-table-column prop="jpName" label="名称" align="center" class-name="table"></el-table-column>
        <el-table-column prop="jpUsername" label="用户名" align="center" class-name="table"></el-table-column>
        <el-table-column prop="jpLoginname" label="登录名" align="center" class-name="table"></el-table-column>
        <el-table-column prop="jpSite" label="地址" align="center" class-name="table"></el-table-column>
        <el-table-column prop="jpNumber" label="编号" align="center" class-name="table"></el-table-column>
        <el-table-column prop="jpPhoneNumber" label="联系方式" align="center" class-name="table"></el-table-column>
        <!-- <el-table-column prop="jpPlaceNumber" label="车位数"  align="center" class-name="table">
        </el-table-column>-->
        <!-- <el-table-column prop="jpCameraBrand" label="摄像品牌"  align="center" class-name="table">
        </el-table-column>-->
        <el-table-column prop="jpAgentName" label="代理商" align="center" class-name="table"></el-table-column>
        <el-table-column prop="jpRemark" label="备注" align="center" class-name="table"></el-table-column>
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
        <el-form-item label="用户名" prop="jpUsername">
          <el-input v-model="editForm.jpUsername" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="jpLoginname">
          <el-input v-model="editForm.jpLoginname" placeholder="请输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="jpName">
          <el-input v-model="editForm.jpName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="jpSite">
          <el-input v-model="editForm.jpSite" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="车场编号" prop="jpNumber">
          <el-input v-model="editForm.jpNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="jpPhoneNumber">
          <el-input v-model="editForm.jpPhoneNumber" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <!-- <el-form-item label="车位数" prop="jpPlaceNumber">
                    <el-input v-model="editForm.jpPlaceNumber"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="摄像头品牌" prop="jpCameraBrand">
                    <el-select v-model="editForm.jpCameraBrand" placeholder="摄像头品牌">
                      <el-option
                        v-for="item in getcarama"
                            :key="item.id"
                           :label="item.jpCameraBrand"
                        :value="item.jpCameraBrand"
                      ></el-option>
                    </el-select>
        </el-form-item>-->
        <el-form-item label="代理商" prop="jpAgentName">
          <el-select v-model="editForm.jpAgentName" placeholder="请选择代理商">
            <el-option
              v-for="item in getAgentName"
              :key="item.jpAgentName"
              :label="item.jpAgentName"
              :value="item.jpAgentName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="jpRemark">
          <el-input v-model="editForm.jpRemark" placeholder="请填写备注"></el-input>
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
        <el-form-item label="名称" prop="jpName">
          <el-input v-model="addForm.jpName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="jpUsername">
          <el-input v-model="addForm.jpUsername" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="jpLoginname">
          <el-input v-model="addForm.jpLoginname" placeholder="请输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="jpSite">
          <el-input v-model="addForm.jpSite" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="车场编号" prop="jpNumber">
          <el-input v-model="addForm.jpNumber" placeholder="请输入车场编号"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="jpPhoneNumber">
          <el-input v-model="addForm.jpPhoneNumber" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <!-- <el-form-item label="车位数" prop="jpPlaceNumber">
                    <el-input v-model="addForm.jpPlaceNumber"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="摄像头品牌" prop="jpCameraBrand">
                    <el-select v-model="addForm.jpCameraBrand" placeholder="摄像头品牌">
                      <el-option
                        v-for="item in getcarama"
                            :key="item.id"
                           :label="item.jpCameraBrand"
                        :value="item.jpCameraBrand"
                      ></el-option>
                    </el-select>
        </el-form-item>-->
        <el-form-item label="代理商" prop="jpAgentName">
          <el-select v-model="addForm.jpAgentName" placeholder="请选择代理商">
            <el-option
              v-for="item in getAgentName"
              :key="item.jpAgentName"
              :label="item.jpAgentName"
              :value="item.jpAgentName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="jpRemark">
          <el-input v-model="addForm.jpRemark" placeholder="请添加备注"></el-input>
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
      getcarama: [
        {
          jpCameraBrand: "芊熠"
        },
        {
          jpCameraBrand: "臻识"
        }
      ],
      getAgentName: [],
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
      numberer:0,
      condition:0,
      editForm: {
        jpLoginname: "",
        jpUsername: "",
        jpId: "",
        jpName: "",
        jpSite: "",
        jpMembers: "",
        jpTotalTurnover: "",
        jpNumber: "",
        jpPhoneNumber: "",
        jpPlaceNumber: "",
        jpCameraBrand: "",
        jpPicturePath: "",
        jpAgentName: "",
        jpRemark: "",
        jpCreatetime: "",
        jpIsdelete: ""
      },
      addForm: {
        jpLoginname: "",
        jpUsername: "",
        jpId: "",
        jpName: "",
        jpSite: "",
        jpMembers: "",
        jpTotalTurnover: "",
        jpNumber: "",
        jpPhoneNumber: "",
        jpPlaceNumber: "",
        jpCameraBrand: "",
        jpPicturePath: "",
        jpAgentName: "",
        jpRemark: "",
        jpCreatetime: "",
        jpIsdelete: ""
      },
      carFormRules: {
        jpName: [
          { message: "名称不能为空", required: true, trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度应在3到12个字之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        jpSite: [
          { message: "地址不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应在1个字到10个字之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        jpPhoneNumber: [
          {
            message: "手机号不能为空",
            trigger: ["blur", "change"],
            required: true
          },
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
        jpNumber: [
          { message: "编号不能为空", required: true, trigger: "blur" }
        ],
        jpUsername: [
          { message: "用户名不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应该在1-10个字符之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        jpLoginname: [
          { message: "登录名不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应该在1-10个字符之间",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        jpRemark: [
          {
            min: 1,
            max: 20,
            message: "长度应该在1-20个字符之间",
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
      this.select_word=""
      this.addForm={}
      this.editForm={}
    },
    getJur() {
      var res = this;
      this.$axios({
        url: "parkingJinshi/selectAllAgent",
        method: "post",
        data: {}
      })
        .then(function(response) {
          res.getAgentName=[]
          for (var i = 0; i < response.data.agentNameData.length; i++) {
            res.getAgentName.push({
              jpAgentName: response.data.agentNameData[i].username
            });
          }
          console.log(res.getdaili);
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
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
        url: "parkingJinshi/selectParkingAll",
        method: "post",
        data: {
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          agentId: localStorage.getItem("agentId")
        }
      })
        .then(function(response) {
          res.tableData=[]
          if (response.status <= 200) {
            res.tableData = response.data.parkingData;
            res.totalRecords = response.data.parkingTotalRecords; //总条数
            console.log(response.data.parkingData);
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
        url: "parkingJinshi/searchParking",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          agentId:localStorage.getItem("agentId")
        }
      })
        .then(function(response) {
          console.log(response,"sousuo")
          if (response.status <= 200) {
            res.tableData = response.data.parkingData;
            res.totalRecords = response.data.parkingTotalRecords; //总条数
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
        jpName: row.jpName,
        jpSite: row.jpSite,
        jpMembers: row.jpMembers,
        jpTotalTurnover: row.jpTotalTurnover,
        jpNumber: row.jpNumber,
        jpPhoneNumber: row.jpPhoneNumber,
        jpPlaceNumber: row.jpPlaceNumber,
        jpCameraBrand: row.jpCameraBrand,
        jpPicturePath: row.jpPicturePath,
        jpAgentName: row.jpAgentName,
        jpRemark: row.jpRemark,
        jpCreatetime: row.jpCreatetime,
        jpLoginname: row.jpLoginname,
        jpUsername: row.jpUsername
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.jpId;
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
            url: "parkingJinshi/updateByParking",
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
            url: "parkingJinshi/insert",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                if (response.data == 5) {
                  res.$message.error("已存在");
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
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url: "parkingJinshi/deleteByJpNumber",
        method: "post",
        data: { id: res.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.delVisible = false;
            if (res.tableData[res.idx].jpId === res.id) {
              res.tableData.splice(res.idx, 1);
            } else {
              for (let i = 0; i < res.tableData.length; i++) {
                if (res.tableData[i].jpId === res.id) {
                  res.tableData.splice(i, 1);
                  return;
                }
              }
            }
          }
        })
        .catch(function(error) {
          console.log(res.id);
          res.$message.success("查询失败！");
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
.nserder {
  text-align: center;
}
.yardManager {
  width: 100%;
  height: 100%;
}
</style>

