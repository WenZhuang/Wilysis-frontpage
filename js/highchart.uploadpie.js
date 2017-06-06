/**
 * Created by wangyu on 16/5/17.
 */
$(function () {
    $('#container-upload-pie').highcharts({
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
            text: 'UPLOAD<br>SHARES',
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
                ['高速',   10.38],
                ['中速',       56.33],
                ['低速', 24.03],
                ['中低速',    4.77],
                ['中高速',     0.91],
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