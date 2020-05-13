import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/Login'
        },
        {
            path: '/Home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [{
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    //车场管理组件
                    path: '/yardManager',
                    component: resolve => require(['../components/page/yardManager.vue'], resolve),
                    meta: { title: '车场管理', flag: true }
                },
                {
                    //财务管理组件financialManagement
                    path: '/financialManagement',
                    component: resolve => require(['../components/page/financialManagement.vue'], resolve),
                    meta: { title: '财务管理' }
                },
                {
                    //进厂组件
                    path: '/goin',
                    component: resolve => require(['../components/page/goin.vue'], resolve),
                    meta: { title: '在场记录' }
                },
                {
                    //商户组件
                    path: '/businessManagement',
                    component: resolve => require(['../components/page/businessManagement.vue'], resolve),
                    meta: { title: '商户管理' }
                },
                {
                    //优惠券组件
                    path: '/couponManagement',
                    component: resolve => require(['../components/page/couponManagement.vue'], resolve),
                    meta: { title: '优惠券管理' }
                },
                {
                    //出厂组件
                    path: '/goout',
                    component: resolve => require(['../components/page/goout.vue'], resolve),
                    meta: { title: '出场记录' }
                },
                {
                    //历史组件
                    path: '/lincensePlateHistory',
                    component: resolve => require(['../components/page/lincensePlateHistory.vue'], resolve),
                    meta: { title: '历史记录' }
                },
                {
                    //异常组件
                    path: '/lincensePlateException',
                    component: resolve => require(['../components/page/lincensePlateException.vue'], resolve),
                    meta: { title: '异常记录' }
                },
                {
                    //用户组件
                    path: '/userMessage',
                    component: resolve => require(['../components/page/userMessage.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    //权限组件
                    path: '/jurMessage',
                    component: resolve => require(['../components/page/jurMessage.vue'], resolve),
                    meta: { title: '权限管理' }
                },
                {
                    //区域管理组件
                    path: '/area',
                    component: resolve => require(['../components/page/area.vue'], resolve),
                    meta: { title: '区域管理' }
                },
                {
                    //服务组件
                    path: '/serviceManagement',
                    component: resolve => require(['../components/page/serviceManagement.vue'], resolve),
                    meta: { title: '服务管理' }
                },
                {
                    //代理商管理
                    path: '/agentManagement',
                    component: resolve => require(['../components/page/agentManagement.vue'], resolve),
                    meta: { title: '代理商管理' }
                },
                {
                    //代理商管理
                    path: '/companyManagement',
                    component: resolve => require(['../components/page/companyManagement.vue'], resolve),
                    meta: { title: '公司管理' }
                },
                {
                    //部门管理
                    path: '/departmentManagement',
                    component: resolve => require(['../components/page/departmentManagement.vue'], resolve),
                    meta: { title: '部门管理' }
                },
                {
                    //关注名单
                    path: '/import',
                    component: resolve => require(['../components/page/import.vue'], resolve),
                    meta: { title: '关注名单' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/carManager',
                    component: resolve => require(['../components/page/carManager.vue'], resolve),
                    meta: { title: '车主档案' }
                },
                {
                    path: '/outInControl',
                    component: resolve => require(['../components/page/outInControl.vue'], resolve),
                    meta: { title: '出入管理' }
                },
                {
                    path: '/inOutRecord',
                    component: resolve => require(['../components/page/inOutRecord.vue'], resolve),
                    meta: { title: '进出记录' }
                },
                {
                    path: '/whiteListManager',
                    component: resolve => require(['../components/page/whiteListManager.vue'], resolve),
                    meta: { title: '黑/白名单' }
                },
                {
                    path: '/blacklist',
                    component: resolve => require(['../components/page/blacklist.vue'], resolve),
                    meta: { title: '黑名单' }
                },
                {
                    path: '/whitelist',
                    component: resolve => require(['../components/page/whitelist.vue'], resolve),
                    meta: { title: '白名单' }
                },
                {
                    path: '/attentionlist',
                    component: resolve => require(['../components/page/attentionlist.vue'], resolve),
                    meta: { title: '关注记录' }
                },
                {
                    path: '/camerasSetting',
                    component: resolve => require(['../components/page/camerasSetting.vue'], resolve),
                    meta: { title: '摄像机设置' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/parkingSetting',
                    component: resolve => require(['../components/page/parkingSetting.vue'], resolve),
                    meta: { title: '车场设置' }
                },
                {
                    path: '/parkingCharge',
                    component: resolve => require(['../components/page/parkingCharge.vue'], resolve),
                    meta: { title: '收费设置' }
                },
                {
                    path: '/lincensePlateGroup',
                    component: resolve => require(['../components/page/lincensePlateGroup.vue'], resolve),
                    meta: { title: '车牌组' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: resolve => require(['../components/page/I18n.vue'], resolve),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '首页' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: resolve => require(['../components/page/Donate.vue'], resolve),
                    meta: { title: '支持作者' }
                },
                {
                    path: '/presenceTrack',
                    component: resolve => require(['../components/page/presenceTrack.vue'], resolve),
                    meta: { title: '在场轨迹表' }
                },
                {
                    path: '/historicalTrack',
                    component: resolve => require(['../components/page/historicalTrack.vue'], resolve),
                    meta: { title: '历史轨迹表' }
                },
                {
                    path: '/equipmentManagement',
                    component: resolve => require(['../components/page/equipmentManagement.vue'], resolve),
                    meta: { title: '设备管理' }
                },
                {
                    path: '/memberOrder',
                    component: resolve => require(['../components/page/memberOrder.vue'], resolve),
                    meta: { title: '车主订单管理' }
                },
                {
                    path: '/table9',
                    component: resolve => require(['../components/page/table9.vue'], resolve),
                    meta: { title: '退出' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})