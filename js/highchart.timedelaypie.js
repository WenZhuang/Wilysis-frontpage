/**
 * Created by wangyu on 16/5/17.
 */
$(function () {
    $('#container-timedelay-pie').highcharts({
        credits:{
            enabled:false
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderColor: '#346691',
            plotBorderWidth: 2,
            plotShadow: false
        },
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        title: {
            text: 'DELAYTIME<br>SHARES',
            align: 'center',
            verticalAlign: 'middle',
            y: 0
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                // dataLabels: {
                //     enabled: true,
                //     distance: -50,
                //     style: {
                //         fontWeight: 'bold',
                //         color: 'white',
                //         textShadow: '0px 1px 2px black'
                // }
                // }
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}'
                },
                startAngle: 0,
                endAngle: 360,
                center: ['50%', '50%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '50%',
            data: [
                ['大于100ms',   10.38],
                ['大于50ms',       56.33],
                ['等于50ms', 24.03],
                ['小于50ms',    4.77],
                ['小于10ms',     0.91],
                {
                    name: 'Proprietary or Undetectable',
                    y: 0.2,
                    dataLabels: {
                        enabled: false
                    }
                }
            ]
        }]
    });
});