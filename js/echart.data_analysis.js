//var map = new BMap.Map("allmap", {enableMapClick: false});          // 创建地图实例


function getTime(str){
    var date = new Date(str);
    return date.getTime() + 8*3600*1000;
}


function showDelay(lng,lat,radius){
    $.ajax({
        type:"POST",
        url: "http://101.200.215.79:38080/wilysis/1.0/webLatencies/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":sessionStorage.operatorId,
            "standard":"13",
            "longitude":lng,
            "latitude":lat,
            "radius":radius,
            "location":sessionStorage.location,
            "startTime":sessionStorage.startTime,
            "endTime":sessionStorage.endTime,
            "target":"operator"
        }),
        success: function(jsonObj) {
            var lng1 = lng;
            var lat1 = lat;
            var chart = {
                type: 'scatter',
//                events: 
//                {
//                    selection: function (event) {
//                        var min = event.xAxis[0].min;
//                        var max = event.xAxis[0].max;
//                        chart.xAxis[0].setExtremes(Math.ceil(min), Math.ceil(max));
//                        return false;
//                    }
//                },
                
                zoomType: 'xy',
                panning: true,
                panKey: 'shift',
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
		max:6000,
		min:0,
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
                    text:'Time(ms)',
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

function showSpeeds(lng,lat,radius){
    $.ajax({
        type:"POST",
        url: "http://101.200.215.79:38080/wilysis/1.0/transferSpeeds/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":sessionStorage.operatorId,
            "standard":"13",
            "longitude":lng,
            "latitude":lat,
            "radius":radius,
            "location":sessionStorage.location,
            "startTime":sessionStorage.startTime,
            "endTime":sessionStorage.endTime

        }),
        success: function(jsonObj) {
            $('#container_showSpeeds').highcharts({
                colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                credits:{
                    enabled:false
                },
                chart: {
                    zoomType: 'xy',
                    panning: true,
                    panKey: 'shift',
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
                        text:'Mbps',
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

function showVideoQoe(lng,lat,radius) {
    $.ajax({
        type:"POST",
        url: "http://101.200.215.79:38080/wilysis/1.0/videoExperiences/",
        contentType:"application/json;charset=utf-8",
        dataType:"json",
        data:JSON.stringify({
            "operatorId":sessionStorage.operatorId,
            "standard":"13",
            "longitude":lng,
            "latitude":lat,
            "radius":radius,
            "location":sessionStorage.location,
            "startTime":sessionStorage.startTime,
            "endTime":sessionStorage.endTime,
            "target":"video"
        }),


        success:function(jsonObj){
            var data = jsonObj[jsonObj.length-1];
            $("#mos").html(data.mos);
            $("#bufferTime").html((data.bufferTime).toFixed(2) + " s");
            $("#bufferFrequency").html((data.bufferFrequency).toFixed(2) + " HZ");
            $("#throughput").html(getAvr((data.throughputs)).toFixed(2) + "kbps");
            $("#loadTime").html((data.loadTime).toFixed(2 ) + " s");
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



//调用函数
//showDelay(116.364549,39.968112, 2000.0);
//showSpeeds(116.364549,39.968112, 2000.0);
//showVideoQoe(116.364549,39.968112, 2000.0);
showDelay(sessionStorage.lng,sessionStorage.lat, 2000.0);
showSpeeds(sessionStorage.lng,sessionStorage.lat, 2000.0);
showVideoQoe(sessionStorage.lng,sessionStorage.lat, 2000.0);
//showDelay(2000.0);
//showSpeeds(2000.0);
//showVideoQoe(2000.0);