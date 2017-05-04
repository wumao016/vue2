window.onload = function() {
	new Vue({
		el: '#box',
		data: {
			myData: [],
			tit: '',
			now: -1,
			isTrue: false,
            message: '这里将展示您的输入提示...'
		},
		methods: {
			get: function(ev) {
				if(ev.keyCode == 38 || ev.keyCode == 40) {
					return
				}
				if(ev.keyCode == 13) {
					window.open('https://www.baidu.com/s?wd=' + this.tit);
					this.tit = "";
				}
				this.$http.jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su', {
					wd: this.tit
				}, {
					jsonp: 'cb'
				}).then(function(res) {
					this.myData = res.data.s;
				}, function(res) {

				})
			},
			changeDown: function() {
				this.now++;
				if(this.now == this.myData.length) {
					this.now = 0
				}
				this.tit = this.myData[this.now];
			},
			changeUp: function() {
				this.now--;
				if(this.now == -1) this.now = this.myData.length - 1;
				this.tit = this.myData[this.now];
			},
			search: function() {
				if(this.tit== "" || this.tit.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
					this.message = "你输入的内容为空哦！";
					this.isTrue = true;
					return;
				}
				window.open('https://www.baidu.com/s?wd=' + this.t1);
				this.tit = ""
			},
			open: function(index) {
				window.open('https://www.baidu.com/s?wd=' + this.myData[index]);
				this.tit = ""
			}
		}
	})
}