/**
 * Created by Administrator on 2016/5/12.
 */
/**
 * Created by Administrator on 2016/5/12.
 */

setInterval("addpoints()",15000)
function addpoints() {
    // var map1 = new BMap.Map("document.getElementById("chart_demo")");          // ������ͼʵ��
    var map2 = new BMap.Map(document.getElementById("chart_demo_right"));
    var point1 = new BMap.Point(116.364851, 39.968124);
    map2.centerAndZoom(point1, 17);             // ��ʼ����ͼ���������ĵ�����͵�ͼ����
    map2.enableScrollWheelZoom(); // �����������



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
        alert('����ͼĿǰֻ֧����canvas֧�ֵ������,����ʹ�õ����������ʹ������ͼ����~')
    }
    //��ϸ�Ĳ���,���Բ鿴heatmap.js���ĵ� https://github.com/pa7/heatmap.js/blob/master/README.md
    //����˵������:
    /* visible ����ͼ�Ƿ���ʾ,Ĭ��Ϊtrue
     * opacity ������͸����,1-100
     * radius ����ͼ��ÿ����İ뾶��С
     * gradient  {JSON} ����ͼ�Ľ������� . gradient������ʾ
     *	{
     .2:'rgb(0, 255, 255)',
     .5:'rgb(0, 110, 255)',
     .8:'rgb(100, 0, 255)'
     }
     ���� key ��ʾ��ֵ��λ��, 0~1.
     value Ϊ��ɫֵ.
     */
    heatmapOverlay1 = new BMapLib.HeatmapOverlay({"radius": 20});
    map2.addOverlay(heatmapOverlay1);
    heatmapOverlay1.setDataSet({data: points1, max: 100});

}
//�Ƿ���ʾ����ͼ
function openHeatmap2(){
    heatmapOverlay1.show();
}
function closeHeatmap2(){
    heatmapOverlay1.hide();
}
closeHeatmap();
function setGradient(){
    /*��ʽ������ʾ:
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
//�ж�������Ƿ�֧��canvas
function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}