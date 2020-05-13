<template>
  <div class="whiteListManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>白名单
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
        <el-table-column label="操作" align="center" class-name="table">
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
            <el-button
              type="text"
              icon="el-icon-star-off"
              @click="attention(scope.$index, scope.row)"
            >关注</el-button>
            <el-button
              type="text"
              icon="el-icon-star-off"
              @click="noattention(scope.$index, scope.row)"
            >取消关注</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" class-name="table"></el-table-column>
        <el-table-column prop="lincensePlateNumber" label="车牌号" class-name="table"></el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="dateFormatter"
          label="创建时间"
          sortable
          class-name="table"
        ></el-table-column>
        <el-table-column prop="isFlag" label="关注" class-name="table"></el-table-column>
        <el-table-column prop="describtion" label="备注" class-name="table"></el-table-column>
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="carFormRules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="lincensePlateNumber">
          <el-input v-model="editForm.lincensePlateNumber" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="是否关注" prop="isFlag">
          <el-select v-model="editForm.isFlag" placeholder="类型" class="handle-select mr10">
            <el-option key="1" label="否" value="未关注"></el-option>
            <el-option key="0" label="是" value="已关注"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="describtion">
          <el-input v-model="editForm.describtion" placeholder="请添加备注"></el-input>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="lincensePlateNumber">
          <el-input v-model="addForm.lincensePlateNumber" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="是否关注" prop="isFlag">
          <el-select v-model="addForm.isFlag" placeholder="请选择类型" class="handle-select mr10">
            <el-option key="1" label="否" value="未关注"></el-option>
            <el-option key="0" label="是" value="已关注"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="describtion">
          <el-input v-model="addForm.describtion" placeholder="请添加备注"></el-input>
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
      numberer: 0,
      condition: 0,
      editForm: {
        id: "",
        name: "",
        lincensePlateNumber: "",
        describtion: "",
        listType: "",
        createTime: "",
        isFlag: "",
        parkId: localStorage.getItem("parkId"),
        agentId: localStorage.getItem("agentId")
      },
      addForm: {
        id: "",
        name: "",
        lincensePlateNumber: "",
        describtion: "",
        listType: "",
        createTime: "",
        isFlag: "",
        parkId: localStorage.getItem("parkId"),
        agentId: localStorage.getItem("agentId")
      },
      attForm: {
        id: "",
        name: "",
        lincensePlateNumber: "",
        describtion: "",
        listType: "",
        createTime: "",
        isFlag: ""
      },
      isflag: {
        isFlag: ""
      },
      carFormRules: {
        lincensePlateNumber: [
          { message: "车牌号不能为空", required: true, trigger: "blur" },
          { min: 3, max: 12, message: "请输入正确车牌号", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        name: [
          { message: "姓名不能为空", required: true, trigger: "blur" },
          { min: 2, max: 5, message: "长度应在2-5个字之间", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        listType: [
          { min: 0, max: 10, message: "长度应在0-10个字之间", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        describtion: [
          { message: "请输入描述", required: true, trigger: "blur" },
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
        ]
      },
      idx: -1,
      id: -1
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
      this.editForm={}
      this.select_word=""
      this.addForm={}
      this.getData();
    },
    dateFormatterexpirationTime(row, column) {
      let datetime = row.createTime;
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
      let datetime = row.createTime;
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
      if (this.numberer == 0) {
        this.cur_page = val;
        this.getData();
      } else {
        this.cur_page = val;
        this.search(2);
      }
    },
    // 获取 easy-mock 的模拟数据
    getData(value) {
       if(value==1){
        this.cur_page=1
      }
      this.numberer = 0;
      var res = this;
      this.$axios({
        url: "whiteList/selectWhiteListAll",
        method: "post",
        data: {
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: localStorage.getItem("parkId")
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData=[]
            res.tableData = response.data.whiteListData;
            res.totalRecords = response.data.whiteListTotalRecords; //总条数
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
        url: "whiteList/searchWhiteList",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: Number(localStorage.getItem("parkId"))
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData = response.data.whiteListData;
            res.totalRecords = response.data.whiteListTotalRecords; //总条数
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
        name: row.name,
        lincensePlateNumber: row.lincensePlateNumber,
        describtion: row.describtion,
        listType: row.listType,
        createTime: row.createTime,
        isFlag: row.isFlag
      };
      this.editVisible = true;
    },
    //加关注
    attention(index, row) {
      var res = this;
      var idx = "";
      var id = "";
      this.idx = index;
      this.id = row.id;
      this.attForm = {
        id: row.id,
        name: row.name,
        lincensePlateNumber: row.lincensePlateNumber,
        describtion: row.describtion,
        listType: row.listType,
        createTime: row.createTime,
        isFlag: row.isFlag
      };
      var setData = this.attForm;
      this.$axios({
        url: "whiteList/updateFlagZero",
        method: "post",
        data: setData
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("关注成功");
          }
        })
        .catch(function(error) {
          res.$message.error("关注失败！");
          console.log(error);
        });
    },
    //取消关注
    noattention(index, row) {
      var res = this;
      var idx = "";
      var id = "";
      this.idx = index;
      this.id = row.id;
      this.attForm = {
        id: row.id,
        name: row.name,
        lincensePlateNumber: row.lincensePlateNumber,
        describtion: row.describtion,
        listType: row.listType,
        createTime: row.createTime,
        isFlag: row.isFlag
      };
      var setData = this.attForm;
      this.$axios({
        url: "whiteList/updateFlagOne",
        method: "post",
        data: setData
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("取消成功");
          }
        })
        .catch(function(error) {
          res.$message.error("取消失败！");
          console.log(error);
        });
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
            url: "whiteList/updateByPrimaryKey",
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
              res.$message.error("修改失败！");
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
          res.$message.error("格式不正确");
        } else {
          this.$axios({
            url: "whiteList/insert",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.addVisible = false;
                res.$message.success("添加成功");
                res.getData()
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
        url: "whiteList/deleteByPrimaryKey",
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
.none {
  display: none;
}
.nserder {
  text-align: center;
}
</style>
