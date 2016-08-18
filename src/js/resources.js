! function($, win) {

	win.resources = {};

	//var remoteUrl = "http://10.100.201.39:8020/yck.b2b.h5app.v1/htmls/";
	var remoteUrl = "";

	/**
	 * localStorage Keys 
	 */
	resources.keys = {
		/**
		 * 登录状态
		 */
		state: "$state",
		/**
		 * app 设置状态 
		 */
		settings: "$settings",

		/**
		 * 首页图片key
		 */
		mainIndexPath: "$mainIndexPath"
	};

	resources.langs = {
		loading: ""
	};

	/**
	 * urls
	 */
	resources.urls = {
		/*
		 * 
		 */
		//		footer: {
		//			id: "footer.html",
		//			url: "footer.html"
		//		},
		//		footerNav: {
		//			id: "footerNav.html",
		//			url: remoteUrl + "footerNav.html"
		//		},
		unlock: {
			id: "unlock.html",
			url: remoteUrl + "unlock.html"
		},
		reg: {
			id: "reg.html",
			url: remoteUrl + 'reg.html'
		},
		forget_password: {
			id: "forget_password.html",
			url: remoteUrl + 'forget_password.html'
		},
		login: {
			id: "login.html",
			url: remoteUrl + 'login.html'
		},
		/*
		 * index page
		 */
		main: {
			id: "main.html",
			url: "main.html"
		},
		mainindex: {
			id: "mainindex.html",
			url: remoteUrl + "mainindex.html"
		},
		financeindex: {
			id: "financeindex.html",
			url: "financeindex.html"
		},
		/*
		 * @description 用户首页
		 */
		userindex: {
			id: "userindex.html",
			url: remoteUrl + "userindex.html"
		},
		/*
		 * @description 票据融资
		 */
		financingindex: {
			id: "financingindex.html",
			url: remoteUrl + "financingindex.html"
		},

		/*
		 * 联系我们
		 */
		contactus: {
			id: "contactus.html",
			url: "contactus.html"
		},
		/*
		 * 企业理财子页面
		 */
		financeindexsub: {
			id: "financeindex-sub.html",
			url: remoteUrl + "financeindex-sub.html"
		}

	};

}(mui, window);