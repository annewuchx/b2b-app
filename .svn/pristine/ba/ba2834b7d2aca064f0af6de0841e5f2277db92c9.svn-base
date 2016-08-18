/*
 * 
 */
define(function(require, exports, module) {

	require('../libs/echart2/echarts.line.js');

	//每天更新2次数据，12小时一次
	var interval = setInterval(function() {

		dataList = {
			day: null,
			week: null,
			month: null
		};

		renderChart(lastTab);

	}, 1000 * 60 * 60 * 12);

	var remTimes = lib.flexible.dpr;
	var chartsParam = {
		fontSize: 14 * remTimes,
		width: 3 * remTimes,
		margin: 25 * remTimes,
		symbolSize: 3 * remTimes,
		shadowBlur: 40 * remTimes,
		shadowOffsetX: 8 * remTimes,
		shadowOffsetY: 20 * remTimes
	}

	var githubChartsInited = !1;
	var lastTab = null;

	//缓存日，周，月指数数据
	var dataList = {
		day: null,
		week: null,
		month: null
	};

	var echartsObj = null;

	function echartsInit() {
		if(echartsObj == null) {
			echartsObj = echarts.init(document.getElementById('ct-chart'));
		}
	}

	/*
	 * 处理chart
	 */
	function renderChart(targetTab) {

		var type = 1;

		if(targetTab == 'day') {
			type = 1;
		} else if(targetTab == 'week') {
			type = 2;
		} else if(targetTab == 'month') {
			type = 3;
		}

		//对比上次生成类型，如果重复，则直接返回。
		if(lastTab == type) {
			return;
		} else {
			lastTab = type;
		}

		if(dataList[targetTab] != null &&
			dataList[targetTab].labels != null &&
			dataList[targetTab].labels.length > 0) {

			generateReport(dataList[targetTab]);

		} else {

			window.servicebus.billIndexIndex({
				type: type
			}, function(data) {

				var labels = [];
				var series = [];
				if(data.bodyData != null) {
					var datas = JSON.parse(data.bodyData).countryList;

					if(targetTab == 'day') {
						for(var i = 0; i < datas.length; i++) {
							series[i] = parseFloat(parseFloat(datas[i].dayIndex * 100).toFixed(2));
							labels[i] = datas[i].indexDate.substring(6, 10);
						}
					} else if(targetTab == 'week') {
						for(var i = 0; i < datas.length; i++) {
							series[i] = parseFloat(parseFloat(datas[i].weekIndex * 100).toFixed(2));
							labels[i] = datas[i].indexDate.substring(6, 10);
						}
					} else if(targetTab == 'month') {
						for(var i = 0; i < datas.length; i++) {
							series[i] = parseFloat(parseFloat(datas[i].monthIndex * 100).toFixed(2));
							labels[i] = datas[i].indexDate.substring(6, 10);
						}
					}

					dataList[targetTab] = {
						labels: labels,
						series: series
					};

					generateReport(dataList[targetTab]);
				} else {
					var defaultValue = {
						labels: ['00-01', '00-02', '00-03', '00-04', '00-05'],
						series: [0, 0, 0, 0, 0]
					};

					generateReport(defaultValue);
					mui.toast('服务器异常');
				}

			}, function() {

				var defaultValue = {
					labels: ['00-01', '00-02', '00-03', '00-04', '00-05'],
					series: [0, 0, 0, 0, 0]
				};

				generateReport(defaultValue);
			});
		}

	}

	/*
	 * 绘制chart-表
	 */
	function generateReport(data) {

		var gb = {
			colors: {
				white: "#FFF",
				whiteLight: "rgba(255, 255, 255, 0.5)",
				whiteLighter: "rgba(255, 255, 255, 0.7)",
				blackLight: "rgba(85,85,85)",
				blackLighter: "rgb(224,224,224)",
				primary: "#556fb5",
				primaryLight: "#889acb"
			},
			labels: data.labels,
			series: data.series,
		};

		initGithubCharts(gb);

		//		if (!githubChartsInited) {
		//			initGithubCharts(gb);
		//			githubChartsInited = 1;
		//		}

		//reRenderCharts();
	}

	//	function reRenderCharts(series) {
	//		echartsObj.setSeries(series, false);
	//	}

	/*
	 * 
	 */
	function initGithubCharts(gb) {

		var minY, maxY = 0;
		minY = Math.min.apply(null, gb.series);
		maxY = Math.max.apply(null, gb.series);
		var count = maxY - minY;
		if(minY == 0 && maxY == 0) {
			minY = -1;
			maxY = 1;
		} else {
			minY = minY - count;
			maxY = count + maxY;
		}

		var series1 = {
			name: '',
			type: 'line',
			smooth: true,
			symbol: 'emptyCircle',
			symbolSize: chartsParam.symbolSize,
			color: "#7ba3f6",
			itemStyle: {
				normal: {
					label: {
						show: true,
						position: "top",
						formatter: function(t) {
							return t.value + "%";
						},
						textStyle: {
							color: "#7ba3f6",
							fontSize: chartsParam.fontSize
						}
					},
					lineStyle: { // 系列级个性化折线样式，横向渐变描边
						width: chartsParam.width,
						color: (function() {

							return new zrender.tool.color.getLinearGradient(
								0, 0, document.body.clientWidth, 0, [
									[0, 'rgba(47,195,251,0.8)'],
									[0.2, 'rgba(79,166,242,0.8)'],
									[0.4, 'rgba(130,119,229,0.8)'],
									[0.6, 'rgba(187,72,215,0.8)'],
									[0.8, 'rgba(225,33,204,0.8)']
								]
							)

							//								var zrColor = require('zrender/tool/color');
							//								return zrColor.getLinearGradient
						})(),
						shadowColor: 'rgba(0,0,0,0.4)',
						shadowBlur: chartsParam.shadowBlur,
						shadowOffsetX: chartsParam.shadowOffsetX,
						shadowOffsetY: chartsParam.shadowOffsetY
					}
				},
				emphasis: {
					label: {
						show: true,
						textStyle: {
							color: "#006cff",
							fontSize: chartsParam.fontSize,
							fontWeight: "bold"
						}
					}
				}
			},
			data: gb.series
		};

		echartsObj.setOption({
			color: [
				"#6495ed",
				"#32cd32",
				"#ff7f50",
				"#87cefa",
				"#da70d6",
				"#ff69b4",
				"#ba55d3",
				"#cd5c5c",
				"#ffa500",
				"#40e0d0",
				"#1e90ff",
				"#ff6347",
				"#7b68ee",
				"#00fa9a",
				"#ffd700",
				"#6699FF",
				"#ff6666",
				"#3cb371",
				"#b8860b",
				"#30e0e0"
			],
			animation: false,
			animationDuration: 1500,
			series: [series1],
			xAxis: [{
				type: "category",
				splitLine: {
					show: !0,
					lineStyle: {
						type: "solid",
						color: gb.colors.blackLighter
					}
				},
				axisLine: {
					show: !1
				},
				axisTick: {
					show: !1
				},
				data: gb.labels,
				position: "top",
				boundaryGap: 1,
				axisLabel: {
					textStyle: {
						color: "#555555",
						fontSize: chartsParam.fontSize
					},
					margin: -(chartsParam.margin)
				}
			}],
			yAxis: [{
				type: "value",
				show: !1,
				max: maxY,
				min: minY
			}],
			grid: {
				borderWidth: 0,
				x: 0,
				y: 0,
				x2: 0,
				y2: 0
			},
			tooltip: {
				trigger: "axis",
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						,
					shadowStyle: {
						color: "rgba(123,163,246,0.1)"
					}
				},
				showContent: false
			}
		}, true);

		window.onresize = function() {
			console.log('onresize echartsObj');

			if(echartsObj != null)
				echartsObj.resize();
		};

		echartsObj.restore();
	}

	/**
	 * 
	 * @param {Object} type
	 */
	exports.init = function(type) {

		echartsInit();

		renderChart(type);

		mui('.mui-segmented-control').on('tap', 'a.mui-control-item', function() {
			var targetTab = this.getAttribute('href');
			renderChart(targetTab);
		});

	};
});