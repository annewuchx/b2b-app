(function(w) {

	//	$.plusReady(function() {
	//		//是否为沉浸式状态栏模式。
	//		var bi = plus.navigator.isImmersedStatusbar();
	//		if(bi) {
	//			// 获取系统状态栏高度
	//			var lh = plus.navigator.getStatusbarHeight();
	//			console.error("Statusbar Height: " + lh * plus.screen.scale);
	//		}
	//	});

	//	document.addEventListener('plusready', function() {
	//		console.log("Immersed-UserAgent: " + navigator.userAgent);
	//	}, false);

	//通过userAgent判断 - 沉浸式状态栏模式

	var immersed = 0;
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	if(ms && ms.length >= 3) {
		immersed = parseFloat(ms[2]);
	}
	w.immersed = immersed;

	if(!immersed) {
		return;
	}
	var t = document.getElementById('header');
	t && (t.style.paddingTop = immersed + 'px', t.style.background = '-webkit-linear-gradient(top,rgba(215,75,40,1),rgba(215,75,40,0.8))', t.style.color = '#FFF');
	t = document.getElementById('content');
	t && (t.style.marginTop = immersed + 'px');
	t = document.getElementById('dcontent');
	t && (t.style.marginTop = immersed + 'px');
	t = document.getElementById('map');
	t && (t.style.marginTop = immersed + 'px');

})(window);