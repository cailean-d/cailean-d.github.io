var readerSelector = '.reader .content .inner';
var isLoaded = false;
var isHideThemeWarning = getCookie('hide-theme-warning');

var colorPickerOptions = {
    color: '#000',
    showPalette: true,
    // showInitial: true,
    palette: [
        ["#010101","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
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
        backgroundImage: undefined /* 'img/background1.jpg' */,
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
    custom: {},
    key: function(n) {
        return this[Object.keys(this)[n]];
    }
}


$(document).ready(function() {

    getAllThemes();

    $('#save-theme-btn').on('click', function(e) {
        var theme = getCookie('theme');
        if (!theme) {
            $('.save-theme-alert').html('Theme is not set');
            $('.save-theme-alert').show();
            return;
        }
        theme = JSON.parse(theme);
        var themeName = $('#title-input').val();
        var isShared = $('#shared_theme').prop('checked');
        if (!isThemeNameValid(themeName)) return;
        theme['theme-name'] = themeName;
        theme['public'] = isShared;
        resetSaveThemeModal();
        addThemeToList(theme);
        saveThemeToAccount(theme);
    });

    $('#save-theme-cancel').on('click', function() {
        resetSaveThemeModal();
    });

    $('#close_theme_warning').on('click', function() {
        var isHide = $('#hide_theme_warning').prop('checked');
        if (isHide) hideThemeWarning();
    });

    $('.fullscreen-on').on('click', function() {
        var winScrollOffset = $(window).scrollTop(); 
        $(this).hide();
        $('.content').addClass('reader-fullscreen');
        $('body').css('overflow', 'hidden');
        $('.content').scrollTop(winScrollOffset);
        setTimeout(function(){ $('.fullscreen-on').show() }, 300);
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

    // Object.keys(presets).forEach(function(key, i) {
    //     if (key == 'key') return;
    //     $('.theme-preset-' + i).on('click', function(e) {
    //         e.preventDefault();
    //         setTheme(key, true);
    //     })
    // })

    $('.theme-list').on('click', 'a', function(e) {
        e.preventDefault();
        var themeKey = $(this).data('theme');
        setTheme(themeKey, true);
    })

});

function setTheme(name, reset, props) {

    var savedTheme = getCookie('theme');
    if (savedTheme) {
        savedTheme = JSON.parse(savedTheme);
    } else {
        savedTheme = {};
    }

    var theme = presets[name], options, backgOptions;
    if (!theme) return;
    var prevThemeName = savedTheme['theme-name'];
    savedTheme['theme-name'] = name;

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
        if (isLoaded && props && !isHideThemeWarning) $('#theme_warning').modal('show');
    }

    savedTheme['theme-opts'] = theme;

    saveThemeToCookie(savedTheme);
    setActiveOptions(name, theme);

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
    if (!$('[data-theme="custom"]').length) {
        $('.theme-list').prepend('<li><a href="#" data-theme="custom">Custom</a></li>')
    }
}

function initThemeSettings() {

    var theme = getCookie('theme');
    var themeName, themeSet;

    if (theme) {
        theme = JSON.parse(theme);
        themeSet = theme['theme-opts'];
        themeName = theme['theme-name'];
    }
   
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

function saveThemeToCookie(theme) {
    setCookie('theme', JSON.stringify(theme), { expires: 2592000 });
}

function saveThemeToAccount(theme) {
    alert(JSON.stringify(theme));
}

function addThemeToList(theme) {
    var themeName = theme['theme-name'];
    presets[themeName] = theme['theme-opts'];
    $('.theme-list').append('<li><a href="#" data-theme="'+themeName+'">'+themeName+'</a></li>')
}

function getAllThemes() {
    $.ajax('themes.json').done(function(data){
        if (data.themes.length > 0) hideThemeWarning();
        data.themes.forEach(function(v) {
            var themeName = v['theme-name'];
            presets[themeName] = v['theme-opts']; 
            $('.theme-list').append('<li><a href="#" data-theme="'+themeName+'">'+themeName+'</a></li>');
        });
        initThemeSettings();
        isLoaded = true;
    })
}

function resetSaveThemeModal() {
    $('.save-theme-alert').hide();
    $('#save_theme_modal').modal('hide');
    $('#title-input').val('');
    $('#shared_theme').prop('checked', false);
}

function setActiveOptions(name, options) {
    setActiveThemeName(name);
    setActiveOption(fonts, options.fontFamily, 'reader-font');
    setActiveOption(fontStyles, options.fontStyle, 'reader-font-style');
    setActiveOption(fontSizes, options.fontSize, 'font-size');
    setActiveOption(fontInterval, options.fontInterval, 'font-interval');
    setActiveOption(textAlign, options.textAlign, 'text-align');
    setActiveOption(textIndent, options.textIndent, 'text-indent');
    setActiveOption(textPadding, options.textPadding, 'text-padding');
    setActiveBackground(options.backgroundImage);
    setActiveColorPicker('text', options.color);
    setActiveColorPicker('background', options.backgroundColor);
}

function setActiveThemeName(name) {
    $('*[data-theme]').removeClass('active-option')
    $('*[data-theme^="'+name+'"]').addClass('active-option');
}

function setActiveOption(arr, opt, className) {
    var index = arr.indexOf(opt);
    var sIndex = className == 'font-size' ? 1 : 0;
    $('*[class^="'+ className + '"]').removeClass('active-option');
    if (index != -1) {
        if (className == 'font-interval') index++;
        $('.' + className + '-' + index).addClass('active-option');
    } else {
        $('.' + className + '-' + sIndex).addClass('active-option');        
    }
}

function setActiveBackground(opt) {
    var index = textures.indexOf(opt);
    $('*[class*="bg-texture"]').removeClass('active-background');
    if (index != -1) {
        $('.bg-texture-' + index).addClass('active-background');
    }
}

function setActiveColorPicker(id, color) {
    if (color) {
        setTimeout(() => {
            $("#" + id + "-color-picker").spectrum("set", color);
        }, 500);
    }
}

function hideThemeWarning() {
    setCookie('hide-theme-warning', 1, { expires: 2592000 })
    isHideThemeWarning = true;
}

function isThemeNameValid(name) {
    if (!name) {
        $('.save-theme-alert').html('Theme name cannot be empty');
        $('.save-theme-alert').show();
        return;
    }

    for (var prop in presets) {
        if (name.toLowerCase() == prop.toLowerCase()) {
            $('.save-theme-alert').html('Theme name is already in use');
            $('.save-theme-alert').show();
            return;
        }
    }
    return true;
}


// // load recommended theme
// var themeLink = 'theme.json';

// if (themeLink) {
//     $('.theme-preset-3').show();
//     $.ajax(themeLink).done(function (data) {
//         presets.recommended = data;
//     });
// }    


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