/*
 * 
 */
var charType = 'day';
var lastType = null;
var datas = [];
var type = 1;
var charLineObj = null;
var lineNum = 1;
var dataList = {
	day: null,
	week: null,
	month: null
};
var gb = {
	colors: {
		white: "#FFF",
		whiteLight: "rgba(255, 194, 47, 0.5)",
		whiteLighter: "rgba(255, 194, 47, 0.7)",
		blackLight: "rgba(85,85,85)",
		blackLighter: "rgb(27,96,165)",
		primary: "#556fb5",
		primaryLight: "#889acb"
	}
};
mui.plusReady(function() {
	renderLineChartType(charType);
	document.addEventListener('renderChartLineEvent', function(event) {
		charType = event.detail.type;
		if(charType == lastType) {
			return;
		}
		lastType = charType;
		renderLineChartType(charType);

	});
})

//mui.ready(function() {
//	renderLineChartType(charType);
//});

function renderLineChartType(typeLine) {
	charType = typeLine;
	if(dataList[charType] != null &&
		dataList[charType].labels != null &&
		dataList[charType].labels.length > 0) {

		renderLineChart(dataList[charType].series, dataList[charType].labels);
		return;
	}

	if(charType == 'day') {
		type = 1;
	} else if(charType == 'week') {
		type = 2;
	} else {
		type = 3;
	}
	renderLineChartData();
}

function renderLineChartData() {
	window.servicebus.billIndexIndex({
		type: type
	}, function(data) {
		var series = [];
		var labels = [];
		datas = JSON.parse(data.bodyData).countryList;
		if(charType == 'day') {
			for(var i = 0; i < datas.length; i++) {
				series[i] = parseFloat(parseFloat(datas[i].dayIndex * 100).toFixed(2));
				labels[i] = datas[i].indexDate.substring(6, 10);
			}
		} else if(charType == 'week') {
			for(var i = 0; i < datas.length; i++) {
				series[i] = parseFloat(parseFloat(datas[i].weekIndex * 100).toFixed(2));
				labels[i] = datas[i].indexDate.substring(6, 10);
			}
		} else if(charType == 'month') {
			for(var i = 0; i < datas.length; i++) {
				series[i] = parseFloat(parseFloat(datas[i].monthIndex * 100).toFixed(2));
				labels[i] = datas[i].indexDate.substring(6, 10);
			}
		}

		renderLineChart(series, labels);
		dataList[charType] = {
			labels: labels,
			series: series
		};
	}, function(e) {
		var series = ['0', '0', '0', '0', '0'];
		var labels = ['00-01', '00-02', '00-03', '00-04', '00-05'];
		renderLineChart(series, labels);
	});
}

/*
 * 
 */
function renderLineChart(series, labels) {

	if(charLineObj == null) {
		charLineObj = echarts.init(document.getElementById('mapsline1'));
	}
	var minY, maxY = 0;
	minY = Math.min.apply(null, series);
	maxY = Math.max.apply(null, series);
	var count = maxY - minY;
	//			count = count/10;
	//			var height =  document.getElementsByClassName('zr-element')[0].offsetHeight;
	if(minY == 0 && maxY == 0) {
		minY = -1;
		maxY = 1;
	} else {
		minY = parseFloat(minY - count).toFixed(2);
		maxY = parseFloat(count + maxY).toFixed(2);
	}

	var series1 = {
		name: '',
		type: 'line',
		smooth: true,
		symbol: 'emptyCircle',
		symbolSize: 3,
		color: "#FFC22F",
		itemStyle: {
			normal: {
				label: {
					show: true,
					position: "top",
					formatter: function(t) {
						return t.value + "%";
					},
					textStyle: {
						color: "#38ACE1",
						fontSize: 14
					}
				},
				lineStyle: { // 系列级个性化折线样式，横向渐变描边
					width: 3,
					color: (function() {

						return new zrender.tool.color.getLinearGradient(
							0, 0, document.body.clientWidth, 0, [
								[0, 'rgba(47,195,251,0.8)'],
								[0.2, 'rgba(77,160,237,0.8)'],
								[0.4, 'rgba(131,119,229,0.8)'],
								[0.6, 'rgba(190,65,213,0.8)'],
								[0.8, 'rgba(224,34,204,0.8)']
							]
						)

						//								var zrColor = require('zrender/tool/color');
						//								return zrColor.getLinearGradient
					})()
				},
				areaStyle: {
					color:
						(function() {
							return zrender.tool.color.getLinearGradient(
								0, 0, 0, document.body.clientHeight, [
									[0, 'rgba(182,44,247,0.3)'],
									[1, 'rgba(182,44,247,0)']
								]
							)

						})(),

				}
			},
			emphasis: {
				label: {
					show: true,
					textStyle: {
						color: "#fff",
						fontSize: 14,
						fontWeight: "bold"
					}
				}
			}
		},
		data: series
	};

	charLineObj.setOption({
		color: [
			"#46CDFF"
		],
		animation: false,
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
			data: labels,
			position: "top",
			boundaryGap: 1,
			axisLabel: {
				textStyle: {
					color: "#fff",
					fontSize: 14
				},
				margin: -25
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

	if(charLineObj != null) {
		window.onresize = charLineObj.resize();
	}

	charLineObj.restore();
}