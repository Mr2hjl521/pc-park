<template>
  <div class="yardManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 区域管理
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
        <el-table-column type="selection" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column type="index" width="100" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="areaName" label="区域名称" align="center" class-name="table"></el-table-column>
        <el-table-column prop="areaNumber" label="区域编号" align="center" class-name="table"></el-table-column>
        <el-table-column prop="parkingCount" label="车位数" align="center" class-name="table"></el-table-column>

        <el-table-column prop="payMonth" label="包月" align="center" class-name="table"></el-table-column>
        <el-table-column prop="payQuarter" label="包季" align="center" class-name="table"></el-table-column>
        <el-table-column prop="payYear" label="包年" align="center" class-name="table"></el-table-column>

        <el-table-column
          prop="temporaryParkingCount"
          label="临时车位数"
          align="center"
          class-name="table"
        ></el-table-column>
         <el-table-column prop="allowNegativeCar" label="允许负车位数" align="center" class-name="table"></el-table-column>

        <el-table-column label="操作" width="200" align="center" class-name="table">
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
      <el-form ref="editForm" :model="editForm" label-width="110px" :rules="carFormRulesA">
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="editForm.areaName" placeholder="请输入区域名称"></el-input>
        </el-form-item>

        <el-form-item label="区域编号" prop="areaNumber">
          <el-input v-model="editForm.areaNumber" placeholder="请输入区域编号"></el-input>
        </el-form-item>
        <el-form-item label="车位数" prop="parkingCount">
          <el-input v-model="editForm.parkingCount" placeholder="请输入车位数"></el-input>
        </el-form-item>

         <el-form-item label="包月" prop="payMonth">
          <el-input v-model="editForm.payMonth" placeholder="请输入金额，若为0，则说明不支持此项"></el-input>
        </el-form-item>


        <el-form-item label="包季" prop="payQuarter">
          <el-input v-model="editForm.payQuarter" placeholder="请输入金额，若为0，则说明不支持此项"></el-input>
        </el-form-item>


        <el-form-item label="包年" prop="payYear">
          <el-input v-model="editForm.payYear" placeholder="请输入金额，若为0，则说明不支持此项"></el-input>
        </el-form-item>
        
        <el-form-item label="允许负车位数" prop="allowNegativeCar">
          <el-input v-model="editForm.allowNegativeCar" placeholder="0-9999"></el-input>
        </el-form-item>
      
        <el-form-item label="临时车位数" prop="temporaryParkingCount">
          <el-input v-model="editForm.temporaryParkingCount" placeholder="请输入临时车位数"></el-input>
        </el-form-item>

        <el-form-item label="代理商id" prop="agentId">
          <el-input v-model="editForm.agentId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="车场id" prop="parkId">
          <el-input v-model="editForm.parkId" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="carFormRules" label-width="110px">
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="addForm.areaName" placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item label="区域编号" prop="agentId">
          <el-input v-model="addForm.areaNumber" placeholder="请输入区域编号"></el-input>
        </el-form-item>
        <el-form-item label="车位数" prop="parkingCount">
          <el-input v-model="addForm.parkingCount" placeholder="请输入车位数"></el-input>
        </el-form-item>

        <el-form-item label="包月" prop="payMonth">
          <el-input v-model="addForm.payMonth" placeholder="请输入金额，若为0，则说明不支持此项"></el-input>
        </el-form-item>


        <el-form-item label="包季" prop="payQuarter">
          <el-input v-model="addForm.payQuarter" placeholder="请输入金额，若为0，则说明不支持此项"></el-input>
        </el-form-item>
   

        <el-form-item label="包年" prop="payYear">
          <el-input v-model="addForm.payYear" placeholder="请输入金额，若为0，则说明不支持此项"></el-input>
        </el-form-item>

         <el-form-item label="允许负车位数" prop="allowNegativeCar">
          <el-input v-model="addForm.allowNegativeCar"  placeholder="0-9999"></el-input>
        </el-form-item>

        <el-form-item label="临时车位数" prop="temporaryParkingCount">
          <el-input v-model="addForm.temporaryParkingCount" placeholder="请输入临时车位数"></el-input>
        </el-form-item>
        <el-form-item label="代理商id" prop="agentId">
          <el-input v-model="addForm.agentId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="车场id" prop="parkId">
          <el-input v-model="addForm.parkId" :disabled="true"></el-input>
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
  data() {
    return {
      tableData: [],
      cur_page: 1,
      pagesize: 20,
      totalRecords: 0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      numberer: 0,
      condition: 0,
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      carFormRules: {
        allowNegativeCar:[
           { message: "不能为空", required: true, trigger: "blur" },
           {
            min: 0,
            max: 4,
            message: "不能超过5个字符",
            trigger: "blur"
          },
          {
            pattern: /^[0-9]+$/,
            message: "只能输入数字"
          }
        ],
        parkingCount: [
          {
            pattern: /^[0-9]+$/,
            message: "只能输入数字"
          }
        ],
        temporaryParkingCount: [
          {
            pattern: /^[0-9]+$/,
            message: "只能输入数字"
          }
        ],
        areaName: [
          {
            min: 0,
            max: 10,
            message: "长度在10个字符之内",
            trigger: "blur"
          }
        ],
        areaNumber: [
          {
            min: 0,
            max: 10,
            message: "长度在10个字符之内",
            trigger: "blur"
          }
        ]
      },
      carFormRulesA:{
         allowNegativeCar:[
           { message: "不能为空", required: true, trigger: "blur" },
           {
            min: 0,
            max: 4,
            message: "不能超过5个字符",
            trigger: "blur"
          },
          {
            pattern: /^[0-9]+$/,
            message: "只能输入数字"
          }
        ],
      },
      editForm: {
        id: "",
        areaName: "",
        areaNumber: "",
        parkingCount: "",
        temporaryParkingCount: "",
        payMonth:"",
        payQuarter:"",
        payYear:"",
        agentId: localStorage.getItem("agentId"),
        parkId: localStorage.getItem("parkId"),
        allowNegativeCar:""
        
      },
      addForm: {
        id: "",
        areaName: "",
        areaNumber: "",
        parkingCount: "",
        temporaryParkingCount: "",
        payMonth:"",
        payQuarter:"",
        payYear:"",
        agentId: localStorage.getItem("agentId"),
        parkId: localStorage.getItem("parkId"),
        allowNegativeCar:""
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
    refresh() {
      this.getData();
      this.editForm = {}, 
      this.select_word = "", 
      this.addForm={
        id: "",
        areaName: "",
        areaNumber: "",
        parkingCount: "",
        temporaryParkingCount: "",
        agentId: localStorage.getItem("agentId"),
        parkId: localStorage.getItem("parkId")
      }
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
      if (value == 1) {
        this.cur_page = 1;
      }
      this.numberer = 0;
      var res = this;
      this.$axios({
        url: "jinshiArea/selectJinshiAreaAll",
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
            res.tableData = response.data.jinshiAreaData;
            res.totalRecords = response.data.jinshiAreaTotalRecords; //总条数
            console.log(response.data.jinshiAreaData);
            console.log(response, "123456789");
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    search(value) {
      this.is_search = true;
      this.numberer = 1;
      if (value == 1) {
        this.cur_page = 1;
      }
      var res = this;
      this.$axios({
        url: "jinshiArea/searchArea",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: localStorage.getItem("parkId")
        }
      })
        .then(function(response) {
          console.log(response, "852963");
          if (response.status <= 200) {
            res.tableData = response.data.parkingData;
            res.totalRecords = response.data.parkingTotalRecords; //总条数
            res.tableData = response.data.jinshiAreaData;
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
        areaName: row.areaName,
        areaNumber: row.areaNumber,
        parkingCount: row.parkingCount,
        temporaryParkingCount: row.temporaryParkingCount,
        agentId: row.agentId,
        parkId: row.parkId,
        allowNegativeCar:String(row.allowNegativeCar)

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
            url: "jinshiArea/updateByArea",
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
            url: "jinshiArea/insertJinshiArea",
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
                  res.addForm = "";
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
      console.log(res.id);
      this.$axios({
        url: "jinshiArea/deleteByPrimaryKey",
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
</style>

