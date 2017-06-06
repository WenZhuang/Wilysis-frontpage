$(function () {
    $('#container').highcharts({
        credits: {
            enabled:false,
        },
        allowDrillToNode: false,
        alternateStartingDirection: true,
        plotOptions: {
            series: {
                dataLabels: {
                    borderRadius: 5,
                    size:10,
                    shape: 'callout',
                    enabled: true
                }
            }
        },

        series: [{
            dataLabels: {
                enabled: true
            },
            type: "treemap",
            layoutAlgorithm: 'stripes',
            alternateStartingDirection: true,
            animation: false,
            levels: [{
                level: 1,
                borderWidth: '1px',
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'center',
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                }
            }],
            data: [
                {name: '视频分析',
                    id:'A'},
                {
                    name: '初始化时间: ' + '1.23' + 'ms',
                    parent: 'A',
                    value: 1000,
                    color: "#EBEDA8",
                }, {
                    name: 'MOS值: ' + '23.4',
                    parent: 'A',
                    value: 1000,
                    color: "#B8E5ED",
                },{
                    name: '缓冲时间: ' + '3.4' + 'ms',
                    value: 1000,
                    parent: 'A',
                    color: "#EDC0EB",
                }, {
                    name: '缓冲频率: '+ '200' + 'hz',
                    parent: 'A',
                    value: 1000,
                    color: "#BDB4ED",
                }, {
                    name: 'TCP吞吐量: ' + '200',
                    parent: 'A',
                    value: 1000,
                }]
        }],
        title: {
            text: '',
            style: {
                fontSize:'16px',
                fontWeight: 'bold'
            },
            align: 'left'
        },
        legend: {
            enabled: true
        },
        exporting: {
            enabled: false
        },
        tooltip: {
            animation: false,
            shared: true,
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td style="color: {series.color}"> </td>' +
            '<td style="text-align: right"></b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 2
        }
    });
});