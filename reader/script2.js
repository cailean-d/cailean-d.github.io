let isLoading = false;
let topIsLoaded = false;
let bottomIsLoaded = false;
let topPage = getCookie('last-page') || 1;
let bottomPage = getCookie('last-page') || 1;
let pageCount = 5;
let maxPages = 60;
let data = '';
let doc = document.documentElement;

function loadPageOnScroll(elem, e) {
    if ($(elem).hasClass('content') && !$(elem).hasClass('reader-fullscreen')) return;
    if(!$(elem).hasClass('content') && $('.reader-fullscreen').length) return;
    if (elem.clientHeight == elem.scrollHeight && elem.scrollTop == 0) {
        if (e.deltaY > 0) {
            startLoadBottom();
       } else {
            startLoadTop();
       }
    } else if ((elem.clientHeight + elem.scrollTop) >= elem.scrollHeight) {
        if (!e.deltaY || (e.deltaY && e.deltaY > 0)) {
            startLoadBottom();
        }
    } else if (elem.scrollHeight > elem.clientHeight && elem.scrollTop == 0) {
        if (!e.deltaY || (e.deltaY && e.deltaY < 0)) {
            startLoadTop();
        }
    }
}


function startLoadTop() {
    if (!isLoading && !topIsLoaded) {
        if (topPage > 1) {
            isLoading = true;
            loadPage(--topPage, false)
        } else {
            topIsLoaded = true;
        }
    }
}

function startLoadBottom() {
    if (!isLoading && !bottomIsLoaded) {
        if (bottomPage < maxPages) {
            isLoading = true;
            loadPage(++bottomPage, true)
        } else {
            bottomIsLoaded = true;
        }
    }
}

function loadPage(page, dir) {
    // if (dir === true) {
    //     $(readerSelector).append('<div class="loader-wrapper"><div class="loader"></div></div>')
    // } else if (dir === false) {
    //     $(readerSelector).prepend('<div class="loader-wrapper"><div class="loader"></div></div>')
    // }
    fetch('pages/' + page + '.html').then(res => {
        res.text().then(text => {
            $('.loader-wrapper').remove();
            let html = '<div class="page' + page + '">' + text + '</div>';
            $('#pageInput').val(page);
            setCookie('last-page', page, { expires: 2592000 });
            if (dir === true) {
                $(readerSelector).append(html); 
            } else if (dir === false) {
                $(readerSelector).prepend(html);
            } else {
                topIsLoaded = bottomIsLoaded = false;
                topPage = bottomPage = page;
                $(readerSelector).html(html);
            }
            setTimeout(_ => isLoading = false, 300);                
        })
    })
}

function debounceFn(timer, cb, time) {
    if(timer) {
        window.clearTimeout(timer);
    }
    timer = window.setTimeout(function() {
        cb();
    }, time || 100);
}


$(document).ready(function() {
    loadPage(bottomPage);
    $('#pageInput').val(bottomPage);
    var debounceTimer, debounceTimer2, debounceTimer3, debounceTimer4;
    var reader = $(readerSelector).parent()[0];
    window.addEventListener('scroll', e => debounceFn(debounceTimer, _ => loadPageOnScroll(doc, e)))
    window.addEventListener('mousewheel', e => debounceFn(debounceTimer2, _ => loadPageOnScroll(doc, e)))
    reader.addEventListener('scroll', e => debounceFn(debounceTimer3, _ => loadPageOnScroll(reader, e)))
    reader.addEventListener('mousewheel', e => debounceFn(debounceTimer4, _ => loadPageOnScroll(reader, e)))

    $('#pageInput').on('keypress', function(e) {
        if (e.keyCode == 13) {
            if($(this).val() < 1) {
                $(this).val(1)
            } else if ($(this).val() > maxPages) {
                $(this).val(maxPages);
            }
            loadPage($(this).val())
        }
    })

})    
