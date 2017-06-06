var map = new BMap.Map("allmap", {enableMapClick: false});          // 创建地图实例
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
/*缩放控件type有四种类型:
 BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/

//添加控件和比例尺
function add_control(){
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);
    map.addControl(top_right_navigation);
}


//获取当前视野半径
function getRadius(){
    var diameter=map.getDistance(map.getBounds().getSouthWest(),map.getBounds().getNorthEast());
    var radius=diameter/2;
    return radius;
}

//"lng":116.363825,"lat":39.966981
var point = new BMap.Point(116.364549,39.968112);
var markers = [];
var place0;
var chart;
var boxcontentHome=  "<div class='mantle'>" +
    " <div class='titlet'><b><span id='locationId'></span></b></div> " +
    " <div class='coltext'>Mos：<b><span id='value'></span></b></div>" +
    "</div>";
var infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {boxStyle:{width: "100px"},
    closeIconMargin: "10px 10px 0 0",closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});

    // " <div class='coltext'>Throughput：<b><span id='throughput'></span></b></div> " +
    // " <div class='coltext'>BufferTime：<b><span id='buffertime'></span></b></div>" +
    // " <div class='coltext'>BufferFreq：<b><span id='bufferfreq'></span></b> </div> " +
    // " <div class='coltext'>LoadingTime:<b><span id='loadingtime'></span></b></div></div>";
// var infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {boxStyle:{width: "100px"},
//     closeIconMargin: "10px 10px 0 0",closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});
// infoBoxHome.disableAutoPan();

map.centerAndZoom(point, 12);             // 初始化地图，设置中心点坐标和地图级别
map.enableInertialDragging();
map.enableScrollWheelZoom();
map.enableAutoResize();
// map.addControl(top_left_control);
// map.addControl(top_left_navigation);
map.addControl(top_right_navigation);
// map.disableScrollWheelZoom(); // 允许滚轮缩放

// var b = new BMap.Bounds(new BMap.Point(116.362168,39.965834),new BMap.Point(116.367432,39.9709325));
// try {
//     BMapLib.AreaRestriction.setBounds(map, b);
// } catch (e) {
//     alert(e);
// }
// map.disableDragging();//启用地图拖拽事件，默认启用
// map.disableKeyboard();//启用键盘上下左右键移动地图
// add_retangle();

window.overlay = showoverlay();
showDelay(116.364549,39.968112, 2000.0);
showSpeeds(116.364549,39.968112, 2000.0);
showVideoQoe(116.364549,39.968112, 2000.0);

//添加地图缩放事件
map.addEventListener("zoomend",function(){
    if(document.getElementById("indoorRadio").checked){
		 closeOutDoor();	
	}else{
	     closeInDoor();
	}   
});

//判断浏览区是否支持canvas
var elem = document.createElement('canvas');
var flag=!!(elem.getContext && elem.getContext('2d'));
if (!flag) {
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
}

if(!isSupportCanvas()){
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
}
//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
//参数说明如下:
/* visible 热力图是否显示,默认为true
 * opacity 热力的透明度,1-100
 * radius 势力图的每个点的半径大小
 * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
 *	{
 .2:'rgb(0, 255, 255)',
 .5:'rgb(0, 110, 255)',
 .8:'rgb(100, 0, 255)'
 }
 其中 key 表示插值的位置, 0~1.
 value 为颜色值.
 */

//是否显示热力图
// function openHeatmap(){
//     heatmapOverlay.show();
//     // add_retangle();
// }
function showAll() {
    map.clearOverlays();
    infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {boxStyle:{width: "100px"},
        closeIconMargin: "10px 10px 0 0",closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});
    showoverlay();
    showlocqoe();
}
function closeInDoor() {
   // heatmapOverlay.hide();
    map.clearOverlays();
    infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {boxStyle:{width: "100px"},
        closeIconMargin: "10px 10px 0 0",closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});
    showoverlay();
}
function closeOutDoor(){
    infoBoxHome.length = 0;
    map.clearOverlays();
    infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {boxStyle:{width: "100px"},
        closeIconMargin: "10px 10px 0 0",closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});
    showlocqoe();
}

function fresh(){
	  if(document.getElementById('indoorRadio').checked){
		 closeOutDoor();	
	}else{
	     closeInDoor();
	}   
}

function getTime(str){
    var date = new Date(str);
    return date.getTime() + 8*3600*1000;
}

function getEndTime(){
	var now = new Date();
    var endTime = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + (now.getDate()) + " "
                + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var endDay = document.getElementById("endDay").value;
	if(endDay !== ""){
	    endTime = endDay + " " + "00:00:00";
	}
    return endTime;
}

function getStartTime(){
    var time = new Date().getTime() - 30*24*3600*1000;
    var date = new Date(time);
    var startTime = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + (date.getDate()) + " "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	var startDay = document.getElementById("startDay").value;
	if(startDay !== ""){
	    startTime = startDay + " " + "00:00:00";
	}
    return startTime;  
}

function getOperatorId(){
	var operatorId = "02";
    var operator = $("#operator option:selected").val();
	if(operator === "unicom"){
		operatorId = "01";
	}else if(operator === "telecom"){
		operatorId = "03";
	}
	
	return operatorId;
}
// closeHeatmap();
function showoverlay() {
    $.ajax({
        type:"POST",
        url:"http://101.200.215.79:38080/wilysis/1.0/QoeList/",
        contentType:"application/json;charsetj=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":getOperatorId(),
            "standard":"13",
            "longitude":116.364549,
            "latitude":39.968112,
            "radius":getRadius(),
            "location":"outdoor",
            "startTime":getStartTime(),
            "endTime":getEndTime(),
            "target":"QoE"
        }),
        success:function (jsonObj) {
            var hotPoints = new Array();
            var hotMapPoints = jsonObj.points;
            for (var i = 0; i < hotMapPoints.length; i++) {
                var point={
                    "lng":hotMapPoints[i].longitude,
                    "lat":hotMapPoints[i].latitude,
                    "count":hotMapPoints[i].value,
                };
                hotPoints[i]=point;
            }
            heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":60,
                "gradient":{.3:'rgb(70,176,53)',.5:'rgb(155,199,2)',.7:'rgb(255,174,0)',.8:'rgb(255,114,0)',.9:'rgb(253,48,35)'}
            });
            map.addOverlay(heatmapOverlay);
            heatmapOverlay.setDataSet({data:hotPoints,max:5});
            for (var i = 0; i < hotMapPoints.length; i++) {
                var marker = new BMap.Marker(new BMap.Point(hotMapPoints[i].longitude, hotMapPoints[i].latitude));
                var content = [hotMapPoints[i].location,hotMapPoints[i].value];
            // hotMapPoints[i].throughput, hotMapPoints[i].buffertime,
            //         hotMapPoints[i].bufferfreq, hotMapPoints[i].loadtime];
                map.addOverlay(marker);
                showInfo(content, marker);
            }
        }

    });
    // var hotPoints = new Array();
    // for (var i = 0; i < hotMapPoints.length; i++) {
    //     var point={
    //         "lng":hotMapPoints[i].lng,
    //         "lat":hotMapPoints[i].lat,
    //         "count":hotMapPoints[i].mos,
    //     };
    //     hotPoints[i]=point;
    // }
    // heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":60,
    //     "gradient":{.3:'rgb(70,176,53)',.5:'rgb(155,199,2)',.7:'rgb(255,174,0)',.8:'rgb(255,114,0)',.9:'rgb(253,48,35)'}
    // });
    // map.addOverlay(heatmapOverlay);
    // heatmapOverlay.setDataSet({data:hotPoints,max:5});
    // for (var i = 0; i < hotMapPoints.length; i++) {
    //     var marker = new BMap.Marker(new BMap.Point(hotMapPoints[i].lng, hotMapPoints[i].lat));
    //     var content = [hotMapPoints[i].location,hotMapPoints[i].mos, hotMapPoints[i].throughput, hotMapPoints[i].buffertime,
    //         hotMapPoints[i].bufferfreq, hotMapPoints[i].loadtime];
    //     map.addOverlay(marker);
    //     showInfo(content, marker);
    // }
}
function createHeatMapOverlay() {
    heatmapOverlay = 0;
}
//判断浏览区是否支持canvasx
function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
//地点位置qoe显示
function showlocqoe() {
    $.ajax({
        type:"POST",
        url:"http://101.200.215.79:38080/wilysis/1.0//QoeList",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":getOperatorId(),
            "standard":"13",
            "longitude":116.364549,
            "latitude":39.968112,
            "radius":getRadius(),
            "location":"indoor",
            "startTime": getStartTime(),
            "endTime": getEndTime(),
            "target":"QoE"
        }),
        success:function (jsonObj) {
            var points = jsonObj.points;
            for (var i = 0; i < points.length; i++){
                var pt = new BMap.Point(points[i].longitude, points[i].latitude);
                var myIcon = new BMap.Icon("images/qoeicons" + chouseQoeIcon(points[i]), new BMap.Size(35,55));
                var content = [points[i].location,points[i].value];
            // points[i].throughput, points[i].buffertime, points[i].bufferfreq, points[i].loadtime];
                var marker2 = new BMap.Marker(pt, {icon:myIcon});  // 创建标注
                map.addOverlay(marker2);              // 将标注添加到地图中
                showInfo(content, marker2);
            }
        }
    });
    // for (var i = 0; i < points.length; i++) {
    //     var pt = new BMap.Point(points[i].lng, points[i].lat);
    //     var myIcon = new BMap.Icon("images/qoeicons" + chouseQoeIcon(points[i]), new BMap.Size(35,55));
    //     // myIcon.setImageUrl("./fox.gif");
    //     var content = [points[i].location,points[i].mos, points[i].throughput, points[i].buffertime, points[i].bufferfreq, points[i].loadtime];
    //     var marker2 = new BMap.Marker(pt, {icon:myIcon});  // 创建标注
    //     map.addOverlay(marker2);              // 将标注添加到地图中
    //     showInfo(content, marker2);
    // }
}
function addClickHandler(content, marker) {
    marker.addEventListener("click",function (e) {
       openInfo(content, e);
    });
}
function openInfo(content, e) {
    var opts = {
        width : 0,     // 信息窗口宽度
        height: 0,     // 信息窗口高度
        title : 0 , // 信息窗口标题
        enableMessage:false//设置允许信息窗发送短息
    };
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    infoWindow.disableAutoPan();
    place0=	infoWindow.getContent();

}
// function openInfo(content,e){
//     var opts = {
//         width : 0,     // 信息窗口宽度
//         height: 0,     // 信息窗口高度
//         title : 0 , // 信息窗口标题
//         enableMessage:false//设置允许信息窗发送短息
//     };
//     var p = e.target;
//     var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
//     var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
//     infoWindow.disableAutoPan();
//     place0=	infoWindow.getContent();
// }
function chouseQoeIcon(array) {
    if (array.value >= 4) {
        return "/gaoqoe1.png";
    } else if (array.value < 4 && array.value >= 3) {
        return "/zhonggaoqoe1.png";
    } else if (array.value < 3 && array.value >= 2) {
        return "/zhongqoe1.png";
    } else if (array.value < 2 && array.value >= 1) {
        return "/zhongdiqoe1.png";
    } else {
        return "/diqoe1.png";
    }
}

function showInfo(content, marker) {

    // infoBoxHome.disableAutoPan();
    marker.addEventListener("click", function (e) {
        // openInfo(content, e);
        var lng1 = marker.getPosition().lng;
        var lat1 = marker.getPosition().lat;
        var markerlocation1 = new BMap.Point(lng1, lat1);
        infoBoxHome.open(markerlocation1);
        document.getElementById("locationId").innerHTML = content[0];
        document.getElementById("value").innerHTML = content[1];
        showDelay(lng1, lat1, 20.0);
        showSpeeds(lng1, lat1, 20.0);
        showVideoQoe(lng1, lat1, 20.0);
    });
}


function openInfoHot(content, e) {
    var opts = {
        width: 0,
        height: 0,
        title: 0,
        enableMessage: false
    };
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content, opts);
    // infoWindow.disableAutoPan();
    place0 = infoWindow.getContent();
}

function showDelay(lng, lat, radius){
    $.ajax({
        type:"POST",
        url:"http://101.200.215.79:38080/wilysis/1.0/webLatencies/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":"02",
            "standard":"13",
            "longitude":lng,
            "latitude":lat,
            "radius":radius,
            "location":"",
            "startTime":getStartTime(),
            "endTime":getEndTime(),
            "target":"operator"
        }),
        success: function(jsonObj) {
            var lng1 = lng;
            var lat1 = lat;
            var chart = {
                type: 'scatter',
                zoomType: 'xy',
                //设置绘图背景颜色
                plotBackgroundColor: '#fcf2f0',
                borderWidth: 0,
                plotShadow: true,
                plotBorderWidth: 1,
                spacingLeft:3,
                spacingBottom:0,
            };
            var title = {
                text: '时延图',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold'
                },
                align: 'left'
            };
            var subtitle = {
                text: '',
                style: {
                    color: '#666666',
                    font: 'bold 10px "Trebuchet MS", Verdana, sans-serif'
                }
            };
            var credits = {
                enabled:false
            };
            var xAxis = {
                type: 'datetime',
                // title: {
                //     enabled: true,
                //     text: 'Time'
                // },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                gridLineWidth: 1,
                lineWidth: 0,
                lineColor: '#000',
                tickColor: '#000',
                labels: {
                    style: {
                        color: '#000',
                        font: '10px Trebuchet MS, Verdana, sans-serif'
                    }
                },
                title: {
                    style: {
                        color: '#333',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                    }
                }
            };
            var yAxis = {
                minorTickInterval: 'auto',
                lineColor: '#000',
                lineWidth: 1,
                tickWidth: 1,
                tickColor: '#000',
                labels: {
                    style: {
                        color: '#000',
                        font: '11px Trebuchet MS, Verdana, sans-serif'
                    }
                },
                title: {
                    text:'',
                    style: {
                        color: '#333',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                    }
                }
            };
            var exporting = {
                enabled: false
            };
            var legend = {
                // layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
                y: 0,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                borderWidth: 0,
                itemStyle: {
                    font: '9pt Trebuchet MS, Verdana, sans-serif',
                    color: 'black'

                },
                itemHoverStyle: {
                    color: '#039'
                },
                itemHiddenStyle: {
                    color: 'gray'
                }
            };
            var plotOptions = {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x} , {point.y ms} '
                    }
                }
            };
            var tooltip = {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);

                }
            };
            var colors = {
                colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
            };

            var series= [{
                name: 'Tencent',
                color: 'rgba(223, 83, 83, .5)',
                data:  (function() {
                    // generate an array of random data
                    var data = [];
                    var xVal = jsonObj.submitAts;
                    var yVal = jsonObj.websiteLatencies["www.tencent.com"];
                    for(var i = 0; i < xVal.length; i++){
                       
                        data.push({
                            x: getTime(xVal[i]),
                            y: yVal[i]
                        });
                    }

                    return data;
                })()
            }, {
                name: 'Operator',
                color: 'rgba(119, 152, 191, .5)',
                data:  (function() {
                    // generate an array of random data
                    var data = [];
                    var xVal = jsonObj.submitAts;
                    var yVal = jsonObj.operatorLatencies;
                    for(var i = 0; i < xVal.length; i++){
                        // var date = datetime_to_unix(xVal[i]);
                        // var date = new Date(xVal[i]);
                        // var arr = xVal[i].replace(/ |:/g, '-').split('-');
                        // date = new Date(Date.UTC(arr[1], arr[2], arr[3], arr[4], arr[5]));
                        data.push({
                            x: getTime(xVal[i]),
                            y: yVal[i]
                        });
                    }

                    return data;
                })()
            },{
                name: 'Baidu',
                color: 'rgba(119, 52, 9, .5)',
                data:   (function() {
                    // generate an array of random data
                    var data = [];
                    var xVal = jsonObj.submitAts;
                    var yVal = jsonObj.websiteLatencies["www.baidu.com"];

                    for(var i = 0; i < xVal.length; i++){
                        // var date = datetime_to_unix(xVal[i]);
                        // var arr = xVal[i].replace(/ |:/g, '-').split('-');
                        // date = new Date(Date.UTC(arr[1], arr[2], arr[3], arr[4], arr[5]));
                        data.push({
                            x: getTime(xVal[i]),
                            y: yVal[i]
                        });
                    }

                    return data;
                })()
            }
            ];

            var json = {};
            json.chart = chart;
            json.title = title;
            json.subtitle = subtitle;
            json.legend = legend;
            json.exporting = exporting;
            json.xAxis = xAxis;
            json.yAxis = yAxis;
            json.series = series;
            json.credits = credits;
            json.plotOptions = plotOptions;
            json.tooltip = tooltip;
            $('#container_timedelay').highcharts(json);
        }
    });
}

function datetime_to_unix(datetime){
    var tmp_datetime = datetime.replace(/-/g,"/");
    var date = new Date(tmp_datetime);
    var humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
    date.getMinutes(), date.getSeconds()));
    return (humanDate.getTime()/1000 - 8*60*60);
}


function showSpeeds(lng, lat, radius){
    $.ajax({
        type:"POST",
        url:"http://101.200.215.79:38080/wilysis/1.0/transferSpeeds/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":"02",
            "standard":"13",
            "longitude":lng,
            "latitude":lat,
            "radius":radius,
            "location":"",
            "startTime":getStartTime(),
            "endTime":getEndTime()

        }),
        success: function(jsonObj) {
            $('#container_updown').highcharts({
                colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                credits:{
                    enabled:false
                },
                chart: {
                    type: 'spline',
                    plotBackgroundColor: '#fcf2f0',
                    borderWidth: 0,
                    plotShadow: true,
                    plotBorderWidth: 1,
                    spacingLeft:3,
                    spacingBottom:0,
                },
                title: {
                    text: '上传/下载速度',
                    align: 'left',
                    style: {
                        fontSize: '12px',
                        fontWeight: 'bold'
                    },
                },
                legend: {
                    // layout: 'vertical',
                    backgroundColor: '#FFFFFF',
                    align: 'center',
                    verticalAlign: 'bottom',
                    floating: false,
                    x: 0,
                    y: 0
                },
                exporting: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                    gridLineWidth: 1,
                    lineWidth: 0,
                    lineColor: '#000',
                    tickColor: '#000',
                    labels: {
                        style: {
                            color: '#000',
                            font: '10px Trebuchet MS, Verdana, sans-serif'
                        }
                    },
                    title: {
                        style: {
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                        }
                    },
                },
                yAxis: {
                    minorTickInterval: 'auto',
                    lineColor: '#000',
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000',
                    labels: {
                        style: {
                            color: '#000',
                            font: '11px Trebuchet MS, Verdana, sans-serif'
                        }
                    },
                    title: {
                        text:'',
                        style: {
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                        }
                    }

                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);

                    }
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.x} , {point.y ms} '
                        }
                    }
                    // spline: {
                    //     lineWidth: 4,
                    //     states: {
                    //         hover: {
                    //             lineWidth: 5
                    //         }
                    //     },
                    //     marker: {
                    //         enabled: false
                    //     },
                    //     pointInterval: 3600000, // one hour
                    //     pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
                    // }
                },
                series: [{
                    name: '下载',
                    data:  (function() {
                        // generate an array of random data
                        var data = [];
                        var xVal = jsonObj.submitAts;
                        var yVal = jsonObj.downloadSpeeds;

                        for(var i = 0; i < xVal.length; i++){
                            // var date = new Date(xVal[i]);
                            // var arr = xVal[i].replace(/ |:/g, '-').split('-');
                            // date = new Date(Date.UTC(arr[1], arr[2], arr[3], arr[4], arr[5]));
                            // var date = datetime_to_unix(xVal[i]);
                            data.push({
                                x: getTime(xVal[i]),
                                y: yVal[i]
                            });
                        }

                        return data;
                    })()

                }, {
                    name:'上传',
                    data:  (function() {
                        // generate an array of random data
                        var data = [];
                        var xVal = jsonObj.submitAts;
                        var yVal = jsonObj.uploadSpeeds;

                        for(var i = 0; i < xVal.length; i++){
                            // var date = new Date(xVal[i]);
                            // var arr = xVal[i].replace(/ |:/g, '-').split('-');
                            // date = new Date(Date.UTC(arr[1], arr[2], arr[3], arr[4], arr[5]));
                            // var date = datetime_to_unix(xVal[i]);
                            data.push({
                                x: getTime(xVal[i]),
                                y: yVal[i]
                            });
                        }

                        return data;
                    })()
                }]
            });
        }
    });
}

function showVideoQoe(lng, lat, radius) {
    $.ajax({
        type:"POST",
        url:"http://101.200.215.79:38080/wilysis/1.0/videoExperiences/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":"02",
            "standard":"13",
            "longitude":lng,
            "latitude":lat ,
            "radius":radius,
            "location":"",
            "startTime":getStartTime(),
            "endTime":getEndTime(),
            "target":"video"
        }),


        success:function(jsonObj){
            var data = jsonObj[jsonObj.length-1];
            $("#mos").html(data.mos);
            $("#bufferTime").html(data.bufferTime + " s");
            $("#bufferFrequency").html(data.bufferFrequency + " HZ");
            $("#throughput").html(getAvr(data.throughputs) + "kbps");
            $("#loadTime").html(data.loadTime + " s");
        },
        error:function(jqXHR){
            alert("Error"+jqXHR.status);
        }
    });
}

function getAvr(array){
    var len = array.length;
    if (len === 0) {
        return 0;
    }
    var sum = 0;
    for (var i = 0; i < len; i++) {
       sum += array[i];
    }
    var avr = Math.round(sum/len);
    return avr;
}
/**
 * Grid theme for Highcharts JS
 * @author Torstein Honsi
 */


