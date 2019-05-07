var isLoading = false;
var isTopLoaded = false;
var isBottomLoaded = false;
var isScrolledByButton = false;
var topPage = currentPage || 1;
var bottomPage = currentPage || 1;
var pageCount = 3;
var maxPages = /* 60 */ pagesAmount;
var data = '';
var doc = document.documentElement;
var scrolledPage;
var debounceTimer, debounceTimer2, debounceTimer3, debounceTimer4, debounceTimer5;
var initLastPage = getCookie('last-page');


$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

function onPageScroll(elem) {
    
    if (isScrolledByButton) return;
    if ($(elem).hasClass('content') && !$(elem).hasClass('reader-fullscreen')) return;
    if (!$(elem).hasClass('content') && $('.reader-fullscreen').length) return;

    var elHeight = elem === document.documentElement ? window.innerHeight : elem.clientHeight;

    determinePageOnScroll();

    if (elHeight + elem.scrollTop + 60 >= elem.scrollHeight) { // bottom corner
        startLoadBottom();
    } else if (elem.scrollTop == 0) { // top corner
        startLoadTop();
    }
}

function startLoadTop(scrollToPage) {
    if (!isLoading && !isTopLoaded) {
        loadPage(getPages(-1), false, function() {
            scrollByButton(scrollToPage);
        })
    }
}

function startLoadBottom(scrollToPage) {
    if (!isLoading && !isBottomLoaded) {
        loadPage(getPages(1), true, function() {
            scrollByButton(scrollToPage);
        })
    }
}

function scrollByButton(scroll) {
    if (scroll) {
        setTimeout(function() {
            isScrolledByButton = true;
            var page = $('#pageInput').attr('data-page');
            scrollToTarget($('.page' + page)[0], function() {
                isScrolledByButton = false;
            });
        }, 100)
    }
}

function loadPage(pages, dir, cb) {
    if (pages && pages[0]) {
        var p = pages.shift();
        $.ajax('/onlinereader/' + bookLink, {
            cache: false,
            method: 'post',
            data: {page: p}
            }).done(function(text) {
            if (dir === true || dir === undefined) {
                data += '<div class="sub-page' + p + '">' + text + '</div>';
            } else {
                data = '<div class="sub-page' + p + '">' + text + '</div>' + data;
            }
            loadPage(pages, dir, cb);          
        });
    } else {
        if (data) {
            var pageNumber = dir ? Math.ceil((bottomPage - 1) / pageCount) : Math.ceil(topPage / pageCount);
            if (dir === undefined) pageNumber = $('#pageInput').val();
            var html = '<div class="page page' + pageNumber + '">' + data + '</div>';
            if (dir === true) {
                $('#pageInput').attr('data-page', pageNumber);
                if (isScrolledByButton) $('#pageInput').val(pageNumber);
                $(readerSelector).append(html); 
            } else if (dir === false) {
                preventScroll(function() {
                    $('#pageInput').attr('data-page', pageNumber);
                    if (isScrolledByButton) $('#pageInput').val(pageNumber);
                    $(readerSelector).prepend(html);
                });
            } else {
                $(readerSelector).html(html);
            }
            data = '';
            if (typeof cb === 'function') cb();
        }
        hideLoading();
    }
        
}

function changePageByButton() {
    var pageOffset = $(this).attr('id') == 'next_page' ? 1 : -1;
    var pageNumber = +$('#pageInput').val() + pageOffset;
    var pageElement = $('.page' + pageNumber);
    var startPage = pageNumber * pageCount - (pageCount - 1);
    if (pageElement.length) { // page is loaded
        isScrolledByButton = true;
        scrollToTarget(pageElement[0], function() {
            isScrolledByButton = false;
        });
        $('#pageInput').val(pageNumber);
        savePage(startPage);
    } else if(pageOffset < 0) { // prev page
        startLoadTop(true);
    } else if (pageOffset > 0) { // next page
        startLoadBottom(true);
    }
}

function changePageByInput(e) {
    var isKeyEnter = e.keyCode == 13;
    if (isKeyEnter) {
        var pageNumber = +$(this).val();
        var p = Math.ceil(maxPages / pageCount);
        
        if(pageNumber < 1) {
            $(this).val(1)
            pageNumber = 1;
        } else if (pageNumber > p) {
            $(this).val(p);
            pageNumber = p;
        }

        var pageElement = $('.page' + pageNumber);
        var startPage = pageNumber * pageCount - (pageCount - 1);
        
        if (pageElement.length > 0) {
            isScrolledByButton = true;
            savePage(startPage)
            scrollToTarget(pageElement[0], function() {
                isScrolledByButton = false;
            });
        } else {
            isScrolledByButton = true;
            var pagesToLoad = getPages(1, startPage);
            isBottomLoaded = isTopLoaded = false;
            topPage = startPage;
            bottomPage = pagesToLoad[pagesToLoad.length - 1] + 1;
            loadPage(pagesToLoad, undefined, function() {
                document.documentElement.scrollTo(0, 1);
                isScrolledByButton = false;
            });
        }
    }
}

function getPages(dir, startPage) {
    var pagesToLoad = [];

    if (startPage && (startPage < 1 || startPage > maxPages)) return;

    for(var i = 0; i < pageCount; i++){
        if (startPage) {
            if (startPage == maxPages) {
                pagesToLoad.push(startPage);
                isBottomLoaded = true;
                break;
            }
            pagesToLoad.push(startPage++)
        } else  if (dir > 0) {
            if (bottomPage > maxPages) break;
            if (bottomPage == maxPages) {
                pagesToLoad.push(bottomPage);
                isBottomLoaded = true;
                break;
            }
            pagesToLoad.push(bottomPage++)
        } else if (dir < 0) {
            if (topPage == 1) {
                isTopLoaded = true;
                break;
            }
            pagesToLoad.push(--topPage)
        }
    }

    if (dir < 0 && pagesToLoad[pagesToLoad.length - 1]) {
        savePage(pagesToLoad[pagesToLoad.length - 1]);
    } else if (dir > 0 && pagesToLoad[0]) {
        savePage(pagesToLoad[0]);
    }
    if (pagesToLoad.length > 0) {
        showLoading();
    }
    return pagesToLoad;
}

function scrollToTarget(element, cb){
    
    var headerOffset = parseInt($('.reader').css('margin-top')) + 10 || 100;
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

function preventScroll(cb) {
    var el;
    if ($('.reader-fullscreen').length) {
        el = $(readerSelector).parent()[0]
    } else {
        el = document.documentElement;
    }
    var old_height = $(el)[0].scrollHeight; //store document height before modifications
    var old_scroll = $(el).scrollTop(); //remember the scroll position
    
    if (typeof cb === 'function') cb();
    
    var new_scroll = old_scroll + $(el)[0].scrollHeight - old_height;
    
    $(el).scrollTop(new_scroll);
}

function debounceFn(timer, cb, time) {
    if(timer) {
        window.clearTimeout(timer);
    }
    timer = window.setTimeout(function() {
        cb();
    }, time || 100);
}

function determinePageOnScroll() {
    $('.page').each(function() {
        if ($(this).isInViewport()) {
            var elClass = $(this).attr('class');
            var page = elClass.split(' ')[1].slice(4);
            var startPage = page * pageCount - (pageCount - 1);
            $('#pageInput').val(page);
            savePage(startPage);
            saveOffsetPosition(page);
        }
    });
}

function saveOffsetPosition(page) {
    var headerOffset = parseInt($('.reader').css('margin-top')) + 40 || 100;
    var pageOffset = $('.page' + page).offset().top - 112;
    var scrollTop = $(window).scrollTop();
    var pageHeight = $('.page' + page).outerHeight();
    var newScrollOffset = scrollTop - pageOffset;
    var pageBottom = pageOffset + pageHeight - window.innerHeight + headerOffset;

    var savedObj = getCookie('scroll-offset');
    if (savedObj) savedObj = JSON.parse(savedObj);
    var scrollObject = savedObj || {};
    if (!scrollObject[bookLink]) scrollObject[bookLink] = {};
    scrollObject[bookLink]['offset'] = newScrollOffset;

    if (newScrollOffset < 0) { // visible prev page
        scrollObject[bookLink]['mode'] = 'prev';
    } else if (scrollTop > pageBottom) { // visible next page
        scrollObject[bookLink]['mode'] = 'next';
    } else { // fit page
        scrollObject[bookLink]['mode'] = 'fit';
    }
    
    setCookie('scroll-offset', JSON.stringify(scrollObject), { expires: 2592000 });
}

function restoreOffsetPosition() {
    var scrollObject = getCookie('scroll-offset');
    if (!scrollObject) return;
    scrollObject = JSON.parse(scrollObject);
    var bookName = scrollObject[bookLink];
    var isSameBook = bookLink == bookName;
    var isSameLastPage = currentPage == initLastPage;
    if (bookName && isSameBook && isSameLastPage) {
        if(bookName['mode'] == 'fit') {
            window.scrollTo(0, bookName['offset']);
        } else if (bookName['mode'] == 'next') {
            if (!isBottomLoaded) {
                loadPage(getPages(1), true, function() {
                    window.scrollTo(0, bookName['offset']);
                });
            }
        } else if (bookName['mode'] == 'prev') {
            if (!isTopLoaded) {
                loadPage(getPages(-1), false, function() {
                    var page = $('#pageInput').val();
                    var pageOffset = $('.page' + page).offset().top - 112;
                    var newScrollOffset = pageOffset + bookName['offset'];
                    window.scrollTo(0, newScrollOffset);
                })
            }
        }
    }
}

function showLoading() {
    isLoading = true;
    $('.loader-wrapper').show();
}

function hideLoading() {
    isLoading = false;
    $('.loader-wrapper').hide();
}

function savePage(p) {
    var pagex = getCookie('last-page');
    if (p != pagex) {
        $.ajax('/savelastpage/' + bookLink, {cache: false, method: 'post', data: {page: p} })
        setCookie('last-page', p , { expires: 2592000 });
    }
}

$(document).ready(function() {
    loadPage(getPages(1), undefined, restoreOffsetPosition);
    $('#pageInput').val(Math.ceil((bottomPage - 1) / pageCount));
    var reader = $(readerSelector).parent()[0];
    window.addEventListener('scroll', function() {
        debounceFn(debounceTimer, function() {
            onPageScroll(doc);
        })
    })
    reader.addEventListener('scroll', function() {
        debounceFn(debounceTimer2, function() {
            onPageScroll(reader);
        })
    })
    $('#pageInput').on('keypress', changePageByInput)
    // $('#prev_page').click(changePageByButton)
    // $('#next_page').click(changePageByButton)
})    