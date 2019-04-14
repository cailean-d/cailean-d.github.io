let isLoading = false;
let topIsLoaded = false;
let bottomIsLoaded = false;
let topPage = getCookie('last-page') || 1;
let bottomPage = getCookie('last-page') || 1;
let pageCount = 5;
let data = '';
let doc = document.documentElement;

function loadPages(pages, dir, cb) {
    if (pages && pages[0]) {
        fetch('pages/' + pages.shift() + '.html').then(res => {
            if (res.status == 200) {
                res.text().then(text => {
                    if (dir) {
                        data += text;
                    } else {
                        data = text + data;
                    }
                    loadPages(pages, dir, cb);
                })
            } else {
                isLoading = false;
                if (dir) {
                    bottomIsLoaded = true;
                    setCookie('last-page', bottomPage - pageCount * 2, { expires: 2592000 });
                } else {
                    topIsLoaded = true;
                }
            }
        })
    }  else {
        if (dir) {
            $(readerSelector).append(data)
        } else {
            $(readerSelector).prepend(data)
        }
        data = '';
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
        if (topPage == 1) break;
        pagesToLoad.push(--topPage)
    }
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
    if ((doc.clientHeight + doc.scrollTop) >= doc.scrollHeight && e.deltaY < 0) {
        if (!isLoading && !bottomIsLoaded) {
            isLoading = true;
            loadPages(getNextPages(), true, _ => isLoading = false)
        }
    } else if (doc.scrollHeight > doc.clientHeight && doc.scrollTop == 0 && e.deltaY > 0) {
        if (!isLoading && !topIsLoaded) {
            isLoading = true;
            loadPages(getPrevPages(), false, _ => isLoading = false)
        }
    }

    // if (doc.scrollTop == 0 && e.deltaY < 0) {
    //     // if (!isLoading && !topIsLoaded) {
    //     //     isLoading = true;
    //     //     loadPages(getPrevPages(), false, _ => isLoading = false)
    //     // }
    //     console.log('load prev')
    // } else if () {

    // }
}