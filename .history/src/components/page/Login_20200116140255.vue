<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">金石停车</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="ruleForm.username" placeholder="username" @blur="bur">
						<!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="userMessage()">
						<!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="userMessage()">登录</el-button>
				</div>
				<div class="icon-div"><p class="login-tips" ><el-checkbox v-model="checkeders"></el-checkbox> 记住用户名</p>
				<p class="nee" style="margin-left:42%">
					<el-checkbox v-model="checked">

					</el-checkbox> 记住密码</p>
				</div>
			</el-form>
		</div>
		
		<div class="nserders">
			<p class="pper">备案号：<a href="http://www.beian.miit.gov.cn">苏ICP备19063828号</a> 版本号：1.0 版权所有：苏州金石智能系统工程有限公司</p>
		</div>
	</div>
	
</template>

<script>
	export default {
		data: function() {
			return {
				checked:"",
				checkeders:'',
				applyGood:[],
				ruleForm: {
					username: '',
					password: '',
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		created(){
			this.ruleForm.username=window.localStorage.getItem("checkedersid")
			if(this.ruleForm.username!=null){
                 this.bur()
			}
		},
		methods: {
			bur(){
				var nde=JSON.parse(window.localStorage.getItem('applyParams'))
				console.log(nde)
				for(var i=0;i<nde.length;i++){
					if(this.ruleForm.username==nde[i].username){
                        this.ruleForm.password=nde[i].password
					}else{
                       this.ruleForm.password=""
					}
				}
			},
			userMessage(formName) {
				var res = this
				this.$axios({
					url: 'testBoot/login?userName=' + res.ruleForm.username + '&passWord=' +res.ruleForm.password,
					// url: 'testBoot/login?userName=' + res.ruleForm.username + '&passWord=' +res.ruleForm.password,
					method: 'post',
					// data: {
					// 	'userName': res.ruleForm.username,
					// 	'passWord': res.ruleForm.password
					// }
				}).then(function(response) {
					if (response.status <= 200) {
						console.log(response,"47545")
						if (response.data.code == 0) {
							localStorage.setItem('ms_username',res.ruleForm.username);
							document.cookie = "jurisdiction=" +JSON.stringify(response.data.info)
							document.cookie = "userid="+ response.data.user.id
							localStorage.setItem('agentId',response.data.user.agentid)
							localStorage.setItem('parkId',response.data.user.parkid)
							localStorage.setItem('userId',response.data.user.id)
							localStorage.setItem("roleName",response.data.roleName)
							localStorage.setItem("realName",response.data.user.realName)
							localStorage.setItem("realName",response.data.user.realName)
							if(res.checked==true){
								     res.applyGood.push({
										username: res.ruleForm.username,
										password: res.ruleForm.password,
								})			
							    localStorage.setItem('applyParams', JSON.stringify(res.applyGood))
							}else  {
								//没有填写记住密码
							}

							if(res.checkeders==true){
                                localStorage.setItem('checkedersid',res.ruleForm.username)
							}else{
								//没有记住用户名
							}
							res.$router.push('/');
							localStorage.setItem("numberword",res.ruleForm.password)
						} else if (response.data.code == 1) {
							res.$message.error("用户不存在");
						} else {
						    res.$message.error("密码错误");
						}
					}
				}).catch(function(error) {
					res.$message.error('系统错误: ' + error);
					console.log(error);
				});
		  }
		}
	}
</script>

<style scoped>
    .icon-p{
		margin-left: 29%;
		cursor:pointer;
	}
	.nee{
		word-spacing: 5px;
	}
    .icon-div{
		display: flex;
		align-content: space-between;
		font-size: 12px;
		line-height: 30px;
		color:#ffffff;
	}
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url(../../assets/img/login-bg.jpg);
		background-size: 100%;
	}

	.ms-title {
		width: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		border-bottom: 1px solid #ddd;
	}

	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 350px;
		margin: -190px 0 0 -175px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}

	.ms-content {
		padding: 30px 30px;
	}

	.login-btn {
		text-align: center;
	}

	.login-btn button {
		width: 100%;
		height: 36px;
		margin-bottom: 10px;
	}

	.login-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
		word-spacing: 7px;
	}
	.nserders{
		width: 100%;
		position: absolute;
		bottom: 0;
		text-align: center;
		font-size: 14px;
	}
	.pper{
		word-spacing: 10px;
	}
</style>
