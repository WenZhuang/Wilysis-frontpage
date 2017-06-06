var map = new BMap.Map("allmap03", {enableMapClick: false});          // 创建地图实例
//"lng":116.363825,"lat":39.966981
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮

var point = new BMap.Point(sessionStorage.lng,sessionStorage.lat);
var markers = [];
var place0;
var chart;
var boxcontent1=  "<div class='mantle'>" +
    " <div class='titlet'><b><span id='location2'></span></b></div> " +
    " <div class='coltext'>平均信号质量：<br><b><span id='signalQuality'></span></b></div></div>";
var infoBox1 = new BMapLib.InfoBox(map, boxcontent1, {boxStyle:{width: "130px"},closeIconMargin: "10px 10px 0 0",
    closeIconUrl:'images/qoeicons/x1.png',  enableAutoPan: true, alignBottom:false});

// infoBox1.disableAutoPan();



map.centerAndZoom(point, sessionStorage.zoom);
map.enableInertialDragging();
map.enableScrollWheelZoom();
map.enableAutoResize();
//添加控件和比例尺
map.addControl(top_left_control);
map.addControl(top_left_navigation);
//map.addControl(top_right_navigation);

//获取当前视野半径
function getRadius(){
    var diameter=map.getDistance(map.getBounds().getSouthWest(),map.getBounds().getNorthEast());
    var radius=diameter/2;
    return radius;
}

//window.overlay = showoverlay();
if (document.getElementById("qualityIndoor").checked) {
    closeOutDoor3();
    //showlocqoe();
} else {
    closeInDoor2();
    //showoverlay();
}

//添加地图缩放事件
map.addEventListener("zoomend", function () {
    if (document.getElementById("qualityIndoor").checked) {
        closeOutDoor3();
    }else{
		closeInDoor2();
	}
});

//添加地图点击事件,显示室外信息
map.addEventListener("click", function (e) {
    if (document.getElementById("qualityIndoor").checked) {
        showInfo(e.point.lng, e.point.lat, "indoor");
	   //alert("indoor"+e.point.lng+","+e.point.lat);
    } else {
        showInfo(e.point.lng, e.point.lat, "outdoor");
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

function closeInDoor2() {
    map.clearOverlays();
    infoBox1 = new BMapLib.InfoBox(map, boxcontent1, {boxStyle:{width: "150px"},closeIconMargin: "10px 10px 0 0",
    closeIconUrl:'images/qoeicons/x1.png',  enableAutoPan: true, alignBottom:false});
    showoverlay("outdoor");
}
function closeOutDoor3(){
//    infoBox1.length = 0;
    map.clearOverlays();
//    infoBox1 = new BMapLib.InfoBox(map, boxcontent1, {boxStyle:{width: "150px"},closeIconMargin: "10px 10px 0 0",
//    closeIconUrl:'images/qoeicons/x1.png',  enableAutoPan: true, alignBottom:false});
    showoverlay("indoor");
}

//获取地图比例尺
function getMapScale() {
    var scales = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000];
    var zoom = map.getZoom();
    var scale = scales[19 - zoom];
    return scale;
}


function showInfo(lng,lat,lac) {
    $.ajax({
        type:"POST",
        url: REST_URL + "/1.0/signals/",
        contentType:"application/json;charsetj=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":sessionStorage.operatorId,
            "standard":"13",
            "longitude":lng,
            "latitude":lat,
            "radius":  getMapScale() / 5,
            "location":lac,
            "startTime":sessionStorage.startTime,
            "endTime":sessionStorage.endTime,
            "target":"RSRQ"
        }),
        success:function (jsonObj) {
            if (jsonObj) {				
                var points = jsonObj;
                var markerlocation1 = new BMap.Point(lng, lat);
                infoBox1.open(markerlocation1);
				
				var lacCh = "室外";
				if(lac == "indoor"){
					lacCh = "室内";
				}
                document.getElementById("location2").innerHTML = lacCh;
			    document.getElementById("signalQuality").innerHTML = getAvr(points) + "db";
            }
		   
        }

    });
}

function getAvr(points) {
    var len = points.length;
    var sum = 0;
    for (var i = 0; i < len; i++) {
        sum += points[i].value;
    }
    var avr = Math.round((sum / len) * 100) / 100;
    return avr;
}


function showoverlay(lac) {
    $.ajax({
        type:"POST",
        url: REST_URL + "/1.0/signals/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":sessionStorage.operatorId,
            "standard":"13",
            "longitude":sessionStorage.lng,
            "latitude":sessionStorage.lat,
            "radius": getRadius(),
            "location":lac,
            "startTime":sessionStorage.startTime,
            "endTime":sessionStorage.endTime,
            "target":"RSRQ"

        }),


        success:function(jsonObj){
            var hotMapPoints = jsonObj;
            var hotPoints = new Array();
            for (var i = 0; i < hotMapPoints.length; i++) {
                var point={
                    "lng":hotMapPoints[i].longitude,
                    "lat":hotMapPoints[i].latitude,
                    "count":20 + hotMapPoints[i].value,
                };
                hotPoints[i]=point;
            }
            heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20,
//                "gradient":{.3:'rgb(70,176,53)',.5:'rgb(155,199,2)',.7:'rgb(255,174,0)',.8:'rgb(255,114,0)',.9:'rgb(253,48,35)'}
            });
            map.addOverlay(heatmapOverlay);
            heatmapOverlay.setDataSet({data:hotPoints,max:5});
//            for (var i = 0; i < hotMapPoints.length; i++) {
//                var marker = new BMap.Marker(new BMap.Point(hotMapPoints[i].longitude, hotMapPoints[i].latitude));
//                var content = [hotMapPoints[i].location,hotMapPoints[i].value];
//                map.addOverlay(marker);
//                showInfo(content, marker);
//            }
        },
        error:function(jqXHR){
            $("#data").html("Error:"+jqXHR.status);
        }
    });

}

function createHeatMapOverlay() {
    heatmapOverlay = 0;
}
//判断浏览区是否支持canvasx
function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
/*
//地点位置qoe显示
function showlocqoe() {
    $.ajax({
        type:"POST",
        url:"http://101.200.215.79:38080/wilysis/1.0/signals/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":sessionStorage.operatorId,
            "standard":"13",
            "longitude":sessionStorage.lng,
            "latitude":sessionStorage.lat,
            "radius": getRadius(),
            "location":sessionStorage.location,
            "startTime":sessionStorage.startTime,
            "endTime":sessionStorage.endTime,
            "target":"RSRQ"

        }),

        success:function(jsonObj){
            var points = jsonObj;
            for (var i = 0; i < points.length; i++) {
                var pt = new BMap.Point(points[i].longitude, points[i].latitude);
                var myIcon = new BMap.Icon("images/qoeicons" + chouseQoeIcon(points[i]), new BMap.Size(35,55));
                // myIcon.setImageUrl("./fox.gif");
                var content = [points[i].location,points[i].value];
                var marker2 = new BMap.Marker(pt, {icon:myIcon});  // 创建标注
                map.addOverlay(marker2);              // 将标注添加到地图中
                showInfo(content, marker2);
            }
        }
    })
}
*/
function addClickHandler(content, marker) {
    marker.addEventListener("click",function (e) {
        openInfo(content, e)
    });
}
function openInfo(content, e) {
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts); //创建信息窗口对象
    // infoWindow.disableAutoPan();
    map.openInfoWindow(infoWindow, point); //开启信息窗口

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
    if (array.signalQuality >= -6) {
        return "/gaoqoe1.png";
    } else if (array.signalQuality < -6 && array.signalQuality >= -10) {
        return "/zhonggaoqoe1.png";
    } else if (array.signalQuality < -10 && array.signalQuality >= -14) {
        return "/zhongqoe1.png";
    } else if (array.signalQuality < -14 && array.signalQuality >= -17) {
        return "/zhongdiqoe1.png";
    } else {
        return "/diqoe1.png";
    }
}

// var boxcontent1=  "<div class='module' style='border: #DEDEDE 1px solid;border-radius: 7px;" +
//     "background-color:rgba(249, 249, 249, 0.84);padding:15px'><div style='line-height:1.8em;font-size:12px;'>" +
//     "当前位置：<b><span id='heatplace1'></span></b></br>热力指数：<b><span id='heatvalue1'></span></b></div></div>";
// var infoBox1 = new BMapLib.InfoBox(map, boxcontent1, {boxStyle:{width: "175px"}, closeIconMargin:"10px 10px 0 0", enableAutoPan: true, alignBottom:false});
// infoBox1.disableAutoPan();
/*
function showInfo(content, marker) {
    marker.addEventListener("click", function (e) {
        openInfoHot(content, e);
        var lng1 = marker.getPosition().lng;
        var lat1 = marker.getPosition().lat;
        var markerlocation = new BMap.Point(lng1, lat1);
        infoBox1.open(markerlocation);
        document.getElementById("location2").innerHTML = place0[0];
        document.getElementById("signalQuality").innerHTML = place0[1];
        // document.getELementsById("heatdelay").innerHTML = place0[2];
    });
}
*/
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


