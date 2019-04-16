Vue.component('fuel-gauge', {
    template: '<span ref="gauge"></span>',
    props: ['size', 'value'],
    data: () => ({
        body: null,
        config: {
            size: 200,
            label: '',
            min: 0,
            max: 100,
            unit: '%',
            transitionDuration: 500,
            majorTicks: 6,
            minorTicks: 1,
            showPointer: true,
            showValue: true,
            valueFontSize: 16,
            greenColor: "#72A544",
            yellowColor: "#FFBE00",
            redColor: "#C81922",
            greyColor: "#D5D3D9",
            redZone: {
                from: 0,
                to: 20
            },
            yellowZone: {
                from: 20,
                to: 60
            },
            greenZone: {
                from: 60,
                to: 100
            }
        },
    }),
    created() {
        this.configure();
    },
    mounted() {
        this.initialize();
    },
    watch: {
        value(val) {
            this.redraw(val);
        }
    },
    methods: {
        initialize() {
            this.render(this.value || 0.1);
            setInterval(this.updateGauges, 2000);
        },
        updateGauges(startNumber) {
            var number = Math.random() * 100;
            var theNumber = Math.round(number);
            this.redraw(theNumber);
        },  
        valueToDegrees(value) {
            return value / this.config.range * 180 - (this.config.min / this.config.range * 180);
        },
        valueToRadians(value) {
            return this.valueToDegrees(value) * Math.PI / 180;
        },
        valueToPoint(value, factor) {
            return {
              x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
              y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value))
            };
        },
        configure() {
            var zoneRange;
 
            this.config.size = this.size || this.config.size;

            //todo: add checks for valid values
        
            this.config.radius = this.config.size / 2;
            this.config.cx = this.config.size / 2;
            this.config.cy = this.config.size / 2;
        
            this.config.I = 0;
            this.config.range = this.config.max - this.config.min;
            zoneRange = Math.round(this.config.range / 3);
        
            this.config.redZone = this.config.redZone || {
              from: this.config.min,
              to: this.config.min + zoneRange
            };
            this.config.yellowZone = this.config.yellowZone || {
              from: this.config.redZone.to,
              to: this.config.redZone.to + zoneRange
            };
            this.config.greenZone = this.config.greenZone || {
              from: this.config.yellowZone.to,
              to: this.config.max
            };

        },
        isRendered() {
            return (this.body !== undefined);
        },
        render(value) {
            if (value < this.config.min || value > this.config.max) {
                throw new Error('Invalid value');
            }

            var labelFontSize, major, minor, minorDelta, majorDelta, point1, point2, point;
        
            this.body = d3.select(this.$refs.gauge)
              .append("svg:svg")
              .attr("class", "gauge")
              .attr("width", this.config.size)
              .attr("height", this.config.size);
        
            this.drawRestBand(this.config.min, this.config.max, this.config.greyColor);
            this.drawBand(this.config.min, this.config.max, this.config.greyColor);
        
        
            if (this.config.label) {
              labelFontSize = Math.round(this.config.size / 9);
              this.body.append("svg:text")
                .attr("x", this.config.cx)
                .attr("y", this.config.cy / 2 + labelFontSize / 2)
                .attr("dy", labelFontSize)
                .attr('class', 'label')
                .attr("text-anchor", "middle")
                .text(this.config.label)
                .style("font-size", labelFontSize + "px");
            }
        
            majorDelta = this.config.range / (this.config.majorTicks - 1);
            for (major = this.config.min; major <= this.config.max; major += majorDelta) {
              minorDelta = majorDelta / this.config.minorTicks;
              for (minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta) {
                point1 = this.valueToPoint(minor, 0.75);
                point2 = this.valueToPoint(minor, 0.85);
        
                this.body.append("svg:line")
                  .attr("class", "minorTick")
                  .attr("x1", point1.x)
                  .attr("y1", point1.y)
                  .attr("x2", point2.x)
                  .attr("y2", point2.y);
              }
        
              point1 = this.valueToPoint(major, 0.44); // 0.6
              point2 = this.valueToPoint(major, 0.9);
        
              this.body.append("svg:line")
                .attr("class", "majorTick")
                .attr("x1", point1.x)
                .attr("y1", point1.y)
                .attr("x2", point2.x)
                .attr("y2", point2.y);
        
              if (major === this.config.max) {
                point = this.valueToPoint(major, 0.82);
              }
              if (major === this.config.min) {
                point = this.valueToPoint(major, 0.82);
              }
            }
        
        
            var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
        
            var midValue = (this.config.min + this.config.max) / 2;
            if (this.config.showPointer) {
              var pointerPath = this.buildPointerPath(midValue);
        
              var pointerLine = d3.line()
                .x(function(d) {
                  return d.x;
                })
                .y(function(d) {
                  return d.y;
                })
                .curve(d3.curveBasis);
        
              pointerContainer.selectAll("path")
                .data([pointerPath])
                .enter()
                .append("svg:path")
                .attr("d", pointerLine)
                .attr('class', 'pointerLine')
                .style("fill-opacity", 1);
        
              pointerContainer.append("svg:circle")
                .attr("cx", this.config.cx)
                .attr("cy", this.config.cy)
                .attr("r", 0.06 * this.config.radius)
                .attr('class', 'pointerCircle')
                .style("opacity", 1);
            }
        
            if (this.config.showValue) {
              var fontSize = this.config.valueFontSize;
              pointerContainer.selectAll("text")
                .data([midValue])
                .enter()
                .append("svg:text")
                .attr("x", this.config.cx)
                .attr("y", this.config.size - this.config.cy / 1.6 - fontSize)
                .attr("dy", fontSize)
                .attr("text-anchor", "middle")
                .attr('class', 'value')
                .style("font-size", fontSize + "px")
                .style("stroke-width", "0px");
            }
        
            this.redraw(value || this.config.min);
        },
        buildPointerPath(value) {
            var self = this;
            function valueToPoint(value, factor) {
              var point = self.valueToPoint(value, factor);
              point.x -= self.config.cx;
              point.y -= self.config.cy;
              return point;
            }
        
            var delta = this.config.range / 6; // 13
        
            var head = valueToPoint(value, 0.8); // 6
            var head1 = valueToPoint(value - delta, 0.12);
            var head2 = valueToPoint(value + delta, 0.12);
        
            var tailValue = value - (this.config.range * (1 / (180 / 360)) / 2);
            var tail = valueToPoint(tailValue, -0.1);
            var tail1 = valueToPoint(tailValue - delta, 0.12);
            var tail2 = valueToPoint(tailValue + delta, 0.12);
        
            return [head, head1, tail2, tail, tail1, head2, head];
        },
        drawBand(start, end, color) {
            var self = this;
            var bands, bandsdraw, theend, arc, arcs;
            if (0 >= end - start) {
              return;
            }
        
            function arcTween(transition, newAngle) {
              transition.attrTween("d", function(d) {
                var theAngle = (newAngle / 100 * 180 - (0 / 100 * 180)) * Math.PI / 180;
                var interpolate = d3.interpolate(d.endAngle, theAngle);
                return function(t) {
                  d.endAngle = interpolate(t);
                  self.config.I = newAngle;
                  return arc(d);
                };
              });
            }
        
            bands = this.body.select(".bands");
            if (bands.empty()) {
              bands = this.body.append("svg:path").attr("class", 'bands');
            }
        
            theend = this.valueToRadians(end);
            arc = d3.arc()
              .innerRadius(0.45 * this.config.radius)
              .outerRadius(0.85 * this.config.radius)
              .startAngle(0);
        
            bandsdraw = bands.attr("transform", () => {
              return "translate(" + this.config.cx + ", " + this.config.cy + ") rotate(270)";
            });
        
            if (this.config.I === 0) {
              arcs = bandsdraw
                .datum({
                  endAngle: 0
                })
                .style("fill", color)
                .attr("d", arc);
            } else {
              arcs = bandsdraw
                .datum({
                  endAngle: this.valueToRadians(this.config.I)
                })
                .style("fill", color)
                .attr("d", arc);
            }
        
            arcs.transition().duration(this.config.transitionDuration).call(arcTween, end);
        },
        drawRestBand(start, end, color) {
            var bands, theend, bandsdrawn, arcEnd, arcss;
            if (0 >= end - start) {
              return;
            }
            bands = this.body.select(".backbands");
            if (bands.empty()) {
              bands = this.body.append("svg:path").attr("class", 'backbands');
            }
            theend = this.valueToRadians(end);
            bandsdrawn = bands.attr("transform", () => {
              return "translate(" + this.config.cx + ", " + this.config.cy + ") rotate(270)";
            });
            arcEnd = d3.arc()
              .innerRadius(0.45 * this.config.radius)
              .outerRadius(0.85 * this.config.radius)
              .startAngle(this.valueToRadians(start))
              .endAngle(this.valueToRadians(end));
            arcss = bandsdrawn
              .style("fill", color)
              .attr("d", arcEnd);
        },
        redraw(value) {
            if (value < this.config.min || value > this.config.max) {
                throw new Error('Invalid value');
            }
            var self = this;
            if (!this.isRendered() || !value || !(!isNaN(parseFloat(value)) && isFinite(value))) {
              return;
            }
        
            var pointerContainer = self.body.select(".pointerContainer");
        
            pointerContainer.selectAll("text").text(Math.round(value) + this.config.unit);
        
            var pointer = pointerContainer.selectAll("path");
            pointer.transition()
              .duration(self.config.transitionDuration)
              .attrTween("transform", function() {
                var pointerValue = value;
                if (value > self.config.max) {
                  pointerValue = self.config.max + 0.02 * self.config.range;
                } else if (value < self.config.min) {
                  pointerValue = self.config.min - 0.02 * self.config.range;
                }
                var targetRotation = (self.valueToDegrees(pointerValue) - 90);
                var currentRotation = this._currentRotation || targetRotation;
                this._currentRotation = targetRotation;
        
                return function(step) {
                  var rotation = currentRotation + (targetRotation - currentRotation) * step;
                  return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")";
                };
              });
        
            //todo: make color ranges configurable
            if (value >= self.config.redZone.from && value < self.config.redZone.to) {
                self.drawBand(0, value, self.config.redColor);
            } else if (value >= self.config.yellowZone.from && value <= self.config.yellowZone.to) {
                self.drawBand(0, value, self.config.yellowColor);
            } else if (value >= self.config.greenZone.from && value <= self.config.greenZone.to) {
                self.drawBand(0, value, self.config.greenColor);
            } else {
                self.drawBand(0, value, self.config.greyColor);
            }
            self.drawRestBand(0, 100, self.config.greyColor);
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        value: 70,
        a: 70
    },
    methods: {
        change() {
            this.value = this.a;
        }
    }
})