var map2 = new BMap.Map("allmap02", {enableMapClick: false});          // 创建地图实例
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
var point2 = new BMap.Point(sessionStorage.lng,sessionStorage.lat);
var markers = [];
var place2;
var chart;
var boxcontent2=  "<div class='mantle'>" +
    " <div class='titlet'><b><span id='location'></span></b></div> " +
    " <div class='coltext'>平均信号强度：<br><b><span id='signalPower'></span></b></div></div>";
var infoBox2 = new BMapLib.InfoBox(map2, boxcontent2, {boxStyle:{width: "150px"},closeIconMargin: "10px 10px 0 0",
    closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});


map2.centerAndZoom(point2, sessionStorage.zoom);
map2.enableInertialDragging();
map2.enableScrollWheelZoom();
map2.enableAutoResize();// 初始化地图，设置中心点坐标和地图级别
//添加控件和比例尺
map2.addControl(top_left_control);
map2.addControl(top_left_navigation);
//map2.addControl(top_right_navigation);
//获取当前视野半径
function getRadius2(){
    var diameter2=map2.getDistance(map2.getBounds().getSouthWest(),map2.getBounds().getNorthEast());
    var radius2=diameter2/2;
    return radius2;
}
 

// var b2 = new BMap.Bounds(new BMap.Point(116.362168,39.965834),new BMap.Point(116.367432,39.9709325));
// try {
//     BMapLib.AreaRestriction.setBounds(map2, b2);
// } catch (e) {
//     alert(e);
// }
//window.overlay = showoverlay2();
if (document.getElementById("powerIndoor").checked) {
    closeOutDoor33();
    //showlocqoe();
} else {
    closeInDoor22();
    //showoverlay();
}

//添加地图缩放事件
map2.addEventListener("zoomend", function () {
    if (document.getElementById("powerIndoor").checked) {
        closeOutDoor33();
    }else{
		closeInDoor22();
	}
});

//添加地图点击事件,显示室外信息
map2.addEventListener("click", function (e) {
    if (document.getElementById("powerIndoor").checked) {
        showInfo2(e.point.lng, e.point.lat, "indoor");
	   //alert("indoor"+e.point.lng+","+e.point.lat);
    } else {
        showInfo2(e.point.lng, e.point.lat, "outdoor");
    }
});

//判断浏览区是否支持canvas
var elem2 = document.createElement('canvas');
var flag2=!!(elem2.getContext && elem2.getContext('2d'));
if (!flag2) {
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
}

if(!isSupportCanvas2()){
    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
}


function closeInDoor22() {
    map2.clearOverlays();
	infoBox2 = new BMapLib.InfoBox(map2, boxcontent2, {boxStyle:{width: "150px"},closeIconMargin: "10px 10px 0 0",
    closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});
    showoverlay2("outdoor");
}
function closeOutDoor33(){
     map2.clearOverlays();
	infoBox2 = new BMapLib.InfoBox(map2, boxcontent2, {boxStyle:{width: "150px"},closeIconMargin: "10px 10px 0 0",
    closeIconUrl:'images/qoeicons/x1.png', enableAutoPan: true, alignBottom:false});
    showoverlay2("indoor");
}

function showoverlay2(lac) {
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
            "radius": getRadius2(),
            "location": lac,
            "startTime": sessionStorage.startTime,
            "endTime": sessionStorage.endTime,
            "target":"RSRP"
        }),
        success:function(jsonObj)
        {
            var hotMapPoints2 = jsonObj;
            var hotPoints = new Array();

            for (var i = 0; i < hotMapPoints2.length; i++) {
                var point2={
                    "lng":hotMapPoints2[i].longitude,
                    "lat":hotMapPoints2[i].latitude,
                    "count":145+(hotMapPoints2[i].value)
                };
                hotPoints[i]=point2;
            }
            heatmapOverlay2 = new BMapLib.HeatmapOverlay({"radius":20,
            //    "gradient":{.3:'rgb(70,176,53)',.5:'rgb(155,199,2)',.7:'rgb(255,174,0)',.8:'rgb(255,114,0)',.9:'rgb(253,48,35)'}
            });
            map2.addOverlay(heatmapOverlay2);
            heatmapOverlay2.setDataSet({data:hotPoints,max:70});
//            for (var i = 0; i < hotMapPoints2.length; i++) {
//                var marker = new BMap.Marker(new BMap.Point(hotMapPoints2[i].longitude, hotMapPoints2[i].latitude));
//                var content = [hotMapPoints2[i].location,hotMapPoints2[i].value];
//                map2.addOverlay(marker);
//                showInfo2(content, marker);
//            }
        }
    })
}

function createHeatMapOverlay() {
    heatmapOverlay2 = 0;
}
//判断浏览区是否支持canvasx
function isSupportCanvas2(){
    var elem2 = document.createElement('canvas');
    return !!(elem2.getContext && elem2.getContext('2d'));
}
/*
//地点位置qoe显示
function showlocqoe2() {
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
            "radius": getRadius2(),
            "location":sessionStorage.location,
            "startTime": sessionStorage.startTime,
            "endTime": sessionStorage.endTime,
            "target":"RSRP"
        }),


        success:function(jsonObj){
            var points2 = jsonObj;
            for (var i = 0; i < points2.length; i++) {
                var pt = new BMap.Point(points2[i].longitude, points2[i].latitude);
                var myIcon = new BMap.Icon("images/qoeicons" + chouseQoeIcon2(points2[i]), new BMap.Size(35,55));
                // myIcon.setImageUrl("./fox.gif");
                var content = [points2[i].location,points2[i].value];
                var marker2 = new BMap.Marker(pt, {icon:myIcon});  // 创建标注
                map2.addOverlay(marker2);              // 将标注添加到地图中
                showInfo2(content, marker2);
            }
        }
    })
}*/

function addClickHandler2(content, marker) {
    marker.addEventListener("click",function (e) {
        openInfo2(content, e)
    });
}
function openInfo2(content, e) {
    var p = e.target;
    var point2 = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts); //创建信息窗口对象
    map2.openInfoWindow(infoWindow, point2); //开启信息窗口

}

function chouseQoeIcon2(array) {
    if (array.signalPower >= -65) {
        return "/gaoqoe1.png";
    } else if (array.signalPower < -65 && array.signalPower >= -75) {
        return "/zhonggaoqoe1.png";
    } else if (array.signalPower < -75 && array.signalPower >= -85) {
        return "/zhongqoe1.png";
    } else if (array.signalPower < -85 && array.signalPower >= -95) {
        return "/zhongdiqoe1.png";
    } else {
        return "/diqoe1.png";
    }
}


/*
function showInfo2(content, marker) {
    marker.addEventListener("click", function (e) {
        openInfoHot2(content, e);
        var lng1 = marker.getPosition().lng;
        var lat1 = marker.getPosition().lat;
        var markerlocation1 = new BMap.Point(lng1, lat1);
        infoBox2.open(markerlocation1);
        document.getElementById("location").innerHTML = place2[0];
        document.getElementById("signalPower").innerHTML = place2[1];
        // document.getELementsById("heatdelay").innerHTML = place0[2];
    });
}
*/

//获取地图比例尺
function getMapScale() {
    var scales = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 500000, 1000000, 2000000];
    var zoom = map.getZoom();
    var scale = scales[19 - zoom];
    return scale;
}

function showInfo2(lng, lat, lac) {
    $.ajax({
        type: "POST",
        url: REST_URL + "/1.0/signals/",
        contentType: "application/json;charsetj=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "operatorId":sessionStorage.operatorId,
            "standard":"13",
            "longitude":lng,
            "latitude":lat,
            "radius":  getMapScale() / 5,
            "location": lac,
            "startTime": sessionStorage.startTime,
            "endTime": sessionStorage.endTime,
            "target":"RSRP"
        }),
        success: function (jsonObj) {
            if (jsonObj) {				
                var points = jsonObj;
                var markerlocation1 = new BMap.Point(lng, lat);
                infoBox2.open(markerlocation1);
				
				var lacCh = "室外";
				if(lac == "indoor"){
					lacCh = "室内";
				}
                document.getElementById("location").innerHTML = lacCh;
			    document.getElementById("signalPower").innerHTML = getAvr(points) + "dbm";
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

function openInfoHot2(content, e) {
    var opts = {
        width: 0,
        height: 0,
        title: 0,
        enableMessage: false
    };
    var p = e.target;
    var point2 = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content, opts);
    // infoWindow.disableAutoPan();
    place2 = infoWindow.getContent();
}

