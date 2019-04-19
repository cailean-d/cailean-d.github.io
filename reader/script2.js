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
        var p = pages.shift();
        fetch('pages/' + p + '.html').then(res => {
            if (res.status == 200) {
                res.text().then(text => {
                    if (dir) {
                        data += '<div class="page' + p + '">' + text + '</div>';
                    } else {
                        data = '<div class="page' + p + '">' + text + '</div>' + data;
                    }
                    loadPages(pages, dir);
                })
            } else {
                setTimeout(_ => isLoading = false, 300);                
                $('.loader-wrapper').remove();
                if (dir) {
                    bottomIsLoaded = true;
                    setCookie('last-page', bottomPage - pageCount * 2, { expires: 2592000 });
                } else {
                    topIsLoaded = true;
                }
            }
        });
    }  else {
        setTimeout(_ => isLoading = false, 300);
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
    isLoading = true;
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        pagesToLoad.push(bottomPage++)
    }
    $(readerSelector).append('<div class="loader-wrapper"><div class="loader"></div></div>')
    setCookie('last-page', pagesToLoad[0], { expires: 2592000 });
    return pagesToLoad;
}

function getPrevPages() {
    isLoading = true;
    let pagesToLoad = []
    for(let i = 0; i < pageCount; i++){
        if (topPage == 1) break;
        pagesToLoad.push(--topPage)
    }
    $(readerSelector).prepend('<div class="loader-wrapper"><div class="loader"></div></div>')
    return pagesToLoad;
}

function loadPageOnScroll(elem, e) {
    if ($(elem).hasClass('content') && !$(elem).hasClass('reader-fullscreen')) return;
    if ((elem.clientHeight + elem.scrollTop) >= elem.scrollHeight) {
        if (!e.deltaY || (e.deltaY && e.deltaY > 0)) {
            if (!isLoading && !bottomIsLoaded) {
                loadPages(getNextPages(), true)
            }
        }
    } else if (elem.scrollHeight > elem.clientHeight && elem.scrollTop == 0) {
        if (!e.deltaY || (e.deltaY && e.deltaY < 0)) {
            if (!isLoading && !topIsLoaded) {
                loadPages(getPrevPages(), false)
            }
        }
    }
}

window.addEventListener('scroll', e => loadPageOnScroll(doc, e))
window.addEventListener('mousewheel', e => loadPageOnScroll(doc, e))
$('.reader .content')[0].addEventListener('scroll', e => loadPageOnScroll($('.reader .content')[0], e))
$('.reader .content')[0].addEventListener('mousewheel', e => loadPageOnScroll($('.reader .content')[0], e))

loadPages(getNextPages(), true);
