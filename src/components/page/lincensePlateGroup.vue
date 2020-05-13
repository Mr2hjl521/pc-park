<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 车牌组
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(1)" class="sousuo">搜索</el-button>
        <el-button type="primary" icon="el-icon-search" @click="addVisible = true" style="margin-left:0px">添加</el-button>
        <el-button type="primary" icon="el-icon-search" @click="refresh" >刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index"  align="center" label="序号" width="100px" class-name="table"></el-table-column>
        <el-table-column prop="jsGroupName" label="名称" align="center"   class-name="table"></el-table-column>
        <el-table-column prop="jsNumber" label="编号" align="center"  class-name="table"></el-table-column>
        <el-table-column prop="jsCarCount" label="车位数"  align="center" class-name="table"></el-table-column>
        <el-table-column prop="jsPhone" label="联系电话"  align="center" class-name="table"></el-table-column>
        <el-table-column prop="jsAddress" label="联系地址"  align="center" class-name="table"></el-table-column>
        <el-table-column label="操作" width="180" align="center"  class-name="table">

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
      <!-- 删除弹出框 -->
       <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
          <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteRow">确 定</el-button>
          </span>
        </el-dialog>
      <!-- 删除弹出框结束 -->
      <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
          <el-form ref="addForm" :model="addForm" :rules="carFormRules"  label-width="100px">
            <el-form-item label="名称" prop="jsGroupName">
              <el-input v-model="addForm.jsGroupName" placeholder="请输入名称"></el-input>
            </el-form-item>

            <el-form-item label="编号" prop="jsNumber">
              <el-input v-model="addForm.jsNumber" placeholder="请输入编号"></el-input>
            </el-form-item>
          
            <el-form-item label="车位数" prop="jsCarCount">
              <el-input v-model="addForm.jsCarCount" placeholder="请输入车位数"></el-input>
            </el-form-item>
          
            <el-form-item label="联系电话" prop="jsPhone">
              <el-input v-model="addForm.jsPhone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" prop="jsAddress">
              <el-input v-model="addForm.jsAddress" placeholder="请输入联系地址"></el-input>
            </el-form-item>
            <el-form-item label="所属区域">
              <el-select v-model="addForm.jsAreaId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->
    <!-- 修改弹出框开始 -->
     <el-dialog title="添加" :visible.sync="editVisible" width="30%">
          <el-form ref="editForm" :model="editForm" :rules="carFormRules"  label-width="100px">
            <el-form-item label="名称" prop="jsGroupName">
              <el-input v-model="editForm.jsGroupName" ></el-input>
            </el-form-item>

            <el-form-item label="编号" prop="jsNumber">
              <el-input v-model="editForm.jsNumber"></el-input>
            </el-form-item>
          
            <el-form-item label="车位数" prop="jsCarCount">
              <el-input v-model="editForm.jsCarCount"></el-input>
            </el-form-item>
          
            <el-form-item label="联系电话" prop="jsPhone">
              <el-input v-model="editForm.jsPhone"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" prop="jsAddress">
              <el-input v-model="editForm.jsAddress"></el-input>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
       
    <!-- 修改弹出框结束 -->
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
   
  </div>
</template>
<script>
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "carManager",
  data() {
    return {
      options:[],
      cur_page: 1,//分页
      pagesize: 50,//分页
      tableData:[],
      select_word:"",
      valueA:"",//开始时间
      valueB:"",//结束时间
      totalRecords:0,
      id:"",
      value:"",
      numberer:0,
      condition:0,
      addVisible:false,
      delVisible:false,
      editVisible:false,
      Alloptions:[],
      addForm:{
        jsGroupName:"",
        jsNumber:"",
        jsCarCount:"",
        jsPhone:"",
        jsAddress:"",
        jsAreaId:"",
        jsParkId :Number(localStorage.getItem("parkId")) ,
        jsAgentId  :Number(localStorage.getItem("agentId")) 
      },
      editForm:{
        jsGroupName:"",
        jsNumber:"",
        jsCarCount:"",
        jsPhone:"",
        jsAddress:""
      },
      carFormRules:{
       jsAddress:[
          {
            min: 0,
            max: 10,
            message: "长度应该在1-10个字符之间",
            trigger: "blur"
          },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
       ],
       jsPhone:[
          {
            min: 11,
            max: 11,
            message: "请输入11位手机号",
            trigger: "blur"
          },
          {
            pattern: /^[0-9]+$/, message: '请输入正确的手机号'
          }
       ],
       jsCarCount:[
          {
            pattern: /^[0-9]+$/, message: '只能输入数字'
          }
       ],
       jsGroupName:[
         {
            min: 0,
            max: 10,
            message: "长度为0-10字符之间",
            trigger: "blur"
          },
           { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
       ]
      }
    }
  },
  created() {
    this.getData();
    this.getAll()
  },
  methods: {
    refresh(){
      this.getData();
      this.select_word="",
      this.addForm={},
      this.editForm={}
    },
    //查询所有区域
    getAll(){
      var res=this
      this.$axios({
        url:
          "jinshiArea/selectAllArea?parkId="+String(localStorage.getItem("parkId")),
          method: "get",
      })
        .then(function(response) {
          console.log(response,"获取区域")
          // res.Alloptions=response.data
            res.Alloptions=response.data
           if (response.status <= 200) {
            res.options=[]
            for (var i = 0; i < response.data.length; i++) {
              res.options.push({
                value: response.data[i].areaName,

              });
            }
             console.log(res.options,"7787")
  
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
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
    //table 表格
    handleSelectionChange(){

    },
    //获取所有数据
    getData(value){
       if(value==1){
        this.cur_page=1
      }
      this.numberer=0
        var res = this;
        this.$axios({
            url: "jinshiLincenseGroup/selectLincenseGroupAll",
            method: "post",
            data: { pageNum: res.cur_page, pageSize: res.pagesize, parkId:Number(localStorage.getItem("parkId"))}
        })
        .then(function(response) {
          if (response.status <= 200) {
             res.tableData=[]
             console.log(response,"获取所有数据");
             res.tableData=response.data.lincenseGroupData
             res.totalRecords=response.data.lincenseGroupRecords
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    
    //搜索
    search(value){
      this.numberer=1
     
      if(value==1){
         this.cur_page=1
      }
        var res = this;
        this.$axios({
            url: "jinshiLincenseGroup/searchLincenseGroup",
            method: "post",
            data: { pageNum: res.cur_page, pageSize: res.pagesize,keyWord:res.select_word, parkId:Number(localStorage.getItem("parkId"))}
        })
        .then(function(response) {
          if (response.status <= 200) {
             console.log(response,"搜索");
              res.tableData=[]
              res.tableData=response.data.lincenseGroupData
              res.totalRecords=response.data.lincenseGroupRecords
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    
    //删除
    handleDelete(index, row) {
      this.id = row.jsLgId;
      this.delVisible = true;
    },
    //删除里面的确定
    deleteRow() {
      var res = this;
      this.$axios({
        url: "jinshiLincenseGroup/deleteByPrimaryKey",
        method: "post",
        data: { id: this.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.delVisible = false;
            res.getData();
          }
        })
        .catch(function(error) {
          res.$message.success("删除失败！");
          console.log(error);
        });
    },
    //添加里面的确定按钮
     saveAdd() {
        var res=this
        console.log(this.addForm)
        console.log( this.Alloptions)
        for (var i = 0; i < this.Alloptions.length; i++) {
          if(this.addForm.jsAreaId==this.Alloptions[i].areaName){
              this.addForm.jsAreaId=this.Alloptions[i].id
          }
        }
        this.$axios({
          url: "jinshiLincenseGroup/insert",
          method: "post",
          data: this.addForm
        })
        .then(function(response) {
          res.$message.success("添加成功");
          console.log(response,"添加")
          res.getData();
          res.addVisible=false
        })
        .catch(function(error) {
          res.$message.error("添加失败！");
          console.log(error);
        })
    },
    //点击编辑
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.jsLgId;
      this.editForm = {
        jsLgId:row.jsLgId,
        jsGroupName:row.jsGroupName,
        jsNumber:row.jsNumber,
        jsCarCount:row.jsCarCount,
        jsPhone:row.jsPhone,
        jsAddress:row.jsAddress
      };
      this.editVisible = true;
    },
    //编辑保存
    saveEdit() {
      var res = this;
          this.$axios({
            url: "jinshiLincenseGroup/updateByPrimaryKey",
            method: "post",
            data: this.editForm
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                console.log(response,"修改")
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success("修改失败！");
              console.log(error);
            });
    },
  }
};
</script>

<style scoped>
.huizong {
  height: 30px;
  width: 400px;
  position: relative;
}
.huizong span {
  height: 30px;
  width: 400px;
  position: absolute;
  bottom: -60px;
  z-index: 999;
}
.tianjia {
  margin-left: 10px;
}
.sousuo {
  margin-right: 10px;
}
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
.nserder{
  text-align: center
}

</style>

