// 1. ширина столбца + (сss 7 строка)
// 2. цвет столбца + (css 2 строка)
// 3. шаг + (js 44 строка)
// 4. сужался и расширялся в зависимости от кол-ва столбцов +
// 6. процент графика от макс значения столбцов + (js 45 строка)
// 7. высота и ширина графика + (css 11, 12 строка)
// 8. адаптивная ширина графика + 

// данные
var data = [
    1, 1, 11, 16, 11, 17, 16, 20, 1, 1, 11, 16, 11, 17, 16, 20, 1, 1, 11, 16, 11, 17, 16, 20, 16, 20
];

// подписи
var labels = [
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
    '2 мес. 2013 г.',
]

var step = 5;                   // шаг
var highModifier = 0.55;        // коеффициент высоты

new Chartist.Bar('.ct-chart', {
    labels: labels,
    series: data
    }, 
    {
        distributeSeries: true,
        width: '100%',
        high: Math.max.apply(null, data) / highModifier,
        low: 0,
        seriesBarDistance: 12,
        axisY: {
            type: Chartist.FixedScaleAxis,
            ticks: steps(),
            low: 0
        },
    }
);

function steps() {
    var x = [0];
    while (x[x.length - 1] <= Math.max.apply(null, data) / highModifier) {
        x.push(x[x.length - 1] + step)
    }
    return x;
}

setTimeout(function() {
    document.querySelector('.title').classList.remove('hide')
}, 50)
