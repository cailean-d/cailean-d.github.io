fetch('https://reader-backend1.herokuapp.com/pages/1')
.then((res) => {
	console.log(res.text())
})
.catch(console.log)
