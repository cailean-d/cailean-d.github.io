fetch('pages/1.html')
.then(res => {  
    console.log(readerSelector);
    res.text().then(text => $(readerSelector).append(text))
})

