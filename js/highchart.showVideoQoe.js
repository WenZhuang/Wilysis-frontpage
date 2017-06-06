function showVideoQoe(lng=116.364549, lat=39.968112, radius=20.0) {
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

function getEndTime(){
    var now = new Date();
    var endTime = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + (now.getDate()) + " "
                + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    return endTime;
}

function getStartTime(){
    var time = new Date().getTime() - 2592000000;
    var date = new Date(time);
    var startTime = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + (date.getDate()) + " "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return startTime;  
}