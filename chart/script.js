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


function labelPlugin() {
    return function labelPlugin(chart) {
        chart.on('draw', function(data) {
          var barHorizontalCenter, barVerticalCenter, label, value, rect;
          if (data.type === "bar") {
            barHorizontalCenter = data.x1 + (data.element.width() * .5);
            barVerticalCenter = data.y1 + (data.element.height() * -1) - 10;
            value = data.element.attr('ct:value');
            if (value !== '0') {

                rect = new Chartist.Svg('rect');
                rect.addClass('ct-bar-label-container');
                var cHeight = 15;
                var cWidth = 20;
                var xOffset = cWidth / 2;
                var radius = 3;
                var barOffset =  (data.element.height() * -1) + 10;
                var barOffset2 = data.y1 + (data.element.height() * -1) - 15;
                var cy1 = data.element.height() > cHeight ? data.y1 + barOffset : barOffset2;
                var cy2 = cy1 + cHeight;
                rect.attr({
                    x: data.x1 - xOffset,
                    y: cy1,
                    height: cHeight,
                    width: cWidth,
                    rx: radius,
                    ry: radius
                })

                label = new Chartist.Svg('text');
                label.text(value);
                label.addClass("ct-bar-label");
                label.attr({
                    x: barHorizontalCenter,
                    y: cy1 + cHeight * .5 + 3,
                    'text-anchor': 'middle'
                });

                data.group.append(rect);
                return data.group.append(label);
            }
        }
        });
    }
}


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
        plugins: [
            labelPlugin()
        ]
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
