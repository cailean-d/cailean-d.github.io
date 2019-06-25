const chartTicks = 10
const pathOffsetForDots = 30
const pathOffsetForHead = 100
const pathOffsetForTime = 24
const chartMoveDuration = 200
const xChartOffset = 30
const yChartOffset = 30
const yTimeOffset = 30
const nextStepsToMoveChart = chartTicks / 2
const maxDataLendth = 20
const duration = 1000
const headRadius = 6
const circleRadius = 3
const showOnlyChangedValueText = true
const dotTextOffset = -15
const areaBottomOverflowOffset = 50
const areaBottomOverflow = 100 + areaBottomOverflowOffset
const receiveDataTimer = 3000
const scaleDuration = 500
const autoScaleThreshold = 0.3
const autoScale = true

const margin = {
  top: 100,
  right: 0,
  bottom: 30,
  left: 0
}

const width = 700 - margin.right - margin.left
const height = 400 - margin.top - margin.bottom

let chartClipPath, dotClipPath,headClipPath, chartContainer,
timeClipPath, svg, timeSvg, last_value, head, circles, texts, times, path, pathArea
let t = -1, needStepsToMoveChart = chartTicks, chartOffsetLeft = 0, valuesRange = [0, 0], 
isFakeNodeRendered = false

let data = [
  // {time: ++t, value: randomIntFromInterval(...valuesRange), date: getCurrentTime(), last_change: 5},
  // {time: ++t, value: randomIntFromInterval(...valuesRange), date: getCurrentTime(), last_change: 1},
  // {time: ++t, value: randomIntFromInterval(...valuesRange), date: getCurrentTime(), last_change: 3},
  // {time: ++t, value: randomIntFromInterval(...valuesRange), date: getCurrentTime(), last_change: 6},
  // {time: ++t, value: randomIntFromInterval(...valuesRange), date: getCurrentTime(), last_change: 6},
]

let x = d3.scaleLinear().domain([0, chartTicks]).range([xChartOffset, width]);
let y = d3.scaleLinear().domain(valuesRange).range([height - areaBottomOverflow, yChartOffset])

let smoothLine = d3.line().curve(d3.curveLinear).x(d => x(d.time)).y(d => y(d.value))
let lineArea = d3.area().curve(d3.curveLinear).x(d => x(d.time)).y0(height).y1(d => y(d.value))

// svg
{
  const viewBox = `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
  const marginLeft = -margin.left + "px"
  const transform = "translate(" + margin.left + "," + margin.top + ")"

  svg = d3.select("#chart .svg-container").append("svg")
    .attr("viewBox", viewBox)
    .style("margin-left", marginLeft)
    .append("g")
    .attr("transform", transform)

  timeSvg = d3.select("#chart .svg-container").append("svg")
    .attr("viewBox", viewBox)
    .style("margin-left", marginLeft)
    .style("position", "absolute")
    .style("top", yTimeOffset + 'px')
    .style("left", 0)
    .append("g")
    .attr("transform", transform)
    .append('g').attr('class', 'chart-container')
}

// clip paths
{

  const xt = t > 0 ? t : 0

  chartClipPath = svg.append("defs").append("clipPath")
    .attr("id", "chart_clip")
    .append("rect")
    .attr("width", x(xt))
    .attr("height", height - areaBottomOverflowOffset);

  dotClipPath = svg.select("defs").append("clipPath")
    .attr("id", "dot_clip")
    .append("rect")
    .attr("width", x(xt) - pathOffsetForDots)
    .attr("height", height)

  headClipPath = svg.select("defs").append("clipPath")
    .attr("id", "head_clip")
    .append("rect")
    .attr("width", x(xt) + pathOffsetForHead)
    .attr("height", height)

  timeClipPath = timeSvg.append("defs").append("clipPath")
    .attr("id", "time_clip")
    .append("rect")
    .attr("width", x(xt) - pathOffsetForTime)
    .attr("height", height + yTimeOffset )

}

// gradient
{

  const grad = svg.select("defs").append("linearGradient")
    .attr("id", "grad")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "80%")
    .attr("y2", "0%");

  grad.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "rgb(0, 0, 0)")
    .style("stop-opacity", "0")
  grad.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "rgb(197, 118, 37)")
    .style("stop-opacity", "0.1")

}

// chart paths
{

  chartContainer = svg.append('g').attr('class', 'chart-container')
  
  path = chartContainer.append("path")
    .attr("class", "smoothline")
    .attr('clip-path', 'url(#chart_clip)')
  
  pathArea = chartContainer.append("path")
    .attr("class", "area")
    .attr('clip-path', 'url(#chart_clip)')
    .attr('fill', 'url(#grad)')

}

let renderObj = {
  head: function() {

    if (head) {
      head.raise()
        .transition(d3.easeLinear)
        .duration(duration)
        .attr("cx", x(data[data.length - 1].time))
        .attr("cy", y(data[data.length - 1].value))
      return
    } 

    head = chartContainer.append('circle').raise()
      .attr('r', headRadius)
      .attr("class", "circle2")
      .attr('cx',(d => x(t)))
      .attr('cy',(d => y(data[data.length - 1].value)))
      .attr('clip-path', 'url(#head_clip)')
  },
  circles: function() {
    
    circles = chartContainer.selectAll('.circle')
    circles.exit().remove();

    circles.data(data).enter().append('circle')
      .merge(circles)
      .attr('r', circleRadius)
      .attr('class', 'circle')
      .attr('cx',(d => x(d.time)))
      .attr('cy',(d => y(d.value)))     
      .attr('clip-path', 'url(#dot_clip)')

  },
  path: function() {
    path.data([data]).attr("d", smoothLine)
    pathArea.data([data]).attr("d", lineArea)
  },
  text: function() {
    texts = chartContainer.selectAll('.circle-text')
    texts.exit().remove();

    texts.data(data).enter().append('text')
      .merge(texts)
      .text(d => {
        let v = d.last_change, z = v >= 0 ? '+$' + v : '-$' + Math.abs(v)

        if (showOnlyChangedValueText) {
          const x = last_value
          last_value = v
          return v !== x ? z : ''
        } 
          
        return z
      })
      .style('fill', '#fff')
      .attr('class', 'circle-text')
      .attr('x',(d => x(d.time) ))
      .attr('y',(d => y(d.value) + dotTextOffset ))     
      .attr('text-anchor', 'middle')
      .attr('clip-path', 'url(#dot_clip)')

  },
  time: function() {
    
    times = timeSvg.selectAll('.time')
    times.exit().remove();

    times.data(data).enter().append('text')
      .merge(times)
      .attr('class', 'time')
      .attr('x',(d => x(d.time) ))
      .attr('y', height)     
      .text(d => d.date)
      .attr('text-anchor', 'middle')
      .attr('clip-path', 'url(#time_clip)')
  },
}

function getData() {
  return new Promise((resolve, reject) => {
    fetch('https://api.bitaps.com/market/v1/ticker/btcusd')
    .then(res => {
      return res.json()
    })
    .then(data => {
      resolve(data.data)
    })
    .catch(e => {
      reject(e)
    })
  })
}

function getCurrentTime() {
  return new Date().toLocaleString().split(',')[1].trim()
}

function moveChartToLeft() {

  const a =  t / needStepsToMoveChart
  const b = needStepsToMoveChart == chartTicks ? a : a - 1;

  chartOffsetLeft = x(b * (chartTicks / 2)) - xChartOffset

  return new Promise((resolve, reject) => {
    d3.selectAll("#chart .chart-container").transition(d3.easeLinear)
    .duration(chartMoveDuration)
    .attr("transform", "translate(-" + chartOffsetLeft + ")")
    .on('end', function() {
      needStepsToMoveChart = nextStepsToMoveChart
      resolve()
    })
  })
}

function addFakeNode() {
  data.unshift({time: -1, value: data[0].value, date: "", last_change: 0, fake: true})
}

function changeClipPath(width, instant, newDuration) {
  return new Promise((resolve, reject) => {
    chartClipPath.transition()
    .duration(instant ? 0 : newDuration || duration)
    .attr('width', width)
    .on('start', function() {
      timeClipPath.attr('width', width - pathOffsetForTime)
      dotClipPath.attr('width', width - pathOffsetForDots)
    })
    .on('end', resolve)

  headClipPath.transition()
    .duration(instant ? 0 : newDuration || duration)
    .attr('width', width + pathOffsetForHead)
  })

}

function scaleChart(xRange, yRange) {
  return new Promise((resolve, reject) => {

    x.domain(xRange)
    y.domain(yRange)

    if (!(data.length > 2)) resolve()

    path.transition()
      .duration(scaleDuration)
      .attrTween('d', function (d) {
        const previous = d3.select(this).attr('d')
        const current = smoothLine(d)
        return d3.interpolatePath(previous, current)
      })

    pathArea.transition()
      .duration(scaleDuration)
      .attrTween('d', function (d) {
        const previous = d3.select(this).attr('d')
        const current = lineArea(d)
        return d3.interpolatePath(previous, current)
      })
  
    head.raise()
      .transition()
      .duration(scaleDuration)
      .attr("cx", x(data[data.length - 1].time))
      .attr("cy", y(data[data.length - 1].value))
      .on('end', resolve)
      
    chartContainer.selectAll('.circle')
      .transition()
      .duration(scaleDuration)
      .attr('cx',(d => x(d.time)))
      .attr('cy',(d => y(d.value)))     
  
    chartContainer.selectAll('.circle-text')
      .transition()
      .duration(scaleDuration)
      .attr('x',(d => x(d.time) ))
      .attr('y',(d => y(d.value) + dotTextOffset ))
  
    timeSvg.selectAll('.time')
      .transition()
      .duration(scaleDuration)
      .attr('x',(d => x(d.time) ))
      .attr('y', height)     
  
    changeClipPath(x(t), null, scaleDuration)
  })
}

function setValue(value) {
  d3.select('#chart .value').html('$' + value)
}

async function preScaleForNewValue(d) {

  if (!data.length > 0) return

  const minCondition = d.value < y.domain()[0] || y.domain()[0] == 0
  const maxCondition = d.value > y.domain()[1] || y.domain()[1] == 0

  // if new value less than chart bottom or more than chart top
  if (minCondition || maxCondition) {

    let newMax = y.domain()[1]
    let newMin = y.domain()[0]
    let maxRatio = 0
    let minRatio = 0

    if (minCondition) {
      newMin = d.value 
      minRatio = .1
    } 

    if (maxCondition) {
      newMax = d.value
      maxRatio = .1
    }

    const diff = newMax - newMin
    await scaleChart(x.domain(), [newMin - diff * minRatio, newMax + diff * maxRatio])
  } 
}

async function autoScaleChart() {

  if (!data.length > 0 && !autoScale) return

  const visibleElementCount = t % needStepsToMoveChart + (needStepsToMoveChart == chartTicks ? 0 : 5)

  // get elements in viewport + 1 from left
  const visibleElements = data.slice(-visibleElementCount - 2)
  const max = d3.max(visibleElements, d => d.value)
  const min = d3.min(visibleElements, d => d.value)
  let diff = max - min
  const oldDiff = y.domain()[1] - y.domain()[0]
  const thresholdDiff =  oldDiff * autoScaleThreshold
  const offsetMin = min - diff * .1
  const offsetMax =  max + diff * .1
  diff = offsetMax - offsetMin
  
  // if diff between new and old value more than thrashold
  if (Math.abs(oldDiff - diff) > thresholdDiff) {
    deleteExtraNodes(visibleElements.length)
    await scaleChart(x.domain(), [offsetMin, offsetMax])
  }

}

function addData(d) {

  if (data.length > maxDataLendth) {
    data.shift();
  }

  data.push({time: ++t, value: d.last, date: getCurrentTime(), last_change: d.last_change})
 
}

function deleteExtraNodes(elCount) {
  data.splice(0, data.length - elCount)
}

async function render() {

  if (!data.length > 0) return

  if (!data[0].fake && !isFakeNodeRendered) {
    addFakeNode()
    isFakeNodeRendered = true
  }
  
  renderObj.circles()
  renderObj.head()
  renderObj.path()
  renderObj.text()
  renderObj.time()

  await changeClipPath(x(t))

}

async function tick() {

  await preScaleForNewValue(data[data.length - 1])
  await render()

  // move chart to left if its at right border
  if (t >= chartTicks && t % needStepsToMoveChart == 0) {
    await moveChartToLeft()
  } 
    
  await autoScaleChart()
  await sleep(100)

  tick()

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

// setTimeout(() => {
//   scaleChart([0, 5], [8750, 8830])
// }, 3000)





// render();
tick();


setInterval(async () => {

  const d = await getData()
  addData(d)
  setValue(d.last.toFixed(2))

}, receiveDataTimer)


document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    d3.select('.axis').style('display', 'block')
  } else {
    


    const a =  t / needStepsToMoveChart
    const b = needStepsToMoveChart == chartTicks ? a : a - 1;
  
    const w = x(b * (chartTicks / 2)) - xChartOffset

    const qtw = /translate\(\s*-?(?<x>\d+),\s*-?\d+\)/m

    const q = d3.select("#chart .chart-container").attr("transform") || 'translate(0, 0)'

    const zx = Math.abs(w - qtw.exec(q).groups['x']) < width


    while(!zx) { }

    d3.select('.axis').style('display', 'none')

    // console.log(Math.abs(w - qtw.exec(q).groups['x']) < width)


  }
})
