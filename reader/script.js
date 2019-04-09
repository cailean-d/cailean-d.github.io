$(document).ready(function() {
    

    if (getCookie('font-family')) {
        $('.reader .text').css('font-family', getCookie('font-family'));
    }

    if (getCookie('font-size')) {
        $('.reader .text').css('font-size', getCookie('font-size'));
    }

    if (getCookie('line-height')) {
        $('.reader .text').css('line-height', getCookie('line-height'));
    }

    if (getCookie('text-align')) {
        $('.reader .text').css('text-align', getCookie('text-align'));
    }

    if (getCookie('text-indent')) {
        $('.reader .text').css('text-indent', getCookie('text-indent'));
    }

    if (getCookie('text-color')) {
        $('.reader .text').css('color', getCookie('text-color'));
        $('.text-color-picker').css('border-bottom-color', getCookie('text-color'));
    }

    if (getCookie('background-color')) {
        $('.reader .text').css('background-color', getCookie('background-color'));
        $('.background-color-picker').css('border-bottom-color', getCookie('background-color'))
    }


    var opts = {
        color: '#000',
        showPalette: true,
        palette: [
            ['black', 'white', 'blanchedalmond'],
            ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
        ],
    }

    $("#text-color-picker").spectrum({
        ...opts,
        change: function(color) {
            $('.reader .text').css('color', color.toHexString());
            $('.text-color-picker').css('border-bottom-color', color.toHexString())
            setCookie('text-color', color.toHexString());
        }
    });
    $("#background-color-picker").spectrum({
        ...opts,
        change: function(color) {
            $('.reader .text').css('background-color', color.toHexString());
            $('.background-color-picker').css('border-bottom-color', color.toHexString())
            setCookie('background-color', color.toHexString())
        }
    });


    $('.font-arial').on('click', () => {
        $('.reader .text').css('font-family', 'Arial');
        setCookie('font-family', 'Arial');
    })
    $('.font-times').on('click', () => {
        $('.reader .text').css('font-family', 'Times New Roman');
        setCookie('font-family', 'Times New Roman');
    })
    $('.font-georgia').on('click', () => {
        $('.reader .text').css('font-family', 'Georgia');
        setCookie('font-family', 'Georgia');
    })
    $('.font-verdana').on('click', () => {
        $('.reader .text').css('font-family', 'Verdana');
        setCookie('font-family', 'Verdana');
    })


    $('.font-size-14').on('click', () => {
        $('.reader .text').css('font-size', '14px');
        setCookie('font-size', '14px');
    })
    $('.font-size-16').on('click', () => {
        $('.reader .text').css('font-size', '16px');
        setCookie('font-size', '16px');
    })
    $('.font-size-20').on('click', () => {
        $('.reader .text').css('font-size', '20px');
        setCookie('font-size', '20px');
    })
    $('.font-size-24').on('click', () => {
        $('.reader .text').css('font-size', '24px');
        setCookie('font-size', '24px');
    })


    $('.font-interval-0').on('click', () => {
        $('.reader .text').css('line-height', 'unset');
        setCookie('line-height', 'unset');
    })
    $('.font-interval-02').on('click', () => {
        $('.reader .text').css('line-height', '22px');
        setCookie('line-height', '20px');
    })
    $('.font-interval-04').on('click', () => {
        $('.reader .text').css('line-height', '24px');
        setCookie('line-height', '24px');
    })
    $('.font-interval-06').on('click', () => {
        $('.reader .text').css('line-height', '26px');
        setCookie('line-height', '26px');
    })


    $('.text-align-start').on('click', () => {
        $('.reader .text').css('text-align', 'start');
        setCookie('text-align', 'start');
    })
    $('.text-align-end').on('click', () => {
        $('.reader .text').css('text-align', 'end');
        setCookie('text-align', 'end');
    })
    $('.text-align-justify').on('click', () => {
        $('.reader .text').css('text-align', 'justify');
        setCookie('text-align', 'justify');
    })


    $('.text-indent-0').on('click', () => {
        $('.reader .text').css('text-indent', '0');
        setCookie('text-indent', '0');
    })
    $('.text-indent-min').on('click', () => {
        $('.reader .text').css('text-indent', '20px');
        setCookie('text-indent', '20px');
    })
    $('.text-indent-max').on('click', () => {
        $('.reader .text').css('text-indent', '40px');
        setCookie('text-indent', '40px');
    })
});



function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }


  function setCookie(name, value, options) {
    options = options || {};
  
    var expires = options.expires;
  
    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }
  
    value = encodeURIComponent(value);
  
    var updatedCookie = name + "=" + value;
  
    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }
  
    document.cookie = updatedCookie;
  }

  function deleteCookie(name) {
    setCookie(name, "", {
      expires: -1
    })
  }