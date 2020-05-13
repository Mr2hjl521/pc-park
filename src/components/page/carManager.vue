<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 车主档案
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(1)" class="sousuo">搜索</el-button>
        <el-button
          style="margin-left:0px"
          type="primary"
          icon="el-icon-search"
          @click="addVisible = true"
          class="tianjia"
        >添加</el-button>
        <button @click="outup" class="outup">导出数据</button>
        <el-upload class="upload-demo" action="member/batchImport">
          <el-button size="small" type="primary" class="inup">导入数据</el-button>
        </el-upload>
            <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo" style="margin-left:-8px">刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="55" align="center" label="序号" class-name="table"></el-table-column>

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
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEditined(scope.$index, scope.row)"
            >续费</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="lincensePlateId"
          label="车牌号"
          width="120"
          align="center"
          class-name="table"
        ></el-table-column>
        <el-table-column prop="memberId" label="姓名" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column
        prop="serviceType"
        label="收费类型"
        align="center"
        width="120"
        class-name="table"
      ></el-table-column>
        
        <!-- <el-table-column prop="state" label="状态" width="80" class-name="table"></el-table-column> -->
        <el-table-column
          prop="joinTime"
          align="center"
          :formatter="dateFormatter"
          label="开始日期"
          sortable
          width="150"
          class-name="table"
        ></el-table-column>
        <el-table-column
          prop="expirationTime"
          align="center"
          :formatter="dateFormatterexpirationTime"
          label="结束日期"
          sortable
          width="150"
          class-name="table"
        ></el-table-column>
          <el-table-column prop="carName" label="次数" width="100" align="center" class-name="table"></el-table-column>


          <el-table-column prop="storedMoney" label="储值余额" width="100" align="center" class-name="table"></el-table-column>


        <el-table-column
          prop="phoneNumber"
          label="手机号"
          align="center"
          width="120"
          class-name="table"
        ></el-table-column>
        <el-table-column
          prop="companyName"
          label="公司名"
          align="center"
          width="120"
          class-name="table"
        ></el-table-column>
        <el-table-column prop="departmentName" label="部门名" align="center" class-name="table"></el-table-column>
        <el-table-column prop="areaName" label="区域" align="center" class-name="table"></el-table-column>
        <el-table-column prop="memberAddress" label="到期提醒"  align="center" class-name="table"></el-table-column>
        <el-table-column prop="lgName" label="车牌组" width="120" align="center" class-name="table"></el-table-column>
        <el-table-column prop="carType" label="车辆类型" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="carColor" label="汽车颜色" width="100" align="center" class-name="table"></el-table-column>
        <!-- <el-table-column prop="jmoPayable" label="应收费用" width="100" align="center" class-name="table"></el-table-column>
        <el-table-column prop="jmoActualCost"  label="实收费用" width="100" align="center" class-name="table"></el-table-column> -->
        <el-table-column prop="state" label="录入时间" width="200" align="center" class-name="table"></el-table-column>
        <!-- jmoPayable   jmoActualCost -->
        <el-table-column
          prop="enterUser"
          label="录入账号"
          width="200"
          align="center"
          class-name="table"
        ></el-table-column>
         <el-table-column prop="companyAddress" label="备注" width="200" align="center" class-name="table"></el-table-column>
      </el-table>
      <div class="huizong">
        <span>车辆总数：{{all.plate}}辆</span>
      </div>
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
        <el-form-item label="收费类型" prop="serviceType">
          <el-select
            v-model="editForm.serviceType"
            placeholder="服务类型"
            class="handle-select mr10"
            @change="addselect"
          >
            <el-option key="1" label="贵宾车" value="贵宾车"></el-option>
            <el-option key="2" label="月租车" value="月租车"></el-option>
            <el-option key="3" label="储值车" value="储值车"></el-option>
            <el-option key="4" label="临时车" value="临时车"></el-option>
            <el-option key="5" label="内部车" value="内部车"></el-option>
            <el-option key="6" label="计次车" value="计次车"></el-option>
            <el-option key="7" label="节假日车" value="节假日车"></el-option>
            <el-option key="8" label="工作日车" value="工作日车"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="lincensePlateId">
          <el-input v-model="editForm.lincensePlateId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="memberId">
          <el-input v-model="editForm.memberId" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="开始时间"  prop="joinTime" >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.joinTime"
            style="width: 100%;"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间"  prop="expirationTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.expirationTime"
            style="width: 100%;"
            :disabled="true"
          ></el-date-picker>
        </el-form-item>
          <el-form-item label="到期提醒" prop="memberaddress">
            <el-input v-model="editForm.memberaddress" placeholder="请输入期限"></el-input>
          </el-form-item>
        <!-- <el-form-item label="到账金额" prop="carname" v-if="addnumber==true">
          <el-input v-model="editForm.carname" placeholder="请输入金额"></el-input>
        </el-form-item> -->
         <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="editForm.phonenumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
         <el-form-item label="次数" prop="carname" >
          <el-input v-model="editForm.carname" placeholder="请输入次数" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="储值余额" prop="storedMoney">
          <el-input v-model="editForm.storedMoney" placeholder="请输入储值余额" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="应收费用" prop="jmoPayable">
          <el-input v-model="editForm.jmoPayable" v-bind:disabled="money" placeholder="请输入应收费用"></el-input>
        </el-form-item>
        <el-form-item label="实收费用" prop="jmoActualCost">
          <el-input v-model="editForm.jmoActualCost"  v-bind:disabled="money" placeholder="请输入实收费用"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="状态" prop="state">
          <el-select v-model="editForm.state" placeholder="状态" class="handle-select mr10">
            <el-option key="1" label="未过期" value="未过期"></el-option>
            <el-option key="2" label="已过期" value="已过期"></el-option>
          </el-select>
        </el-form-item>-->
         <el-form-item label="公司名" prop="companyname">
          <el-select v-model="editForm.companyid" placeholder="选择公司名" @change="handleCommandA">
            <el-option
              v-for="item in gongsi"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名" prop="departmentname">
          <el-select v-model="editForm.departmentid" placeholder="请选择部门名">
            <el-option
              v-for="item in bumen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="areaName">
          <el-select v-model="editForm.areaName" placeholder="请选择区域" @change="handleCommandareaA">
            <el-option
              v-for="item in area"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
       
        <el-form-item label="汽车颜色">
          <el-select v-model="editForm.carcolor" placeholder="请选择汽车颜色">
            <el-option
              v-for="item in colors"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务类型" prop="cartype">
          <el-select v-model="editForm.cartype" placeholder="请选择收费类型" class="handle-select mr10">
            <el-option key="1" label="小型车" value="小型车"></el-option>
            <el-option key="2" label="中型车(黄牌)" value="中型车(黄牌)"></el-option>
            <el-option key="3" label="大型车(黄牌)" value="大型车(黄牌)"></el-option>
            <el-option key="4" label="新能源车" value="新能源车"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车牌组">
          <el-select v-model="valueAC" placeholder="请选择车牌组" @change="handleCommandesed" @visible-change="spanserCompile">
            <el-option
              v-for="item in bumenstr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span style="margin-left:20px;color:red" v-show="spanaddshowA==true">请先选择区域</span>
        </el-form-item>

         <el-form-item label="备注" prop="companyaddress">
          <el-input v-model="editForm.companyaddress" placeholder="备注"></el-input>
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
        <el-form-item label="收费类型" prop="serviceType">
          <el-select
            v-model="addForm.serviceType"
            placeholder="请选择服务类型"
            class="handle-select mr10"
            @change="addselect"
          >
            <el-option key="1" label="贵宾车" value="贵宾车"></el-option>
            <el-option key="2" label="月租车" value="月租车"></el-option>
            <el-option key="3" label="储值车" value="储值车"></el-option>
            <el-option key="4" label="临时车" value="临时车"></el-option>
            <el-option key="5" label="内部车" value="内部车"></el-option>
            <el-option key="6" label="计次车" value="计次车"></el-option>
            <el-option key="7" label="节假日车" value="节假日车"></el-option>
            <el-option key="8" label="工作日车" value="工作日车"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车牌号" prop="lincensePlateId">
          <el-input v-model="addForm.lincensePlateId" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="memberId">
          <el-input v-model="addForm.memberId" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="joinTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addForm.joinTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
            v-bind:disabled="money"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="expirationTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-bind:disabled="money"
            v-model="addForm.expirationTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
          
        </el-form-item>
        <el-form-item label="到期提醒" prop="memberaddress">
            <el-input v-model="addForm.memberaddress" placeholder="请输入期限"></el-input>
          </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="addForm.phonenumber" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="次数" prop="carname">
          <el-input v-model="addForm.carname" placeholder="请输入次数" :disabled="addnumbered"></el-input>
        </el-form-item>

         <el-form-item label="储值余额" prop="storedMoney">
          <el-input v-model="addForm.storedMoney" placeholder="请输入储值余额" :disabled="addstoredMoney"></el-input>
        </el-form-item>
        <!-- <el-form-item label="应收费用" prop="jmoPayable">
          <el-input v-model="addForm.jmoPayable" v-bind:disabled="money" placeholder="请输入应收费用"></el-input>
        </el-form-item>
        <el-form-item label="实收费用" prop="jmoActualCost">
          <el-input v-model="addForm.jmoActualCost" v-bind:disabled="money" placeholder="请输入实收费用"></el-input>
        </el-form-item> -->
        <el-form-item label="公司名" prop="companyid">
          <el-select v-model="addForm.companyid" placeholder="选择公司名" @change="handleCommand">
            <el-option
              v-for="item in gongsi"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名" prop="departmentid">
          <el-select v-model="addForm.departmentid" placeholder="请选择部门名">
            <el-option
              v-for="item in bumen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="areaName">
          <el-select v-model="addForm.areaName" placeholder="请选择区域" @change="handleCommandarea">
            <el-option
              v-for="item in area"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="汽车颜色">
          <el-select v-model="addForm.carcolor" placeholder="请选择汽车颜色">
            <el-option
              v-for="item in colors"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车辆类型" prop="cartype">
          <el-select v-model="addForm.cartype" placeholder="请选择车辆类型" class="handle-select mr10">
            <el-option key="1" label="小型车" value="小型车"></el-option>
            <el-option key="2" label="中型车(黄牌)" value="中型车(黄牌)"></el-option>
            <el-option key="3" label="大型车(黄牌)" value="大型车(黄牌)"></el-option>
            <el-option key="4" label="新能源车" value="新能源车"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车牌组">
          <el-select v-model="valueAC" placeholder="请选择车牌组" @change="handleCommandes" @visible-change="spanserD">
            <el-option
              v-for="item in bumenstr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span style="margin-left:20px;color:red" v-show="spanaddshow==true">请先选择区域</span>
        </el-form-item>
        <el-form-item label="备注" prop="companyaddress">
          <el-input v-model="addForm.companyaddress" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->

    <!-- 续费弹出框开始 -->
    <el-dialog title="续费" :visible.sync="nsedr" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="carFormRules">
        <el-form-item label="续费时长" prop="lincensePlateId">
          <el-select v-model="valueBB" placeholder="请选择" @change="selectGet">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="begin" style="width: 100%;"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="antedTime" style="width: 100%;"></el-date-picker>
        </el-form-item>

        <el-form-item label="应收储值金额" prop="jmoPayable">
          <el-input v-model="jmoPayable" placeholder="应收储值金额" :disabled="endnewnumber"></el-input>
        </el-form-item>
        <el-form-item label="实际储值金额" prop="jmoActualCost">
          <el-input v-model="jmoActualCost" placeholder="实际储值金额" :disabled="endnewnumber"></el-input>
        </el-form-item>
        <el-form-item label="请输入次数" prop="carname" >
          <el-input v-model="carname" placeholder="请输入次数" :disabled="newnumber"></el-input>
        </el-form-item>
        <el-form-item label="储值余额" prop="storedMoney" >
          <el-input v-model="storedMoney" placeholder="请输入储值余额" :disabled="endnewnumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nsedr = false">取 消</el-button>
        <el-button type="primary" @click="addersper">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 续费弹出框结束 -->

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
      area: [],
      numbername:"",
      money: false, //实收费用的input 禁用
      jmoPayable: 0, //续费  应收费用
      jmoActualCost: 0, //续费  实收费用
      newnumber: false, //续费 计次开关
      carname: 0, //续费 次数
      addnumber: false, //开关
      storedMoney:null,
      addnumbered: true,
      addoption: "",
      switer: false, //存储车的金额是否显示
      nes: 1,
      all: { plate: "未查询" },
      showapp: true,
      areaid:"",
      Allarea:"",
      spaner:0,//判断有没有选择区域
      spanaddshow:false,//请选择区域样式
      spanaddshowA:false,//编辑里面的文字提示
      colors: [
        {
          value: "无",
          label: "无"
        },
        {
          value: "红色",
          label: "红色"
        },
        {
          value: "黄色",
          label: "黄色"
        },
        {
          value: "蓝色",
          label: "蓝色"
        },
        {
          value: "绿色",
          label: "绿色"
        },
        {
          value: "白色",
          label: "白色"
        },
        {
          value: "黑色",
          label: "黑色"
        },
        {
          value: "银色",
          label: "银色"
        },
        {
          value: "灰色",
          label: "灰色"
        }
      ],
      options: [
        {
          value: "1",
          label: "1月"
        },
        {
          value: "2",
          label: "2月"
        },
        {
          value: "3",
          label: "3月"
        },
        {
          value: "4",
          label: "4月"
        },
        {
          value: "5",
          label: "5月"
        },
        {
          value: "6",
          label: "6月"
        },
        {
          value: "7",
          label: "7月"
        },
        {
          value: "8",
          label: "8月"
        },
        {
          value: "9",
          label: "9月"
        },
        {
          value: "10",
          label: "10月"
        },
        {
          value: "11",
          label: "11月"
        },
        {
          value: "12",
          label: "12月"
        }
      ],
      valueAC: "无",
      value: "",
      nsid: "",
      jmoPayable: 0,
      jmoActualCost: 0,
      numberer: 0,
      nsedr: false,
      valueAse: "",
      bumen: [], //部门名称
      gongsi: [], //公司名称
      tableData: [],
      valueBB: "1月", //默认续费时长
      cur_page: 1,
      pagesize: 50,
      begin: "", //续费里面的开始时间
      antedTime: "", //续费里面的结束时间
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
      addstoredMoney:true,
      endnewnumber:true,
      storedMoneyA:"",
      nperder:"",
      whyer: 0,
      editForm: {
        memberaddress:"",
        id: "",
        lgId: "",
        lincensePlateId: "",
        memberId: "",
        expirationTime: "",
        serviceType: "",
        joinTime: "",
        phonenumber: "",
        companyname: "",
        departmentname: "",
        storedMoney:null,//储值金额
        companyaddress: "",
        carname: 0,
        cartype: "",
        carcolor: "无",
        areaName: "",
      },
      addForm: {
        memberaddress:"15",
        switch: 0,
        jmoPayable: 0,
        jmoActualCost: 0,
        id: "",
        lgId: 0,
        lincensePlateId: "",
        memberId: "",
        expirationTime: "",
        serviceType: "月租车",
        joinTime: "",
        phonenumber: "",
        companyname: "",
        companyid: "", //公司名
        departmentname: "", //部门名
        departmentid: "",
        companyaddress: "",
        carname: null,
        cartype: "小型车",
        storedMoney:null,//储值金额
        carcolor: "无",
        areaName: "",
        datetimess: "",
        parkId: localStorage.getItem("parkId"),
        agentId: localStorage.getItem("agentId"),
        npmvalue: "", //获取月份
        addmoney: null, //存储车金额
        addnumber: null,
        enterUser: localStorage.getItem("ms_username")
      },
      carFormRules: {
        companyid: [
          { message: "公司名不能为空", required: true, trigger: "blur" }
        ],
        cartype: [
          { message: "车辆类型不能为空", required: true, trigger: "blur" }
        ],
        lincensePlateId: [
          { message: "车牌号不能为空", required: true, trigger: "blur" },
          { min: 7, max: 8, message: "请输入正确车牌号", trigger: "blur" }
        ],
        phonenumber: [
          { message: "手机号不能为空", required: true, trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位数字", trigger: "blur" }
        ],
        memberId: [
          { message: "姓名不能为空", required: true, trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度应在10个字符内",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        expirationTime: [
          { message: "结束时间不能为空", required: true, trigger: "blur" }
        ],
        serviceType: [
          { message: "服务类型不能为空", required: true, trigger: "blur" }
        ],
        joinTime: [
          { message: "加入时间不能为空", required: true, trigger: "blur" }
        ],
        memberaddress: [
          {
            min: 0,
            max: 10,
            message: "长度应在0个字到10个字之间",
            trigger: "blur"
          }
        ],
        companyaddress: [
          {
            min: 0,
            max: 10,
            message: "长度应在10个字之内",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ],
        // carname: [
        //   { message: "不能为空", required: true, trigger: "blur" },
        //   {
        //     min: 1,
        //     max: 10,
        //     message: "长度应在1-10个字符之内",
        //     trigger: "blur"
        //   },
        //   { pattern: /^[0-9]+$/, message: "只允许输入数字" }
        // ],
        jmoPayable: [
          // {
          //   min: 0,
          //   max: 10,
          //   message: "长度应在10个字符之内",
          //   trigger: "blur"
          // },
          { pattern: /^[0-9]+$/, message: "只能输入数字" }
        ],
        jmoActualCost: [
          //  {
          //   min: 0,
          //   max: 10,
          //   message: "长度应在10个字符之内",
          //   trigger: "blur"
          // },
          { pattern: /^[0-9]+$/, message: "只允许输入数字" }
        ],
        memberaddress:[
            { message: "不能为空", required: true, trigger: "blur" },
            { pattern: /^[0-9]+$/, message: "只允许输入数字" }
        ],
        areaName: [{ message: "区域不能为空", required: true, trigger: "blur" }]
      },
      idx: -1,
      id: -1,
      bumenstr: [],
      datetimess: "",
      datetimers: ""
    };
  },
  created() {
    this.getData();
    this.getJur();
    this.getArea();
    this.Time();
    // this.bur();
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
  watch:{
    jmoActualCost(val,newval){
       this.storedMoney= this.storedMoneyA
       this.storedMoney=Number(this.storedMoney)+Number(this.jmoActualCost)
    }
  },
  methods: {
    refresh(){
      this.getData();
      this.getJur();
      this.getArea();
      // this.bur();
      this.select_word="",
      this.valueAC="无"
      this.addForm={
        memberaddress:"15",
        switch: 0,
        jmoPayable: 0,
        jmoActualCost: 0,
        id: "",
        lgId: 0,
        lincensePlateId: "",
        memberId: "",
        expirationTime: "",
        serviceType: "月租车",
        joinTime: "",
        phonenumber: "",
        companyname: "", 
        companyid: "", //公司名
        departmentname: "", //部门名
        departmentid: "",
        companyaddress: "",
        carname: "",
        cartype: "小型车",
        carcolor: "无",
        areaName: "",
        datetimess: "",
        c:"",
        npmvalue: "", //获取月份
        addmoney: null, //存储车金额
        addnumber: null,
        parkId: localStorage.getItem("parkId"),
        agentId: localStorage.getItem("agentId"),
        enterUser: localStorage.getItem("ms_username"),
      }
      console.log(this.addForm)
      this.Time()
    },
    //编辑里面选择区域
    handleCommandareaA(){
       this.spanaddshowA=false
        for(var i=0;i<this.Allarea.length;i++){
          if(this.Allarea[i].areaName==this.editForm.areaName){
            this.areaid=this.Allarea[i].id
          }
       }
       //获取车牌组
        var res = this;
        this.$axios({
          url:
            "jinshiLincenseGroup/selectByParkIdAndAreaId",
            method: "post",
            data:{
              jsParkId:localStorage.getItem("parkId"),
              jsAreaId: Number(this.areaid)
            }
        })
          .then(function(response) {
            console.log(response,"车牌组")
            if (response.status <= 200) {
              res.bumenstr=[]
              for (var i = 0; i < response.data.length; i++) {
                res.bumenstr.push({
                  value: response.data[i].jsLgId,
                  label: response.data[i].jsGroupName
                });
              }
              console.log(res.bumenstr);
            }
          })
          .catch(function(error) {
            res.$message.error("查询失败: " + error);
            console.log(error);
          });
    },
    //编辑车牌组下拉框出现的时候
    spanserCompile(){
       if(this.editForm.areaName==""){
           this.spanaddshowA=true
       }else{
            this.spanaddshowA=false
       }
    },
    //车牌组下拉框出现的时候
    spanserD(){
      console.log(this.spaner)
      if(this.spaner==0){
        this.spanaddshow=true
      }else{
         this.spanaddshow=false
      }
    },
    //选择区域获取的值
    handleCommandarea(){
     //判断 有没有点击
     this.spaner=1
     this.spanaddshow=false
       console.log(this.addForm.areaName)
       for(var i=0;i<this.Allarea.length;i++){
          if(this.Allarea[i].areaName==this.addForm.areaName){
            this.areaid=this.Allarea[i].id
          }
       }
       //获取车牌组
        var res = this;
        this.$axios({
          url:
            "jinshiLincenseGroup/selectByParkIdAndAreaId",
            method: "post",
            data:{
              jsParkId:localStorage.getItem("parkId"),
              jsAreaId: Number(this.areaid)
            }
        })
          .then(function(response) {
            console.log(response,"车牌组")
            if (response.status <= 200) {
              res.bumenstr=[]
              for (var i = 0; i < response.data.length; i++) {
                res.bumenstr.push({
                  value: response.data[i].jsLgId,
                  label: response.data[i].jsGroupName
                });
              }
              console.log(res.bumenstr);
            }
          })
          .catch(function(error) {
            res.$message.error("查询失败: " + error);
            console.log(error);
          });
    },
    addselect(value) {
      console.log(value);
      this.nperder=value
      this.addForm.storedMoney=null
      if (value == "计次车") {
        this.addnumbered = false;
        this.addForm.carname = 1;
        var tomerr = new Date(this.addForm.joinTime);
        this.addForm.expirationTime= (tomerr.getFullYear()+1) + "-" + (tomerr.getMonth()+1) + "-" + tomerr.getDate();
      } else {
        this.addnumbered = true;
        this.addForm.carname = null;
        this.addForm.expirationTime = this.addForm.joinTime
      }
      if (value =="贵宾车" || value == "内部车") {
        
        this.money = true;
      } else {
        this.money = false;
      }
      if (value == "储值车") {
        this.addstoredMoney=false
         var tomer = new Date(this.addForm.joinTime);
        this.addForm.expirationTime= (tomer.getFullYear()+1) + "-" + (tomer.getMonth()+1) + "-" + tomer.getDate();
      }
      else{
         this.addstoredMoney=true
      }
    },
    handleCommandes(value) {
      this.addForm.lgId = Number(value);

    },
    handleCommandesed(value) {
      this.editForm.lgId = Number(value);
    },
    //点击续费
    handleEditined(index, row) {
      console.log(row);
      this.numbername=row.serviceType
      //判断日期
      this.nsid = row.id;
      this.nsedr = true;
      this.idAA = index;
      this.storedMoney=row.storedMoney
      this.storedMoneyA=row.storedMoney
      this.carname=row.carName
      if(this.numbername=="计次车"||this.numbername=="储值车"){
        this.valueBB="12月"
         var myDate = new Date();
         this.begin=myDate;
         this.antedTime= (myDate.getFullYear()+1) + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();

      }else{
         this.valueBB="1月"
          const data1= new Date(row.expirationTime);
          // this.begin=data1;
           this.antedTime= (data1.getFullYear()) + "-" + (data1.getMonth() + 2) + "-" + data1.getDate();
           console.log(this.antedTime,"结束时间")
        function dateToMs(data1) {
          let result = new Date(data1).getTime();
          return result;
        }
      const data1_timestamp = dateToMs(data1);
      var newser=data1_timestamp>row.expirationTime?data1_timestamp:row.expirationTime
      this.begin = this.tableData[index].expirationTime;
      this.begin = newser
      var c = new Date(row.expirationTime);
      var bb = c.getMonth() + 2;
      if (bb > 12) {
        var ee = bb - 12;
        this.antedTime = c.getFullYear() + 1 + "-" + ee + "-" + c.getDate();
      } else if (bb <= 12) {
        this.antedTime = this.datetimes =
          c.getFullYear() + "-" + bb + "-" + c.getDate();
      }
      }
      //判断计次车
      if(row.serviceType == "计次车"||row.serviceType == "储值车"){
          if(row.serviceType == "计次车"){
               console.log("我是几次车")
               this.newnumber = false;
          }else{
             this.newnumber = true;
             this.endnewnumber=true
              console.log("我不是")
          }
          if(row.serviceType == "储值车"){
              this.endnewnumber=false
               console.log("我不是")
          } else{
             this.endnewnumber=true
              console.log("我不是")
          }
         
          
      }else{
        this.newnumber = true;
        this.endnewnumber=true
         console.log("我是月租车")
      }
    },
    //点击续费里面的续费日期
    selectGet(value,row) {
      this.npmvalue = value;
      console.log(this.npmvalue)
      var c = new Date(this.begin);
      var b = c.getMonth() + Number(this.npmvalue) + 1;
      if (b > 12) {
        var e = b - 12;
        this.antedTime = c.getFullYear() + 1 + "-" + e + "-" + c.getDate();
      } else if (b <= 12) {
        this.antedTime = c.getFullYear() + "-" + b + "-" + c.getDate();
      }
    },
    //点击续费里面的提交按钮
    addersper() {
      if(this.numbername=="储值车"){
          this.storedMoney=Number(this.storedMoney)
      }
      else{
         this.storedMoney=null
      }
      var d = new Date(this.begin);
      this.datetimers =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

      var c = new Date(this.antedTime);
      this.datetimess =
        c.getFullYear() + "-" + (c.getMonth() + 1) + "-" + c.getDate();
      this.nsedr = false;
      var res = this;
      
      this.$axios({
        url: "member/updateRenew",
        method: "post",
        data: {
          id: this.nsid,
          expirationTime: this.datetimess,
          joinTime: this.datetimers,
          jmoPayable: Number(this.jmoPayable), //续费  应收费用
          jmoActualCost: Number(this.jmoActualCost), //续费  实收费用
          carname: this.carname,
          storedMoney :this.storedMoney 
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("执行成功")
            res.getData();
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    //获取当前时间
    Time() {
      var myDate = new Date();
      this.addForm.joinTime = myDate;
      this.addForm.expirationTime = myDate;
    },
    //获取区域
    getArea() {
       var res = this;
      if(localStorage.getItem("roleName")=="超级管理员"||localStorage.getItem("roleName")=="金石管理员"){
       
         this.$axios({
        url:
          "jinshiArea/selectAllArea?parkId="+String(localStorage.getItem("parkId")),
          method: "get",
      })
        .then(function(response) {
          console.log(response,"获取区域")
          res.Allarea=response.data
           if (response.status <= 200) {
            res.area=[]
            for (var i = 0; i < response.data.length; i++) {
              res.area.push({
                value: response.data[i].areaName,

              });
            }
             console.log(res.area,"7787")
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
      }else{
         console.log("123456")
      this.$axios({
        url:
          "jinshiArea/selectAreaNameAll?parkId="+String(localStorage.getItem("parkId")),
          method: "get",
      })
        .then(function(response) {
           console.log(response,"获取区域")
          if (response.status <= 200) {
            res.area=[]
            for (var i = 0; i < response.data.areaNameData.length; i++) {
              res.area.push({
                value: response.data.areaNameData[i].areaName
              });
            }
             console.log(res.area,"7787")
          }
        })
        .catch(function(error) {
          // res.$message.error("查询失败: " + error);
          console.log(error);
        });
      }
    },
    //点击公司名   获取部门名
    handleCommand(value) {
      var res = this;
      this.bumen = [];
      // alert(res.addForm.companyname)
      this.addForm.departmentid = "";
      this.$axios({
        url: "jinshiCompany/selects",
        method: "post",
        data: { id: Number(this.addForm.companyid) }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response, "123456789");
            // res.$message.success('添加成功');
            for (var i = 0; i < response.data.companyData.length; i++) {
              if (response.data.companyData[i].jdName == "") {
                response.data.companyData[i] = null;
              }
              res.bumen.push({
                value: response.data.companyData[i].id,
                label: response.data.companyData[i].jdName
              });
              console.log(res.bumen);
            }
          }
        })
        .catch(function(error) {
          // res.$message.error('添加失败: '+error);
        });
    },

    //编辑里面的公司名
    handleCommandA(value) {
      
      var res = this;
      console.log(value);
      res.bumen = [];
      // alert(res.addForm.companyname)
      this.$axios({
        url: "jinshiCompany/selects",
        method: "post",
        data: { id: Number(this.editForm.companyid) }
      })
        .then(function(response) {
          console.log(response);
          if (response.status <= 200) {
            console.log(response, "123456789");
            // res.$message.success('添加成功');
            for (var i = 0; i < response.data.companyData.length; i++) {
              res.bumen.push({
                value: response.data.companyData[i].id,
                label: response.data.companyData[i].jdName
              });
            }
          }
        })
        .catch(function(error) {
          // res.$message.error('添加失败: '+error);
          console.log(error);
        });
    },

    getnew() {
      console.log(this.value);
      var res = this;
      this.$axios({
        url:
          "member/selectMemberByCalendar",
        method: "post",
        data: {
          type: res.value,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: localStorage.getItem("parkId")
        }
      })
        .then(function(response) {
          console.log(response.data);
          res.tableData = response.data.memberData;
          res.totalRecords = response.data.memberCountList[0];
          res.all.plate = response.data.memberCountList[0];
          console.log(res.totalRecords, res.all.plate);
        })
        .catch(function(error) {
          // res.$message.error('添加失败: '+error);
          console.log(error);
        });
    },
    batchImport() {
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
    //获取公司名
    getJur() {
      var res = this;
      var ned = localStorage.getItem("parkId");
      console.log(ned);
      console.log(typeof ned);
      this.$axios({
        url:
          "jinshiCompany/selectname",
        method: "post",
        data: {
          parkId: localStorage.getItem("parkId")
        }
      })
        .then(function(response) {
          console.log(response, "AA");
          res.gongsi=[]
          if (response.status <= 200) {
            for (var i = 0; i < response.data.companyData.length; i++) {
              res.gongsi.push({
                label: response.data.companyData[i].jsName,
                value: response.data.companyData[i].id
              });
            }
            console.log(response, res.gongsi);
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
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
      console.log(this.numberer);
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
        console.log("获取所有");
        console.log(this.numberer);
      } else {
        this.cur_page = val;
        this.search(2);
        console.log("搜索");
      }
    },
    // 获取 easy-mock 的模拟数据
    getData(value) {
      if (value == 1) {
        this.cur_page = 1;
      }
      var res = this;
      this.numberer = 0;
      console.log(this.pagesize);
      this.$axios({
        url: "member/selectMemberAll",
        method: "post",
        data: {
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          parkId: localStorage.getItem("parkId"),
          roleName:localStorage.getItem("roleName")
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.tableData=[]
            res.tableData = response.data.memberData;
            res.totalRecords = response.data.memberTotalRecords; //总条数
            res.all.plate = response.data.memberTotalRecords;
            console.log(response.data, "获取所有数据");
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    //搜索
    search(value) {
      var res = this;
      this.is_search = true;
      if (value == 1) {
        res.cur_page = 1;
      }
      this.numberer = 1;
      this.$axios({
        url: "member/searchMember",
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
            res.tableData = response.data.memberData;
            res.totalRecords = response.data.memberTotalRecords; //总条数
            res.all.plate = response.data.memberTotalRecords;
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
      console.log(row);
      console.log(row.carColor)
      this.numbername=row.serviceType
      this.idx = index;
      this.id = row.id;
      this.editForm = {
        id: row.id,
        lgId: "",
        // jmoPayable:row.jmoPayable, //续费  应收费用
        // jmoActualCost: row.jmoActualCost,//实收费用
        memberaddress :row.memberaddress,
        lincensePlateId: row.lincensePlateId,
        memberId: row.memberId,
        state: row.state,
        expirationTime: row.expirationTime,
        serviceType: row.serviceType,
        departmentname: row.departmentName,
        memberaddress: row.memberAddress,
        joinTime: row.joinTime,
        phonenumber: row.phoneNumber,
        companyname: row.companyName,
        companyaddress: row.companyAddress,
        cartype: row.carType,
        carname: row.carName,
        carcolor: row.carColor,
        areaName: row.areaName,
        companyid: row.companyName,
        departmentid: row.departmentName,
        parkId: localStorage.getItem("parkId"),
        agentId: localStorage.getItem("agentId"),
        enterUser: localStorage.getItem("ms_username"),
        storedMoney:row.storedMoney

      };
      var res = this;
      
      this.$axios({
        url:
          "jinshiArea/selectAreaNameAll?parkId="+String(row.parkId),
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

      var value = this.editForm.serviceType;
      if ( value == "储值车" || value == "节假日车" ||value == "工作日车" || value == "计次车" ) {
     
        if (value == "计次车") {
          this.addnumbered = false;
        } else {
          this.addnumber = true;
        }
        if(value=="储值车"){
          this.addstoredMoney=false
        }
        else{
          this.addstoredMoney=true
        }
      } else {
        this.addstoredMoney=true
        this.addnumbered = true;
        this.addnumber = false;
        // this.editForm.carname = null;
      }

      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      console.log(row.id);
      this.id = row.id;
      this.delVisible = true;
    },
    delAll()
     {
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
      var ll = res.gongsi;
      var aaId = res.editForm.companyid;
      for (var i = 0; i < ll.length; i++) {
        if (ll[i].value == aaId) {
          res.editForm.companyname = ll[i].label;
        }
      }
      var hh = res.bumen;
      var ssId = res.editForm.departmentid;
      for (var u = 0; u < hh.length; u++) {
        if (hh[u].value == ssId) {
          res.editForm.departmentname = hh[u].label;
        }
      }
      var setData = this.editForm;
      console.log(this.editForm,"保存")
      if (this.editForm.lgId == "") {
        this.editForm.lgId = 2;
      } else {
      }
      if (this.valueAC == "无") {
        this.editForm.lgId = null;
      }
       if(this.numbername=="储值车"){
          this.editForm.storedMoney=Number(this.editForm.storedMoney)
      }
      else{
         this.storedMoney=null
      }
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url:
              "member/updateByPrimaryKey",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                console.log(response,"保存编辑");
                res.editVisible = false;
                res.$message.success(response.data.msg);
                // res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                res.addForm.carname = "null";
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
      var ll = res.gongsi;
      var aaId = res.addForm.companyid;
      for (var i = 0; i < ll.length; i++) {
        if (ll[i].value == aaId) {
          res.addForm.companyname = ll[i].label;
        }
      }
      var hh = res.bumen;
      var ssId = res.addForm.departmentid;
      for (var u = 0; u < hh.length; u++) {
        if (hh[u].value == ssId) {
          res.addForm.departmentname = hh[u].label;
        }
      }
      var setData = this.addForm;
      if (this.addForm.lgId == "") {
        this.addForm.lgId = 2;
      } else {
      }
      if (this.valueAC == "无") {
        this.addForm.lgId = null;
      }
      this.addForm.jmoPayable = Number(this.addForm.jmoPayable);
      this.addForm.jmoActualCost = Number(this.addForm.jmoActualCost);
      
      if(this.nperder=="储值车"){
          this.addForm.storedMoney = Number(this.addForm.storedMoney);
      }
      else{
        this.addForm.storedMoney = null
      }
      if(this.nperder=="计次车"){
        this.addForm.carname=String(this.addForm.carname)
      }
      this.$refs.addForm.validate(valid => {
        if (!valid) {
          res.$message.error("格式错误");
        } else {
          console.log(setData, "添加");
          this.$axios({
            url: "member/insert",
            method: "post",
            data: setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                if (response.data.code == 0) {
                  res.$message.error("已存在车牌");
                } else {
                  res.addVisible = false;
                  console.log(response.data);
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
      console.log(this.id);
      this.$axios({
        url:
          "member/deleteByPrimaryKey",
        method: "post",
        data: { memberid: res.id }
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
    },
    //导出数据
    outup(){
         window.location.href = 'member/batchExport?parkId='+String(localStorage.getItem("parkId"))+"&roleName=" +localStorage.getItem("roleName")
    }

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
  border: none;
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

</style>

