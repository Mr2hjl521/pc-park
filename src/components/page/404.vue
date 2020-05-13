<template>
  <div class="index-div">
      <div class="divv">
         <span>金石停车欢迎您</span>
      </div>
        <div class="divv-icon">
            <p><span class="span-icon">账号：{{username}}</span><span style="margin-left:60px">权限名：{{roleName}}</span></p>
            <p><span class="span-icon">车场：{{jpName}}</span><span style="margin-left:60px">地址：{{site}}</span></p>
        </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
             username:"",
             roleName:"",
             ownername:"",//车场名称
             site:"",
             jpName:""
        }
    },
    created(){
       this.username=localStorage.getItem("ms_username")
       this.roleName=localStorage.getItem("roleName")
       this.site=localStorage.getItem("site")
       if(localStorage.getItem("site")==0){
         this.site=""
       }
       this.$axios({
            url: "parkingJinshi/selectParkByParkId",
            method: "post",
            data:  {
              parkId:String(localStorage.getItem("parkId"))
            }
          }).then(res=>{
           console.log(res,"444444444444444")
           this.jpName=res.data[0].jpName
       }).catch(err=>{
           console.log(err)
       })

    },
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    }
}
</script>


<style scoped>
    .index-div{
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/index.jpg);
        font-size: 100% 100%;
        /* text-align: center; */
    }
    .divv{
        width: 100%;
        height: 300px;
        /* background: red; */
        text-align: center;
        line-height: 400px;
    }
    .divv>span{
       font-size: 60px;
       font-weight: bolder;
       letter-spacing: 30px;
       color: white;
    }
    .divv-icon{
        width: 600px;
        color: white;
        height: 100px;
        margin-left: 31%;
        line-height: 50px;
        
    }
    .span-icon{
        float: left;
        width: 300px;
        height: 30px;
    }
</style>
