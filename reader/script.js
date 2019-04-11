var readerSelector = '.reader .text';

var colorPickerOptions = {
    color: '#000',
    showPalette: true,
    palette: [
        ['#111', 'white', 'blue', 'yellow', 'red'],
        ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
    ]
}

var fonts = ['Arial', 'Times New Roman', 'Georgia', 'Verdana'];
var fontSizes = [12, 14, 16, 20, 24, 26];
var fontInterval = [22, 24, 26, 30];
var textAlign = ['start', 'end', 'justify'];
var textIndent = [0, 20, 40];
var textPadding = [0, 10, 20, 40];
var textures = ['img/background1.jpg', 'img/background2.jpg']
var presets = {
    default: {
        color: '#000',
        backgroundColor: '#fff',
        backgroundImage: undefined,
        fontFamily: 'Arial',
        fontSize: 16,
        fontInterval: undefined, // отступ между строк
        textAlign: 'start',
        textIndent: 0, // отступ абзаца
        textPadding: 0 // отступ от краев
    },
    light: {
        color: '#000',
        backgroundColor: '#fff'
    },
    dark: {
        color: '#fff',
        backgroundColor: '#000'
    }
}

$(document).ready(function() {

    $('.toolbar > *').on('click', function() {
        $("#text-color-picker").spectrum('hide');
        $("#background-color-picker").spectrum('hide');
    });

    $('.toolbar-hide').on('click', function() {
        $('.toolbar').attr('style', 'display: none !important');
        $('.toolbar-hide').hide();
        $('.toolbar-show').show();
    })

    $('.toolbar-show').on('click', function() {
        $('.toolbar').attr('style', 'display: inline-flex !important');
        $('.toolbar-hide').show();
        $('.toolbar-show').hide();
    })

    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover", container: 'body' });
    $('[data-toggle="tooltip"]').click(function () { $(this).tooltip("hide");});
    
    initSettings();

    $("#text-color-picker").spectrum({
        ...colorPickerOptions,
        change: function(color) {
            $(readerSelector).css('color', color.toHexString());
            setCookie('text-color', color.toHexString(), { expires: 2592000 });
        },
        beforeShow: function() {
            $("#background-color-picker").spectrum('hide');
            $('body').trigger('click');
        }
    });
    $("#background-color-picker").spectrum({
        ...colorPickerOptions,
        change: function(color) {
            $(readerSelector).css('background-color', color.toHexString());
            $(readerSelector).css('background-image', '');
            setCookie('background-color', color.toHexString(), { expires: 2592000 })
            deleteCookie('background-image');
        },
        beforeShow: function() {
            $("#text-color-picker").spectrum('hide');
            $('body').trigger('click');
        }
    });

    fonts.forEach(function(item, i) {
        $('.reader-font-' + i).on('click', function() {
            $(readerSelector).css('font-family', item);
            setCookie('font-family', item, { expires: 2592000 });
        })
    });

    fontSizes.forEach(function(item, i) {
        $('.font-size-' + i).on('click', function() {
            $(readerSelector).css('font-size', item + 'px');
            setCookie('font-size', item + 'px', { expires: 2592000 });
        })
    });

    fontInterval.forEach(function(item, i) {
        $('.font-interval-0').on('click', function() {
            $(readerSelector).css('line-height', 'unset');
            setCookie('line-height', 'unset', { expires: 2592000 });
        })
        $('.font-interval-' + (i + 1)).on('click', function() {
            $(readerSelector).css('line-height', item + 'px');
            setCookie('line-height', item + 'px', { expires: 2592000 });
        })
    });

    textAlign.forEach(function(item, i) {
        $('.text-align-' + i).on('click', function() {
            $(readerSelector).css('text-align', item);
            setCookie('text-align', item, { expires: 2592000 });
        })
    });

    textIndent.forEach(function(item, i) {
        $('.text-indent-' + i).on('click', function() {
            $(readerSelector).css('text-indent', item + 'px');
            setCookie('text-indent', item + 'px', { expires: 2592000 });
        })
    });

    textPadding.forEach(function(item, i) {
        $('.text-padding-' + i).on('click', function() {
            $(readerSelector).css('padding', '0px ' + item + 'px');
            setCookie('text-padding', '0px ' + item + 'px', { expires: 2592000 });
        })
    })

    textures.forEach(function(item, i) {
        $('.bg-texture-' + i).on('click', function() {
            $(readerSelector).css('background-image', 'url("' + item + '")')
            setCookie('background-image', 'url("' + item + '")', { expires: 2592000 });
        });
    });

    Object.keys(presets).forEach(function(key, i) {
        $('.theme-preset-' + i).on('click', function() {

            if (key === 'dark') {
                $('body').addClass('theme-dark');
                setCookie('theme', 'dark', { expires: 2592000 });
            } else {
                $('body').removeClass('theme-dark');
                setCookie('theme', key, { expires: 2592000 });
            }

            $(readerSelector).css('color', presets[key].color);
            setCookie('text-color', presets[key].color, { expires: 2592000 }); 

            $(readerSelector).css('background-color', presets[key].backgroundColor);
            setCookie('background-color', presets[key].backgroundColor, { expires: 2592000 }); 
            
            $(readerSelector).css('font-family', presets[key].fontFamily);
            setCookie('font-family', presets[key].fontFamily, { expires: 2592000 });

            $(readerSelector).css('font-size', presets[key].fontSize + 'px');
            setCookie('font-size', presets[key].fontSize + 'px', { expires: 2592000 });

            $(readerSelector).css('line-height', presets[key].fontInterval + 'px');
            setCookie('line-height', presets[key].fontInterval + 'px', { expires: 2592000 });

            $(readerSelector).css('text-align', presets[key].textAlign);
            setCookie('text-align', presets[key].textAlign, { expires: 2592000 });

            $(readerSelector).css('text-indent', presets[key].textIndent + 'px');
            setCookie('text-indent', presets[key].textIndent + 'px', { expires: 2592000 });

            $(readerSelector).css('padding', '0px ' + presets[key].textPadding + 'px');
            setCookie('text-padding', '0px ' + presets[key].textPadding + 'px', { expires: 2592000 });

            $(readerSelector).css('background-image', 'url("' + presets[key].backgroundImage + '")')
            setCookie('background-image', 'url("' + presets[key].backgroundImage + '")', { expires: 2592000 });

            if (!presets[key].backgroundImage) {
                $(readerSelector).css('background-image', '');
                deleteCookie('background-image');
            }

        })
    })

});



function initSettings() {
    $(readerSelector).css('font-family', getCookie('font-family') || presets.default.fontFamily);
    $(readerSelector).css('font-size', getCookie('font-size') || presets.default.fontSize);
    $(readerSelector).css('line-height', getCookie('line-height') || presets.default.fontInterval);
    $(readerSelector).css('text-align', getCookie('text-align') || presets.default.textAlign);
    $(readerSelector).css('text-indent', getCookie('text-indent') || presets.default.textIndent);
    $(readerSelector).css('padding', getCookie('text-padding') || presets.default.textPadding);
    $(readerSelector).css('color', getCookie('text-color') || presets.default.color);
    $(readerSelector).css('background-color',getCookie('background-color') || presets.default.backgroundColor);
    $(readerSelector).css('background-image', getCookie('background-image'));
    if (getCookie('theme') === 'dark') {
        $('body').addClass('theme-dark');
    }
}