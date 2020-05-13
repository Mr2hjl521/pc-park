<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
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
        <el-table-column prop="userName" label="用户名" width="100" class-name="table"></el-table-column>
        <el-table-column prop="roleName" label="权限名" class-name="table"></el-table-column>
        <el-table-column prop="province" label="省" class-name="table"></el-table-column>
        <el-table-column prop="city" label="市" class-name="table"></el-table-column>
        <el-table-column prop="district" label="区县" class-name="table"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" class-name="table"></el-table-column>

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
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="carFormRules" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="realName">
          <el-input v-model="addForm.realName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="addForm.passWord" placeholder="请输入密码"></el-input>
        </el-form-item>
         <el-form-item label="确认密码" prop="passwordsure">
          <el-input v-model="addForm.passwordsure" placeholder="请再次输入密码"></el-input>
        </el-form-item>

         <el-form-item label="代理商" >
          <el-select v-model="addForm.agentId" placeholder="请选择代理商">
            <el-option
              v-for="item in optionsA"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="停车场" >
          <el-select v-model="addForm.parkId" placeholder="请选择代理商">
            <el-option
              v-for="item in optionsB"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>




        <el-form-item label="权限名" prop="roleName">
          <el-select v-model="addForm.roleName" placeholder="请选择权限名">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-select v-model="addForm.province" placeholder="请选择省份" @change="handleCommand">
            <el-option
              v-for="item in getProvince"
              :key="item.id"
              :label="item.province"
              :value="item.province"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="city">
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
         <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="addForm.phoneNumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="修改用户权限" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm"  :rules="carFormRules" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName" :disabled="true"></el-input>
        </el-form-item>
        
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="passWord">
          <el-input v-model="editForm.passWord"></el-input>
        </el-form-item>

        

        <el-form-item label="代理商" >
          <el-select v-model="editForm.agentId" placeholder="请选择代理商">
            <el-option
              v-for="item in optionsA"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="停车场" >
          <el-select v-model="editForm.parkId" placeholder="请选择代理商">
            <el-option
              v-for="item in optionsB"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>







        <el-form-item label="权限名"  prop="roleName">
          <el-select v-model="editForm.roleName" placeholder="重新选择权限">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-select v-model="editForm.province" placeholder="请选择省份" @change="handleCommandA">
            <el-option
              v-for="item in getProvince"
              :key="item.id"
              :label="item.province"
              :value="item.province"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="city">
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
         <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber" placeholder="请输入手机号"></el-input>
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
      getCity:[],
      getdistrict:[],
      getProvince:[],
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
        id: "",
        userName: "",
        passWord: "",
        passwordsure: "",
        agentId:"",
        parkId:"",
        roleName: "",
        realName:"",
        province:"",
        city:"",
        district:"",
        phoneNumber:"",
        
        //  parkId:String(localStorage.getItem("parkId")),
        // agentId:String(localStorage.getItem("agentId"))
      },
      editForm: {
        id: "",
        userName: "",
        passWord: "",
        passwordsure: "",
        roleName: "",
        realName:"",
        province:"",
        city:"",
        district:"",
        phoneNumber:"",
        agentId:"",
        parkId:"",
        //  parkId:String(localStorage.getItem("parkId")),
        // agentId:String(localStorage.getItem("agentId"))

      },
      options: [],
      value: "",
      // carFormRules: {},
      idx: -1,
      id: -1,
      carFormRules: {
        roleName:[
            { message: "权限名不能为空", required: true, trigger: "blur" },
        ],
        userName: [
          { message: "用户名不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应该在1-10个字符之间",
            trigger: "blur"
          },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ],
        realName:[
           { message: "姓名名不能为空", required: true, trigger: "blur" },
            {
              min: 2,
              max: 5,
              message: "长度应该在2-5个字符之间",
              trigger: "blur"
            },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
        ],
        passWord:[
          { message: "密码不能为空", required: true, trigger: "blur" },
            {
              min: 6,
              max: 10,
              message: "长度应该在6-10个字符之间",
              trigger: "blur"
            },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '不允许输入中文' }
        ],
        passwordsure:[
          { message: "密码不能为空", required: true, trigger: "blur" },
            {
              min: 6,
              max: 10,
              message: "长度应该在6-10个字符之间",
              trigger: "blur"
            },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '不允许输入中文' }
        ]
      },
    };
  },
  created() {
    this.getData();
    this.getJur();
    this.getJurA(),
    this.shopNameA()
    this.shopNameB()
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
            console.log(res.getCity,"市");
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
    handleCommandA() {
      var res = this;
      res.getCity = [];
      this.$axios({
        url: "sharea/selectcity",
        method: "post",
        data: { name: res.editForm.province }
      })
        .then(function(response) {
          console.log(response,"市");
          if (response.status <= 200) {
            for (var i = 0; i < response.data.shareaData[0].length; i++) {
              res.getCity.push({
                city: response.data.shareaData[0][i].name
              });
            }
            console.log(res.getCity,"市");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //添加接口获取区县
    handgetDesA() {
      var res = this;
      res.getdistrict = [];
      this.$axios({
        url: "sharea/selectDistrict",
        method: "post",
        data: { name: res.editForm.city }
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
    refresh(){
        this.getData();
        this.getJur();
        this.getJurA()
        this.select_word=""
        this.addForm={}
        this.editForm={}
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
        url: "testBoot/selectUserAll",
        method: "post",
        data: { 
            pageNum: res.cur_page,
            pageSize: res.pagesize,
            parkId:String(localStorage.getItem("parkId")),
            agentId:String(localStorage.getItem("agentId")),
            roleName:String(localStorage.getItem("roleName"))
          }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData =[]
            res.tableData = response.data.user;
            console.log(response.data,"874485555555555555");
            res.totalRecords = response.data.userTotalRecords; //总条数
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    // getJur() {
    //   var res = this;
    //   this.$axios({
    //     url: "testBoot/selectRolename",
    //     method: "post",
    //     data: {}
    //   })
    //     .then(function(response) {
    //       console.log(response,"代理商")
    //       if (response.status <= 200) {
    //         res.options=[]
    //         if(localStorage.getItem("roleName")=="超级管理员"||localStorage.getItem("roleName")=="金石管理员"){
    //             res.options.push({
    //               value: response.data.rolename[4].jsRolename,
    //               label: response.data.rolename[4].jsRolename
    //             });
    //         }else if(localStorage.getItem("roleName")=="区域代理商"){
    //             res.options.push({
    //               value: response.data.rolename[5].jsRolename,
    //               label: response.data.rolename[5].jsRolename
    //             },{
    //               value: response.data.rolename[6].jsRolename,
    //               label: response.data.rolename[6].jsRolename
    //             }
                
    //             );
    //         }else if(localStorage.getItem("roleName")=="车场管理员"){
    //             res.options.push({
    //               value: response.data.rolename[7].jsRolename,
    //               label: response.data.rolename[7].jsRolename
    //             },{
    //               value: response.data.rolename[8].jsRolename,
    //               label: response.data.rolename[8].jsRolename
    //             },
    //             {
    //               value: response.data.rolename[8].jsRolename,
    //               label: response.data.rolename[8].jsRolename
    //             }
                
    //             );
    //         } 
    //         // for (var i = 0; i < response.data.rolename.length; i++) {
    //         //   res.options.push({
    //         //     value: response.data.rolename[i].jsRolename,
    //         //     label: response.data.rolename[i].jsRolename
    //         //   });
    //         // }
    //       }
    //       console.log(res.options,"11111111111111111111111111111111111111111111");
    //     })
    //     .catch(function(error) {
    //       res.$message.error("查询失败: " + error);
    //       console.log(error);
    //     });
    // },
   shopNameB(){
      var res = this;
      // this.numberer=0;
      this.$axios({
        url: "parkingJinshi/selectParkingAll ",
        method: "post",
        data: { 
            pageNum: res.cur_page, pageSize: res.pagesize, 
            agentId:String(localStorage.getItem("agentId")),
            roleName:localStorage.getItem("roleName") 
            }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response,"车场")
            res.optionsB=[]
             for(var i=0;i<response.data.parkingData.length;i++){
                res.optionsB.push({
                  value: response.data.parkingData[i].jpId,
                  label: response.data.parkingData[i].jpName
              })
            }
 
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    shopNameA(){
      var res = this;
      // this.numberer=0;
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
            console.log(response,"123456")
            res.optionsA=[]
             for(var i=0;i<response.data.AgentData.length;i++){
                res.optionsA.push({
                  value: response.data.AgentData[i].id,
                  label: response.data.AgentData[i].username
              })
            }
 
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    getJur() {
      console.log("4165546")
      var res = this;
       res.userlogin = localStorage.getItem("userId");
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
          console.log(response,"代理商")
          if (response.status <= 200) {
            res.options=[]
            for(var i=0;i<response.data.roleData.length;i++){
                res.options.push({
                  value: response.data.roleData[i].jsRolename,
                  label: response.data.roleData[i].jsRolename
              })
            }
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
    //修改
    handleEdit(index, row) {
      console.log(row,"我是编辑")
      this.idx = index;
      this.id = row.id;
      console.log(this.id)
      this.editForm = {
        id: row.id,
        userName: row.userName,
        roleName:row.roleName,
        realName:row.realName,
        province:row.province,
        city:row.city,
        district:row.district,
        phoneNumber:row.phoneNumber,
        parkId:row.parkid,
        agentId:row.agentid
      };
      console.log(this.editForm)
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
            url: "testBoot/updateUser",
            method: "post",
            data:res.editForm
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
      }
      )
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.id;
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
      console.log(this.addForm.passWord,this.addForm.passwordsure)
      if(this.addForm.passWord==this.addForm.passwordsure){
      var res = this;
      // res.addForm.agentId=String(res.addForm.agentId)
      res.addForm.rolename = res.value;
      var setData = this.addForm;
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "testBoot/insert",
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
      }else{
            alert("两次密码不一致")
      }
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url:
          "testBoot/deleteByPrimaryKey?id=" +
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
        })
        .catch(function(error) {
          res.$message.success("删除失败！");
          console.log(error);
        });
    },
      getJurA() {
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
.nserder{
  text-align: center
}
</style>

