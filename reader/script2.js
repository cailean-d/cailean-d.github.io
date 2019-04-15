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

function loadPageOnScroll(e) {
    if ((doc.clientHeight + doc.scrollTop) >= doc.scrollHeight) {
        if (!e.deltaY || (e.deltaY && e.deltaY > 0)) {
            if (!isLoading && !bottomIsLoaded) {
                loadPages(getNextPages(), true)
            }
        }
    } else if (doc.scrollHeight > doc.clientHeight && doc.scrollTop == 0) {
        if (!e.deltaY || (e.deltaY && e.deltaY < 0)) {
            if (!isLoading && !topIsLoaded) {
                loadPages(getPrevPages(), false)
            }
        }
    }
}

window.addEventListener('scroll', loadPageOnScroll)
// window.addEventListener('scroll', stickyToolbar)
window.addEventListener('mousewheel', loadPageOnScroll)

loadPages(getNextPages(), true);

// var stickyOffset = $('.toolbar-wrapper')[0].offsetTop;

// function stickyToolbar() {
//   if (window.pageYOffset > stickyOffset) {
//     $('.toolbar-wrapper').addClass('sticky');
//   } else {
//     $('.toolbar-wrapper').removeClass('sticky');
//   }
// }