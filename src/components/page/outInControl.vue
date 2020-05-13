<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-pie-chart"></i> 出入管理   
        </el-breadcrumb-item>  
      </el-breadcrumb>
    </div>
    <div style="height:100%;width:100%">
      <div class="div-icon-er">
        <div @click="onshowertwo" :class="addnumberA==2?'adderde':'adderdeA'">2</div>
        <div @click="onshowerfour" :class="addnumberA==4?'adderde':'adderdeA'">4</div>
        <div @click="onshowersix" :class="addnumberA==6?'adderde':'adderdeA'">6</div>
        <div @click="onshowernighat" :class="addnumberA==8?'adderde':'adderdeA'">8</div>
      </div>
      <el-row :gutter="10" type="flex" justify="center">
        <!-- A出口模块 -->
        <el-col :span="12">
          <div class="addserve"  v-if="datalisttwo[0].addshow==true">
              <div style="margin-left:26%;margin-top:28%">
                 
                  <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="calladd(0)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(0)">确认</el-button>
              </div>
               
          </div>
          <div class="container">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="12">
                <div>{{list.cameraAName}}</div>
                <div>{{list.cameraAState}} IP:{{list.cameraAIpAddress}} {{list.accessA}} tHandle:{{list.thandleA}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valueaa" @change="handEditASub">
                  <el-option
                    v-for="outcameras in outCamera"
                    :key="outcameras.thandle"
                    :label="outcameras.name"
                    :value="outcameras.thandle"   
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathA"/>
                </div>
              </el-col>
              <el-col class="icon-button" :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号： {{list.cameraALicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraAInboundTime}}</div>
                <div style="font-size:20px;">出场时间： {{list.cameraADepartureTime}}</div>
                <div style="font-size:20px;">停车时长： {{list.carAOften}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberAType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseAType}}</div>
                <div style="font-size:20px;">支付状态： {{list.payStateA}}</div>
                <div style="font-size:20px;">应收费用： {{list.cameraARent}}</div>
                <label style="font-size:20px;">实收费用：</label>
                <el-input
                  style="width:30%"
                  size="mini"
                  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                  v-model="addA"
                ></el-input>
                <br />
                <el-button
                  class="button"
                  size="medium"
                  type="primary"
                  @click="getPayOpenGate(1)"
                >收费放行</el-button>
                <el-button class="button" size="medium" type="primary" @click="openGate(1)">免费抬杆</el-button>
                <el-button class="button" size="medium" type="primary" @click="closeGate(1)">落杆</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualAForm" :model="ManualAForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualAForm.license" style="width:120px;"></el-input>
                  <!--<el-checkbox v-model="ManualAForm.isUp" size="medium">是否抬杆</el-checkbox>-->
                  <el-button type="primary" @click="ManualAFormSubmit">手动出场</el-button>
                </el-form>
                <!-- <el-button type="primary" @click="openGate(1)">收费抬杆</el-button>-->
              </el-col>
              <el-col :span="13">
                <!--<el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                      <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
                      <el-table-column prop="date" label="车牌" sortable width="150" class-name="table">
                      </el-table-column>
                      <el-table-column prop="name" label="停车时长" width="120" class-name="table">
                      </el-table-column>
                      <el-table-column prop="address" label="应收费用" :formatter="formatter" class-name="table">
                      </el-table-column>
                </el-table>-->
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- B出口模块 -->
        <el-col :span="12">
          <div class="addserveA"  v-if="datalisttwo[1].addshow==true">
              <div style="margin-left:26%;margin-top:28%">
                  <el-button class="button" size="medium" type="primary" style="margin-bottom:30px"  @click="calladd(1)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(1)">确认</el-button>
              </div>
          </div>
          <div class="container">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="16">
                <div>{{list.cameraBName}}</div>
                <div>{{list.cameraBState}} IP:{{list.cameraBIpAddress}} {{list.accessB}} tHandle:{{list.thandleB}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valuebb" @change="handEditBSub">
                  <el-option
                    v-for="outcameras in outCamera"
                    :key="outcameras.thandle"
                    :label="outcameras.name"
                    :value="outcameras.thandle"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathB"/>
                </div>
              </el-col>
              <el-col :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号： {{list.cameraBLicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraBInboundTime}}</div>
                <div style="font-size:20px;">出场时间： {{list.cameraBDepartureTime}}</div>
                <div style="font-size:20px;">停车时长： {{list.carBOften}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberBType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseBType}}</div>
                <div style="font-size:20px;">支付状态： {{list.payStateB}}</div>
                <div style="font-size:20px;">应收费用： {{list.cameraBRent}}</div>
                <label style="font-size:20px;">实收费用：</label>
                <el-input
                  style="width:30%"
                  size="mini"
                  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                  v-model="addB"
                ></el-input>
                <br />
                <el-button
                  class="button"
                  size="medium"
                  type="primary"
                  @click="getPayOpenGate(2)"
                >收费放行</el-button>
                <el-button class="button" type="primary" size="medium" @click="openGate(2)">免费抬杆</el-button>
                <el-button class="button" type="primary" size="medium" @click="closeGate(2)">落杆</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualBForm" :model="ManualBForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualBForm.license" style="width:120px;"></el-input>
                 
                  <el-button type="primary" @click="ManualBFormSubmit">手动出场</el-button>
                </el-form>
                <!-- <el-button type="primary" @click="openGate(1)">收费抬杆</el-button>-->
              </el-col>
              <el-col :span="13">
             
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row :gutter="10" type="flex" class="row-bg" justify="center" v-if="addnumberA!=2">
        <!-- E出口模块 -->
        <el-col :span="12">
           <div class="addserve"  v-if="datalisttwo[2].addshow==true">
               <div style="margin-left:26%;margin-top:28%">
                  <el-button class="button" size="medium" type="primary" style="margin-bottom:30px"  @click="calladd(2)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(2)">确认</el-button>
              </div>
           </div>
          <div class="container">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="16">
                <div>{{list.cameraEName}}</div>
                <div>{{list.cameraEState}} IP:{{list.cameraEIpAddress}} {{list.accessE}} tHandle:{{list.thandleE}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valueee" @change="handEditESub">
                  <el-option
                    v-for="outcameras in outCamera"
                    :key="outcameras.thandle"
                    :label="outcameras.name"
                    :value="outcameras.thandle"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathE"/>
                </div>
              </el-col>
              <el-col :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号： {{list.cameraELicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraEInboundTime}}</div>
                <div style="font-size:20px;">出场时间： {{list.cameraEDepartureTime}}</div>
                <div style="font-size:20px;">停车时长： {{list.carEOften}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberEType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseEType}}</div>
                <div style="font-size:20px;">支付状态： {{list.payStateE}}</div>
                <div style="font-size:20px;">应收费用： {{list.cameraERent}}</div>
                <label style="font-size:20px;">实收费用：</label>
                <el-input
                  style="width:30%"
                  size="mini"
                  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                  v-model="addE"
                ></el-input>
                <br />
                <el-button
                  class="button"
                  size="medium"
                  type="primary"
                  @click="getPayOpenGate(5)"
                >收费放行</el-button>
                <el-button class="button" size="medium" type="primary" @click="openGate(5)">免费抬杆</el-button>
                <el-button class="button" size="medium" type="primary" @click="closeGate(5)">落杆</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualEForm" :model="ManualEForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualEForm.license" style="width:120px;"></el-input>
                  <!--<el-checkbox v-model="ManualAForm.isUp" size="medium">是否抬杆</el-checkbox>-->
                  <el-button type="primary" @click="ManualEFormSubmit">手动出场</el-button>
                </el-form>
                <!-- <el-button type="primary" @click="openGate(1)">收费抬杆</el-button>-->
              </el-col>
              <el-col :span="13">
                <!--<el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
                        <el-table-column prop="date" label="车牌" sortable width="150" class-name="table">
                        </el-table-column>
                        <el-table-column prop="name" label="停车时长" width="120" class-name="table">
                        </el-table-column>
                        <el-table-column prop="address" label="应收费用" :formatter="formatter" class-name="table">
                        </el-table-column>
                </el-table>-->
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- G出口模块 -->
       <el-col :span="12" v-if="addnumberA!=2">
          <div class="addserveA"  v-if="datalisttwo[3].addshow==true">
              <div style="margin-left:26%;margin-top:28%">
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px"  @click="calladd(3)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(3)">确认</el-button>
              </div>
          </div>
          <div class="container">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="16">
                <div>{{list.cameraGName}}</div>
                <div>{{list.cameraGState}} IP:{{list.cameraGIpAddress}} {{list.accessG}} tHandle:{{list.thandleG}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valuegg" @change="handEditGSub">
                  <el-option
                    v-for="outcameras in outCamera"
                    :key="outcameras.thandle"
                    :label="outcameras.name"
                    :value="outcameras.thandle"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathG"/>
                </div>
              </el-col>
              <el-col :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号：   {{list.cameraGLicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraGInboundTime}}</div>
                <div style="font-size:20px;">出场时间： {{list.cameraGDepartureTime}}</div>
                <div style="font-size:20px;">停车时长： {{list.carGOften}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberGType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseGType}}</div>
                <div style="font-size:20px;">支付状态： {{list.payStateG}}</div>
                <div style="font-size:20px;">应收费用： {{list.cameraGRent}}</div>
                <label style="font-size:20px;">实收费用：</label>
                <el-input
                  style="width:30%"
                  size="mini"
                  onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                  v-model="addG"
                ></el-input>
                <br />
                <el-button
                  class="button"
                  size="medium"
                  type="primary"
                  @click="getPayOpenGate(7)"
                >收费放行</el-button>
                <el-button class="button" size="medium" type="primary" @click="openGate(7)">免费抬杆</el-button>
                <el-button class="button" size="medium" type="primary" @click="closeGate(7)">落杆</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualGForm" :model="ManualGForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualGForm.license" style="width:120px;"></el-input>
                  <!--<el-checkbox v-model="ManualAForm.isUp" size="medium">是否抬杆</el-checkbox>-->
                  <el-button type="primary" @click="ManualGFormSubmit">手动出场</el-button>
                </el-form>
                <!-- <el-button type="primary" @click="openGate(1)">收费抬杆</el-button>-->
              </el-col>
              <el-col :span="13">
                <!--<el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
                        <el-table-column prop="date" label="车牌" sortable width="150" class-name="table">
                        </el-table-column>
                        <el-table-column prop="name" label="停车时长" width="120" class-name="table">
                        </el-table-column>
                        <el-table-column prop="address" label="应收费用" :formatter="formatter" class-name="table">
                        </el-table-column>
                </el-table>-->
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row :gutter="10" type="flex" class="row-bg" justify="center"  v-if="addnumberA!=4&&addnumberA!=2">
        <!-- C入口模块 -->
        <el-col :span="12">
           <div class="addserve"  v-if="datalisttwo[4].addshow==true">
               <div style="margin-left:26%;margin-top:28%">
                  <el-button class="button" size="medium" type="primary" style="margin-bottom:30px"  @click="calladd(4)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(4)">确认</el-button>
              </div>
           </div>
          <div class="container">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="16">
                <div>{{list.cameraCName}}</div>
                <div>{{list.cameraCState}} IP:{{list.cameraCIpAddress}} {{list.accessC}} tHandle:{{list.thandleC}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valuecc" @change="handEditCSub">
                  <el-option
                    v-for="incameras in inCamera"
                    :key="incameras.thandle"
                    :label="incameras.name"
                    :value="incameras.thandle"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathC"/>
                </div>
              </el-col>
              <el-col :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号： {{list.cameraCLicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraCInboundTime}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberCType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseCType}}</div>

                <br />
                <el-button type="primary" size="medium" @click="openGate(3)">免费抬杆</el-button>
                <el-button type="primary" size="medium" @click="closeGate(3)">落杆</el-button>
                <el-button type="primary" size="medium" @click="remakePhoto(3)">重拍</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualCForm" :model="ManualCForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualCForm.license" style="width:120px;"></el-input>
                  <el-date-picker
                    v-model="ManualCForm.datatime"
                    @change="dateChangebirthdayC"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                  <!--<el-checkbox v-model="ManualAForm.isUp" size="medium">是否抬杆</el-checkbox>-->
                  <el-button
                    class="button"
                    type="primary"
                    size="medium"
                    @click="ManualCFixOpenGate"
                  >人工补录抬杆</el-button>
                  <el-button class="button" type="primary" size="medium" @click="ManualCFix">人工补录不抬杆</el-button>
                </el-form>
              </el-col>
              <el-col :span="13">
                <!--<el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
                        <el-table-column prop="date" label="车牌" sortable width="150" class-name="table">
                        </el-table-column>
                        <el-table-column prop="name" label="停车时长" width="120" class-name="table">
                        </el-table-column>
                        <el-table-column prop="address" label="应收费用" :formatter="formatter" class-name="table">
                        </el-table-column>
                </el-table>-->
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- D入口模块 -->
        <el-col :span="12" v-if="addnumberA!=4&&addnumberA!=2">
           <div class="addserveA"  v-if="datalisttwo[5].addshow==true">
               <div style="margin-left:26%;margin-top:28%">
                  <el-button class="button" size="medium" type="primary" style="margin-bottom:30px"  @click="calladd(5)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(5)">确认</el-button>
              </div>
           </div>
          <div class="container">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="16">
                <div>{{list.cameraDName}}</div>
                <div>{{list.cameraDState}} IP:{{list.cameraDIpAddress}} {{list.accessD}} tHandle:{{list.thandleD}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valuedd" @change="handEditDSub">
                  <el-option
                    v-for="incameras in inCamera"
                    :key="incameras.thandle"
                    :label="incameras.name"
                    :value="incameras.thandle"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathD"/>
                </div>
              </el-col>
              <el-col :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号： {{list.cameraDLicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraDInboundTime}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberDType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseDType}}</div>
                <br />
                <el-button type="primary" size="medium" @click="openGate(4)">免费抬杆</el-button>
                <el-button type="primary" size="medium" @click="closeGate(4)">落杆</el-button>
                <el-button type="primary" size="medium" @click="remakePhoto(4)">重拍</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualDForm" :model="ManualDForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualDForm.license" style="width:120px;"></el-input>
                  <el-date-picker
                    v-model="ManualDForm.datatime"
                    @change="dateChangebirthdayD"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                  <el-button
                    type="primary"
                    size="medium"
                    class="button"
                    @click="ManualDFixOpenGate"
                  >人工补录抬杆</el-button>
                  <el-button type="primary" size="medium" class="button" @click="ManualDFix">人工补录不抬杆</el-button>
                </el-form>
              </el-col>
              <el-col :span="13">
                <!-- <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
                        <el-table-column prop="date" label="车牌" sortable width="150" class-name="table">
                        </el-table-column>
                        <el-table-column prop="name" label="停车时长" width="120" class-name="table">
                        </el-table-column>
                        <el-table-column prop="address" label="应收费用" :formatter="formatter" class-name="table">
                        </el-table-column>
                </el-table>-->
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <br />
      <el-row :gutter="10" type="flex" class="row-bg" justify="center" v-if="addnumberA!=2&&addnumberA!=4&&addnumberA!=6">
          <!-- F入口模块 -->
        <el-col :span="12">
           <div class="addserve"  v-if="datalisttwo[6].addshow==true">
               <div style="margin-left:26%;margin-top:28%">
                  <el-button class="button" size="medium" type="primary" style="margin-bottom:30px"  @click="calladd(6)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(6)">确认</el-button>
              </div>
           </div>
          <div class="container" style="height:363px">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="16">
                <div>{{list.cameraFName}}</div>
                <div>{{list.cameraFState}} IP:{{list.cameraFIpAddress}} {{list.accessF}} tHandle:{{list.thandleF}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valueff" @change="handEditFSub">
                  <el-option
                    v-for="incameras in inCamera"
                    :key="incameras.thandle"
                    :label="incameras.name"
                    :value="incameras.thandle"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathF"/>
                </div>
              </el-col>
              <el-col :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号： {{list.cameraFLicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraFInboundTime}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberFType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseFType}}</div>
                <br />
                <el-button type="primary" size="medium" @click="openGate(6)">免费抬杆</el-button>
                <el-button type="primary" size="medium" @click="closeGate(6)">落杆</el-button>
                <el-button type="primary" size="medium" @click="remakePhoto(6)">重拍</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualFForm" :model="ManualFForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualFForm.license" style="width:120px;"></el-input>
                  <el-date-picker
                    v-model="ManualFForm.datatime"
                    @change="dateChangebirthdayF"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                  <el-button
                    type="primary"
                    class="button"
                    size="medium"
                    @click="ManualFFixOpenGate"
                  >人工补录抬杆</el-button>
                  <el-button type="primary" class="button" size="medium" @click="ManualFFix">人工补录不抬杆</el-button>
                </el-form>
              </el-col>
              <el-col :span="13">
                <!-- <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                      <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
                      <el-table-column prop="date" label="车牌" sortable width="150" class-name="table">
                      </el-table-column>
                      <el-table-column prop="name" label="停车时长" width="120" class-name="table">
                      </el-table-column>
                      <el-table-column prop="address" label="应收费用" :formatter="formatter" class-name="table">
                      </el-table-column>
                </el-table>-->
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- H入口模块 -->
        <el-col :span="12" v-if="addnumberA!=2&&addnumberA!=4&&addnumberA!=6">
           <div class="addserveA"  v-if="datalisttwo[7].addshow==true">
               <div style="margin-left:26%;margin-top:28%">
                  <el-button class="button" size="medium" type="primary" style="margin-bottom:30px"  @click="calladd(7)">取消</el-button>
                <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="addbuttons(7)">确认</el-button>
              </div>
           </div>
          <div class="container">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="16">
                <div>{{list.cameraHName}}</div>
                <div>{{list.cameraHState}} IP:{{list.cameraHIpAddress}} {{list.accessH}} tHandle:{{list.thandleH}}</div>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择摄像机" v-model="valuehh" @change="handEditHSub">
                  <el-option
                    v-for="incameras in inCamera"
                    :key="incameras.thandle"
                    :label="incameras.name"
                    :value="incameras.thandle"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div class="divv">
                      <img class="iconers" :src="list.picPathH"/>
                </div>
              </el-col>
              <el-col :span="12">
                <br />
                <br />
                <br />
                <div style="font-size:20px;">车牌号： {{list.cameraHLicenseId}}</div>
                <div style="font-size:20px;">入场时间： {{list.cameraHInboundTime}}</div>
                <div style="font-size:20px;">车辆类型： {{list.memberHType}}</div>
                <div style="font-size:20px;">车牌类型： {{list.lincenseHType}}</div>
                <br />
                <el-button type="primary" size="medium" @click="openGate(8)">免费抬杆</el-button>
                <el-button type="primary" size="medium" @click="closeGate(8)">落杆</el-button>
                <el-button type="primary" size="medium" @click="remakePhoto(8)">重拍</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form ref="ManualHForm" :model="ManualHForm" label-width="80px">
                  <div>车牌号:</div>
                  <el-input v-model="ManualHForm.license" style="width:120px;"></el-input>
                  <el-date-picker
                    v-model="ManualHForm.datatime"
                    @change="dateChangebirthdayH"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                  <el-button
                    type="primary"
                    size="medium"
                    class="button"
                    @click="ManualHFixOpenGate"
                  >人工补录抬杆</el-button>
                  <el-button type="primary" size="medium" class="button" @click="ManualHFix">人工补录不抬杆</el-button>
                </el-form>
              </el-col>
              <el-col :span="13">
                <!-- <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" align="center" class-name="table"></el-table-column>
                        <el-table-column prop="date" label="车牌" sortable width="150" class-name="table">
                        </el-table-column>
                        <el-table-column prop="name" label="停车时长" width="120" class-name="table">
                        </el-table-column>
                        <el-table-column prop="address" label="应收费用" :formatter="formatter" class-name="table">
                        </el-table-column>
                </el-table>-->
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

    </div>
    <!-- A手动出场弹出框 -->
    <el-dialog title="手动收费" :visible.sync="shouManualOutMessageVisible" width="30%">
      <span>车辆类型：{{shouManualOutMessage.carType}}</span>
      <br />
      <span>汽车牌照：{{shouManualOutMessage.license}}</span>
      <br />
      <span>入场闸口：{{shouManualOutMessage.lpInboundCname}}</span>
      <br />
      <span>入场时间：{{shouManualOutMessage.lpInboundTime}}</span>
      <br />
      <span>应收费用：{{shouManualOutMessage.rent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shouManualOutMessageVisible = false">取 消</el-button>
        <el-button type="primary" @click="getRentOpenGate">收费抬杆</el-button>
      </span>
    </el-dialog>
    <!-- B手动出场弹出框 -->
    <el-dialog title="手动收费" :visible.sync="shouManualOutMessageBVisible" width="30%">
      <span>车辆类型：{{shouManualOutMessageB.carType}}</span>
      <br />
      <span>汽车牌照：{{shouManualOutMessageB.license}}</span>
      <br />
      <span>入场闸口：{{shouManualOutMessageB.lpInboundCname}}</span>
      <br />
      <span>入场时间：{{shouManualOutMessageB.lpInboundTime}}</span>
      <br />
      <span>应收费用：{{shouManualOutMessageB.rent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shouManualOutMessageBVisible = false">取 消</el-button>
        <el-button type="primary" @click="getRentOpenGateB">收费抬杆</el-button>
      </span>
    </el-dialog>
    <!-- E手动出场弹出框 -->
    <el-dialog title="手动收费" :visible.sync="shouManualOutMessageEVisible" width="30%">
      <span>车辆类型：{{shouManualOutMessageE.carType}}</span>
      <br />
      <span>汽车牌照：{{shouManualOutMessageE.license}}</span>
      <br />
      <span>入场闸口：{{shouManualOutMessageE.lpInboundCname}}</span>
      <br />
      <span>入场时间：{{shouManualOutMessageE.lpInboundTime}}</span>
      <br />
      <span>应收费用：{{shouManualOutMessageE.rent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shouManualOutMessageEVisible = false">取 消</el-button>
        <el-button type="primary" @click="getRentOpenGateE">收费抬杆</el-button>
      </span>
    </el-dialog>
    <el-dialog align="center" title="车牌已重复是否继续" :visible.sync="hide" width="30%">
      <el-button type="primary"  class="icon-buttoner">否</el-button>
      <el-button type="primary"  class="icon-button" @click="addent">是</el-button>
    </el-dialog>
     
      <audio src="http://downsc.chinaz.net/Files/DownLoad/sound1/201909/12025.wav"  ref="btn"></audio>
        <el-button class="button" size="medium" type="primary" style="margin-bottom:30px" @click="Updata()">刷新</el-button>
  </div>
  
</template>
<style>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
<script>
import { setTimeout } from "timers";
import { log } from "util";
// import { fetchData } from '../../api/index';
export default {
  name: "outInControl",
  data() {
    return {
    addnumberA:8,
    datalisttwo:[],
    //  弹出框显示隐藏
        onshow0:false,
        onshow1:false,
        onshow2:false,
        onshow3:false,
        onshow4:false,
        onshow5:false,
        onshow6:false,
        onshow7:false,

      addA:"",
      addB:"",
      addE:"",
      addG:"",
      vscode:'undefined',
      nes:3,
      npmaerA:'',
      npmaerB:'',
      npmaerE:'',
      npmaerG:'',
      shouManualOutMessageVisible: false,
      shouManualOutMessageBVisible: false,
      shouManualOutMessageEVisible: false,
       shouManualOutMessageGVisible: false,
      valueaa:"",
      valuebb:"",
      valuecc:"",
      valuedd:"",
      valueee:"",
      valueff:"",
      valuegg:"",
      valuehh:"",
      hide:false,
      yarn:"",
      shouManualOutMessage: {
        carType: "",
        license: "",
        lpInboundCname: "",
        lpInboundTime: "",
        rent: ""
      },
      shouManualOutMessageB: {
        carType: "",
        license: "",
        lpInboundCname: "",
        lpInboundTime: "",
        rent: ""
      },
      shouManualOutMessageE: {
        carType: "",
        license: "",
        lpInboundCname: "",
        lpInboundTime: "",
        rent: ""
      },
      shouManualOutMessageG: {
        carType: "",
        license: "",
        lpInboundCname: "",
        lpInboundTime: "",
        rent: ""
      },
      shouManualInMessage: {
        carType: "",
        license: "",
        lpInboundCname: "",
        lpInboundTime: "",
        rent: ""
      },
      ManualAForm: {
        license: ""
        // isUp:''
      },
      ManualBForm: {
        license: ""
        // isUp:''
      },
      ManualEForm: {
        license: ""
        // isUp:''
      },
      ManualGForm: {
        license: ""
        // isUp:''
      },
      ManualCForm: {
        license: "",
        datatime: ""
      },
      ManualDForm: {
        license: "",
        datatime: ""
      },
      ManualFForm: {
        license: "",
        datatime: ""
      },
       ManualHForm: {
        license: "",
        datatime: ""
      },
      list: {
        picPathA:require("../../../screenshots/wu.png"),
        picPathB:require("../../../screenshots/wu.png"),
        picPathC:require("../../../screenshots/wu.png"),
        picPathD:require("../../../screenshots/wu.png"),
        picPathE:require("../../../screenshots/wu.png"),
        picPathF:require("../../../screenshots/wu.png"),
        picPathG:require("../../../screenshots/wu.png"),
        picPathH:require("../../../screenshots/wu.png"),


        cameraALicenseId: "",//车牌号
        cameraAInboundTime: "",//入场时间
        cameraADepartureTime: "",//出场时间
        cameraARent: "",//应收费用

        cameraBLicenseId: "",
        cameraBInboundTime: "",
        cameraBDepartureTime: "",
        cameraBRent: "",

        cameraCLicenseId: "",
        cameraCInboundTime: "",
        cameraCDepartureTime: "",
        cameraCRent: "",

        cameraDLicenseId: "",
        cameraDInboundTime: "",
        cameraDDepartureTime: "",
        cameraDRent: "",

        cameraELicenseId: "",
        cameraEInboundTime: "",
        cameraEDepartureTime: "",
        cameraERent: "",

        cameraFLicenseId: "",
        cameraFInboundTime: "",
        cameraFDepartureTime: "",
        cameraFRent: "",

        cameraGLicenseId: "",
        cameraGInboundTime: "",
        cameraGDepartureTime: "",
        cameraGRent: "",

        cameraHLicenseId: "",
        cameraHInboundTime: "",
        cameraHDepartureTime: "",
        cameraHRent: "",

        cameraBcake: "",

        cameraAId: "",
        cameraAName: "",
        cameraAState: "",
        cameraAIpAddress: "",
        accessA: "",
        thandleA: "",

        cameraBId: "",
        cameraBName: "",
        cameraBState: "",
        cameraBIpAddress: "",
        accessB: "",
        thandleB: "",

        cameraCId: "",
        cameraCName: "",
        cameraCState: "",
        cameraCIpAddress: "",
        accessC: "",
        thandleC: "",

        cameraDId: "",
        cameraDName: "",
        cameraDState: "",
        cameraDIpAddress: "",
        accessD: "",
        thandleD: "",

        cameraEId: "",
        cameraEName: "",
        cameraEState: "",
        cameraEIpAddress: "",
        accessE: "",
        thandleE: "",

        cameraFId: "",
        cameraFName: "",
        cameraFState: "",
        cameraFIpAddress: "",
        accessF: "",
        thandleF: "",

        cameraGId: "",
        cameraGName: "",
        cameraGState: "",
        cameraGIpAddress: "",
        accessG: "",
        thandleG: "",

        cameraHId: "",
        cameraHName: "",
        cameraHState: "",
        cameraHIpAddress: "",
        accessH: "",
        thandleH: ""
      },
      listSort: {
        listA: "-1",
        listB: "-1",
        listC: "-1",
        listD: "-1",
        listE: "-1",
        listF: "-1",
        listG: "-1",
        listH: "-1"
      },
      inCamera: {
        name: "",
        thandle: "-1"
      },
      outCamera: {
        name: "",
        thandle: "-1"
      }
    };
  },
  created() {
    // this.getThere()
    // this.createss()
    this.refreshCarMessage();
    this.getInCamerasName();
    this.getOutCamerasName();
    this.getdataadd()
    // this.nserp()
  },
  watch: {
      'npmaerA': function () {
        this.aplayAudio()
      },
      'npmaerB': function () {
        this.aplayAudio()
      },
      'npmaerE': function () {
        this.aplayAudio()
      },
      'npmaerG': function () {
        this.aplayAudio()
      }
    },
  computed: {},
  
  methods: {
    // //一上来判断哪些弹出框 是显示的
    // getThere(){

    // }
    Updata(){
       console.log("123456789")
        this.refreshCarMessage();
        this.getInCamerasName();
        this.getOutCamerasName();
        this.getdataadd()
        this.addA="",
        this.addB="",
        this.addE="",
        this.addG=""
    },
    aplayAudio(){
        if(this.vscode){
           this.$refs.btn.play()
        }else{

        }
    },
    //取消按钮
    calladd(index){
       this.datalisttwo[index].addshow=false
    },
    //获取摄像机
    getdataadd(){
      var res=this
       this.$axios({
        // url: "cameraInit/ManualSupplementOpenGate",
         url: "jinshiCameras/selectByParkIdDesc",
         method: "post",
         data:{
           parkId:String(localStorage.getItem("parkId"))
           
         }
      })
        .then(function(response) {
            res.listSort.listA=response.data[0].jcThandle
            res.listSort.listB=response.data[1].jcThandle
            res.listSort.listE=response.data[2].jcThandle
            res.listSort.listG=response.data[3].jcThandle
            res.listSort.listC=response.data[4].jcThandle
            res.listSort.listD=response.data[5].jcThandle
            res.listSort.listF=response.data[6].jcThandle
            res.listSort.listH=response.data[7].jcThandle
            res.valueaa=response.data[0].jcName,
            res.valuebb=response.data[1].jcName,
            res.valueee=response.data[2].jcName,
            res.valuegg=response.data[3].jcName,
           res.valuecc=response.data[4].jcName,
            res.valuedd=response.data[5].jcName,
           res.valueff=response.data[6].jcName,
           res.valuehh=response.data[7].jcName

           //判断摄像机是不是显示的
           for(var i=0;i<response.data.length;i++){
              if(response.data[i].jcIsType==1){
                   response.data[i]["addshow"]=true
              }else{
                   response.data[i]["addshow"]=false
              }
           }


          //  res.newadd=response.data
          //  console.log(res.newadd)
 console.log(response,"摄像机设置")
          res.datalisttwo=response.data
        }).catch(function(error) {
          console.log(error);
        });
        
    },
    //点击  是  的接口
    addent(){
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualSupplementOpenGate",
         url: "cameraInit/ManualSupplementOpenGate",
        method: "post",
        data: {
          license: res.yarn,
          tHandle: res.listSort.listC,
          datatime: res.ManualCForm.datatime
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
              res.hide=false
              res.$message.success("执行成功！");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //请选择日期时间
    dateChangebirthdayC(val) {
      console.log(val);
      this.ManualCForm.datatime = val;
    },
    dateChangebirthdayD(val) {
      console.log(val);
      this.ManualDForm.datatime = val;
    },
     dateChangebirthdayF(val) {
      console.log(val);
      this.ManualFForm.datatime = val;
    },
     dateChangebirthdayH(val) {
      console.log(val);
      this.ManualHForm.datatime = val;
    },
    //c模块的人工补录抬竿
    ManualCFixOpenGate() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualSupplementOpenGate",
         url: "cameraInit/ManualSupplementOpenGateNext",
        method: "post",
        data: {
          license: res.ManualCForm.license,
          tHandle: res.listSort.listC,
          datatime: res.ManualCForm.datatime
        }
      })
        .then(function(response) {
            //res.$message.success("执行成功！");
          if (response.status <= 200) {
            if (response.data.code == 0) {
               res.hide=true
               res.yarn=res.ManualCForm.license
            } else {
              res.$message.success("执行成功！");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //  ManualCFixOpenGate() {
    //   var res = this;
    //   this.$axios({
    //     // url: "cameraInit/ManualCFix",
    //     url: "cameraInit/ManualCFix",
    //     method: "post",
    //     data: {
    //       license: res.ManualCForm.license,
    //       tHandle: res.listSort.listC,
    //       datatime: res.ManualCForm.datatime
    //     }
    //   })
    //     .then(function(response) {
    //       if (response.status <= 200) {
    //         if (response.data.resMessage != null) {
    //           res.$message.error(response.data.resMessage);
    //         } else {
    //           res.$message.success("执行成功！");
    //         }
    //       }
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    //d模快的人工补录抬竿
    ManualDFixOpenGate() {
       var res = this;
      this.$axios({
        // url: "cameraInit/ManualSupplementOpenGate",
         url: "vcameraInit/ManualSupplementOpenGateNext",
        method: "post",
        data: {
          license: res.ManualDForm.license,
          tHandle: res.listSort.listD,
          datatime: res.ManualDForm.datatime
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            if (response.data.code == 0) {
               res.hide=true
               res.yarn=res.ManualDForm.license
            } else {
             res.$message.success("执行成功！");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //f模块的人工补录抬竿
     ManualFFixOpenGate() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualSupplementOpenGate",
         url: "cameraInit/ManualSupplementOpenGateNext",
        method: "post",
        data: {
          license: res.ManualFForm.license,
          tHandle: res.listSort.listF,
          datatime: res.ManualFForm.datatime
        }
      })
        .then(function(response) {
          // res.$message.success("执行成功！");
          if (response.status <= 200) {
            if (response.data.code == 0) {
               res.yarn=res.ManualFForm.license
               res.hide=true
            } else {
              res.$message.success("执行成功！");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //H模块的人工抬杠
     ManualHFixOpenGate() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualSupplementOpenGate",
         url: "cameraInit/ManualSupplementOpenGateNext",
        method: "post",
        data: {
          license: res.ManualHForm.license,
          tHandle: res.listSort.listH,
          datatime: res.ManualHForm.datatime
        }
      })
        .then(function(response) {
          // res.$message.success("执行成功！");
          if (response.status <= 200) {
            if (response.data.code == 0) {
               res.yarn=res.ManualHForm.license
               res.hide=true
            } else {
              res.$message.success("执行成功！");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //d模块的人工补录不抬杠
    ManualDFix() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualCFix",
        url:"cameraInit/ManualCFix",
        method: "post",
        data: {
          license: res.ManualDForm.license,
          tHandle: res.listSort.listD,
          datatime: res.ManualDForm.datatime
        }     
      })
        .then(function(response) {
          if (response.status <= 200) {
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.$message.success("执行成功！");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //c模块的人工补录不抬杠
    ManualCFix() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualCFix",
         url: "cameraInit/ManualCFix",
        method: "post",
        data: {
          license: res.ManualCForm.license,
          tHandle: res.listSort.listC,  
          datatime: res.ManualCForm.datatime
        }  
      })  
        .then(function(response) {
          if (response.status <= 200) {
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.$message.success("执行成功");
            }  
          }    
        })
        .catch(function(error) {
          console.log(error);        
        });    
    },
    //f 模块的补录不抬杠       
    ManualFFix() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualCFix",
         url: "cameraInit/ManualCFix",
        method: "post",
        data: {
          license: res.ManualFForm.license,
          tHandle: res.listSort.listF,
          datatime: res.ManualFForm.datatime
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.$message.success("执行成功！");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //h模块补录不抬杠
     ManualHFix() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualCFix",
         url: "cameraInit/ManualCFix",
        method: "post",
        data: {
          license: res.ManualHForm.license,
          tHandle: res.listSort.listH,
          datatime: res.ManualHForm.datatime
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.$message.success("执行成功！");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //收费抬杠    排除
    getRentOpenGate() {
      var res = this;
      this.$axios({
        // url: "cameraInit/getRentOpenGate",
        url: "cameraInit/getRentOpenGate",
        method: "post",
        data: {
          license: res.ManualAForm.license,
          tHandle: res.listSort.listA,
          rent: res.shouManualOutMessage.rent
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("执行成功");
            console.log(response,"收费抬杠")
            res.shouManualOutMessageVisible = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getRentOpenGateB() {
      var res = this;
      this.$axios({
        // url: "cameraInit/getRentOpenGate",
         url: "cameraInit/getRentOpenGate",
        method: "post",
        data: {
          license: res.ManualBForm.license,
          tHandle: res.listSort.listB,
          rent: res.shouManualOutMessageB.rent
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("执行成功");
            shouManualOutMessageBVisible = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getRentOpenGateE() {
      var res = this;
      this.$axios({
        // url: "cameraInit/getRentOpenGate",
        url: "cameraInit/getRentOpenGate",
        method: "post",
        data: {
          license: res.ManualEForm.license,
          tHandle: res.listSort.listE,
          rent: res.shouManualOutMessageE.rent
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("执行成功");
            shouManualOutMessageEVisible = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getRentOpenGateG() {
      var res = this;
      this.$axios({
        // url: "cameraInit/getRentOpenGate",
        url: "cameraInit/getRentOpenGate",
        method: "post",
        data: {
          license: res.ManualGForm.license,
          tHandle: res.listSort.listG,
          rent: res.shouManualOutMessageG.rent
        }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("执行成功");
            shouManualOutMessageGVisible = false;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //手动出场第一个模块
    ManualAFormSubmit() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualAFormSubmit",
        url: "cameraInit/ManualAFormSubmit",
        method: "post",
        data: { license: res.ManualAForm.license, tHandle: res.listSort.listA }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.shouManualOutMessageVisible = true;
              res.shouManualOutMessage = response.data;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //手动出场第二个模块
    ManualBFormSubmit() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualAFormSubmit",
        url: "cameraInit/ManualAFormSubmit",
        method: "post",
        data: { license: res.ManualBForm.license, tHandle: res.listSort.listB }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.shouManualOutMessageBVisible = true;
              res.shouManualOutMessageB = response.data;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //手动出场第三个模块
    ManualEFormSubmit() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualAFormSubmit",
        url: "cameraInit/ManualAFormSubmit",
        method: "post",
        data: { license: res.ManualEForm.license, tHandle: res.listSort.listE }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.shouManualOutMessageEVisible = true;
              res.shouManualOutMessageE = response.data;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //手动出常的第4个模块
    ManualGFormSubmit() {
      var res = this;
      this.$axios({
        // url: "cameraInit/ManualAFormSubmit",
        url: "cameraInit/ManualAFormSubmit",
        method: "post",
        data: { license: res.ManualGForm.license, tHandle: res.listSort.listG }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            if (response.data.resMessage != null) {
              res.$message.error(response.data.resMessage);
            } else {
              res.shouManualOutMessageGVisible = true;
              res.shouManualOutMessageG = response.data;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //上来执行的事件
    getInCamerasName() {
      var res = this;
      this.$axios({
        // url: "cameraInit/getInCamerasName",
         url: "cameraInit/getInCamerasName",
        method: "post"
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.inCamera = response.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //上来执行的事件
    getOutCamerasName() {
      var res = this;
      this.$axios({
        // url: "cameraInit/getOutCamerasName",
         url: "cameraInit/getOutCamerasName",
        method: "post"
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response.data);
            res.outCamera = response.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //请选择相机事件
    handEditASub(thandle) {
      
      this.listSort.listA = thandle;
    },
    handEditBSub(thandle) {
      this.listSort.listB = thandle;
    
    },
    handEditCSub(thandle) {
      this.listSort.listC = thandle;
   
    },
    handEditDSub(thandle) {
      this.listSort.listD = thandle;
       
    },
    handEditESub(thandle) {
      this.listSort.listE = thandle;
       
    },
     handEditFSub(thandle) {
      this.listSort.listF = thandle;
     
    },
    handEditGSub(thandle) {
      this.listSort.listG = thandle;
       
    },
    handEditHSub(thandle) {
      this.listSort.listH = thandle;
     
    },
    //出口的收费放行   根据val 来判断是哪个出口
    getPayOpenGate(val) {
      var res = this;
      if(val==1){
          this.$axios({
              url: 'cameraInit/openGateNew',
              method: 'post',
              data:{"jcThandle":this.list.thandleA,"lincense":this.list.cameraALicenseId,"lpParkingRealCost":Number(this.addA),"lpParkingOften":Number(this.list.lpParkingOften)}
          }).then(function (response) {
          if (response.status <= 200) {
              console.log(response)
              res.$message.success(response.data.msg);
          }
          }).catch(function (error) {
              res.$message.error(response.data);
              console.log("收费放行失败");
          });
      }else if(val==2){
          this.$axios({
              url: 'cameraInit/openGateNew',
              method: 'post',
              data:{"jcThandle":this.list.thandleB,"lincense":this.list.cameraBLicenseId,"lpParkingRealCost":Number(this.addB),"lpParkingOften":Number(this.list.lpParkingOften)}
          }).then(function (response) {
          if (response.status <= 200) {
              res.$message.success(response.data.msg);
          }
          }).catch(function (error) {
              res.$message.error(response.data);
              console.log(error);
          });
      }else if(val==5){
           this.$axios({
              url: 'cameraInit/openGateNew',
              method: 'post',
              data:{"jcThandle":this.list.thandleE,"lincense":this.list.cameraELicenseId,"lpParkingRealCost":Number(this.addE),"lpParkingOften":Number(this.list.lpParkingOften)}
          }).then(function (response) {
          if (response.status <= 200) {
              res.$message.success(response.data.msg);
          }
          }).catch(function (error) {
              res.$message.error(response.data);
              console.log(error);
          });
      }else if(val==7){
           this.$axios({
              url: 'cameraInit/openGateNew',
              method: 'post',
              data:{"jcThandle":this.list.thandleG,"lincense":this.list.cameraGLicenseId,"lpParkingRealCost":Number(this.addG),"lpParkingOften":Number(this.list.lpParkingOften)}
          }).then(function (response) {
          if (response.status <= 200) {
              res.$message.success(response.data.msg);
          }
          }).catch(function (error) {
              res.$message.error(response.data);
              console.log(error);
          });
      }

    },
    //免费抬竿  根据val值判断是哪个窗口 
    openGate(val) {
      var res = this;
      if (val == 1) {
        this.$axios({
          // url: "cameraInit/openGate",
           url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleA }
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
      } else if (val == 2) {
        this.$axios({
          // url: "cameraInit/openGate",
           url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleB }
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
      } else if (val == 3) {
        this.$axios({
          // url: "cameraInit/openGate",
           url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleC }
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
      } else if (val == 4) {
        this.$axios({
          url: "cameraInit/openGate",
          //  url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleD }
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
      } else if(val == 5){
           this.$axios({
          url: "cameraInit/openGate",
          //  url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleE }
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
      } else if(val == 6){
          this.$axios({
           // url: "cameraInit/openGate",
           url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleF }
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
      }else if(val == 7){
          this.$axios({
           // url: "cameraInit/openGate",
           url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleG }
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
      }else if(val == 8){
          this.$axios({
           // url: "cameraInit/openGate",
           url: "cameraInit/openGate",
          method: "post",
          data: { jcThandle: res.list.thandleH }
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
      }
    },
     //落竿    根据val值判断是哪个窗口
    closeGate(val) {
      var res = this;
      if (val == 1) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleA }
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
      } else if (val == 2) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleB }
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
      } else if (val == 3) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleC }
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
      } else if (val == 4) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleD }
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
      }else if (val == 5) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleE }
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
      }else if (val == 6) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleF }
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
      }else if (val == 7) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleG }
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
      }else if (val == 8) {
        this.$axios({
          // url: "cameraInit/closeGate",
           url: "cameraInit/closeGate",
          method: "post",
          data: { jcThandle: res.list.thandleH }
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
      }
    },
    //入口重拍的事件  根据value 判断是入口哪个窗口
    remakePhoto(val) {
      var res = this;
      // if (val == 1) {
      //   this.$axios({
      //     // url: "cameraInit/remakePhoto",
      //     url: "cameraInit/remakePhoto",
      //     method: "post",
      //     data: { jcThandle: res.list.thandleA}
      //   })
      //     .then(function(response) {
      //       if (response.status <= 200) {
      //         res.$message.success(response.data);
      //       }
      //     })
      //     .catch(function(error) {
      //       res.$message.error(response.data);
      //       console.log(error);
      //     });
      // } else if (val == 2) {
      //   this.$axios({
      //     url: "cameraInit/remakePhoto",
      //     // url: "cameraInit/remakePhoto",
      //     method: "post",
      //     data: { jcThandle: res.list.thandleB }
      //   })
      //     .then(function(response) {
      //       if (response.status <= 200) {
      //         res.$message.success(response.data);
      //       }
      //     })
      //     .catch(function(error) {
      //       res.$message.error(response.data);
      //       console.log(error);
      //     });
      // } 
      if (val == 3) {
        this.$axios({
          // url: "cameraInit/remakePhoto",
          url: "cameraInit/remakePhoto",
          method: "post",
          data: { jcThandle: res.list.thandleC }
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
      } else if (val == 4) {
        this.$axios({
          url: "cameraInit/remakePhoto",
          //  url: "cameraInit/remakePhoto",
          method: "post",
          data: { jcThandle: res.list.thandleD }
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
      }else if (val == 6) {
        this.$axios({
          // url: "cameraInit/remakePhoto",
          url: "cameraInit/remakePhoto",
          method: "post",
          data: { jcThandle: res.list.thandleF}
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
      }else if (val == 8) {
        this.$axios({
          // url: "cameraInit/remakePhoto",
          url: "cameraInit/remakePhoto",
          method: "post",
          data: { jcThandle: res.list.thandleH}
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
      }
      // else if (val == 5) {
      //   this.$axios({
      //     url: "cameraInit/remakePhoto",
      //     // url: "cameraInit/remakePhoto",
      //     method: "post",
      //     data: { jcThandle: res.list.thandleE }
      //   })
      //     .then(function(response) {
      //       if (response.status <= 200) {
      //         res.$message.success(response.data);
      //       }
      //     })
      //     .catch(function(error) {
      //       res.$message.error(response.data);
      //       console.log(error);
      //     });
      // }
    },
    connCamera(val) {
      var res = this;
      if (val == 1) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
          url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraAIpAddress }
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
      } else if (val == 2) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
          url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraBIpAddress }
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
      } else if (val == 3) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
          url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraCIpAddress }
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
      } else if (val == 4) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
          url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraDIpAddress }
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
      }else if (val == 5) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
           url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraEIpAddress }
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
      } else if (val == 6) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
           url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraFIpAddress }
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
      }
      else if (val == 7) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
           url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraGIpAddress }
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
      }
      else if (val == 8) {
        this.$axios({
          // url: "jinshiCameras/connCamera",
           url: "jinshiCameras/connCamera",
          method: "post",
          data: { jcIpAddress: res.list.cameraHIpAddress }
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
      }
    },
    //页面上来就执行的事件   获取数据
    refreshCarMessage() {
      let self = this;
      var arr = this;
      this.$axios({
        // url:"cameraInit/getGlobalVariable",
        url:"cameraInit/getGlobalVariable",
        method: "post",
        data: arr.listSort
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response,"123456789")
           arr.jcIsTypeA=response.data.jcIsTypeA,
           arr.jcIsTypeB=response.data.jcIsTypeB,
           arr.jcIsTypeC=response.data.jcIsTypeC,
           arr.jcIsTypeD=response.data.jcIsTypeD,
           arr.jcIsTypeE=response.data.jcIsTypeE,
           arr.jcIsTypeF=response.data.jcIsTypeF,
           arr.jcIsTypeG=response.data.jcIsTypeG,
           arr.jcIsTypeH=response.data.jcIsTypeH,
            arr.npmaerA=response.data.cameraALicenseId
            arr.npmaerB=response.data.cameraBLicenseId
            arr.npmaerE=response.data.cameraELicenseId
            arr.npmaerG=response.data.cameraGLicenseId
            arr.vscode=response.data.voiceCode
            if(!response.data.picPathA){
              response.data.picPathA=require("../../../screenshots/wu.png")
            }
            if(!response.data.picPathB){
               response.data.picPathB=require("../../../screenshots/wu.png")
            }
            if(!response.data.picPathC){
              response.data.picPathC=require("../../../screenshots/wu.png")
            }
            if(!response.data.picPathD){
               response.data.picPathD=require("../../../screenshots/wu.png")
            }
            if(!response.data.picPathE){
               response.data.picPathE=require("../../../screenshots/wu.png")
            }
            if(!response.data.picPathF){
               response.data.picPathF=require("../../../screenshots/wu.png")
            }
            if(!response.data.picPathG){
               response.data.picPathF=require("../../../screenshots/wu.png")
            }
            if(!response.data.picPathH){
               response.data.picPathF=require("../../../screenshots/wu.png")
            }
            arr.list = response.data;
             console.log(arr.list)
            setTimeout(function() {
              self.refreshCarMessage();
              self.getdataadd()
            }, 3000);
          }
        })
        .catch(function(error) {
          console.log("请求失败123" + error);
        });
    },
    // nserp(){
    //   var res = this;
    //   this.$axios({
    //     url:
    //       "test/openGate?tHandle=0&lincense=苏E5B51A",
    //        method: "get",
    //   })
    //     .then(function(response) {
    //       if (response.status <= 200) {
    //         console.log(response,"OK");
    //       }
    //     })
    //     .catch(function(error) {
    //       res.$message.error("查询失败: " + error);
    //       console.log(error);
    //     });
    // },
    createss(){
        this.$axios({
        url:"test/openGate",
        method: "get",
      })
        .then(function(response) {
            console.log(response,"123456789")
        })
        .catch(function(error) {
          console.log("请求失败123" + error);
        });
    },
    //确认
     addbuttons(event){
      var res = this;
      this.$axios({
        url:
          "jinshiCameras/updateIsType",
           method: "post",
           data:{
             jcId:Number(this.datalisttwo[event].jcId),
             jcIsType:2
           }
      })
        .then(function(response) {
          if (response.status <= 200) {
            console.log(response,"确认成功");
            res.getdataadd()
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    //点击  2  4  6  8
    onshowertwo(){
      this.addnumberA=2
    },
    onshowerfour(){
      this.addnumberA=4
    },
    onshowersix(){
      this.addnumberA=6
    },
     onshowernighat(){
      this.addnumberA=8
    }
  },
  
  //点击确认addbuttons
  
  
};
</script>
<style  scoped>
.button {
  margin-top: 10px;
}
.iconers{
  float: left;
  /* margin-top:15%; */
  width: 300px !important;
  height: 200px !important;
  overflow: hidden;
  /* border: 1px solid #000; */
}
.icon-eldiv{
  width: 100%;
  height: 30px;
  background: red;
  text-align: center;
  position: relative;
  bottom:20px;
  font-size: 12px;
}
.icon-buttoner{
  border: none;
  background-color: red;
  margin-right: 30%;
  
}
.nserder{
  text-align: center
}
.divv{
   width: 300px !important;
  height: 200px !important;
  overflow: hidden;
  /* background-color: renpm d; */
  padding-top: 30px;
}
.addserve{
  width: 300px;
  height: 200px;
  background: #f2f2f2;
  position: absolute;
  z-index: 99;
  left: 283px;
  top: 111px;
}
.addserveA{
   width: 300px;
  height: 200px;
  background: #f2f2f2;
  position: absolute;
  z-index: 99;
  left: 283px;
  top: 111px;
}
.div-icon-er{
  width: 100%;
  height: 30px;
  display: flex;
  line-height: 30px;
}
/* .div-icon-er>div{
  width: 20px;
  height: 20px;
  border: 1px solid black;
  text-align: center;
  line-height: 20px;
  margin-left: 30px;
  margin-bottom: 50px;
} */
.adderde{
   width: 20px;
  height: 20px;
  border: 1px solid #409EFF;
  text-align: center;
  line-height: 20px;
  margin-left: 30px;
  margin-bottom: 50px;
  background: #409EFF;
  color: white;
  cursor:pointer;
}
.adderdeA{
   width: 20px;
  height: 20px;
  border: 1px solid black;
  text-align: center;
  line-height: 20px;
  margin-left: 30px;
  margin-bottom: 50px;
  cursor:pointer;
  /* background: blue; */
  
}
</style>
