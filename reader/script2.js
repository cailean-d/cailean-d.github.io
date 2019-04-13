let isLoading = false;
let topIsLoaded = false;
let bottomIsLoaded = false;
let topPage = getCookie('last-page') || 1;
let bottomPage = getCookie('last-page') || 1;
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
                bottomIsLoaded = true;
                setCookie('last-page', bottomPage - pageCount * 2, { expires: 2592000 });
            }
        })
    } else {
        if (typeof cb == 'function') cb();
    }
}

function getNextPages() {
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        pagesToLoad.push(bottomPage++)
    }
    setCookie('last-page', pagesToLoad[0], { expires: 2592000 });
    return pagesToLoad;
}

function getPrevPages() {
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        pagesToLoad.push(--topPage)
    }
    return pagesToLoad;
}

loadPages(getNextPages())

window.onscroll = function() {
    let el = document.documentElement;
    if ((el.clientHeight + el.scrollTop) >= el.scrollHeight) {
        if (!isLoading && !bottomIsLoaded) {
            isLoading = true;
            loadPages(getNextPages(), _ => isLoading = false)
        }
    } else if ( el.scrollHeight > el.clientHeight && el.scrollTop == 0) {
        if (!isLoading && !topIsLoaded) {
            isLoading = true;
            console.log(getPrevPages())
        }
    }
};