fetch('pages/1.html')
.then((res) => {
	console.log(res.text())
})
.catch(console.log)
