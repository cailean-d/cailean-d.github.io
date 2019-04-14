let isLoading = false;
let topIsLoaded = false;
let bottomIsLoaded = false;
let topPage = getCookie('last-page') || 1;
let bottomPage = getCookie('last-page') || 1;
let pageCount = 5;
let data = '';
let doc = document.documentElement;

function loadPages(pages, dir) {
    if (pages && pages[0]) {
        fetch('pages/' + pages.shift() + '.html').then(res => {
            if (res.status == 200) {
                res.text().then(text => {
                    if (dir) {
                        data += text;
                    } else {
                        data = text + data;
                    }
                    loadPages(pages, dir);
                })
            } else {
                isLoading = false;
                if (dir) {
                    bottomIsLoaded = true;
                    $('.loader-wrapper').remove();
                    setCookie('last-page', bottomPage - pageCount * 2, { expires: 2592000 });
                } else {
                    topIsLoaded = true;
                }
            }
        }).catch(_ => console.log('eeeerrroror'))
    }  else {
        isLoading = false;
        $('.loader-wrapper').remove();
        if (dir) {
            $(readerSelector).append(data)
        } else {
            $(readerSelector).prepend(data)
        }
        data = '';
    }
}

function getNextPages() {
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        pagesToLoad.push(bottomPage++)
    }
    setCookie('last-page', pagesToLoad[0], { expires: 2592000 });
    $(readerSelector).append('<div class="loader-wrapper"><div class="loader"></div></div>')
    isLoading = true;
    return pagesToLoad;
}

function getPrevPages() {
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        if (topPage == 1) break;
        pagesToLoad.push(--topPage)
    }
    $(readerSelector).prepend('<div class="loader-wrapper"><div class="loader"></div></div>')
    isLoading = true;
    return pagesToLoad;
}

loadPages(getNextPages(), true)

// window.onscroll = function() {
//     if ((doc.clientHeight + doc.scrollTop) >= doc.scrollHeight) {
//         if (!isLoading && !bottomIsLoaded) {
//             isLoading = true;
//             loadPages(getNextPages(), true, _ => isLoading = false)
//         }
//     } else if (doc.scrollHeight > doc.clientHeight && doc.scrollTop == 0) {
//         if (!isLoading && !topIsLoaded) {
//             isLoading = true;
//             loadPages(getPrevPages(), false, _ => isLoading = false)
//         }
//     }
// };

window.onmousewheel = function(e) {
    if ((doc.clientHeight + doc.scrollTop) >= doc.scrollHeight && e.deltaY > 0) {
        if (!isLoading && !bottomIsLoaded) {
            loadPages(getNextPages(), true)
        }
    } else if (doc.scrollHeight > doc.clientHeight && doc.scrollTop == 0 && e.deltaY < 0) {
        if (!isLoading && !topIsLoaded) {
            loadPages(getPrevPages(), false)
        }
    }
}