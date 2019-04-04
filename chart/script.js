// подпись
var label = '2 мес.\n2013 г.';

// данные
var data = [
    1, 1, 11, 16, 11, 17, 16, 20, 1, 1, 11, 16, 11, 17, 16, 20, 1, 1, 11, 16, 11, 17, 16, 20, 16, 20
]

var width = 1200;       // ширина графика
var height = 500;       // высота графика
var step = 5;           // шаг
var high = 0.55;        // коеффициент высоты

new Chartist.Bar('.ct-chart', {
    labels: labels(),
    series: data
    }, 
{
    distributeSeries: true,
    width: width,
    height: height,
    high: Math.max.apply(null, data) / high,
    low: 0,
    seriesBarDistance: 12,
    axisY: {
        type: Chartist.FixedScaleAxis,
        ticks: steps(),
        low: 0
    },
});

function labels() {
    var labels = [];
    for(let i = 0; i < data.length; i++){
        labels.push(label)
    }
    return labels;
}

function steps() {
    var x = [0];
    while (x[x.length - 1] <= Math.max.apply(null, data) / high) {
        x.push(x[x.length - 1] + step)
    }
    return x;
}
