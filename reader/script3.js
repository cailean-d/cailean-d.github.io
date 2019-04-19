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



var checkScrollBars = function(){
    var b = $('.content');
    var normalw = 0;
    var scrollw = 0;
    if(b.prop('scrollHeight')>b.height()){
        normalw = window.innerWidth;
        scrollw = normalw - b.width();
        $('#container').css({marginRight:'-'+scrollw+'px'});
    }
}

checkScrollBars();