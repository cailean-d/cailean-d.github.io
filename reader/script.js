var readerSelector = '.reader .content';

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
        backgroundImage: 'img/background1.jpg',
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

    $('.fullscreen-on').on('click', function() {
        $('.content').addClass('reader-fullscreen');
    })

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
            if (lightOrDark(color.toHexString()) == 'dark') {
                $('body').addClass('theme-dark');
                if (!$(readerSelector).css('color') || lightOrDark($(readerSelector).css('color')) == 'dark') {
                    $(readerSelector).css('color', '#fff');
                    setCookie('text-color', '#fff', { expires: 2592000 });
                }
            } else {
                $('body').removeClass('theme-dark');
                if (!$(readerSelector).css('color') || lightOrDark($(readerSelector).css('color')) == 'light') {
                    $(readerSelector).css('color', '#000');
                    setCookie('text-color', '#000', { expires: 2592000 });
                }
            }
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
            $(readerSelector).css({
                'padding-left': item + 'px',
                'padding-right': item + 'px'
            });
            setCookie('text-padding', item + 'px', { expires: 2592000 });
        })
    })

    textures.forEach(function(item, i) {
        $('.bg-texture-' + i).on('click', function() {
            $(readerSelector).css('background-image', 'url("' + item + '")')
            setCookie('background-image', item, { expires: 2592000 });
            getImageLightness(item,function(brightness){
                if (brightness < 100) {
                    $(readerSelector).css('color', '#fff');
                    setCookie('text-color', '#fff', { expires: 2592000 });
                    $('body').addClass('theme-dark');
                } else {
                    $(readerSelector).css('color', '#000');
                    setCookie('text-color', '#000', { expires: 2592000 });
                    $('body').removeClass('theme-dark');
                }
            });
        });
    });

    Object.keys(presets).forEach(function(key, i) {
        $('.theme-preset-' + i).on('click', function() {

            // if (key === 'dark') {
            //     $('body').addClass('theme-dark');
            //     setCookie('theme', 'dark', { expires: 2592000 });
            // } else {
            //     $('body').removeClass('theme-dark');
            //     setCookie('theme', key, { expires: 2592000 });
            // }

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

            $(readerSelector).css({
                'padding-left': presets[key].textPadding + 'px',
                'padding-right': presets[key].textPadding + 'px'
            });
            setCookie('text-padding', presets[key].textPadding + 'px', { expires: 2592000 });

            $(readerSelector).css('background-image', 'url("' + presets[key].backgroundImage + '")')
            setCookie('background-image', presets[key].backgroundImage, { expires: 2592000 });

            if (!presets[key].backgroundImage) {
                $(readerSelector).css('background-image', '');
                deleteCookie('background-image');

                if (lightOrDark(presets[key].backgroundColor) == 'dark') {
                    $('body').addClass('theme-dark');
                } else {
                    $('body').removeClass('theme-dark');
                }
            } 

        })
    })

});



function initSettings() {
    let img;
    if (!getCookie('background-color')) {
        img = getCookie('background-image') || presets.default.backgroundImage;
    } else {
        img = getCookie('background-image');
    }
    $(readerSelector).css({
        'font-family': getCookie('font-family') || presets.default.fontFamily,
        'font-size': getCookie('font-size') || presets.default.fontSize,
        'line-height': getCookie('line-height') || presets.default.fontInterval,
        'text-align': getCookie('text-align') || presets.default.textAlign,
        'padding-left': getCookie('text-padding') || presets.default.textPadding,
        'padding-right': getCookie('text-padding') || presets.default.textPadding,
        'color': getCookie('text-color') || presets.default.color,
        'background-color': getCookie('background-color') || presets.default.backgroundColor,
        'background-image': img? 'url("' + img + '")' : '',
    })
    
    if (img) {
        getImageLightness(img,function(brightness){
            if (brightness < 100) {
                $('body').addClass('theme-dark');
            } 
        });
    } else if (lightOrDark($(readerSelector).css('background-color')) == 'dark') {
        $('body').addClass('theme-dark');
    }
}


function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>127.5) {

        return 'light';
    } 
    else {

        return 'dark';
    }
}

function getImageLightness(imageSrc,callback) {
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.display = "none";
    document.body.appendChild(img);

    var colorSum = 0;

    img.onload = function() {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this,0,0);

        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
        var data = imageData.data;
        var r,g,b,avg;

        for(var x = 0, len = data.length; x < len; x+=4) {
            r = data[x];
            g = data[x+1];
            b = data[x+2];

            avg = Math.floor((r+g+b)/3);
            colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width*this.height));
        callback(brightness);
    }
}