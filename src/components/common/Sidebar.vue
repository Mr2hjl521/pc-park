<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subss">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subss">
                            <el-submenu v-if="subItem.subss" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subss" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item style="padding-left:60px" v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
import { access } from 'fs';
import { log } from 'util';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    // {
                    //     icon: 'el-icon-lx-home',
                    //     index: 'dashboard',
                    //     title: '总览',
                    // },
                     // {
                    //     icon: 'el-icon-lx-home',
                    //     index: 'area',
                    //     title: '区域管理',
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'outInControl',
                    //     title: '出入管理'
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'carManager',
                    //     title: '车辆管理'
                    // },
                    // {  
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'financialManagement',
                    //     title: '财务管理'
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'serviceManagement',
                    //     title: '服务管理'
                    // },
                    //  {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: '2',
                    //     title: '记录管理',
                    //     subs: [
                    //         {
                    //             index: 'goin',
                    //             title: '出场记录'
                    //         },
                    //         {
                    //             index: 'goout',
                    //             title: '入场记录'
                    //         }
                    //     ]
                    // },
                    //  {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: '3',
                    //     title: '黑/白名单',
                    //     subs: [
                    //         {
                    //             index: 'blacklist',
                    //             title: '黑名单'
                    //         },
                    //         {
                    //             index: 'import',
                    //             title: '关注名单'
                    //         },
                    //          {
                    //             index: 'whitelist',
                    //             title: '白名单'
                    //         },
                    //         {
                    //             index: 'attentionlist',
                    //             title: '关注记录'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'yardManager',
                    //     title: '车场管理'
                    // },
                    //  {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'userMessage',
                    //     title: '用户管理'
                    // },
                    //  {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'jurMessage',
                    //     title: '权限管理'
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'agentManagement',
                    //     title: '代理商管理'
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'companyManagement',
                    //     title: '公司管理'
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'departmentManagement',
                    //     title: '部门管理'
                    // },
                    // {
                    //     icon: 'el-icon-lx-calendar',
                    //     index: '4',
                    //     title: '设置',
                    //     subs: [
                    //         {
                    //             index: 'parkingSetting',
                    //             title: '车场设置'
                    //         },
                    //         {
                    //             index: 'camerasSetting',
                    //             title: '摄像机设置'
                    //         },
                    //         {
                    //             index: 'parkingMode',
                    //             title: '模式',
                    //         },
                    //         {
                    //             index: 'parkingCharge',
                    //             title: '收费设置'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'table8',
                    //     title: '日志'
                    // },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     title: '退出'
                    // }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // this.cs()
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            this.addList()
        },
        methods:{
             getCookie(name){
		      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		      if(arr=document.cookie.match(reg)){
			       return unescape(arr[2]);
		        }
		      else{
			       return null;
		        }
            },
            addList(){
                var temporary=[]
                this.temporary=(JSON.parse(this.getCookie("jurisdiction")))
                console.log( this.temporary,"1231356")
                for(var i=0;i<this.temporary.length;i++){
                          var a=this.temporary[i]
                          this.items.push(a[0])
                }
               
            }
            // cs(){
            //     var a = this.getCookie("jurisdiction").split(',')   //   1 3 5 
            //     //比较轮数
            //     function bSort(arr) {
            //            var len=arr.length;
            //                 var temp;
            //                 for(var i=0;i<len-1;i++){
            //                     for(var j=i+1;j<len;j++){
            //                         if(parseInt(arr[j])<parseInt(arr[i])){
            //                             temp=parseInt(arr[j]);
            //                             arr[j]=parseInt(arr[i]);
            //                             arr[i]=temp;
            //                         }
            //                     }             
            //                 }
            //        return arr;
            //        }
            //         var b=a.reverse()  //5 3 1
            //         for(var i=0;i<b.length;i++){
            //             this.items.splice(b[i],1)
            //         }
            //     }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
