let isLoading = false;
let booksIsLoaded = false;
let page = 1;
let pageCount = 5;

function loadPages(pages, cb) {
    if (pages) {
        fetch('pages/' + pages.shift() + '.html').then(res => {
            if (res.status == 200) {
                res.text().then(text => {
                    $(readerSelector).append(text)
                    loadPages(pages, cb);
                })
            } else {
                booksIsLoaded = true;
            }
        })
    } else {
        if (typeof cb == 'function') cb();
    }
}

function getNextPages() {
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        pagesToLoad.push(page++)
    }
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