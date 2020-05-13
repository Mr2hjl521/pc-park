<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 权限管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-search" @click="addVisible = true" style="margin-left:0">添加</el-button>
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
        <el-table-column prop="jsRolename" label="权限名" width="100" class-name="table"></el-table-column>
        <el-table-column prop="jsRolearray" label="权限" class-name="table"></el-table-column>
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
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="37%">
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="权限名" prop="jsRolename">
          <el-input v-model="jsRolename" width="30px" placeholder="请输入权限名"></el-input>
        </el-form-item>
        <el-form-item >
          <input type="checkbox" id="2" value="2" v-model="jsRolearray">
          <label for="2">总览</label>
        </el-form-item>
         <el-form-item >
           <input type="checkbox" id="3" value="3" v-model="jsRolearray">
          <label for="3">代理商管理</label>
        
          <input type="checkbox" id="4" value="4" v-model="jsRolearray" style="margin-left:30px">
          <label for="4">车场管理</label>

         
          <input type="checkbox" id="5" value="5" v-model="jsRolearray" style="margin-left:30px">
          <label for="5">用户管理</label>
          
           <input type="checkbox" id="6" value="6" v-model="jsRolearray" style="margin-left:30px">
          <label for="6">权限管理</label>
        </el-form-item>


         <el-form-item >
          <input type="checkbox" id="7" value="7" v-model="jsRolearray">
          <label for="7">出入管理</label>
        </el-form-item>


        <el-form-item >
           <input type="checkbox" id="8" value="8" v-model="jsRolearray">
          <label for="8">车主档案</label>
           <input type="checkbox" id="9" value="9" v-model="jsRolearray" style="margin-left:30px">
          <label for="9">财务管理</label>

           <input type="checkbox" id="10" value="10" v-model="jsRolearray" style="margin-left:30px">
          <label for="10">记录管理</label>
            <input type="checkbox" id="11" value="11" v-model="jsRolearray" style="margin-left:30px">
          <label for="11">车主订单管理</label>
        </el-form-item>



        <el-form-item >
           <input type="checkbox" id="12" value="12" v-model="jsRolearray">
           <label for="12">区域管理</label>
           <input type="checkbox" id="13" value="13" v-model="jsRolearray"  style="margin-left:30px">
           <label for="13">设备管理</label>
          <input type="checkbox" id="14" value="14" v-model="jsRolearray" style="margin-left:30px">
          <label for="14">车场设置</label>
        </el-form-item>

        <el-form-item >
          <input type="checkbox" id="15" value="15" v-model="jsRolearray">
          <label for="15">关注管理</label>
          <input type="checkbox" id="16" value="16" v-model="jsRolearray" style="margin-left:30px">
          <label for="16">黑白名单</label>
        </el-form-item>


        <el-form-item >
           <input type="checkbox" id="17" value="17" v-model="jsRolearray">
          <label for="17">商户管理</label>
            <input type="checkbox" id="18" value="18" v-model="jsRolearray" style="margin-left:30px">
          <label for="18">优惠券管理</label>
        </el-form-item>
        

        <el-form-item >
          <input type="checkbox" id="19" value="19" v-model="jsRolearray">
          <label for="19">退出</label>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 修改弹出框 editjsRolearray  editVisible-->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="权限名" prop="editjsRolename">
          <el-input v-model="editjsRolename" width="30px" placeholder="请输入权限名"></el-input>
        </el-form-item>

        <el-form-item >
          <input type="checkbox" id="2" value="2" v-model="editjsRolearray">
          <label for="2">总览</label>
        </el-form-item>
         <el-form-item >
           <input type="checkbox" id="3" value="3" v-model="editjsRolearray">
          <label for="3">代理商管理</label>
        
          <input type="checkbox" id="4" value="4" v-model="editjsRolearray" style="margin-left:30px">
          <label for="4">车场管理</label>

         
          <input type="checkbox" id="5" value="5" v-model="editjsRolearray" style="margin-left:30px">
          <label for="5">用户管理</label>
          
           <input type="checkbox" id="6" value="6" v-model="editjsRolearray" style="margin-left:30px">
          <label for="6">权限管理</label>
        </el-form-item>


         <el-form-item >
          <input type="checkbox" id="7" value="7" v-model="editjsRolearray">
          <label for="7">出入管理</label>
        </el-form-item>


        <el-form-item >
           <input type="checkbox" id="8" value="8" v-model="editjsRolearray">
          <label for="8">车主档案</label>
           <input type="checkbox" id="9" value="9" v-model="editjsRolearray" style="margin-left:30px">
          <label for="9">财务管理</label>
           <input type="checkbox" id="10" value="10" v-model="editjsRolearray" style="margin-left:30px">
          <label for="10">记录管理</label>
            <input type="checkbox" id="11" value="11" v-model="editjsRolearray" style="margin-left:30px">
          <label for="11">车主订单管理</label>
        </el-form-item>



        <el-form-item >
           <input type="checkbox" id="12" value="12" v-model="editjsRolearray">
           <label for="12">区域管理</label>
           <input type="checkbox" id="13" value="13" v-model="editjsRolearray"  style="margin-left:30px">
           <label for="13">设备管理</label>
          <input type="checkbox" id="14" value="14" v-model="editjsRolearray" style="margin-left:30px">
          <label for="14">车场设置</label>
        </el-form-item>

        <el-form-item >
          <input type="checkbox" id="15" value="15" v-model="jsRolearray">
          <label for="15">关注管理</label>
          <input type="checkbox" id="16" value="16" v-model="editjsRolearray" style="margin-left:30px">
          <label for="16">黑白名单</label>
        </el-form-item>


        <el-form-item >
           <input type="checkbox" id="17" value="17" v-model="editjsRolearray">
          <label for="17">商户管理</label>
            <input type="checkbox" id="18" value="18" v-model="editjsRolearray" style="margin-left:30px">
          <label for="18">优惠券管理</label>
        </el-form-item>
  

        <el-form-item >
          <input type="checkbox" id="19" value="19" v-model="editjsRolearray">
          <label for="19">退出</label>
        </el-form-item>


      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
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
      userlogin: "",
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
      jsRolename: "",
      editjsRolename:'',
      jsRolearray: [],
      editjsRolearray: [],
      addForm: {
        
      },
      editForm: {
        id:''
      },
      options: [],
      value: "",
      idx: -1,
      id: -1,
      
    };
  },
  created() {
    this.getData();
    this.userlogin = this.getCookie("userid");
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
    this.jsRolename=""
    this.jsRolearray=[];
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
      this.cur_page = val;
      this.getData();
      this.checkedNames();
    },
    // 获取 easy-mock 的模拟数据
    getData(value) {
       if(value==1){
        this.cur_page=1
      }
      var res = this;
      res.userlogin = res.getCookie("userid");
      this.$axios({
        url: "jinshiRole/selectRoleAll",
        method: "post",
        data: {
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          id: JSON.parse(res.userlogin),
          roleName:localStorage.getItem("roleName"),
          parkId:localStorage.getItem("parkId"),
         
        }
      })
        .then(function(response) {
          res.tableData=[]
          if (response.status <= 200) {
            res.tableData = response.data.roleData;
            res.totalRecords = response.data.roleTotalRecords; //总条数
            console.log(response.data);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    //获取登录界面该账号userid
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    //编辑
    handleEdit(index, row) {
      
      //将字符串装成数组
      var a=String(row.jsRolearrayForWeb)
      var b= a.split(",")
      this.editjsRolearray=b



      console.log(row,"编辑")
      this.idx = index;
      this.id = row.id;
      this.editjsRolename=row.jsRolename
      this.editForm = {
        id: row.id
      };
      this.editVisible = true;
    },
     saveEdit() {
      var res = this;
      // var setData = this.editForm;
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "jinshiRole/updateRole",
            method: "post",
            data:  {
              jsRolename: res.editjsRolename,
              jsRolearray: res.editjsRolearray.join(","),
              id:res.editForm.id
            }
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
                res.getData()
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
      console.log(row,"4545")
      this.idx = index;
      this.id = row.id;
      this.delVisible = true;
      this.deleteRow()

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
      var res = this;
      res.userlogin = res.getCookie("userid");
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          console.log(res.jsRolearray.join(","),)
          this.$axios({
            url: "jinshiRole/insert",
            method: "post",
            data: {
              jsRolename: res.jsRolename,
              jsRolearray: res.jsRolearray.join(","),
              userid: JSON.parse(res.userlogin)                                                                                                                                           
            }
          })
            .then(function(response) {
              console.log(response)
              if (response.status <= 200) {
                if (response.data.code == 1) {
                  res.$message.error("权限名已存在");
                } else {
                  res.addVisible = false;
                  res.$message.success("添加成功");
                  res.getData()
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
        url:
          "jinshiRole/deleteByPrimaryKey?id=" +
          res.id,
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
          res.getData()
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
.el-form-item__content {
  width: 100px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 18px;
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
input[type="checkbox"] {
  width: 13px;
  height: 13px;
  background-color: white;
  border: 1px solid #c9c9c9;
  border-radius: 2px;
  padding-right: 10px;
}
.nserder{
 text-align: center
}

</style>

