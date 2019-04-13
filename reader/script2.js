fetch('https://reader-backend1.herokuapp.com/pages/1')
.then((res) => {
	console.log(res.text())
})
.catch(console.log)


let xhr = new XMLHttpRequest();

xhr.open('get', 'https://reader-backend1.herokuapp.com/');

xhr.send();

xhr.onloadend =  function() {
    console.log(xhr.responseText)
}

xhr.onerror = function() {
    console.log(xhr.status)
}