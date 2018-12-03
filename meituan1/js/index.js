Vue.filter('priceFilter', function (price) {
	return price + '元';
})
Vue.filter('originPriceFilter', function (price) {
	return '门市价:' + price + '元';
})
Vue.filter('salesFilter', function (sales) {
	return '已售' + sales;
})
var Home = {
	template:'#tpl_home',
	data: function () {
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
	created: function () {
		// 发送请求，获取数据，更新绑定的数据
		this.$http.get('data/home.json').then(function (res) {
			this.ad = res.data.data.ad;
			this.items = res.data.data.list;
		})
	}
}
var List = {
	// 注册属性数据
	props: ['search','query'],
	template:'#tpl_list',
	data: function () {
		return {
			type: [
				{value: '价格排序', key: 'price'},
				{value: '销量排序', key: 'sales'},
				{value: '好评排序', key: 'evaluate'},
				{value: '优惠排序', key: 'discount'}
			],
			list: [],
			other: []
		}
	},
	methods: {
		// 查看更多
		showAll: function () {
			this.list = this.list.concat(this.other)
			this.other = [];
		},
		sort: function (key) {
			this.list.sort(function (a, b) {
				if (key === 'discount') {
					return (a.orignPrice - a.price) - (b.orignPrice - b.price)
				}
				return b[key] - a[key]
			})
		}
	},
	computed:{
		dealList:function(){
			var search=this.search;
			var result=[];
			for(var i=0;i<this.list.length;i++){
				if(this.list[i].title.indexOf(search)>=0){
					result.push(this.list[i])
				}
			}
			return result
		}
	},
	created: function () {
		// 发送请求
		this.$http.get('data/list.json?id='+this.$route.params.typeId).then(function (res) {
			this.list = res.data.data.slice(0, 3);
			this.other = res.data.data.slice(3);
		})
	}
}
var Product ={
	template:'#tpl_product',
	data: function () {
		return {
			data: {
				src: '01.jpg'
			}
		}
	},
	created: function () {
		this.$http.get('data/product.json?id=' + this.$route.params.productId).then(function (res) {
			this.data = res.data.data;
		})
	}
}
var router= new VueRouter({
	routes: [
	{
		path:'/home',
		name:'home',
		component:Home
	},
	{
		path:'/list/type/:typeId',
		name:'list',
		component:List
	},
	{
		path:'/product/:productId',
		name:'product',
		component:Product
	},
	{
		path:'*',
		name:'home',
		redirect:'/home'
	}
]
})
var app = new Vue({
	el: '#app',
	router:router,
	data: {
		view: 'home',
		query: [],
		search: '',
		searchQuery: '',
	},
	methods: {
		showResult: function () {
			this.searchQuery = this.search;
			this.search = '';
		},
		goBack: function () {
			history.go(-1)
		}
	}
})
