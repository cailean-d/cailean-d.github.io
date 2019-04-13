function loadPages(...pages) {
    pages.forEach(i => {
        fetch('pages/' + i + '.html').then(res => res.text().then(text => $(readerSelector).append(text)))
    })
}


loadPages(1, 2, 3, 4, 5)


window.onscroll = function() {
    if ((window.innerHeight + document.documentElement.scrollTop) >= document.body.offsetHeight) {
        console.log('bottom');
    }
};