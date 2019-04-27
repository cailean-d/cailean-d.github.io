let isLoading = false;
let topIsLoaded = false;
let bottomIsLoaded = false;
let topPage = getCookie('last-page') || 1;
let bottomPage = getCookie('last-page') || 1;
let pageCount = 5;
let maxPages = 60;
let data = '';
let doc = document.documentElement;
let scrolledByButton = false;

function loadPageOnScroll(elem, e) {
    if (scrolledByButton) return;
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

function startLoadTop(scrollToPage) {
    if (!isLoading && !topIsLoaded) {
        if (topPage > 1) {
            isLoading = true;
            loadPage(--topPage, false, function() {
                scrollByButton(scrollToPage, topPage);
            })
        } else {
            topIsLoaded = true;
        }
    }
}

function startLoadBottom(scrollToPage) {
    if (!isLoading && !bottomIsLoaded) {
        if (bottomPage < maxPages) {
            isLoading = true;
            loadPage(++bottomPage, true, function() {
                scrollByButton(scrollToPage, bottomPage);
            })
        } else {
            bottomIsLoaded = true;
        }
    }
}

function scrollByButton(scroll, page) {
    if (scroll) {
        scrolledByButton = true;
        scrollToTarget($('.page' + page)[0], function() {
            setTimeout(() => {
                scrolledByButton = false;
            }, 200);
        });
    }
}

function loadPage(page, dir, cb) {
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
            if (typeof cb === 'function') cb();
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

function changePageByButton() {
    var pageOffset = $(this).attr('id') == 'next_page' ? 1 : -1;
    var pageNumber = +$('#pageInput').val() + pageOffset;
    var pageElement = $('.page' + pageNumber);
    if (pageElement.length > 0) {
        scrollToTarget(pageElement[0]);
        $('#pageInput').val(pageNumber);
    } else if(pageNumber == topPage - 1) {
        startLoadTop(true);
    } else if (pageNumber == bottomPage + 1) {
        startLoadBottom(true);
    } else if (pageOffset > 0 && pageNumber <= maxPages) {
        isLoading = true;
        loadPage(+$('#pageInput').val() + 1);
    } else if (pageOffset < 0 && pageNumber >= 1) {
        isLoading = true;
        loadPage(+$('#pageInput').val() - 1);
    }
}

function scrollToTarget(element, cb){
    
    var headerOffset = 100;
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition - headerOffset + window.scrollY;
    
    const onScroll = function () {
        const scrollTop = window.scrollTop || window.pageYOffset

        if (scrollTop === offsetPosition) {
            window.removeEventListener('scroll', onScroll)
            if (typeof cb == 'function') cb()
        }
    }
    window.addEventListener('scroll', onScroll)
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

function changePageByInput(e) {
    if (e.keyCode == 13) {
        var pageNumber = +$(this).val();
        var pageElement = $('.page' + pageNumber);
        if(pageNumber < 1) {
            $(this).val(1)
        } else if (pageNumber > maxPages) {
            console.log(1);
            $(this).val(maxPages);
            pageNumber = maxPages;
        }
        if (pageElement.length > 0) {
            scrollToTarget(pageElement[0]);
        } else {
            loadPage(pageNumber)
        }
    }
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

    $('#pageInput').on('keypress', changePageByInput)
    $('#prev_page').click(changePageByButton)
    $('#next_page').click(changePageByButton)
})    