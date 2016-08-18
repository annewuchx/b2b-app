define(function(require, exports, module) {

	require('mui');

	var $ = mui;

	//
	//
	$.init();

	/*
	 * 
	 */
	$.ready(function() {
		//
		//
		//		var settings = app.getSettings();
		//		//
		//		window.addEventListener('show', function() {
		//			var state = app.getState();
		//		}, false);
		//
		loadBanner();
		//
		renderChart();

		//	
		$('.mui-segmented-control').on('tap', 'a.mui-control-item', function() {
			//去除多个iframe产生页面冲突
			document.getElementById('ct-chart').innerHTML = '<canvas id="ct-charts" style="margin-top: 10px;"></canvas>';
			renderChart();
		});
	});

	//
	//
	$.plusReady(function() {
		//--
		$.oldBack = mui.back;
		var backButtonPress = 0;
		$.back = function(event) {
			backButtonPress++;
			if (backButtonPress > 1) {
				backButtonPress = 0;
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 2000);
			return false;
		};
	});

	/*
	 * 加载轮播图
	 */
	function loadBanner() {
		mui.ajax('../services/mainindexbanner.json', {
			data: {},
			dataType: 'json',
			type: 'get',
			timeout: 20000, //超时时间设置为20秒；
			success: function(result) {
					//服务器返回响应
					if (result != null) {
						renderBanner(result.data);
					}
				}
				//			,
				//			error: function(xhr, type, errorThrown) {
				//				//异常处理；
				//				console.log(type);
				//			}
		});
	}

	/*
	 * 
	 */
	function renderBanner(list) {

		var template = '<div class="mui-slider-item"><a href="javascript:;"><img data-lazyload="{0}" src="../images/60x60.gif"></a></div>';

		var template2 = '<div class="mui-indicator"></div>';

		var arrList = [],
			arrList2 = [];

		for (var i = 0, l = list.length; i < l; i++) {
			arrList.push(template.replace('{0}', list[i]['url']));
			arrList2.push(template2);
		}

		document.querySelector('.mui-slider-group').innerHTML = arrList.join('');
		document.querySelector('.mui-slider-indicator').innerHTML = arrList2.join('');

		mui('.mui-slider').slider();

		// 加载多个模块，在加载完成时，执行回调
		require.async('mui.lazyload', function() {
			require.async(['mui.lazyload.img'], function() {
				$('.mui-slider').imageLazyload({
					placeholder: '../images/60x60.gif'
				});
			});
		});

	}

	/*
	 * 处理chart
	 */
	function renderChart() {

		var series = [0.1, 0.1, 0.9, 0.3, 0.5, 1.0];
		for (var i = 0; i < 7; i++) {
			var number = Math.random();
			number = Math.ceil(number * 100);
			series[i] = number;
		}
		//
		require.async('highcharts', function() {
			generateReport({
				labels: ['4-18', '4-19', '4-20', '4-21', '4-22', '4-23', '4-24'],
				series: series
			});
		});
	}

	/*
	 * 绘制chart-表
	 */
	function generateReport(data) {

		new Highcharts.Chart({
			credits: {
				enabled: false
			},
			chart: {
				renderTo: 'ct-chart',
				type: 'line'
			},
			title: {
				style: {
					display: 'none'
				}
			},
			xAxis: {
				categories: data.labels
			},
			yAxis: {
				title: {
					style: {
						display: 'none'
					}
				},
				labels: {
					formatter: function() {
						return this.value + '%';
					}
				}
			},
			tooltip: {
				backgroundColor: '#FE8723',
				borderRadius: 10,
				style: {
					color: '#fff',
					fontSize: '12px',
					padding: '8px',
				},
				formatter: function() {
					return this.y + '%</b>';
				}
			},
			plotOptions: {
				spline: {
					marker: {
						radius: 4,
						lineWidth: 1
					}
				}
			},
			legend: {
				enabled: false
			},
			series: [{
				name: 'Tokyo',
				marker: {
					symbol: 'circle'
				},
				data: data.series,
				color: '#FE8723',
				market: {
					radius: 5
				}
			}]
		});
	}

});