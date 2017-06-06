/**
 * Created by wangyu on 7/19/16.
 */
var map = new BMap.Map("allmap", {enableMapClick: false});          // 创建地图实例
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
var top_right_navigation = new BMap.NavigationControl({
    anchor: BMAP_ANCHOR_TOP_RIGHT,
    type: BMAP_NAVIGATION_CONTROL_SMALL
}); //右上角，仅包含平移和缩放按钮
/*缩放控件type有四种类型:
 BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/


//添加控件和比例尺
function add_control() {
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);
    map.addControl(top_right_navigation);
}


//获取当前视野半径
function getRadius() {
    var diameter = map.getDistance(map.getBounds().getSouthWest(), map.getBounds().getNorthEast());
    var radius = diameter / 2;
    return radius;
}

//"lng":116.363825,"lat":39.966981

var markers = [];
var place0;
var chart;
var boxcontentHome = "<div class='mantle'>" +
    " <div class='titlet'><b><span id='locationId'></span></b></div> " +
    " <div class='coltext'>平均Mos：<b><span id='averageMos'></span></b></div>" +
    " <div class='coltext'>不满意Mos：<b><span id='unsatisMos'></span></b></div>" +
    " <div class='coltext'><b><a href='data_analysis.html'>区域信号分析</a></b></div>" +
    " <div class='coltext'><b><a href='signal.html'>信号热图</a></b></div>" +
    "</div>";
var infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {
    boxStyle: {width: "150px"},
    closeIconMargin: "10px 10px 0 0", closeIconUrl: 'images/qoeicons/x1.png', enableAutoPan: true, alignBottom: false
});

// " <div class='coltext'>Throughput：<b><span id='throughput'></span></b></div> " +
// " <div class='coltext'>BufferTime：<b><span id='buffertime'></span></b></div>" +
// " <div class='coltext'>BufferFreq：<b><span id='bufferfreq'></span></b> </div> " +
// " <div class='coltext'>LoadingTime:<b><span id='loadingtime'></span></b></div></div>";
// var infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {boxStyle:{width: "100px"},
//     closeIconMargin: "10px 10px 0 0",closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});
// infoBoxHome.disableAutoPan();

// 初始化地图，设置中心点坐标和地图级别
if (!sessionStorage.center || !sessionStorage.zoom) {
    var point = new BMap.Point(116.364549, 39.968112);
    map.centerAndZoom(point, 12);
} else {
    var center = JSON.parse(sessionStorage.center);
    var point = new BMap.Point(center.lng, center.lat);
    map.centerAndZoom(point, sessionStorage.zoom);
}

map.enableInertialDragging();
map.enableScrollWheelZoom();
map.enableAutoResize();
//添加控件和比例尺
map.addControl(top_left_control);
map.addControl(top_left_navigation);
//map.addControl(top_right_navigation);

// var b = new BMap.Bounds(new BMap.Point(116.362168,39.965834),new BMap.Point(116.367432,39.9709325));
// try {
//     BMapLib.AreaRestriction.setBounds(map, b);
// } catch (e) {
//     alert(e);
// }
// map.disableDragging();//启用地图拖拽事件，默认启用
// map.disableKeyboard();//启用键盘上下左右键移动地图
// add_retangle();
if (document.getElementById("indoorRadio").checked) {
    closeOutDoor();
    //showlocqoe();
} else {
    closeInDoor();
    //showoverlay();
}

//添加地图缩放事件
map.addEventListener("zoomend", function () {
    if (document.getElementById("indoorRadio").checked) {
        closeOutDoor();
    }else{
		closeInDoor();
	}
});

//添加地图点击事件,显示室外信息
map.addEventListener("click", function (e) {
    if (document.getElementById("indoorRadio").checked) {
        showInfo(e.point.lng, e.point.lat, "indoor");
    } else {
        showInfo(e.point.lng, e.point.lat, "outdoor");
    }

});

//判断浏览区是否支持canvas
var elem = document.createElement('canvas');
var flag = !!(elem.getContext && elem.getContext('2d'));
if (!flag) {
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
}

if (!isSupportCanvas()) {
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
    infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {
        boxStyle: {width: "150px"},
        closeIconMargin: "10px 10px 0 0",
        closeIconUrl: 'images/qoeicons/x1.png',
        enableAutoPan: true,
        alignBottom: false
    });
    showoverlay("outdoor");
    showoverlay("indoor");
}
function closeInDoor() {
    // heatmapOverlay.hide();
    map.clearOverlays();
    infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {
        boxStyle: {width: "150px"},
        closeIconMargin: "10px 10px 0 0",
        closeIconUrl: 'images/qoeicons/x1.png',
        enableAutoPan: true,
        alignBottom: false
    });
    showoverlay("outdoor");
//	sessionStorage.location = "outdoor";
}
function closeOutDoor() {
    infoBoxHome.length = 0;
    map.clearOverlays();
    infoBoxHome = new BMapLib.InfoBox(map, boxcontentHome, {
        boxStyle: {width: "150px"},
        closeIconMargin: "10px 10px 0 0",
        closeIconUrl: 'images/qoeicons/x1.png',
        enableAutoPan: true,
        alignBottom: false
    });
    showoverlay("indoor");
//	sessionStorage.location = "indoor";
}

//刷新按钮逻辑
function fresh() {
    if (document.getElementById('indoorRadio').checked) {
        closeOutDoor();
    } else {
        closeInDoor();
    }
}

function getTime(str) {
    var date = new Date(str);
    return date.getTime() + 8 * 3600 * 1000;
}

function getEndTime() {
    var endTime = document.getElementById("endDay").value;
    if (endTime === "") {
        endTime = getPresetTime()[1];
    } else {
        endTime = endTime.replace("T", " ");
    }
    return endTime;
}

function getStartTime() {
    var startTime = document.getElementById("startDay").value;
    if (startDay === "") {
        startTime = getPresetTime()[0];
    } else {
        startTime = startTime.replace("T", " ");
    }
    return startTime;
}

function getOperatorId() {
    var operatorId = "02";
    var operator = $("#operator option:selected").val();
    if (operator === "unicom") {
        operatorId = "01";
    } else if (operator === "telecom") {
        operatorId = "03";
    }

    return operatorId;
}

//获取地图比例尺
function getMapScale() {
    var scales = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000];
    var zoom = map.getZoom();
    var scale = scales[19 - zoom];
    return scale;
}

//获取地图热点的半径
function getHeatMapOverlayRadius(radius) {
    var heatMapRadius = 60;
    if (radius > 30000) {
        heatMapRadius = 5;
    } else if (radius > 10000) {
        heatMapRadius = 10;
    } else if (radius > 5000) {
        heatMapRadius = 20;
    } else if (radius > 2500) {
        heatMapRadius = 35;
    } else if (radius > 1250) {
        heatMapRadius = 50;
    } else if (radius > 700) {
        heatMapRadius = 65;
    } else {
        heatMapRadius = 90;
    }
    return heatMapRadius;
}

// 展示热图效果
function showoverlay(lac) {
    $.ajax({
        type: "POST",
        url: REST_URL + "/1.0/QoeList/",
        contentType: "application/json;charsetj=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "operatorId": getOperatorId(),
            "standard": "13",
            "longitude": 116.364549,
            "latitude": 39.968112,
            "radius": getRadius(),
            "location": lac,
            "startTime": getStartTime(),
            "endTime": getEndTime(),
            "target": "QoE"
        }),
        success: function (jsonObj) {
            var hotPoints = new Array();
            var radius = getRadius();
            var hotMapPoints = jsonObj.points;
            for (var i = 0; i < hotMapPoints.length; i++) {
                var point = {
                    "lng": hotMapPoints[i].longitude,
                    "lat": hotMapPoints[i].latitude,
                    "count": hotMapPoints[i].value,
                };
                hotPoints[i] = point;
            }
            heatmapOverlay = new BMapLib.HeatmapOverlay({
                "radius": 20
                //      "gradient":{.1:'rgb(70,176,53)',.3:'rgb(155,199,2)',.5:'rgb(255,174,0)',.7:'rgb(255,114,0)',.9:'rgb(253,48,35)'}
            });
            map.addOverlay(heatmapOverlay);
            heatmapOverlay.setDataSet({data: hotPoints, max: 5});

            // for (var i = 0; i < hotMapPoints.length; i++) {
            //     var marker = new BMap.Marker(new BMap.Point(hotMapPoints[i].longitude, hotMapPoints[i].latitude));
            //     var content = [hotMapPoints[i].location,hotMapPoints[i].value];
            //
            //     map.addOverlay(marker);
            //     showInfo(content, marker);
            // }
        }

    });
}

function showInfo(lng, lat, lac) {
    $.ajax({
        type: "POST",
        url: REST_URL + "/1.0/QoeList/",
        contentType: "application/json;charsetj=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "operatorId": getOperatorId(),
            "standard": "13",
            "longitude": lng,
            "latitude": lat,
            "radius": getMapScale() / 5,
            "location": lac,
            "startTime": getStartTime(),
            "endTime": getEndTime(),
            "target": "QoE"
        }),
        success: function (jsonObj) {
            if (jsonObj) {
                var points = jsonObj.points;
                var avrQoe = getAvrQoe(points);

                var markerlocation1 = new BMap.Point(lng, lat);
                infoBoxHome.open(markerlocation1);
				var lacCh = "室外";
				if(lac == "indoor"){
					lacCh = "室内";
				}
                document.getElementById("locationId").innerHTML = lacCh;
                document.getElementById("averageMos").innerHTML = avrQoe[0];
                document.getElementById("unsatisMos").innerHTML = avrQoe[1] + "%";

                //使用sessionStorage本地存储
                sessionStorage.operatorId = getOperatorId();
                sessionStorage.startTime = getStartTime();
                sessionStorage.endTime = getEndTime();
                sessionStorage.lng = lng;
                sessionStorage.lat = lat;
                sessionStorage.location = lac;
                var centerPoint = {lng: map.getCenter().lng, lat: map.getCenter().lat};
                sessionStorage.center = JSON.stringify(centerPoint);
                sessionStorage.zoom = map.getZoom();
            }

        }

    });
}

function createHeatMapOverlay() {
    heatmapOverlay = 0;
}
//判断浏览区是否支持canvasx
function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

//测试地点位置qoe显示
function showlocqoe1() {
    for (var i = 0; i < hotMapPoints.length; i++) {
        var pt = new BMap.Point(hotMapPoints[i].lng, hotMapPoints[i].lat);
        var myIcon = new BMap.Icon("images/qoeicons" + chouseQoeIcon1(hotMapPoints[i]), new BMap.Size(35, 55));
        var content = [hotMapPoints[i].location, hotMapPoints[i].mos];
        var marker2 = new BMap.Marker(pt, {icon: myIcon});  // 创建标注
        map.addOverlay(marker2);              // 将标注添加到地图中
        showInfo(content, marker2);
    }

}

function chouseQoeIcon1(array) {
    if (array.mos >= 4) {
        return "/gaoqoe1.png";
    } else if (array.mos < 4 && array.mos >= 3) {
        return "/zhonggaoqoe1.png";
    } else if (array.mos < 3 && array.mos >= 2) {
        return "/zhongqoe1.png";
    } else if (array.mos < 2 && array.mos >= 1) {
        return "/zhongdiqoe1.png";
    } else {
        return "/diqoe1.png";
    }
}
/*
function showlocqoe() {
    $.ajax({
        type: "POST",
        url: "http://101.200.215.79:38080/wilysis/1.0//QoeList",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "operatorId": getOperatorId(),
            "standard": "13",
            "longitude": 116.364549,
            "latitude": 39.968112,
            "radius": getRadius(),
            "location": "indoor",
            "startTime": getStartTime(),
            "endTime": getEndTime(),
            "target": "QoE"
        }),
        success: function (jsonObj) {
            var hotPoints = new Array();
            var radius = getRadius();
            var hotMapPoints = jsonObj.points;
            for (var i = 0; i < hotMapPoints.length; i++) {
                var point = {
                    "lng": hotMapPoints[i].longitude,
                    "lat": hotMapPoints[i].latitude,
                    "count": hotMapPoints[i].value,
                };
                hotPoints[i] = point;
            }
            heatmapOverlay = new BMapLib.HeatmapOverlay({
                "radius": 20
                //      "gradient":{.1:'rgb(70,176,53)',.3:'rgb(155,199,2)',.5:'rgb(255,174,0)',.7:'rgb(255,114,0)',.9:'rgb(253,48,35)'}
            });
            map.addOverlay(heatmapOverlay);
            heatmapOverlay.setDataSet({data: hotPoints, max: 5});

            // var points = jsonObj.points;
            // for (var i = 0; i < points.length; i++){
            //     var pt = new BMap.Point(points[i].longitude, points[i].latitude);
            //     var myIcon = new BMap.Icon("images/qoeicons" + chouseQoeIcon(points[i]), new BMap.Size(35,55));
            //     var content = [points[i].location,points[i].value];
            //     // points[i].throughput, points[i].buffertime, points[i].bufferfreq, points[i].loadtime];
            //     var marker2 = new BMap.Marker(pt, {icon:myIcon});  // 创建标注
            //     map.addOverlay(marker2);              // 将标注添加到地图中
            //     showInfo(content, marker2);

        }
    });

}
*/
function addClickHandler(content, marker) {
    marker.addEventListener("click", function (e) {
        openInfo(content, e);
    });
}
function openInfo(content, e) {
    var opts = {
        width: 0,     // 信息窗口宽度
        height: 0,     // 信息窗口高度
        title: 0, // 信息窗口标题
        enableMessage: false//设置允许信息窗发送短息
    };
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
    infoWindow.disableAutoPan();
    place0 = infoWindow.getContent();

}

//选择室内图标
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
/*
function showInfo(content, marker) {
    marker.addEventListener("click", function (e) {
        // openInfo(content, e);
        var lng = marker.getPosition().lng;
        var lat = marker.getPosition().lat;
        var markerlocation1 = new BMap.Point(lng, lat);
        infoBoxHome.open(markerlocation1);
        document.getElementById("locationId").innerHTML = content[0];
        document.getElementById("averageMos").innerHTML = content[1];
        document.getElementById("unsatisMos").innerHTML = content[1];
        //使用sessionStorage本地存储
        sessionStorage.operatorId = getOperatorId();
        sessionStorage.startTime = getStartTime();
        sessionStorage.endTime = getEndTime();
        sessionStorage.lng = lng;
        sessionStorage.lat = lat;
        sessionStorage.location = "indoor";
        var centerPoint = {lng: map.getCenter().lng, lat: map.getCenter().lat};
        sessionStorage.center = JSON.stringify(centerPoint);
        sessionStorage.zoom = map.getZoom();
    });
}
*/
function getAvrQoe(points) {
    var avrQoe = [];
    var len = points.length;
    var sum = 0;
    var bad = 0;
    for (var i = 0; i < len; i++) {
        sum += points[i].value;
        if (points[i].value <= 2) {
            bad += 1;
        }
    }
    avrQoe[0] = Math.round((sum / len) * 100) / 100;
    avrQoe[1] = Math.round((bad / len) * 1000) / 1000;
    return avrQoe;
}
/**
 * Grid theme for Highcharts JS
 * @author Torstein Honsi
 */


