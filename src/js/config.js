/**
 * 配置文件
 */
var CONFIG = {};
CONFIG.appName = "银承库"; //APP 名称（必填）

//ajax 请求服务根目录地址（必填） live
//CONFIG.appRootUrl = "http://qiyeapp.service.yinchengku.cn/app/"; 

//ajax 请求服务根目录地址（必填） develop
//CONFIG.appRootUrl = "http://10.192.168.190:8080/app/"; 

//董瑞机器
//CONFIG.appRootUrl = "http://10.100.201.138/app/";

//哲学机器
//CONFIG.appRootUrl = "http://10.100.102.198/app/";

//ajax 请求服务根目录地址（必填）test
CONFIG.appRootUrl = "http://qiyeapp01.tst.yinchengku.com/app/";


//ajax 请求服务根目录地址（必填）
//CONFIG.appRootBackUrl = "http://qiyeapp.service.yinchengku.cn/app/"; 
//ajax 请求服务根目录备份地址，用于请求失败重连（选填）
CONFIG.DEBUG = true; //是否是debug模式（必填）