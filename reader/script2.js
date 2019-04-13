fetch('pages/1')
.then((res) => {
	console.log(res.text())
})
.catch(console.log)
