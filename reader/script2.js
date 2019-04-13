fetch('pages/1.html')
.then(res => {  
    res.text().then(text => $(readerSelector).append(text))
})

