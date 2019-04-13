let isLoading = false;
let booksIsLoaded = false;
let page = getCookie('last-page') || 1;
let pageCount = 5;

function loadPages(pages, cb) {
    if (pages && pages[0]) {
        fetch('pages/' + pages.shift() + '.html').then(res => {
            if (res.status == 200) {
                res.text().then(text => {
                    $(readerSelector).append(text)
                    loadPages(pages, cb);
                })
            } else {
                booksIsLoaded = true;
                console.log(page, pageCount)
                setCookie('last-page', page - pageCount * 2, { expires: 2592000 });
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
    setCookie('last-page', pagesToLoad[0], { expires: 2592000 });
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
    } else if ( el.scrollHeight > el.clientHeight && el.scrollTop == 0) {
        console.log('top');
    }
};