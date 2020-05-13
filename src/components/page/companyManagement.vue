<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 公司管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
        <el-button type="primary" icon="el-icon-search" @click="addVisible = true">添加</el-button>
          <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>
        <!-- 
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="addVisible = true">添加</el-button>
                <a href="http://localhost:8080/carmanager_war/member/batchExport" class="outup">导出数据</a>
                <el-upload class="upload-demo"  action="member/batchImport" show-file-list="false">
                    <el-button size="small" type="primary" class="inup">导入</el-button>
        </el-upload>-->
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" class-name="table"></el-table-column>
        <el-table-column type="index" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="jsName" label="公司名称" class-name="table"></el-table-column>
        <el-table-column prop="jsSite" label="公司地点" class-name="table"></el-table-column>
        <el-table-column prop="jsType" label="公司类型" class-name="table"></el-table-column>
        <el-table-column prop="jsUsername" label="联系人" class-name="table"></el-table-column>
        <el-table-column prop="jsPhone" label="联系人电话" class-name="table"></el-table-column>
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
        <el-form-item label="公司名称" prop="jsName">
          <el-input v-model="editForm.jsName" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="公司地点" prop="jsSite">
          <el-input v-model="editForm.jsSite" placeholder="请输入公司地点"></el-input>
        </el-form-item>
        <el-form-item label="公司地点" prop="jsType">
          <el-input v-model.number="editForm.jsType" placeholder="请输入公司地点"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="jsUsername">
          <el-input v-model="editForm.jsUsername" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="jsPhone">
          <el-input v-model="editForm.jsPhone" placeholder="请输入联系人电话"></el-input>
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
        <el-form-item label="公司名称" prop="jsName">
          <el-input v-model="addForm.jsName" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="公司地点" prop="jsSite">
          <el-input v-model="addForm.jsSite" placeholder="请输入公司地点"></el-input>
        </el-form-item>
        <el-form-item label="公司类型" prop="jsType">
          <el-input v-model="addForm.jsType" placeholder="请输入公司类型"></el-input>
        </el-form-item>
        
        <el-form-item label="联系人" prop="jsUsername">
          <el-input v-model="addForm.jsUsername" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="jsPhone">
          <el-input v-model="addForm.jsPhone" placeholder="请输入联系电话"></el-input>
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
      pagesize: 20,
      numberer: 0,
      condition: 0,
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
      editForm: {
        id: "",
        jsName: "",
        jsSite: "",
        jsType: "",
        jsDepartment: "",
        jsUsername: "",
        jsPhone: ""
      },
      addForm: {
        id: "",
        jsName: "",
        jsSite: "",
        jsType: "",
        jsDepartment: "",
        jsUsername: "",
        jsPhone: "",
        parkId: localStorage.getItem("parkId"),
        agentId: localStorage.getItem("agentId")
      },
      carFormRules: {
        jsName: [
          { message: "名称不能为空", required: true, trigger: "blur" },
          { min: 0, max: 12, message: "请输入正确名称", trigger: "blur" }
        ],
        jsPhone: [
          { message: "请输入联系电话", required: true, trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位联系电话", trigger: "blur" },
          { pattern: /^[0-9]+$/, message: "请输入正确的手机号" }
        ],
        jsSite: [
          { min: 0, max: 10, message: "只能是0-10个字符", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        jsDepartment: [
          { min: 0, max: 10, message: "只能是0-10个字符", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        jsUsername: [
          { min: 2, max: 5, message: "只能是2到5个字符", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        jsType: [
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
        this.getData();
        this.editForm={},
        this.select_word="",
        this.addForm={}
    },
    batchImport() {
      // var res = this;
      // this.$axios({
      //     url: 'member/batchImport',
      //     method: 'post',
      //     data:{"pageNum":res.cur_page,"pageSize":res.pagesize}
      // }).then(function (response) {
      // if (response.status <= 200) {
      //     res.tableData = response.data.memberData;
      //     res.totalRecords=response.data.memberTotalRecords; //总条数
      // }
      // }).catch(function (error) {
      //     res.$message.error('查询失败: '+error);
      //     console.log(error);
      // });
      axios
        .get("member/batchImport", {
          params: {
            scheduleType: scheduleType
          },
          responseType: "arraybuffer"
        })
        .then(response => {
          //创建一个blob对象,file的一种
          let blob = new Blob([response.data], { type: "application/x-xls" });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          //配置下载的文件名
          link.download =
            fileNames[scheduleType] + "_" + response.headers.datestr + ".xls";
          link.click();
        });
    },
    batchExport() {
      var res = this;
      this.$axios({
        url: "member/batchExport",
        method: "post"
      })
        .then(function(response) {
          console.log(response);
          if (response.status <= 200) {
            res.$message.error("导出成功: " + error);
          }
        })
        .catch(function(error) {
          res.$message.error("导出失败: " + error);
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
      var res = this;
      this.numberer = 0;
      this.$axios({
        url: "jinshiCompany/selectCompanyAll",
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
            res.tableData = response.data.companyData;
            res.totalRecords = response.data.companyTotalRecords; //总条数
            console.log(response);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    search(value) {
      this.numberer = 1;
      this.is_search = true;
      if (value == 1) {
        this.cur_page = 1;
      }
      var res = this;
      this.$axios({
        url: "jinshiCompany/searchCompany",
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
            res.tableData = response.data.companyData;
            console.log(response, "78584");
            res.totalRecords = response.data.companyTotalRecords; //总条数
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
        jsName: row.jsName,
        jsSite: row.jsSite,
        jsType: row.jsType,
        jsDepartment: row.jsDepartment,
        jsUsername: row.jsUsername,
        jsPhone: row.jsPhone,
        parkId: Number(localStorage.getItem("parkId")),
        agentId: Number(localStorage.getItem("agentId"))
      };
      console.log(this.editForm, "编辑");
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
            url: "jinshiCompany/updateByCompany",
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
            url: "jinshiCompany/insert",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.addVisible = false;
                console.log(response, "添加");
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
      console.log(this.id);
      this.$axios({
        url: "jinshiCompany/deleteById",
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
.nserder {
  text-align: center;
}
</style>


