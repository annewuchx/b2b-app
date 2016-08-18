/*
 * 
 */

var mapProvince = {
	"西沙": "cn-3664",
	"广东": "cn-gd",
	"上海": "cn-sh",
	"浙江": "cn-zj",
	"海南": "cn-ha",
	"西藏": "cn-xz",
	"云南": "cn-yn",
	"安徽": "cn-ah",
	"湖北": "cn-hu",
	"陕西": "cn-sa",
	"重庆": "cn-cq",
	"贵州": "cn-gz",
	"湖南": "cn-hn",
	"四川": "cn-sc",
	"山西": "cn-sx",
	"河南": "cn-he",
	"江西": "cn-jx",
	"内蒙": "cn-nm",
	"广西": "cn-gx",
	"黑龙": "cn-hl",
	"福建": "cn-fj",
	"北京": "cn-bj",
	"河北": "cn-hb",
	"辽宁": "cn-ln",
	"山东": "cn-sd",
	"天津": "cn-tj",
	"江苏": "cn-js",
	"青海": "cn-qh",
	"甘肃": "cn-gs",
	"新疆": "cn-xj",
	"吉林": "cn-jl",
	"宁夏": "cn-nx"
}
var chartMapObj = null;
var charType = 'day';
var lastType = null;
var datas = [];
var mapNum = 1;
mui.ready(function() {
	mui.showLoading();
	/*
	 * renderMap chart
	 */
	ajaxMapData(null);
});
mui.plusReady(function() {

	document.addEventListener('renderChartEvent', function(event) {
		charType = event.detail.type;
		if(charType == lastType) {
			return;
		}
		lastType = charType;
		ajaxMapData(charType);
	});
});

function ajaxMapData(charTypes) {

	if(charTypes == null) {

		window.servicebus.billIndexIndex({}, function(data) {
			if(data.returnCode == 100000) {
				datas = JSON.parse(data.bodyData).indexList;
			}

			renderMapChart(datas);
		}, function(e) {
			renderMapChart(datas);
		});

	} else {

		charType = charTypes;

		renderMapChart(datas);

	}
}
/*
 * 
 */
function renderMapChart(datas) {
	var data = [{
		"hc-key": "cn-3664",
		"value": 0.00
	}, {
		"hc-key": "cn-gd",
		"value": 0.00
	}, {
		"hc-key": "cn-sh",
		"value": 0.00
	}, {
		"hc-key": "cn-zj",
		"value": 0.00
	}, {
		"hc-key": "cn-ha",
		"value": 0.00
	}, {
		"hc-key": "cn-xz",
		"value": 0.00
	}, {
		"hc-key": "cn-yn",
		"value": 0.00
	}, {
		"hc-key": "cn-ah",
		"value": 0.00
	}, {
		"hc-key": "cn-hu",
		"value": 0.00
	}, {
		"hc-key": "cn-sa",
		"value": 0.00
	}, {
		"hc-key": "cn-cq",
		"value": 0.00
	}, {
		"hc-key": "cn-gz",
		"value": 0.00
	}, {
		"hc-key": "cn-hn",
		"value": 0.00
	}, {
		"hc-key": "cn-sc",
		"value": 0.00
	}, {
		"hc-key": "cn-sx",
		"value": 0.00
	}, {
		"hc-key": "cn-he",
		"value": 0.00
	}, {
		"hc-key": "cn-jx",
		"value": 0.00
	}, {
		"hc-key": "cn-nm",
		"value": 0.00
	}, {
		"hc-key": "cn-gx",
		"value": 0.00
	}, {
		"hc-key": "cn-hl",
		"value": 0.00
	}, {
		"hc-key": "cn-fj",
		"value": 0.00
	}, {
		"hc-key": "cn-bj",
		"value": 0.00
	}, {
		"hc-key": "cn-hb",
		"value": 0.00
	}, {
		"hc-key": "cn-ln",
		"value": 0.00
	}, {
		"hc-key": "cn-sd",
		"value": 0.00
	}, {
		"hc-key": "cn-tj",
		"value": 0.00
	}, {
		"hc-key": "cn-js",
		"value": 0.00
	}, {
		"hc-key": "cn-qh",
		"value": 0.00
	}, {
		"hc-key": "cn-gs",
		"value": 0.00
	}, {
		"hc-key": "cn-xj",
		"value": 0.00
	}, {
		"hc-key": "cn-jl",
		"value": 0.00
	}, {
		"hc-key": "cn-nx",
		"value": 0.00
	}, {
		"hc-key": "cn-xz",
		"value": 0.00
	}];
	/*
	 * 
	 */
	//		$.getJSON('../services/pjzs-maps.json', {}, function(result) {
	//			renderCharts(result);
	//		});
	var datamaps = [];

	if(charType == 'day') {

		var maphn = {
			"hc-key": "cn-ha",
			"value": 0
		};

		for(i = 0; i < datas.length; i++) {

			var maps = {};

			var areaName = datas[i].provinceName.substring(0, 2);

			var keys = mapProvince[areaName];

			maps["hc-key"] = keys;
			maps["value"] = parseFloat(datas[i].dayIndex * 100).toFixed(2);

			if(keys == "cn-ha") {
				maphn = maps;
			}

			datamaps[i] = maps;
		}

//		var dataChart = yckExtent(data, datamaps);
		var dataChart =  datamaps;
//		dataChart[dataChart.length] = maphn;

		renderCharts(dataChart);

	} else if(charType == 'week') {

		var maphn = {
			"hc-key": "cn-ha",
			"value": 0
		};

		for(i = 0; i < datas.length; i++) {
			var maps = {};
			var areaName = datas[i].provinceName.substring(0, 2);
			var keys = mapProvince[areaName];

			maps["hc-key"] = keys;
			maps["value"] = parseFloat(datas[i].weekIndex * 100).toFixed(2);

			if(keys == "cn-ha") {
				maphn = maps;
			}

			datamaps[i] = maps;
		}

//		var dataChart = yckExtent(data, datamaps);
		var dataChart =  datamaps;

//		dataChart[dataChart.length] = maphn;

		renderCharts(dataChart);

	} else {

		var maphn = {
			"hc-key": "cn-ha",
			"value": 0
		};

		for(i = 0; i < datas.length; i++) {

			var maps = {};
			var areaName = datas[i].provinceName.substring(0, 2);
			var keys = mapProvince[areaName];

			maps["hc-key"] = keys;
			maps["value"] = parseFloat(datas[i].monthIndex * 100).toFixed(2);

			if(keys == "cn-ha") {
				maphn = maps;
			}

			datamaps[i] = maps;
		}

//		var dataChart = yckExtent(data, datamaps);
		var dataChart =  datamaps;

//		dataChart[dataChart.length] = maphn;

		renderCharts(dataChart);
	}
}

/**
 * 数据合并
 */
function yckExtent(data1, data2) {
	for(var i = 0; i < data1.length; i++) {
		var datakey1 = data1[i];
		for(var j = 0; j < data2.length; j++) {
			var datakey2 = data2[j];
			if(datakey1["hc-key"] == datakey2["hc-key"]) {
				datakey1["value"] = datakey2["value"];
				data1[i] = datakey1;
				break;
			}
		}
	}
	return data1;
}
/**
 * 
 * @param {Object} data
 */
function renderCharts(data) {
	//
	// Initiate the chart
	Highcharts.setOptions({
		colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
	});
	//
	var mapOptionDefault = {
			credits: {
				enabled: false
			},
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			mapNavigation: {
				enabled: true,
				buttonOptions: {
					verticalAlign: 'bottom'
				}
			},
			tooltip: {
				backgroundColor: "rgba(255,255,255,1)",
				pointFormatter:function() {
				 if((this.value+"").length==1){
				 		return this.name+":"+ this.value+".00%";
				 	}else{
				 		return this.name+":"+this.value+"%";
				 	}
				 }
			},
		legend: {
			//						align: 'right',
			//						//margin: 5,
			//						padding: 4,
			//						title: '景气值',
			//						itemDistance: 8,
			//						shadow: true,
			title: {
				text: '' //景气值
			},
			rtl: true,
			layout: 'vertical',
			align: 'right',
			floating: true,
			valueDecimals: 0,
			//valueSuffix: '%',
			backgroundColor: 'rgba(255, 255, 255, 0)',
			itemHeight: 100,
			symbolRadius: 0,
			symbolHeight: 10,
			padding: 0,
			symbolPadding: 10,
			symbolWidth: 18,
			labelFormatter: function() {
				if(this.from == 0) {
					return '低于' + (this.to + 0.001).toFixed(1) + '%';
				} else if(this.to == 100) {
					return '高于' + this.from.toFixed(1) + '%';
				} else {
					return this.from.toFixed(1) + '%-' + (this.to).toFixed(1) + '%';
				}
			},

			itemStyle: {
				//fontWeight: 'bold',
				//fontStyle: 'italic',
				color: 'rgb(51,185,255)',
				textDecoration: 'none',
				fontWeight: 'normal',
				borderWidth: 2,
				borderColor: '#000'
			},
			itemHoverStyle: {
				color: 'rgb(51,185,255)',
				fontWeight: 'normal',
				borderColor: '#000000'
			}
		},
		colorAxis: {
			dataClasses: [{
				from: 0,
				to: 3.999,
				color: "rgb(1,19,85)"
			}, {
				from: 4.0,
				to: 4.499,
				color: "rgb(15,34,105)"
			}, {
				from: 4.5,
				to: 4.999,
				color: "rgb(33,54,130)"
			}, {
				from: 5.0,
				to: 5.499,
				color: "rgb(53,76,160)"
			}, {
				from: 5.5,
				to: 100,
				color: "rgb(90,113,198)"
			}]
		},
		plotOptions: {
			map: {
				allAreas: true,
				joinBy: ['hc-key'],
				dataLabels: {
					enabled: true,
					color: 'rgb(253,189,15)',
					style: {
						fontWeight: 'normal'
					}
				},
				borderColor: "#1A61AC",
				borderWidth: 1,
				mapData: Highcharts.maps['countries/cn/cn-all'],
				//							tooltip: {
				//								headerFormat: '',
				//								pointFormat: '{point.name}: <b>{series.name}</b>'
				//							}

			},
			series: {
				events: {
				}
			}
		},
};

var mapOption = mui.extend(mapOptionDefault, {
	chart: {
		renderTo: document.getElementById('maps1'),
		marginRight: 5, // for the legend
		style: {
			color: "rgb(253,189,15)",
		},
		plotBorderColor: "red",
		backgroundColor: "transparent"
	},
	series: [{
		data: data,

		joinBy: 'hc-key',
		name: '票据指数',
		states: {
			hover: {
				color: '#BADA55'
			}
		},
		dataLabels: {
			enabled: true,
			format: '{point.name}'
		},
		events: {
			click: function() {
				//console.log(this, arguments);
			}
		}
	}]
});

if(chartMapObj == null) {
	chartMapObj = new Highcharts.Map(mapOption);
} else {
	//更新数据
	var seriesObj = chartMapObj.series[0];
	seriesObj.update({
		data: data
	});
}
if(mapNum == 1) {
	mui.plusReady(function() {
		var wb = plus.webview.getWebviewById('pjzs.html');
		mui.fire(wb, 'loadingChart', {
			viewTab: 'pjzsChart.html',
			mapNum: mapNum
		});
		mapNum++;
	})
}
}