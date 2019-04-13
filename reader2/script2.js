let isLoading = false;
let booksIsLoaded = false;
let loadPage = 1;
let pageCount = 5;

function loadPages(pages, cb) {
    pages.forEach(i => {
        if (!booksIsLoaded) {
            fetch('pages/' + i + '.html').then(res => res.text()
            .then(text => $(readerSelector).append(text)))
            .catch(err => booksIsLoaded = true)
        }
    })
    if (typeof cb == 'function') {
        cb();
    }
}

function getNextPages() {
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        pagesToLoad.push(loadPages++)
    }
    console.log(pagesToLoad)
    return pagesToLoad;
}


loadPages(getNextPages())


window.onscroll = function() {
    let el = document.documentElement;
    if ((el.clientHeight + el.scrollTop) >= el.scrollHeight) {
        if (!isLoading && !booksIsLoaded) {
            isLoading = true;
            loadPages(getNextPages(), _ => isLoading = false)
        }
    }
};