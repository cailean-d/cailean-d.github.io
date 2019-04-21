let page = getCookie('last-page') || 1;
let maxPages = 60;


function loadPage(page) {
    $('#pageInput').val(page);
    setCookie('last-page', page, { expires: 2592000 });
    fetch('pages/' + page + '.html').then(res => {
        res.text().then(text => {
            $(readerSelector).html(text)
        })
    });
}

$(document).ready(function() {
    loadPage(page);
    $('#pageInput').val(page);
    
    $('.prev-page').on('click', () => {
        if (page > 1 ) {
            loadPage(--page);
        }
    })
    
    
    $('.next-page').on('click', () => {
        if (page < maxPages) {
            loadPage(++page);
        }
    })

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


function loadPages(pages, dir) {
    // if (pages[0] && pages[0] > pageAmount) {
    //     bottomIsLoaded = true;
    //     return;
    // }
    if (pages && pages[0]) {
        let p = pages.shift();
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
