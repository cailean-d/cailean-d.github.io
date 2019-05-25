
let scale;
var canvasElement = document.getElementById('canvas');
var ctx = canvasElement.getContext("2d");


document.querySelector('#save').onclick = function() {
    canvas.setZoom(1)
    canvas.viewportTransform[4] = 0;
    canvas.viewportTransform[5] = 0;
    let a = document.createElement('img')
    a.src = canvas.toDataURL({
        multiplier: scale
    });
    document.body.appendChild(a);
}


document.querySelector('#text-btn').onclick = function() {
    let t = document.querySelector('#text')
    addText(t.value)
    t.value = ''
}


document.querySelector('#undo').onclick = undo
document.querySelector('#redo').onclick = redo



let $ = function(id){return document.getElementById(id)};
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.selectable = false;

let canvas = new fabric.Canvas('canvas');
// canvas.setHeight(500);
// canvas.setWidth(500);

fabric.Image.fromURL('img.jpg', function(img) {

    let ratio = img.width / img.height;
    ratio > 1 ? canvas.setHeight(canvas.width / ratio) : canvas.setWidth(canvas.height * ratio)


    scale = img.height / canvas.height;

    img.scaleToWidth(canvas.width);
    img.scaleToHeight(canvas.height);
    canvas.setBackgroundImage(img);
    canvas.requestRenderAll();
//   img.scale(0.5).set({
//     left: 150,
//     top: 150,
//     angle: -15
//   });
//   canvas.add(img)/* .setActiveObject(img) */;
    updateModifications()

});

let drawingModeEl = $('drawing-mode');


drawingModeEl.onclick = function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        drawingModeEl.innerHTML = 'Cancel drawing mode';
    }
    else {
        drawingModeEl.innerHTML = 'Enter drawing mode';
    }
};


if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = '#d6daff';
    canvas.freeDrawingBrush.width = 11
    // canvas.freeDrawingBrush.shadow = new fabric.Shadow({
    //   blur: parseInt(drawingShadowWidth.value, 10) || 0,
    //   offsetX: 0,
    //   offsetY: 0,
    //   affectStroke: true,
    //   color: drawingShadowColorEl.value,
    // });
  }



  canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom = zoom + delta/200;
    if (zoom > 20) zoom = 20;
    if (zoom < 1) {
        zoom = 1;
        this.viewportTransform[4] = 0;
        this.viewportTransform[5] = 0;
    };
    canvas.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  })


  canvas.on('mouse:down', function(opt) {
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
  });
  canvas.on('mouse:move', function(opt) {

    // get the current mouse position
    var mouse = canvas.getPointer(opt.e);
    var x = parseInt(mouse.x);
    var y = parseInt(mouse.y);

    // get the color array for the pixel under the mouse
    var px = ctx.getImageData(x, y, 1, 1).data;

    // report that pixel data
    // console.log('[' + px[0] + ', ' + px[1] + ',' + px[2] + ', ' + px[3] + ']');

    document.querySelector('#color').style.backgroundColor = `rgba(${px[0]}, ${[px[1]]}, ${px[2]}, ${px[3]})`

    if (this.isDragging) {
      var e = opt.e;
      this.viewportTransform[4] += e.clientX - this.lastPosX;
      this.viewportTransform[5] += e.clientY - this.lastPosY;
      this.requestRenderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
  });
  canvas.on('mouse:up', function(opt) {
    this.isDragging = false;
    this.selection = true;
  });


  canvas.on({
    'touch:gesture': function(e) {
        if (e.e.touches && e.e.touches.length == 2) {
            pausePanning = true;
            var point = new fabric.Point(e.self.x, e.self.y);
            if (e.self.state == "start") {
                zoomStartScale = self.canvas.getZoom();
            }
            var delta = zoomStartScale * e.self.scale;
            self.canvas.zoomToPoint(point, delta);
            pausePanning = false;
        }
    },
    'object:selected': function() {
        pausePanning = true;
    },
    'selection:cleared': function() {
        pausePanning = false;
    },
    'touch:drag': function(e) {
        if (pausePanning == false && undefined != e.e.layerX && undefined != e.e.layerY) {
            currentX = e.e.layerX;
            currentY = e.e.layerY;
            xChange = currentX - lastX;
            yChange = currentY - lastY;

            if( (Math.abs(currentX - lastX) <= 50) && (Math.abs(currentY - lastY) <= 50)) {
                var delta = new fabric.Point(xChange, yChange);
                canvas.relativePan(delta);
            }

            lastX = e.e.layerX;
            lastY = e.e.layerY;
        }
    }
});


  
  /* UNDO REDO   */
  
  
    canvas.on("object:modified", function (e) {
        updateModifications();
    });
    canvas.on("object:added", function (e) {
        updateModifications();
    });

    var state = [];
    var historyStep = 0;
    var maxStates = 50;


    function updateModifications() {
        if (state.length >= maxStates)
            state.splice(0, 1)
        historyStep = 0
        state.push(JSON.stringify(canvas))
    }

    function undo() {
        if (historyStep < state.length) {
            let stateLen = state.length;
            let savedStep = historyStep;
            let lastIndex = stateLen - 1;
            canvas.loadFromJSON(state[lastIndex - historyStep - 1], function() {
                canvas.renderAll();
                state.length = stateLen;
                historyStep = savedStep + 1;
            });
        }
    }

    function redo() {
        if (historyStep > 0) {
            let stateLen = state.length;
            let savedStep = historyStep;
            let lastIndex = stateLen - 1;
            canvas.loadFromJSON(state[lastIndex - historyStep + 1], function() {
                canvas.renderAll();
                state.length = stateLen;
                historyStep = savedStep - 1;
            });
        }
    }

    function clearcan() {
        canvas.clear().renderAll();
    }
    

    function addText(text) {
        var t = new fabric.Textbox(text, {
            width: 150,
            top: 5,
            left: 5,
            fontSize: 16,
            textAlign: 'center',
            selectable: true,
            cornerStyle: 'circle',
            rotatingPointOffset: 20
        });
        canvas.add(t)
    }