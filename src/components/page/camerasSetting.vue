<template>
  <div class="camerasSetting">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 摄像机设置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
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
        <el-table-column type="selection" align="center" class-name="table"></el-table-column>
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="jcName" label="摄像机名称" class-name="table"></el-table-column>
        <el-table-column prop="jcIpAddress" label="摄像机IP地址" class-name="table"></el-table-column>
        <el-table-column prop="jcMac" label="摄像机MAC地址" width="150px" class-name="table"></el-table-column>
        <el-table-column prop="jcCamerasId" label="摄像机编号" width="150px" class-name="table"></el-table-column>
        <el-table-column prop="jcAccess" label="进出口" class-name="table"></el-table-column>
        <el-table-column prop="jcRemarks" label="摄像机型号" class-name="table"></el-table-column>
        <el-table-column prop="jcLedscreenType" label="led屏幕型号" class-name="table"></el-table-column>
        <el-table-column prop="jcBaudRate" label="波特率" class-name="table"></el-table-column>
        <el-table-column prop="jcDataBits" label="数据位" class-name="table"></el-table-column>
        <el-table-column prop="jcArea" label="区域" class-name="table"></el-table-column>
        <el-table-column prop="jcStopBits" label="停止位" class-name="table"></el-table-column>
        <el-table-column prop="jcValidation" label="校验" class-name="table"></el-table-column>
        <el-table-column prop="jcVolume" label="音量" class-name="table"></el-table-column>
        <el-table-column prop="ontype" label="车队模式"  class-name="table"></el-table-column>
        <el-table-column
          prop="jcCreatetime"
          :formatter="dateFormatter"
          label="创建时间"
          class-name="table"
        ></el-table-column>
        <!--<el-table-column prop="jcRemarks" label="备注">
        </el-table-column>-->
        <el-table-column label="操作" width="200" align="center" class-name="table">
          <template slot-scope="scope">
            <!--
                        <el-button type="text" icon="el-icon-edit" @click="addCamera(scope.$index, scope.row)">连接</el-button>
            <el-button type="text" icon="el-icon-edit" @click="connCamera(scope.$index, scope.row)">连接</el-button>-->
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEditA(scope.$index, scope.row)"
            >配置led</el-button>
            <!--<el-button type="text" icon="el-icon-edit" @click="cameraTest(scope.$index, scope.row)">测试</el-button>-->
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="motorcade(scope.$index, scope.row)"
            >车队模式</el-button>
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
        <el-form-item label="摄像机名称" prop="jc_name">
          <el-input v-model="editForm.jcName"></el-input>
        </el-form-item>
        <el-form-item label="摄像机IP地址" prop="jcIpAddress">
          <el-input v-model="editForm.jcIpAddress"></el-input>
        </el-form-item>
        <el-form-item label="摄像机编号" prop="jcCamerasId">
          <el-input v-model="editForm.jcCamerasId"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="jcArea">
          <el-select v-model="editForm.jcArea" placeholder="区域">
            <el-option
              v-for="item in area"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摄像机MAC地址" >
          <el-input v-model="editForm.jcMac"></el-input>
        </el-form-item>
        <el-form-item label="进出口" prop="jcAccess">
          <el-select v-model="editForm.jcAccess" placeholder="进出口" class="handle-select mr10">
            <el-option key="1" label="进口" value="进口"></el-option>
            <el-option key="2" label="出口" value="出口"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摄像机型号" prop="jcRemarks">
          <el-select v-model="editForm.jcRemarks" placeholder="摄像机型号" class="handle-select mr10">
            <el-option key="1" label="jsqy-001" value="jsqy-001"></el-option>
            <el-option key="2" label="jszs-001" value="jszs-001"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑led框 -->
    <el-dialog title="编辑" :visible.sync="editpeizhi" width="30%">
      <el-form ref="editLed" :model="editLed" label-width="100px">
        <el-form-item label="led屏型号" prop="jcLedscreenType">
          <el-input v-model="editLed.jcLedscreenType" placeholder="请输入led屏型号"></el-input>
        </el-form-item>
        <el-form-item label="波特率" prop=" jcBaudRate">
          <el-input v-model="editLed.jcBaudRate" placeholder="请输入波特率"></el-input>
        </el-form-item>
        <el-form-item label="数据位" prop="jcDataBits">
          <el-input v-model="editLed.jcDataBits" placeholder="请输入数据位"></el-input>
        </el-form-item>
        <el-form-item label="停止位" prop="jcStopBits">
          <el-input v-model="editLed.jcStopBits" placeholder="请输入停止位"></el-input>
        </el-form-item>
        <el-form-item label="效验" prop="jcValidation">
          <el-input v-model="editLed.jcValidation" placeholder="请输入效验"></el-input>
        </el-form-item>
        <el-form-item label="音量" prop="jcVolume">
          <el-input v-model="editLed.jcVolume" placeholder="请输入音量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editpeizhi = false">取 消</el-button>
        <el-button type="primary" @click="saveLed">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="carFormRules" label-width="120px">
        <el-form-item label="摄像机名称" prop="jcName">
          <el-input v-model="addForm.jcName" placeholder="请输入摄像机名称"></el-input>
        </el-form-item>
        <el-form-item label="摄像机IP地址" prop="jcIpAddress">
          <el-input v-model="addForm.jcIpAddress" placeholder="请输入摄像机IP地址"></el-input>
        </el-form-item>
        <el-form-item label="摄像机MAC地址" >
          <el-input v-model="addForm.jcMac" placeholder="请输入摄像机MAC地址"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="jcArea">
          <el-select v-model="addForm.jcArea" placeholder="请输入区域">
            <el-option
              v-for="item in area"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摄像机编号" prop="jcCamerasId">
          <el-input v-model="addForm.jcCamerasId" placeholder="请输入摄像机编号"></el-input>
        </el-form-item>
        <el-form-item label="进出口" prop="jcAccess">
          <el-select v-model="addForm.jcAccess" placeholder="请选择进出口" class="handle-select mr10">
            <el-option key="1" label="进口" value="进口"></el-option>
            <el-option key="2" label="出口" value="出口"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摄像机型号" prop="jcRemarks">
          <el-select v-model="addForm.jcRemarks" placeholder="请选择摄像机型号" class="handle-select mr10">
            <el-option key="1" label="jsqy-001" value="jsqy-001"></el-option>
            <el-option key="2" label="jszs-001" value="jszs-001"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->
    <!-- 车队模式 开始-->
    <el-dialog title="车队模式" :visible.sync="editpeizhiA" width="28%">
      <el-form ref="editLed" :model="editLed" label-width="100px">
       <el-form-item label="开始时间">
          <input type="time" step="1" style="width:150px" v-model="newdataA">
        </el-form-item>
        <el-form-item label="结束时间">
           <input type="time" step="1" style="width:150px" v-model="newdataB">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editpeizhiA = false">取 消</el-button>
        <el-button type="primary" @click="fieopen" v-if="addtype==0">确定开启</el-button>
         <el-button type="danger" @click="fieopenA" v-if="addtype==1">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 车队模式结束 -->
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveLed">确定开启</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "camerasSetting",
  data() {
    return {
      addtype:"",
      type:"",
      area: [],
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
      editpeizhi: false,
      addVisible: false,
      delVisible: false,
      editpeizhiA:false,
      jcId:"",
      newdataA:"00:00:00",//开始时间
      newdataB:"23:59:59",//结束时间
      numberer: 0,
      condition: 0,
      editForm: {
        jcId: "",
        jcName: "",
        jcIpAddress: "",
        jcAccess: "",
        jcLicense: "",
        jcMac: "",
        jcSort: "",
        jcCreatetime: "",
        jcRemarks: "",
        jcParking: "",
        jcAgent: "",
        jcCamerasId: "",
        jcArea: ""
      },
      editLed: {
        jcId: "",
        jcLedscreenType: "",
        jcBaudRate: "",
        jcDataBits: "",
        jcStopBits: "",
        jcValidation: "",
        jcVolume: ""
      },
      addForm: {
        jcId: "",
        jcName: "",
        jcIpAddress: "",
        jcAccess: "",
        jcLicense: "",
        jcMac: "",
        jcSort: "",
        jcCreatetime: "",
        jcRemarks: "",
        jcParking: "",
        jcAgent: "",
        jcCamerasId: "",
        jcArea: ""
      },
      carFormRules: {
        jcName: [
          { message: "摄像机名称不能为空", required: true, trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "摄像机名称必须大于2个字小于12个字",
            trigger: "blur"
          }
        ],
        jcIpAddress: [
          { message: "IP地址不能为空", required: true, trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度应在2个字到8个字之间",
            trigger: "blur"
          }
        ],
        jcAccess: [
          { message: "进出口不能为空", required: true, trigger: "blur" }
        ],

        jcMac: [
          {
            min: 0,
            max: 10,
            message: "长度应在1个字到10个字之间",
            trigger: "blur"
          }
        ],
        jcCamerasId: [
          {
            min: 0,
            max: 20,
            message: "长度应在20个字之内",
            trigger: "blur"
          }
        ]
      },
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData(), 
    this.getArea();
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
    //车队模式关闭按钮
    fieopenA(){
      var res=this
      this.$axios({
        url:"jinshiCameras/closeCarTeam",
        method:"post",
        data:{
              jcId:this.jcId,
        }
      }).then(response=>{
        this.editpeizhiA=false
         res.$message.success("关闭成功")
         res.getData()
      }).catch(err=>{
         res.$message.error("关闭失败")
      })
    },
    // 车队模式
    motorcade(index,row){
      this.jcId=row.jcId
      console.log(row)
      this.editpeizhiA=true
      if(row.jcIsCarTeam==0){
          this.addtype=0
      }else{
          this.addtype=1
      }
    },
    fieopen(){
      var that=this
      this.$axios({
        url: "jinshiCameras/openCarTeam",
        method: "post",
        data:{
           jcId:this.jcId,
           jcStartTime:this.newdataA,
           jcEndTime:this.newdataB
        }
      })
        .then(function(response) {
            console.log(response)
            that.editpeizhiA=false
             that.getData()
        })
        .catch(function(error) {
          error.$message.error("开启失败");
        });
    },
    refresh(){
      this.getData(), this.getArea();
      this.editForm={},
      this.select_word="",
      this.addForm={}
    },
    getArea() {
      var res = this;
      this.$axios({
        url: "jinshiArea/selectAreaNameAll?parkId="+localStorage.getItem("parkId"),
        method: "get",
      })
        .then(function(response) {
          if (response.status <= 200) {
             res.area=[]
            for (var i = 0; i < response.data.areaNameData.length; i++) {
              res.area.push({
                value: response.data.areaNameData[i].areaName
              });
            }
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    dateFormatter(row, column) {
      let datetime = row.jcCreatetime;
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
       if(value==1){
        this.cur_page=1
      }
      var res = this;
      this.numberer = 0;
      this.$axios({
        url: "jinshiCameras/selectCamerasAll",
        method: "post",
        data: {   pageNum: res.cur_page, 
                  pageSize: res.pagesize ,
                  parkId:localStorage.getItem("parkId")
               
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response,"123456")
            for(var i=0;i<response.data.camerasListData.length;i++){
               if(response.data.camerasListData[i].jcIsCarTeam==0){
                  response.data.camerasListData[i]["ontype"]="已关闭"
               }else{
                  response.data.camerasListData[i]["ontype"]="已开启"
               }
            }
            res.tableData=[]
            res.tableData = response.data.camerasListData;
            res.totalRecords = response.data.camerasTotalRecords; //总条数
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    search(vlaue) {
      this.numberer = 1;
      this.is_search = true;
      if (value == 1) {
        this.cur_page = 1;
      }
      var res = this;
      this.$axios({
        url: "jinshiCameras/searchCameras",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData = response.data.camerasListData;
            res.totalRecords = response.data.camerasTotalRecords; //总条数
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
      this.id = row.jcId;
      this.editForm = {
        jcId: row.jcId,
        jcName: row.jcName,
        jcIpAddress: row.jcIpAddress,
        jcAccess: row.jcAccess,
        jcRemarks: row.jcRemarks,
        jcCamerasId: row.jcCamerasId,
        jcMac: row.jcMac,
        jcArea: row.jcArea
      };
      this.editVisible = true;
    },
    handleEditA(index, row) {
      this.idx = index;
      this.id = row.jcId;
      this.editLed = {
        jcId: row.jcId,
        jcLedscreenType: row.jcLedscreenType,
        jcBaudRate: row.jcBaudRate,
        jcDataBits: row.jcDataBits,
        jcStopBits: row.jcStopBits,
        jcValidation: row.jcValidation,
        jcVolume: row.jcVolume,
        jcArea: row.jcArea
      };
      this.editpeizhi = true;
    },
    // 测试按钮
    cameraTest(index, row) {
      var res = this;
      var ipAdd = row.jcIpAddress;
      this.$refs.addForm.validate(valid => {
        this.$axios({
          url: "jinshiCameras/cameraTest",
          method: "post",
          data: { jcIpAddress: ipAdd }
        })
          .then(function(response) {
            if (response.status <= 200) {
              res.$message.success(response.data);
            }
          })
          .catch(function(error) {
            res.$message.error(response.data);
            console.log(error);
          });
      });
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.jcId;
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
      console.log(setData);
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "jinshiCameras/updateByCameras",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                res.$message.success("修改成功");
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                res.getData();
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
    // led屏幕编辑
    saveLed() {
      var res = this;
      var setData = this.editLed;
      this.$refs.editLed.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "jinshiCameras/updateLedScreenType",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editpeizhi = false;
                res.getData();
                res.$message.success("修改成功");
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                if (res.tableData[res.idx].id === res.id) {
                  res.$set(res.tableData, res.idx, res.editLed);
                } else {
                  for (let i = 0; i < res.tableData.length; i++) {
                    if (res.tableData[i].id === res.id) {
                      res.$set(res.tableData, i, res.editLed);
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
    //连接摄像机
    addCamera() {
      var res = this;
      this.$axios({
        url: "jinshiCameras/addCamera",
        method: "post"
        // data:{"jcIpAddress":row.jcIpAddress}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("连接成功");
          }
        })
        .catch(function(error) {
          res.$message.error("连接失败！");
          console.log(error);
        });
    },
    //连接摄像机
    connCamera() {
      var res = this;
      this.$axios({
        url: "jinshiCameras/connCamera",
        method: "post"
        // data:{"jcIpAddress":row.jcIpAddress}
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("连接成功");
          }
        })
        .catch(function(error) {
          res.$message.error("连接失败！");
          console.log(error);
        });
    },
    // 添加
    saveAdd() {
      var res = this;
      var setData = this.addForm;
      console.log(setData);
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "jinshiCameras/insert",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.addVisible = false;
                res.$message.success("添加成功");
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
        url: "jinshiCameras/deleteByPrimaryKey",
        method: "post",
        data: { camerasid: res.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.delVisible = false;
            if (res.tableData[res.idx].jcId === res.id) {
              res.tableData.splice(res.idx, 1);
            } else {
              for (let i = 0; i < res.tableData.length; i++) {
                if (res.tableData[i].jcId === res.id) {
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
.nserder {
  text-align: center;
}
.actives{
  color: green;
}
</style>
