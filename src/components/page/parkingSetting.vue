<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 基本设置
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" :rules="carFormRules" label-width="150px">
          <el-form-item label="车场编号： " prop="jpNumber">
            <el-input v-model="form.jpNumber" :disabled="true" placeholder="请输入车场编号"></el-input>
          </el-form-item>
          <el-form-item label="车场名称： " prop="jpName">
            <el-input v-model="form.jpName" placeholder="请输入车场名称"></el-input>
          </el-form-item>
          <el-form-item label="车场地址：" prop="jpSite">
            <el-input v-model="form.jpSite" placeholder="请输入车场地址"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名：" prop="jpMembers">
            <el-input v-model="form.jpMembers" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机号：" prop="jpPhoneNumber">
            <el-input v-model="form.jpPhoneNumber" placeholder="请输入联系人手机号"></el-input>
          </el-form-item>


           <el-form-item label="备选手机号1 ：" prop="jpPhoneNumberBackup">
            <el-input v-model="form.jpPhoneNumberBackup" placeholder="请输入备选手机号"></el-input>
          </el-form-item>

            <el-form-item label="备选手机号2 ：">
            <el-input v-model="form.jpPhoneNumberBackupTwo" placeholder="请输入备选手机号"></el-input>
          </el-form-item>
          
          <el-form-item label="联系人微信号：" prop="jpWxNumber">
            <el-input v-model="form.jpWxNumber" placeholder="请输入联系人微信"></el-input>
          </el-form-item>
          <el-form-item label="车 位 数 ：" prop="jpPlaceNumber">
            <el-input v-model="form.jpPlaceNumber" placeholder="请输入车位数"></el-input>
          </el-form-item>


          <el-form-item label="对接当地接口 ：">
            <el-select v-model="jpsOpenLocalInterface"  @change="handleCommand">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>

          <el-form ref="form" :model="modeForm" label-width="150px">
          <!-- <el-form-item label="场地免费模式">
            <el-checkbox v-model="modeForm.jpsFreeMode"></el-checkbox>
          </el-form-item>
          <el-form-item label="场地车队模式">
           <el-checkbox v-model="modeForm.jpsOpenMode"></el-checkbox>
          </el-form-item> -->
         
          
          <el-form-item label="月租车是否计算车位">
            <el-checkbox v-model="modeForm.jpsMemberCar"></el-checkbox>
          </el-form-item>

         


          <el-form-item label="无效卡放行">
            <el-checkbox v-model="modeForm.jpsInvalidRelease"></el-checkbox>
          </el-form-item>

           <el-form-item label="是否允许黄牌车进入">
            <el-checkbox v-model="modeForm.jpsYellowLincenseAllow"></el-checkbox>
          </el-form-item>

          <el-form-item label="出场确认模式">
            <el-checkbox v-model="modeForm.jpsExportConfirm"></el-checkbox>
          </el-form-item>

          <el-form-item label="进场确认模式">
            <el-checkbox v-model="modeForm.jpsImportConfirm"></el-checkbox>
          </el-form-item>

           <el-form-item label="支付模式">
            <el-select v-model="modeForm.jpsPayType" placeholder="支付模式"  @change="handleCommandeeAd" >
              <el-option
                v-for="item in optionsAE"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>

          <!-- <el-form-item label="允许负车位数">
            <el-select v-model="valueG" placeholder="请选择负车位数" @change="handleCommandenAll">
              <el-option
                v-for="item in optionsC"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item> -->

           <el-form-item label="云服务器地址：">
            <el-select v-model="valueE" placeholder="请选择云服务器地址" @change="handleCommandee">
              <el-option
                v-for="item in optionsA"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>

           <el-form-item label="优惠券地址：" >
            <el-select v-model="valueF" placeholder="请选择优惠券服务地址" @change="handleCommanden">
              <el-option
                v-for="item in optionsB"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>

          <el-form-item label="免费模式：">
            <p>收费设置所有金额为0即为场地免费模式</p>
          </el-form-item>

          <el-form-item label="抓拍图片保存路径：">
            <p>{{adderimage}}</p>
          </el-form-item>
        </el-form>
        </el-form>
         
      </div>
     
      <el-button type="primary" @click="saveMode" style="margin-left:10%">保存</el-button>
      <el-button type="primary" @click="refresh" style="margin-left:10px">刷新</el-button>
    </div>
       
  </div>
</template>

<script>
export default {
  name: "baseform",
  data: function() {
    return {
      value:0,
      valueG:"0",
      jpsOpenLocalInterface:"0",
      valueE:"0",//云服务器的默认地址
      valueF:"0",//优惠券的默认地址
      adderimage:"",//图片保存路径
      optionsAE:[
         {
           value: 0,
           label: '模式一'
        },
        {
           value: 1,
           label: '模式二'
        },
      ],
      options:[
        {
           value: '0',
           label: '无'
        },
        {
           value: '1',
           label: '常熟'
        }
      ],
       optionsC:[
        {
           value: '0',
           label: '9999'
        },
        {
           value: '1',
           label: '0'
        }
      ],
      optionsA:[
        {
           value: '0',
           label: 'http://www.jinshipark.com'
        },
      ],
       optionsB:[
        {
           value: '0',
           label: 'http://yun.jinshipark.com:81'
        },
      ],
      form: {
        jpId: "",
        jpName: "",
        jpNumber: "",
        jpSite: "",
        jpMembers: "",
        jpPhoneNumber: "",
        jpPlaceNumber: "",
        jpWxNumber: "",
        jpPhoneNumberBackup:"",
        jpPhoneNumberBackupTwo:""
      },
      modeForm: {
        // jpsFreeMode:"",//场地免费
        // jpsOpenMode:"",//场地车队
        jpsMemberCar: "",//月租车
        jpsInvalidRelease: "",//无效卡
        jpsYellowLincenseAllow:"",//黄牌车
        jpsUrlNewPc:"",//云服务器地址
        jpsUrlNewShopPc:'',//优惠券地址
        jpsOpenLocalInterface:"",
        jpsAllowNegativeCar:"",//负车位数
        jpsPayType:"模式一",
        jpsExportConfirm:"",//出场确认模式,
        jpsImportConfirm:""//入场确认模式
      },
      carFormRules:{
         jpNumber:[
            { message: "请输入车场编号", required: true, trigger: "blur" },
            {
              min: 1,
              max: 20,
              message: "长度应该在1-10个字符之间",
              trigger: "blur"
            },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
         ],
         jpName:[
            { message: "请输入车场名称", required: true, trigger: "blur" },
            {
              min: 1,
              max: 20,
              message: "长度应该在1-10个字符之间",
              trigger: "blur"
            },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
         ],
         jpSite:[
            { message: "请输入车场地址", required: true, trigger: "blur" },
            {
              min: 1,
              max: 20,
              message: "长度应该在1-10个字符之间",
              trigger: "blur"
            },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
         ],
         jpMembers:[
           { message: "请输入联系人姓名", required: true, trigger: "blur" },
            {
              min: 2,
              max: 5,
              message: "长度应该在2-5个字符之间",
              trigger: "blur"
            },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' }
         ],
         jpPhoneNumber:[
            { message: "手机号不能为空", required: true },
            { pattern: /^[0-9]+$/, message: '只允许输入数字' },
            { 
              min: 11,
              max: 11,
              message: "请输入11位手机号" },
             
            ],
            jpPhoneNumberBackupTwo:[
               { message: "手机号不能为空", required: true },
            { pattern: /^[0-9]+$/, message: '只允许输入数字' },
            { 
              min: 11,
              max: 11,
              message: "请输入11位手机号" },
             
            ],
         jpWxNumber:[
           {
              min: 0,
              max: 20,
              message: "长度应该在1-20个字符之间",
              trigger: "blur"
            },
            { pattern: /^[0-9a-zA-Z]+$/, message: '不允许输入汉字' }
         ],
         jpPlaceNumber:[
           { message: "车位数不能为空", required: true, trigger: "blur" },
            { pattern: /^[0-9]+$/, message: '只允许输入数字' }
         ],
         jpPhoneNumberBackup:[
             { pattern: /^[0-9]+$/, message: '只允许输入数字' },
           { 
              min: 11,
              max: 11,
              message: "请输入11位手机号" },
            
         ]
         
      }
    };
  },
  methods: {
    refresh(){
      this.modeForm={},
      this.from={}
    },
    handleCommandee(value){
        this.modeForm.urlNewPC=value
    },
    handleCommandeeAd(value){
        this.modeForm.jpsPayType=value
        console.log(value)
    },
    handleCommanden(value){
        this.modeForm.urlNewShopPC=value
    },
    // handleCommandenAll(value){
    //     this.modeForm.jpsAllowNegativeCar=Number(value)
    // },
    //点击下拉框选择
      handleCommand(value) {
       console.log(this.jpsOpenLocalInterface)
       this.modeForm.jpsOpenLocalInterface=this.jpsOpenLocalInterface
    },
    
    //保存
    saveMode() {
      var res = this;
      var  Alldata=this.modeForm
          
          if(Alldata.jpsMemberCar==false){  //月租车
              Alldata.jpsMemberCar=0
          }else{
              Alldata.jpsMemberCar=1
          }
           if(Alldata.jpsInvalidRelease==false){  //无效卡
              Alldata.jpsInvalidRelease=0
          }else{
              Alldata.jpsInvalidRelease=1
          }
          if(Alldata.jpsYellowLincenseAllow==false){  //黄牌车
              Alldata.jpsYellowLincenseAllow=0
          }else{
              Alldata.jpsYellowLincenseAllow=1
          }

           if(Alldata.jpsExportConfirm==false){  //出场
              Alldata.jpsExportConfirm=0
          }else{
              Alldata.jpsExportConfirm=1
          }


           if(Alldata.jpsImportConfirm==false){  //进场
              Alldata.jpsImportConfirm=0
          }else{
              Alldata.jpsImportConfirm=1
          }
          this.modeForm.jpsAllowNegativeCar=Number(this.valueG)
          this.modeForm.jpsOpenLocalInterface=Number(this.jpsOpenLocalInterface)
          console.log(this.modeForm)
      this.$axios({
        url: "JinshiParkingSetup/updateSetup",
        method: "post",
        data: res.modeForm
      })
        .then(function(response) {
          console.log(response);
          if (response.status <= 200) {
            res.getdata()
            res.$message.success("执行成功!!");
          }
        })
        .catch(function(error) {
          res.$message.error("执行失败: " + error);
          console.log(error);
        });

        this.$axios({
        url: "jinshiParking/updateByPrimaryKey",
        method: "post",
        data: { parkSetting: res.form }
      })
        .then(function(response) {
        
          if (response.status <= 200) {
            res.$message.success("执行成功");
          }
        })
        .catch(function(error) {
          res.$message.error("执行失败s");
          console.log(error);
        });
    },
    getModeDate() {
      var res = this;
      this.$axios({
        url: "parking/getModeDate",
        method: "post",
        data:{
        parkId:String(localStorage.getItem("parkId"))
      }
      })
        .then(function(response) {
          console.log(response,"获取所有");
          if (response.status <= 200) {
            console.log(response.data,"4856486");
            res.modeForm = response.data;
            if(response.data.yellowLincenseAllow==1){
                 res.yellow=true
            }
            else{
              res.yellow=false
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询所有数据
    getdata(){
      var res=this
      console.log(typeof(Number(localStorage.getItem("parkId"))))
      this.$axios({
        url:"JinshiParkingSetup/selectParkSetup",
        method: "post",
        data:{
          parkId:Number(localStorage.getItem("parkId"))
        }
      }).then(function(response){

          var  Alldata=response.data
         
          if(Alldata.jpsMemberCar==0){  //月租车
              Alldata.jpsMemberCar=false
          }else{
              Alldata.jpsMemberCar=true
          }
           if(Alldata.jpsInvalidRelease==0){  //无效卡
              Alldata.jpsInvalidRelease=false
          }else{
              Alldata.jpsInvalidRelease=true
          }
          if(Alldata.jpsYellowLincenseAllow==0){  //黄牌车
              Alldata.jpsYellowLincenseAllow=false
          }else{
              Alldata.jpsYellowLincenseAllow=true
          }
            if(Alldata.jpsExportConfirm==0){  //出场
              Alldata.jpsExportConfirm=false
          }else{
              Alldata.jpsExportConfirm=true
          }
            if(Alldata.jpsImportConfirm==0){  //进场
              Alldata.jpsImportConfirm=false
          }else{
              Alldata.jpsImportConfirm=true
          }
           if(Alldata.jpsAllowNegativeCar==9999){  
              Alldata.jpsAllowNegativeCar="0"
              res.valueG="0"
          }else{
              Alldata.jpsAllowNegativeCar="1"
              res.valueG="1"
          }


          if(Alldata.jpsPayType==1){
             Alldata.jpsPayType="模式二"
          }else{
            Alldata.jpsPayType="模式一"
          }
          res.jpsOpenLocalInterface=String(Alldata.jpsOpenLocalInterface)
          res.modeForm=response.data
          console.log(response,"获取所有")
      }).catch(function(error){
          console.log(error);
      })
    } ,
    addImage(){
      this.$axios({
        url:"JinshiParkingSetup/backPicPath",
         method: "post",
          data:{
            parkId:Number(localStorage.getItem("parkId"))
          }
      }).then(res=>{
        console.log("图片路径",res)
        this.adderimage=res.data.picPath
      }).catch(err=>{
        console.log(err)
      })
    } 
  },
  created() {
    this.addImage()
    this.getModeDate()
    // this.nsed()
    this.getdata()
    var res = this;
    this.$axios({
      url: "jinshiParking/selectByNumber",
      method: "post",
      data:{
          parkId:String(localStorage.getItem("parkId"))
        }
    })
      .then(function(response) {
         console.log(response)
        if (response.status <= 200) {
          console.log(response.data);
          res.form = response.data;
        }
      })
      .catch(function(error) {
        res.$message.error("查询失败！");
        console.log(error);
      });
  }
};
</script>
<style  scoped>
.nserder{
  text-align: center
}
.button-on{
    margin-left: 10%;
}
.container{
  height: 1050px;
}
.el-form-item__label{
  text-align: center;
}

</style>