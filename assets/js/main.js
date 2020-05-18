// Polyfill from  https://github.com/MaxArt2501/base64-js/blob/master/base64.js
; (function () {
  // base64 character set, plus padding character (=)
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    // Regular expression to check formal correctness of base64 encoded strings
    b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/

  window.btoa =
    window.btoa ||
    function (string) {
      string = String(string)
      var bitmap,
        a,
        b,
        c,
        result = '',
        i = 0,
        rest = string.length % 3 // To determine the final padding

      for (; i < string.length;) {
        if (
          (a = string.charCodeAt(i++)) > 255 ||
          (b = string.charCodeAt(i++)) > 255 ||
          (c = string.charCodeAt(i++)) > 255
        ) {
          throw new TypeError("Failed to execute 'btoa'")
        }

        bitmap = (a << 16) | (b << 8) | c
        result +=
          b64.charAt((bitmap >> 18) & 63) +
          b64.charAt((bitmap >> 12) & 63) +
          b64.charAt((bitmap >> 6) & 63) +
          b64.charAt(bitmap & 63)
      }

      // If there's need of padding, replace the last 'A's with equal signs
      return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result
    }

  window.atob =
    window.atob ||
    function (string) {
      // atob can work with strings with whitespaces, even inside the encoded part,
      // but only \t, \n, \f, \r and ' ', which can be stripped.
      string = String(string).replace(/[\t\n\f\r ]+/g, '')
      if (!b64re.test(string)) {
        throw new TypeError("Failed to execute 'atob' ")
      }

      // Adding the padding if missing, for semplicity
      string += '=='.slice(2 - (string.length & 3))
      var bitmap,
        result = '',
        r1,
        r2,
        i = 0
      for (; i < string.length;) {
        bitmap =
          (b64.indexOf(string.charAt(i++)) << 18) |
          (b64.indexOf(string.charAt(i++)) << 12) |
          ((r1 = b64.indexOf(string.charAt(i++))) << 6) |
          (r2 = b64.indexOf(string.charAt(i++)))

        result +=
          r1 === 64
            ? String.fromCharCode((bitmap >> 16) & 255)
            : r2 === 64
              ? String.fromCharCode((bitmap >> 16) & 255, (bitmap >> 8) & 255)
              : String.fromCharCode((bitmap >> 16) & 255, (bitmap >> 8) & 255, bitmap & 255)
      }
      return result
    }
})()

var NOT_AVAILABLE = 'NOT_AVAILABLE'

function getBatteryLevel() {
  if (typeof navigator.getBattery !== undefined) {
    return navigator.getBattery()
  } else {
    return 'Not Available'
  }
}

function getRTT() {
  return navigator.connection.rtt
}

function getCompatibilities() {
  var myVideo = document.createElement('video')
  var compatibilites = [0, 0, 0, 0]

  if ('canPlayType' in myVideo) {
    if (myVideo.canPlayType('video/webm').length) {
      compatibilites[0] = '1'
    }
    if (myVideo.canPlayType('video/ogg').length) {
      compatibilites[1] = '1'
    }
    if (myVideo.canPlayType('video/mp4').length) {
      compatibilites[2] = '1'
    }
    if (myVideo.canPlayType('application/vnd.apple.mpegURL').length) {
      compatibilites[3] = '1'
    }
  }

  return compatibilites.join('')
}

function encode(string) {
  return btoa(string);
}

function decode(base64) {
  return atob(base64);
}

function encodeAndDecode(string) {
  var encoded = encode(string);
  addEncodingInfo(encoded);

  var decoded = decode(encoded);
  addElementToInfo(decoded);
}

function addEncodingInfo(encoded) {
  var encodingContainer = document.getElementById('encoding-info');
  encodingContainer.innerHTML = '';

  addElementToInfo(encoded, encodingContainer)
}

function addElementToInfo(encoded, encodingContainer) {
  var encodingContainer = document.getElementById('encoding-info');
  var encodingLabel = document.createElement('div')
  encodingLabel.innerHTML = encoded

  encodingContainer.appendChild(encodingLabel)
}

function encoder() {
  var info = {
    btl: NOT_AVAILABLE,
    btc: NOT_AVAILABLE,
    rtt: NOT_AVAILABLE,
    bmc: getCompatibilities(),
    plt: NOT_AVAILABLE
  }
  if ('platform' in navigator) {
    info.plt = navigator.platform
  }
  if ('connection' in navigator && 'rtt' in navigator.connection) {
    info.rtt = navigator.connection.rtt
  }
  if ('getBattery' in navigator) {
    navigator.getBattery().then(function (battery) {
      info.btl = battery.level
      info.btc = battery.charging

      encodeAndDecode(JSON.stringify(info));
    })
  } else {
    encodeAndDecode(JSON.stringify(info));
  }
}

encoder()
