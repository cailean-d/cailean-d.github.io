var readerSelector = '.reader .content .inner';

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
var fontStyles = ['normal', 'bold', 'italic'];
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
        fontInterval: undefined, // отступ между строк,
        fontStyle: 'normal',
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
    }, 
    recommended: {},
    custom: {}
}


$(document).ready(function() {

    initSettings();

    $('.fullscreen-on').on('click', function() {
        var winScrollOffset = $(window).scrollTop(); 
        $(this).hide();
        $('.content').addClass('reader-fullscreen');
        $('body').css('overflow', 'hidden');
        $('.content').scrollTop(winScrollOffset);
        setTimeout(function(){ $(this).show() }, 300);
    })

    $('.fullscreen-off').on('click', function() {
        var contentScrollOffset = $('.content').scrollTop();
        $('.content').removeClass('reader-fullscreen');
        $('body').css('overflow', '');
        $(window).scrollTop(contentScrollOffset);
    })

    $('.toolbar > *').on('click', function() {
        $("#text-color-picker").spectrum('hide');
        $("#background-color-picker").spectrum('hide');
    });

    $('.toolbar-hide').on('click', function() {
        $('.toolbar-wrapper').attr('style', 'display: none !important');
        $('.book-description').show();
        // $('.toolbar-hide').hide();
    })

    $('.toolbar-show').on('click', function() {
        $('.toolbar-wrapper').attr('style', 'display: flex !important');
        $('.book-description').hide();
        // $('.toolbar-hide').show();
    })

    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover", container: '.navbar' });
    $('[data-toggle="tooltip"]').click(function () { $(this).tooltip("hide");});

    $('.theme-list').on('click', '#custom_theme', function(e) {
        e.preventDefault();
        setTheme('custom', true);
    })

    $("#text-color-picker").spectrum({
        ...colorPickerOptions,
        change: function(color) {
            setTheme('custom', false, {name: 'color', value: color.toHexString()})
        },
        beforeShow: function() {
            $("#background-color-picker").spectrum('hide');
            $('body').trigger('click');
        }
    });
    $("#background-color-picker").spectrum({
        ...colorPickerOptions,
        change: function(color) {
            setTheme('custom', false, [
                {name: 'backgroundColor', value: color.toHexString()},
                {name: 'backgroundImage', value: ''}
            ]);
        },
        beforeShow: function() {
            $("#text-color-picker").spectrum('hide');
            $('body').trigger('click');
        }
    });

    fonts.forEach(function(item, i) {
        $('.reader-font-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'fontFamily', value: item});
        })
    });

    fontStyles.forEach(function(item, i) {
        $('.reader-font-style-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'fontStyle', value: item});
        })
    });

    fontSizes.forEach(function(item, i) {
        $('.font-size-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'fontSize', value: item});
        })
    });

    fontInterval.forEach(function(item, i) {
        $('.font-interval-0').on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'fontInterval', value: 'unset'});
        })
        $('.font-interval-' + (i + 1)).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'fontInterval', value: item});
        })
    });

    textAlign.forEach(function(item, i) {
        $('.text-align-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'textAlign', value: item});
        })
    });

    textIndent.forEach(function(item, i) {
        $('.text-indent-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'textIndent', value: item});
        })
    });

    textPadding.forEach(function(item, i) {
        $('.text-padding-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'textPadding', value: item});
        })
    })

    textures.forEach(function(item, i) {
        $('.bg-texture-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme('custom', false, {name: 'backgroundImage', value: item});
        });
    });

    Object.keys(presets).forEach(function(key, i) {
        $('.theme-preset-' + i).on('click', function(e) {
            e.preventDefault();
            setTheme(key, true);
        })
    })

});

function setTheme(name, reset, props) {

    var themex = getCookie('theme');
    if (themex) {
        themex = JSON.parse(themex);
    } else {
        themex = {};
    }

    var theme = presets[name], options, backgOptions;
    if (!theme) return;
    var prevThemeName = themex['theme-name'];
    themex['theme-name'] = name;

    if (name == 'custom') {
        if (prevThemeName && prevThemeName != 'custom' && !reset) {
            presets.custom = clone(presets[prevThemeName]);
            theme = presets.custom;
        }

        if (props instanceof Array) {
            props.forEach(function(v) {
                theme[v.name] = v.value;
            })
        } else if (typeof props === 'object') {
            theme[props.name] = props.value;
        }
        addCustomThemeButton();
        themex['theme-opts'] = theme;

        $.ajax('/savetheme', {
            cache: false, 
            method: 'post', 
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(themex)
        })
    } else {
        themex['theme-opts'] = {};
    }

    setCookie('theme', JSON.stringify(themex), { expires: 2592000 });

    options = {
        'color': theme.color ? theme.color : '',
        'font-family': theme.fontFamily ? theme.fontFamily : '',
        'font-size': theme.fontSize ? theme.fontSize + 'px' : '',
        'line-height': +theme.fontInterval ? theme.fontInterval + 'px' : 'unset',
        'text-align': theme.textAlign ? theme.textAlign : '',
        'text-indent': theme.textIndent ? theme.textIndent + 'px' : '',
        'padding-left': theme.textPadding ? theme.textPadding + 'px' : '',
        'padding-right': theme.textPadding ? theme.textPadding + 'px' : '',
        'font-style': theme.fontStyle && theme.fontStyle != 'bold' ? theme.fontStyle : '',
        'font-weight': theme.fontStyle && theme.fontStyle == 'bold' ? 'bold' : '',
    };

    backgOptions =  {
        'background-color': theme.backgroundColor ? theme.backgroundColor : '',
        'background-image': theme.backgroundImage ? 'url("' + theme.backgroundImage + '")' : ''
    };

    $(readerSelector).css(options);
    $(readerSelector).parent().css(backgOptions);
    $('body').css(backgOptions);

    setPageBackground(theme.backgroundImage, theme.backgroundColor)
}

function setPageBackground(img, bcolor) {
    if (img) {
        getImageLightness(img, function(brightness) {
            if (brightness < 100) {
                $('body').addClass('theme-dark');
            } else {
                $('body').removeClass('theme-dark')
            } 
        });
    } else if (bcolor && lightOrDark(bcolor) == 'dark') {
        $('body').addClass('theme-dark');
    } else {
        $('body').removeClass('theme-dark');
    }
}

function addCustomThemeButton() {
    if (!$('#custom_theme').length) {
        $('.theme-list').append('<li><a href="#" id="custom_theme">Custom</a></li>')
    }
}

function initSettings() {

    var theme = getCookie('theme');

    if (theme) {
        theme = JSON.parse(theme);
    }

    var themeSet = theme['theme-opts'];
    var themeName = theme['theme-name'];

    if (themeSet) {
        presets.custom = {
            color: themeSet.color,
            backgroundColor: themeSet.backgroundColor,
            backgroundImage: themeSet.backgroundImage,
            fontFamily: themeSet.fontFamily,
            fontSize: themeSet.fontSize,
            fontInterval: themeSet.fontInterval,
            fontStyle: themeSet.fontStyle,
            textAlign: themeSet.textAlign,
            textIndent: themeSet.textIndent,
            textPadding: themeSet.textPadding
        };
    }

    if (themeName) {
        setTheme(themeName);
    } else {
        setTheme('default');
    }
}


// load recommended theme
var themeLink = 'theme.json';

if (themeLink) {
    $('.theme-preset-3').show();
    $.ajax(themeLink).done(function (data) {
        presets.recommended = data;
    });
}    

// // sticky toolbar
// $(document).ready(function() {
//     var $stickyMenu = $('.toolbar-wrapper');
//     var stickyNavTop = $($stickyMenu).offset().top;
//     var navHeight = $($stickyMenu).outerHeight();

//     var stickyNav = function(){
//         var scrollTop = $(window).scrollTop();
//         if (scrollTop > stickyNavTop - 54) { 
//             $($stickyMenu).addClass('sticky');
//             $('body').css('padding-top', navHeight + 'px')
//         } else {
//             $($stickyMenu).removeClass('sticky');
//             $('body').css('padding-top', '0')
//         }
//     };

//     stickyNav();

//     $(window).scroll(function() {
//         stickyNav();
//     });
// });


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

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}