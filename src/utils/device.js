import {getCookie} from '@/utils/index'
module.exports = {
  // 获取设备信息
  getInfo: function() {
    return {
      os: this.getPlatform(), // 当前设备的操作系统信息
      ua: navigator.userAgent, // User Agent
      ip: '', // ip地址
      devid: getCookie('userDevId'),// 设备ID
      osv: this.getOsVersion(), // 当前设备操作系统的版本号信息
      w: window.screen.width, // 屏幕物理分辨率的高
      h: window.screen.height, //  屏幕物理分辨率的宽
      devicetype: this.getOsType(), // 当前设备类型信息
      // 屏幕逻辑分辨率：window.screen.width * window.devicePixelRatio (缩放因子与物理分辨率的乘积)
    }
  },
  // 当前设备的操作系统信息
  getPlatform: function () {
    var platform = -1; // 未知
    var u = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows"); // window
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1); // linux

    if (isAndroid) { // android
      platform = 1;
    }else if (isiOS) { // ios
      platform = 2;
    }else if (isWin) { // windows
      platform = 3;
    }else if (isLinux){ // linux
      platform = 4;
    }

    return platform;
  },
  // 当前设备操作系统的版本号信息
  getOsVersion: function() {
    let ua = navigator.userAgent;
    let version = '';
    if (ua.match(/iPhone/i) || ua.match(/iPod/i)) {
      var regStr_saf = /OS [\d._]*/gi
      var verinfo = ua.match(regStr_saf)
      version = (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
    } else if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
      version = ua.slice(ua.indexOf('Android') + 8, ua.indexOf('Android')+13);
    } else if (ua.indexOf('BB10') > -1) {
      version = ua.substr(ua.indexOf('BB10') + 5, ua.indexOf(";", ua.indexOf("BB10")) - ua.indexOf('BB10') - 5);
    } else if (ua.indexOf('IEMobile')) {
      version = ua.substr(ua.indexOf('IEMobile') + 9, ua.indexOf(";", ua.indexOf("IEMobile")) - ua.indexOf('IEMobile') - 9);
    }
    return version;
  },
  // 当前设备类型信息
  getOsType: function() {
    var ua = navigator.userAgent,
      isWindowsPhone = /(?:Windows Phone)/.test(ua),
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
      isAndroid = /(?:Android)/.test(ua), // android
      isFireFox = /(?:Firefox)/.test(ua),
      isChrome = /(?:Chrome|CriOS)/.test(ua), // chrome
      isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),// 平板
      isPhone = /(?:iPhone)/.test(ua) && !isTablet, // ios
      isPc = !isPhone && !isAndroid && !isSymbian;
    if(isAndroid || isPhone) {
      return 1; // 手机
    } else if(isTablet) {
      return 2; // 平板
    } else if(isPc) {
      return 3; // pc
    }
    return -1; // 未知
  }
};
