// 定义工具对象
var Util = {
	/**
	 * 根据id获取模板
	 * @id 		模板标签元素的id
	 **/
	tpl: function (id) {
		// 获取元素，获取内容，返回
		return document.getElementById(id).innerHTML;
	},
	/**
	 * 定义拉去数据的异步请求方法
	 * @url 	请求的路径
	 * @fn 		请求成功时候的回调函数
	 ***/
	ajax: function (url, fn) {
		// 异步请求拉去数据
		// 创建xhr对象
		var xhr = new XMLHttpRequest();
		// 监听状态的改变
		xhr.onreadystatechange = function () {
			// 监听readyState改变
			if (xhr.readyState === 4) {
				// 监听状态吗
				if (xhr.status === 200) {
					// 查看结果
					// 转化json对象
					var res = JSON.parse(xhr.responseText);
					// 判断回调函数存在，并执行
					fn && fn(res)
				}
			}
		}
		// 发送请求
		// 打开请求
		xhr.open('GET', url, true);
		// 发送数据
		xhr.send(null)
	}
}
// 定义过滤器
// 价格过滤器
Vue.filter('priceFilter', function (price) {
	return price + '元';
})
// 原价过滤器
Vue.filter('originPriceFilter', function (price) {
	return '门市价:' + price + '元';
})
// 销量过滤器
Vue.filter('salesFilter', function (sales) {
	return '已售' + sales;
})

// 定义首页组件，列表页组件，详情页组件
// 首页组件
var Home = Vue.extend({
	template: Util.tpl('tpl_home'),
	// 数据通过data属性来设置
	data: function () {
		// 通过返回值，将数据绑定
		return {
			list: [
				{id: 1, title: '美食', url: '01.png'},
				{id: 2, title: '电影', url: '02.png'},
				{id: 3, title: '酒店', url: '03.png'},
				{id: 4, title: '休闲娱乐', url: '04.png'},
				{id: 5, title: '外卖', url: '05.png'},
				{id: 6, title: 'KTV', url: '06.png'},
				{id: 7, title: '周边游', url: '07.png'},
				{id: 8, title: '丽人', url: '08.png'},
				{id: 9, title: '小吃快餐', url: '09.png'},
				{id: 10, title: '火车票', url: '10.png'}
			],
			ad: [],
			items: []
		}
	},
	// 定义声明周期
	created: function () {
		// 缓存this
		var me = this;
		// 通知父组件显示搜索框
		me.$dispatch('dealSearch', true)
		// 发送请求，获取数据，更新绑定的数据
		Util.ajax('data/home.json', function (res) {
			// 给组件实例化对象保存数据
			if (res && res.errno === 0) {
				me.ad = res.data.ad;
				me.items = res.data.list;
			}
		})
	}
})
// 列表页组件
var List = Vue.extend({
	// 注册属性数据
	props: ['search'],
	template: Util.tpl('tpl_list'),
	// 定义数据
	data: function () {
		return {
			type: [
				{value: '价格排序', key: 'price'},
				{value: '销量排序', key: 'sales'},
				{value: '好评排序', key: 'evaluate'},
				{value: '优惠排序', key: 'discount'}
			],
			list: [],
			// 缓存的数据
			other: []
		}
	},
	// methods属性中定义回调函数
	methods: {
		// 查看更多
		showAll: function () {
			// 将缓存的other数据，添加到list图中，将other清空
			this.list = this.list.concat(this.other)
			this.other = [];

		},
		// 定义排序方法
		sort: function (key) {
			// 排序就是对list中的数据排序
			this.list.sort(function (a, b) {
				// 看是否比较优惠字段
				if (key === 'discount') {
					// 优惠应该是原价减去现价
					return (a.orignPrice - a.price) - (b.orignPrice - b.price)
				}
				return b[key] - a[key]
			})
		}
	},
	// 创建完整之后发送请求获取数据，渲染页面
	created: function () {
		// 通知父组件显示搜索框
		this.$dispatch('dealSearch', true)
		var me = this;
		// 获取query数据
		var query = this.$parent.query 
		// 在地址的query中拼凑出传递给后端的数据
		var url = 'data/list.json';
		// 有query，要将query拼接出来
		if (query[0] !== undefined && query[1] !== undefined) {
			url += '?' + query[0] + '=' + query[1]
		}
		// 发送请求
		Util.ajax(url, function (res) {
			if (res && res.errno === 0) {
				// 将数据存储在组件实例化对象中
				// console.log(res.data)
				// 前三个保存在list中，后七个缓存起来吧
				me.list = res.data.slice(0, 3);
				me.other = res.data.slice(3);
			}
		})
	}
})
// 详情页组件
var Product = Vue.extend({
	// 定义模板
	template: Util.tpl('tpl_product'),
	data: function () {
		// 返回数据是绑定的数据
		return {
			data: {
				src: '01.jpg'
			}
		}
	},
	created: function () {
		var me = this;
		// 向父组件发送消息
		me.$dispatch('dealSearch', false)
		// 拉去数据
		var query = this.$parent.query;
		Util.ajax('data/product.json?id=' + query[0], function (res) {
			if (res && res.errno === 0) {
				// 存储数据
				me.data = res.data;
			}
		})
	}
}) 

// 注册组件
Vue.component('home', Home);
Vue.component('list', List);
Vue.component('product', Product);

// 实例化vue实例化对象
var app = new Vue({
	el: '#app',
	data: {
		// 定义视图变量
		view: '',
		// 定义路由参数变量
		query: [],
		// 搜索词
		search: '',
		// 传递给子组件搜索字段
		searchQuery: '',
		// 是否显示搜索框
		isShowSearch: true
	},
	// 定义方法
	methods: {
		// 搜索框中按下enter键
		showResult: function () {
			// 更新searchQuery
			this.searchQuery = this.search;
			// 清空search
			this.search = '';
		},
		// 点击返回按钮
		goBack: function () {
			history.go(-1)
		}
	},
	// 注册消息
	events: {
		dealSearch: function (msg) {
			// 作用域是vue实例化对象
			this.isShowSearch = msg;
			// console.log(msg)
		}
	}
})


// 定义路由
function route () {
	// #/home 		=> home
	// #list/type/1 => list
	// #product/10 	=> product
	// #/abc 		=>home
	// 定义路由就是解析hash，分析他们
	// 获取hash
	var hash = location.hash;
	// 处理hash, 删除 #或者#/
	hash = hash.replace(/^#(\/)?/g, '');
	// 切割hash list/type/1  => ['list', 'type', '1']
	hash = hash.split('/');
	// 要知道哪些hash[0]可以直接使用，哪些hash[0]要设置默认值
	// 定义可以直接使用的
	var map = {
		home: true,
		list: true,
		product: true
	};
	// 将解析的结果赋值app的vue实例化对象的view属性
	// 在map对象中的hash[0]是可以直接使用的
	if (map[hash[0]]) {
		app.view = hash[0];
	} else {
		// 默认路由
		app.view = 'home';
	}
	// 保存路由参数 ['type', '1']
	app.query = hash.slice(1);
}

// 订阅事件,获取新的路由，切换组件
window.addEventListener('hashchange', route)
// 页面加载完成之后第一次执行路由方法
window.addEventListener('load', route)
// route()