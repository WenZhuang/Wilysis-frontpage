/**
 * Created by Administrator on 2016/5/12.
 */
/**
 * Created by Administrator on 2016/5/12.
 */

setInterval("addpoints()",15000)
function addpoints() {
    // var map1 = new BMap.Map("document.getElementById("chart_demo")");          // 创建地图实例
    var map2 = new BMap.Map(document.getElementById("chart_demo_right"));
    var point1 = new BMap.Point(116.364851, 39.968124);
    map2.centerAndZoom(point1, 17);             // 初始化地图，设置中心点坐标和地图级别
    map2.enableScrollWheelZoom(); // 允许滚轮缩放



    var val=Math.random()*100;
    var points1 = [
        {"lng": 116.361545, "lat": 39.97053, "count": val},
        {"lng": 116.361545, "lat": 39.97053, "count": val},
        {"lng": 116.365929, "lat": 39.969991, "count": val},
        {"lng": 116.367043, "lat": 39.967295, "count": val},
        {"lng": 116.366558, "lat": 39.967309, "count": val},
        {"lng": 116.364097, "lat": 39.966631, "count": val},
        {"lng": 116.425867, "lat": 39.918989, "count": 1000}];

    if (!isSupportCanvas()) {
        alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
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
    heatmapOverlay1 = new BMapLib.HeatmapOverlay({"radius": 20});
    map2.addOverlay(heatmapOverlay1);
    heatmapOverlay1.setDataSet({data: points1, max: 100});

}
//是否显示热力图
function openHeatmap2(){
    heatmapOverlay1.show();
}
function closeHeatmap2(){
    heatmapOverlay1.hide();
}
closeHeatmap();
function setGradient(){
    /*格式如下所示:
     {
     0:'rgb(102, 255, 0)',
     .5:'rgb(255, 170, 0)',
     1:'rgb(255, 0, 0)'
     }*/
    var gradient = {};
    var colors = document.querySelectorAll("input[type='color']");
    colors = [].slice.call(colors,0);
    colors.forEach(function(ele){
        gradient[ele.getAttribute("data-key")] = ele.value;
    });
    heatmapOverlay1.setOptions({"gradient":gradient});
}
//判断浏览区是否支持canvas
function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}