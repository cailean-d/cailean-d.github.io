// let canvas, ctx, saveBtn;
// canvas = document.querySelector('#canvas')
// ctx = canvas.getContext('2d')
let saveBtn = document.querySelector('#save')

saveBtn.onclick = function() {
    let a = document.createElement('img')
    a.src = canvas.toDataURL("image/jpeg");
    document.body.appendChild(a);
}

// window.onload = _ => {

//     let img = new Image()
//     img.src = 'img.jpg'

//     img.onload = _ => {
//         canvas.width = 300
//         canvas.height = 300
//         ctx.drawImage(img, 0, 0, 300, 300)
//         // ctx.fillRect(0, 0, 100, 100)
//     }

// }






function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }



  var fd = new FormData();
fd.append('fname', 'test.wav');
fd.append('data', soundBlob);
$.ajax({
    type: 'POST',
    url: '/upload.php',
    data: fd,
    processData: false,
    contentType: false
}).done(function(data) {
       console.log(data);
});






















// create a Fabric.Canvas
var canvas = new fabric.Canvas("canvas");

// get a reference to <p id=results></p>
// (used to report pixel color under mouse)
var results = document.getElementById('results');

// get references to the html canvas element & its context
var canvasElement = document.getElementById('canvas');
var ctx = canvasElement.getContext("2d");

// listen for mouse:move events
canvas.on('mouse:move', function(e) {

  // get the current mouse position
  var mouse = canvas.getPointer(e.e);
  var x = parseInt(mouse.x);
  var y = parseInt(mouse.y);

  // get the color array for the pixel under the mouse
  var px = ctx.getImageData(x, y, 1, 1).data;

  // report that pixel data
  results.innerHTML = 'At [' + x + ' / ' + y + ']: Red/Green/Blue/Alpha = [' + px[0] + ' / ' + px[1] + ' / ' + px[2] + ' / ' + px[3] + ']';

});
