/**
 * Created by wangyu on 16/5/20.
 */
$(function () {
    $('#gradeqoe').highcharts({
        series: [{
            type: "treemap",
            layoutAlgorithm: 'stripes',
            alternateStartingDirection: true,
            levels: [{
                level: 1,
                layoutAlgorithm: 'sliceAndDice',
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        fontSize: '15px',
                        fontWeight: 'bold'
                    }
                }
            }],
            data: [{
                id: 'A',
                name: '高QOE',
                color: "#EC2500"
            }, {
                id: 'B',
                name: '中高QOE',
                color: "#ECE100"
            }, {
                id: 'O',
                name: '中QOE',
                color: '#EC9800'
            }, {
                id:'F',
                name: '中低QOE',
                color: '#000'
            }, {
                id:'U',
                name: '低QOE',
                color: '#9EDE00'
            }, {
                name: '80~100',
                parent: 'A',
                value: 4
            }, {
                name: '60~79',
                parent: 'B',
                value: 4
            }, {
                name: '40~59',
                parent: 'O',
                value: 10
            }, {
                name: '20~49',
                parent: 'F',
                value: 1
            }, {
                name: '0~19',
                parent: 'U',
                value: 1
            }, {
                name: 'Rick',
                parent: 'O',
                value: 3
            }]
        }],
        title: {
            text: 'Fruit consumption'
        }
    });
});