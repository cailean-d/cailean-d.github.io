function loadPages(...pages) {
    pages.forEach(i => {
        fetch('pages/' + i + '.html').then(res => res.text().then(text => $(readerSelector).append(text)))
    })
}


loadPages(1, 2, 3, 4, 5)