var utils = {
  addFixedMask:function(filter){
    if($("#mask").length>0){
      return;
    }
    var opacity=filter||0.5;
    console.log(opacity)
    var mask='<div id="mask" style="background-color: rgba(0, 0, 0, '+opacity+'); z-index: 1000; position: absolute;' +
        ' left: 0px; right: 0px; top: 0px; bottom: 0px;"'+'></div>';
    $("body").append(mask);
    this.stopPreventDefault("mask");
  },
  addMask:function(){
    if($("#mask").length>0){
      return;
    }
    var mask='<div id="mask" style="background-color: rgba(0, 0, 0, 0.5); z-index: 1000; position: fixed;' +
        ' left: 0; right: 0; top: 0; bottom: 0;height:100%;"'+'></div>';
    $("body").append(mask);
    this.stopPreventDefault("mask");
  },
  addLoadMask:function(){
    if($("#loadMask").length>0){
      return;
    }
    var height= $(document).height();
    var mask='<div id="loadMask" style="background-color: rgba(0, 0, 0, 0.5); z-index: 100; position: absolute;' +
        ' left: 0px; right: 0px; top: 0px; bottom: 0px; height:100%"><p style="text-align: center; padding-top:150px;"><img src="/console/img/loading.gif"/></p></div>';
    $("body").append(mask);
  },
  addLoading:function(){
    if($(".loading").length>0){
      $(".loading").show();
    }else{
      $("body").append('<div class="loading"></div>');
    }
  },
  removeMask:function(){
    $("#mask").remove();
  },
  removeLoadMask:function(){
    $("#loadMask").remove();
  },
  removeLoading:function(){
    $(".loading").remove();
  },
  alertMsg:function(msg){
    var msgDiv='<div class="confirm" id="confirm"><div class="content">'+msg+'</div>' +
        '<div class="confirm-bottom confirm-bottom-single"><a href="javascript:;" id="btn-confirm">确认</a></div></div>';
    this.addMask()
    $("body").append(msgDiv);
  },
  alertConfirmMsg:function(msg,ok,cancle){
    var msgDiv='<div class="confirm" id="confirm"><div class="content">'+msg+'</div>' +
        '<div class="confirm-bottom"><a href="javascript:;" id="btn-confirm">确认</a><a href="javascript:;" id="btn-cancel-confirm">取消</a></div></div>';
    this.addMask()
    $("body").append(msgDiv);
    if(ok){
      $("#btn-confirm").click(function(){
        ok()
      })
    }
    if(cancle){
      $("#btn-cancel-confirm").click(function(){
        cancle()
      })
    }
  },
  alertConfirmMsgSingle:function(msg,ok){
    var msgDiv='<div class="confirm" id="confirm"><div class="content">'+msg+'</div>' +
        '<div class="confirm-bottom"><a href="javascript:;" id="btn-confirm" style="border: none">确认</a></div></div>';
    this.addMask()
    $("body").append(msgDiv);
    if(ok){
      $("#btn-confirm").click(function(){
        ok()
      })
    }
  },
  alertMsgTip:function(msg){
    if($("#msg-tip").length>0){
      return;
    }
    var msgDiv='<div class="msg-tip" id="msg-tip""><span>'+msg+'</span></div>';
    $("body").append(msgDiv);
    setTimeout(function(){
      $("#msg-tip").remove();
    },1500)
  },
  removeMsg:function(){
    $("#confirm").remove();
    $("#mask").remove();
  },
  getScrollHeight: function () {//取文档内容实际高度
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  },
  getScrollTop: function () {//取窗口滚动条高度
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  },
  getClientHeight: function () {//取窗口可视范围的高度
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    else {
      var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
  },
  getfiexdTop:function(height){
    var scrollTop=$(window).scrollTop();
    return height+scrollTop;
  },
  stopPreventDefault:function(id){
    document.getElementById(id).addEventListener('touchmove',function(e){
      e.preventDefault();
    },false)
  },
  pageScroll:function(){
    window.scrollBy(0,-80);
    var scrolldelay = setTimeout('juhai.utils.pageScroll()',10);
    var sTop=document.documentElement.scrollTop+document.body.scrollTop;
    if(sTop==0) clearTimeout(scrolldelay);
  },
  whichTransitionEvent: function () {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    }
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  },

  goTop:function(top){
    $(window).on("scroll",function(){
      var st = $(this).scrollTop();
      if (st >top){
        $(".gotop-btn").show();
      } else {
        $(".gotop-btn").hide();
      }
    });
    $(".gotop-btn").on("click",function(e){
      $(window).scrollTop(0)
    })
  },
  containsHtml:function containsHtml(value) {
    return /<.[^<>]*?>/.test(value) || /&[#a-z0-9]+?;/i.test(value) || /[<>]/.test(value);
  }
};

utils.getCurentTime=function(){
  var now = new Date();
  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日
  var hh = now.getHours();            //时
  var mm = now.getMinutes();          //分
  var clock = year + "-";
  if(month < 10)
    clock += "0";
  clock += month + "-";
  if(day < 10)
    clock += "0";
  clock += day + " ";
  if(hh < 10)
    clock += "0";
  clock += hh + ":";
  if (mm < 10) clock += '0';
  clock += mm;
  return(clock);
}

utils.getRequest =function() {
  var url = decodeURIComponent(location.search);
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
      theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

utils.autoImgHeight=function(){
  var img_width = $(".vodlist li:first-child").find("img").width();
  var img_height = Math.floor(img_width*1.38);
  $(".vodlist li").find("img").attr("height",img_height);
}
utils.autoImgHeightVod=function(){
  var img_width = $(".vodlist li:first-child").find("img").width();
  var img_height = Math.floor(img_width*0.71);
  $(".vodlist li").find("img").height(img_height);
}

utils.fommatDate=function(time,type){
  var d = new Date(time),month,date,hours,minutes,second;
  if(parseInt(d.getSeconds())<10){
    second="0"+d.getSeconds();
  }else{
    second=d.getSeconds();
  }
  if(parseInt(d.getMinutes())<10){
    minutes="0"+d.getMinutes();
  }else{
    minutes=d.getMinutes();
  }
  if(parseInt(d.getHours())<10){
    hours="0"+d.getHours();
  }else{
    hours=d.getHours();
  }
  if(parseInt(d.getDate())<10){
    date="0"+d.getDate();
  }else{
    date=d.getDate();
  }
  if((d.getMonth()+1)<10){
    month="0"+(d.getMonth()+1);
  }else{
    month=d.getMonth()+1;
  }
  if(type==2){
    return month+"-"+date+" "+hours+":"+minutes;
  }
  if(type==1){
    return hours+":"+minutes;
  }
  return d.getFullYear()+"-"+month+"-"+date+" "+hours+":"+minutes+":"+second;
}

utils.getDateDiff=function(dateTimeStamp){
  //JavaScript函数：
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if(diffValue < 0){
    //若日期不符则弹出窗口告之
    //alert("结束日期不能小于开始日期！");
  }
  var monthC =diffValue/month;
  var yearC =monthC/12;
  var weekC =diffValue/(7*day);
  var dayC =diffValue/day;
  var hourC =diffValue/hour;
  var minC =diffValue/minute;
  var result;
  if(yearC>=1){
    result=parseInt(yearC) + "年前";
  }
  else if(monthC>=1){
    result=parseInt(monthC) + "个月前";
  }
  else if(weekC>=1){
    result=parseInt(weekC) + "周前";
  }
  else if(dayC>=1){
    result=parseInt(dayC) +"天前";
  }
  else if(hourC>=1){
    result=parseInt(hourC) +"个小时前";
  }
  else if(minC>=1){
    result=parseInt(minC) +"分钟前";
  }else
    result="刚刚发表";
  return result;
}

utils.browser={
  versions:function(){
    var u = navigator.userAgent, app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  }()
};


utils.isLogin=0; /*0未登录 1登入*/
utils.checkLogin=function(){
  $.ajax({
    url:"/ucenter/user/basic.do",
    dataType:'json',
    success:function(data,textStatus,xhr){
      $(".user").html('<a href="/console/control/service.html">'+data.username+'</a>').show();
      $(".login-out").show();
      $(".login-in").hide()
      $(".register").hide()
    },
    error:function(xhr,textStatus,errorThrown){
      //var response = eval("("+xhr.responseText+")");
      if(location.href.indexOf("control")>-1){
        window.parent.location.href="../login.html"
       }else{
        // utils.alertMsgTip(response.message)
       }
    }
  })
}
utils.validate={
  isEmail:function(str){
    reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if(!reg.test(str)){
      return false
    }
    return true;
  },
  isMobile:function(str){
    reg=/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/;
    if(!reg.test(str)){
      return false
    }
    return true;
  }
}

utils.checkLogin();


//格式化日期
function formatDate(time, format){
  var t = new Date(time);
  var tf = function(i){return (i < 10 ? '0' : '') + i};
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
    switch(a){
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}

//格式化JSON 展示
function formatJson(json, options) {
  var reg = null,
      formatted = '',
      pad = 0,
      PADDING = '    '; // one can also use '\t' or a different number of spaces

  // optional settings
  options = options || {};
  // remove newline where '{' or '[' follows ':'
  options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
  // use a space after a colon
  options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

  // begin formatting...

  // make sure we start with the JSON as a string
  if (typeof json !== 'string') {
    json = JSON.stringify(json);
  }
  // parse and stringify in order to remove extra whitespace
  json = JSON.parse(json);
  json = JSON.stringify(json);

  // add newline before and after curly braces
  reg = /([\{\}])/g;
  json = json.replace(reg, '\r\n$1\r\n');

  // add newline before and after square brackets
  reg = /([\[\]])/g;
  json = json.replace(reg, '\r\n$1\r\n');

  // add newline after comma
  reg = /(\,)/g;
  json = json.replace(reg, '$1\r\n');

  // remove multiple newlines
  reg = /(\r\n\r\n)/g;
  json = json.replace(reg, '\r\n');

  // remove newlines before commas
  reg = /\r\n\,/g;
  json = json.replace(reg, ',');

  // optional formatting...
  if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
    reg = /\:\r\n\{/g;
    json = json.replace(reg, ':{');
    reg = /\:\r\n\[/g;
    json = json.replace(reg, ':[');
  }
  if (options.spaceAfterColon) {
    reg = /\:/g;
    json = json.replace(reg, ': ');
  }

  $.each(json.split('\r\n'), function(index, node) {
    var i = 0,
        indent = 0,
        padding = '';

    if (node.match(/\{$/) || node.match(/\[$/)) {
      indent = 1;
    } else if (node.match(/\}/) || node.match(/\]/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }

    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }

    formatted += padding + node + '\r\n';
    pad += indent;
  });

  return formatted;
};

// flatten({foo: {bar: "xxx"}}) === { 'foo.bar': 'xxx' }
function flatten(object) {
  var result = {};
  function iterate1(key, value) {
    if (value && typeof value === 'object') {
      iterate0(key + ".", value);
    } else {
      result[key] = value;
    }
  }
  function iterate0(prefix, object) {
    for (var k in object) {
      iterate1(prefix + k, object[k]);
    }
  }
  iterate0("", object);
  return result;
}

//获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}



//判断2个对象文本值是否相等
function isObjectValueEqual(a, b) {
  // Of course, we can do it use for in
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  // If we made it this far, objects
  // are considered equivalent
  return true;
}

//判断2个对象key是否相等
function isObjectKeyEqual(a, b) {
  var v1 =flatten(a);
  var v2 =flatten(b);
  var aProps = Object.getOwnPropertyNames(v1);
  var bProps = Object.getOwnPropertyNames(v2);
  if (aProps.length != bProps.length) {
    return false;
  }
  for(var i=0;i<aProps.length;i++){
    if($.inArray(aProps[i], bProps)==-1){
      return false;
    }
  }
  return true;
}

//返回obj1对象相对obj2对象减少的和增加的对象
function differenceObj(obj1,obj2){

  var p1len= 0,p2len= 0,p1lenTemp=0,p2lenTemp=0,tempDlete={},tempAdd={};

  for(n1 in obj1){
    p1len++;
  }
  for(n2 in obj2){
    p2len++;
  }
  console.log(p1len+" "+p2len)

  for(n1 in obj1){
    p2lenTemp=0;
    for(n2 in obj2){
      p2lenTemp++;
      if(n1==n2){
        break;
      }else{
        if(p2lenTemp==p2len){
          tempDlete[n1]=obj1[n1]
        }
      }
    }
  }

  for(n2 in obj2){
    p1lenTemp=0;
    for(n1 in obj1){
      p1lenTemp++;
      if(n2==n1){
        break;
      }else{
        if(p1lenTemp==p1len){
          tempAdd[n2]=obj2[n2]
        }
      }
    }
  }

  var result={};
  if($.isEmptyObject(tempDlete)){
    result.tempDlete={}
  }else{
    result.tempDlete=tempDlete
  }
  if($.isEmptyObject(tempAdd)){
    result.tempAdd={}
  }else{
    result.tempAdd=tempAdd
  }

  return result;
}


function gotoControl(url){
  $.ajax({
    url:"/ucenter/user/basic.do",
    dataType:'json',
    success:function(data,textStatus,xhr){
      location.href=url;
    },
    error:function(xhr,textStatus,errorThrown){
      location.href="/console/login.html"
    }
  })
}


if($(document).height()>$("body").height()){
  $(".ft-modal-footer").addClass("fixed-bottom")
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  var pluses = /\+/g;

  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      // If we can't parse the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '));
      return config.json ? JSON.parse(s) : s;
    } catch(e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }

  var config = $.cookie = function (key, value, options) {

    // Write

    if (value !== undefined && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setTime(+t + days * 864e+5);
      }

      return (document.cookie = [
        encode(key), '=', stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }

    // Read

    var result = key ? undefined : {};

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling $.cookie().
    var cookies = document.cookie ? document.cookie.split('; ') : [];

    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      var name = decode(parts.shift());
      var cookie = parts.join('=');

      if (key && key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value);
        break;
      }

      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }

    return result;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    if ($.cookie(key) === undefined) {
      return false;
    }

    // Must not alter options, thus extending a fresh object...
    $.cookie(key, '', $.extend({}, options, { expires: -1 }));
    return !$.cookie(key);
  };

}));
