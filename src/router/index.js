import Vue from 'vue';
import Router from 'vue-router';
// 1. 定义 (路由) 组件,可以从其他文件 import 进来
import Goods from '@/components/goods/goods';
import Ratings from '@/components/ratings/ratings';
import Seller from '@/components/seller/seller';

// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(Router);

// 2. 定义路由，每个路由应该映射一个组件。 其中"component" 可以是通过 Vue.extend() 创建的组件构造器，或者，只是一个组件配置对象。
const routes = [
  { path: '/', redirect: '/goods' },
  { path: '/goods', component: Goods },
  { path: '/ratings', component: Ratings },
  { path: '/seller', component: Seller }
];

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new Router({
  linkActiveClass: 'active',
  routes
});

export default router;
