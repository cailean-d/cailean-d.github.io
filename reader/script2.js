fetch('pages/1.html')
.then((res) => {  
    $(readerSelector).append(res.text())
})
.catch(console.log)
