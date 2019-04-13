let isLoading = false;

function loadPages(cb, ...pages) {
    pages.forEach(i => {
        fetch('pages/' + i + '.html').then(res => res.text().then(text => $(readerSelector).append(text)))
    })
    if (typeof cb == 'function') {
        cb();
    }
}


loadPages(null, 1, 2, 3, 4, 5)


window.onscroll = function() {
    let el = document.documentElement;
    if ((el.clientHeight + el.scrollTop) >= el.scrollHeight) {
        if (!isLoading) {
            isLoading = true;
            loadPages(_ => isLoading = false, 6, 7, 8, 9, 10)
        }
    }
};