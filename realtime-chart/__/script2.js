var t = -1
var n = 10,
duration = 1000
var last_value;
var maxValue = 10
var data = []/* d3.range(n).map(next) */

const options = {
  headRadius: 7,
  circleRadius: 3,
  showOnlyChangedValue: true,
  chart: {

  }
}


function next(change, w){
  var x = w || randomIntFromInterval(0, maxValue)
  // var data = await getData()
  // d3.select('#chart .value').html('$' + data.last.toFixed(1))
  var a = new Date().toLocaleString().split(',')[1].trim()
  return {time: ++t, value: x, date: a, last_change: change}
}

var margin = {
  top: 100,
  right: 0,
  bottom: 40,
  left: 10
},


width = 700 - margin.right - margin.left,
height = 400 - margin.top - margin.bottom;

var x = d3.scaleLinear()
  .domain([t - n + 1, t])
  .range([0, width]);

var y = d3.scaleTime()
  .domain([0, maxValue])
  .range([height, 0])


var smoothLine = d3.line().curve(d3.curveLinear)
  .x(function(d){ return x(d.time); })
  .y(function(d){ return y(d.value); });
var lineArea = d3.area().curve(d3.curveLinear)
  .x(function(d){ return x(d.time); })
  .y0(height)
  .y1(function(d){ return y(d.value); });

var svg = d3.select("#chart .svg-container").append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .style("margin-left", -margin.left + "px")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr('class', 'graph')

var g = svg.append('g').attr('class', 'graph-container')

svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width/*  - 70 */)
  .attr("height", height);


// gradient
{

  const grad = svg.select("defs").append("linearGradient")
    .attr("id", "grad")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "100%")
    .attr("y2", "0%");

  grad.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "rgb(10, 10, 10)")
    .style("stop-opacity", "0.3")
  grad.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "rgba(197, 118, 37, 0.1)")
    .style("stop-opacity", "0")

}


// var xAxis = d3.axisBottom().scale(x);

// var axis = svg.append("g")
//   .attr("class", "x axis")
//   .attr("transform", "translate(0," + height + ")")
//   .call(x.axis=xAxis);


// setTimeout(() => {
//   d3.selectAll(".graph")
//   .transition()
//   .duration(200)
//   .attr("transform", "translate(-" + (width  / 2) + "," + margin.top + ")");
// }, 3000)

  
var path = g/* .append("g") */
  // .attr("clip-path", "url(#clip)")
  .append("path")
  .data([data])
  .attr("class", "smoothline")
  // .attr("fill", "url(#grad)");
  
var pathArea = g/* .append("g") */
  // .attr("clip-path", "url(#clip)")
  .append("path")
  .data([data])
  .attr("class", "area")
  .attr("fill", "url(#grad)");





var headSvg = d3.select("#chart .svg-container").append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .style("margin-left", -margin.left + "px")
  .style("position", "absolute")
  .style("top", 0)
  .style("left", 0)
  .style("overflow", "visible")
  .style("z-index", "99999")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr('class', 'graph')

var head, circles, texts, times;


var renderObj = {
  head: function() {
    head = headSvg.append('circle').raise()
    .attr('r', options.headRadius)
    .attr("class", "circle2")
    .attr('cx',(function(d){ return width; }))
    .attr('cy',(function(d){ return y(data[data.length - 1].value); }))
  },
  circles: function() {
    
    circles = g.selectAll('.circle')
    circles.exit().remove();

    circles.data(data).enter().append('circle')
      .merge(circles)
      .attr('r', options.circleRadius)
      .attr('class', 'circle')
      .attr('cx',(function(d){ return x(d.time); }))
      .attr('cy',(function(d){ return y(d.value); }))     

  },
  path: function() {
    path.attr("d", smoothLine)
    pathArea.attr("d", lineArea)
  },
  text: function() {
    texts = g.selectAll('.circle-text')
    texts.exit().remove();

    texts.data(data).enter().append('text')
      .merge(texts)
      .text(d => {
        let v = d.last_change, z = v >= 0 ? '+$' + v : '-$' + Math.abs(v)

        if (options.showOnlyChangedValue) {
          const x = last_value
          last_value = v
          return v !== x ? z : ''
        } 
          
        return z
      })
      .style('fill', '#fff')
      .attr('class', 'circle-text')
      .attr('x',(d => x(d.time) ))
      .attr('y',(d => y(d.value) - 15 ))     
      .attr('text-anchor', 'middle')

  }
}

var rerenderObj = {
  head: function() {
    head.raise().transition(d3.easeLinear)
    .duration(duration)
    .attr("cy", y(data[data.length - 1].value))
  },
  circles: function() {
    renderObj.circles()
  },
  path: function(cb) {
    renderObj.path()
    // cb()

    g.attr('transform', null)
      .transition(d3.easeLinear)
      .duration(duration)
      .attr("transform", "translate(" + x(t-n) + ")")
      .on('end', cb)
  },
  axisX: function() {
    axis.transition(d3.easeLinear)
    .duration(duration)
    .call(x.axis);
  },
  time: function() {
    
    times = g.selectAll('.time')
    times.exit().remove();

    times.data(data).enter().append('text')
      .merge(times)
      .style('fill', '#fff')
      .attr('class', 'time')
      .attr('x',(d => x(d.time) ))
      .attr('y',(d => y(-1) ))     
      .text(d => d.date)
      .attr('text-anchor', 'middle')
  },
  text: function() {
    renderObj.text()
  }
}



render();
tick();

function render() {

  if (!data.length > 0) return
  
  renderObj.circles()
  renderObj.head()
  renderObj.path()
  renderObj.text()

}

async function tick() {

  var d = await getData()
  d3.select('#chart .value').html('$' + d.last.toFixed(1))

  // console.log(t - n + 2 , t)

  // update the domains
  x.domain([t - n + 2 , t]);
  // push the accumulated count onto the back, and reset the count
  data.push(next(d.last_change, d.last_change + (maxValue / 2)));
  
  if (!head) {
    render()
  }


  rerenderObj.head()
  rerenderObj.circles()
  rerenderObj.time()
  rerenderObj.text()
  // rerenderObj.axisX()


  rerenderObj.path(tick)

  // pop the old data point off the front
  if (data.length > 50) data.shift();

}









// setInterval(() => {
//   fetch('https://api.bitaps.com/market/v1/ticker/btcusd')
//   .then(res => {
//     return res.json()
//   })
//   .then(data => {
//     d3.select('#chart .value').html('$' + data.data.last.toFixed(1))
//   })
//   .catch(e => {
//     console.log(e)
//   })
// }, 1000)


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
      console.log(e)
    })
  })
}


function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}