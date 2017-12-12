/**
 * 公共分页组件，支持页面中有多个分页
 * @param {object} options 传入的参数，具体说明见defaults
 * @example
    var Paging = new Paging({
        callback: buildHtml, //列表渲染完成后的回调函数名，必填
        totalPage: 10, //默认总页数，可不传，默认为10
        url: '/data/search', //接口地址，必填
        params: 't=event&sm=0&so=1&p=0&n=1', //请求参数
        pageIndexName: 'p', //当前页请求参数名，默认为pageNo
        pageStart: 0, //第一页数据从0开始还是从1开始，默认从0开始
        datatype: 'json', //数据请求类型
        jsonTotalPageName: '' //返回数据中总页数的获取字段名，若不传，则默认加载最多10页数据
    });
    Paging.init();
 */
/**
 * Cookie 操作工具类，包含获取、增加、删除cookie、cookie中文字符解码功能
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // 浏览器全局变量(root 即 window)
    root.Paging = factory(root.jQuery);
  }
}(this, function($) {
  var Paging = function(options) {
    this.defaults = {
      callback: null, //列表渲染完成后的回调函数名
      totalPage: 10, //总页数，默认为10页
      url: '', //接口地址
      params: '', //请求参数
      jsonTotalPageName: '', //返回数据中总页数的获取字段名，若不传，则默认加载最多10页数据
      pageIndexName: 'pageNo', //当前页请求参数名，默认为pageNo
      pageStart: 0, //第一页数据从0开始还是从1开始，默认从0开始
      datatype: 'json', //数据请求类型
      jsonpName: 'callback', //jsonp回调参数名
      jsonpCallbackName: '' //jsonp回调参数值，即响应回来的jsonp函数名
    };
    this.defaults = $.extend(this.defaults, options);

    this.sendAjax = function(pageNo) {
      var T = this;
      var params = T.defaults.params;
      var newPageNo = T.defaults.pageStart === 0 ? pageNo - 1 : pageNo;

      if (newPageNo !== undefined) {
        params = params + '&' + T.defaults.pageIndexName + '=' + newPageNo;
      }

      var sendOpt = {
        type: 'get',
        url: T.defaults.url,
        data: params,
        dataType: T.defaults.datatype || 'json'
      };
      if ('jsonp' === T.defaults.datatype) {
        sendOpt.jsonp = T.defaults.jsonpName;
        if (T.defaults.jsonpCallbackName) {
          sendOpt.jsonpCallback = T.defaults.jsonpCallbackName;
        }
      }
      $.ajax(sendOpt).done(function(data) {
        if (T.defaults.jsonTotalPageName) {
          T.defaults.totalPage = eval(T.defaults.jsonTotalPageName);
        }
        T.setPage(document.getElementById('pagination'), T.defaults.totalPage, pageNo);

        if (typeof T.defaults.callback === "function") {
          T.defaults.callback(data);
        }
      });
    };

    //container为分页页码放置的外层div，count为总页数，pageindex为当前页码
    this.setPage = function(container, count, pageindex) {
      if (!container) return false;
      var a = [],
        prevPage = pageindex - 1, //上一页
        nextPage = pageindex + 1,
        T = this;

      if (count > 1) {
        //总页数少于10 全部显示,大于10 显示前3 后3 中间3 其余....
        if (pageindex == 1) {
          a[a.length] = "<span class=\"page_pre\">上一页</span>";
        } else {
          a[a.length] = "<span class=\"page_pre\"><a href=\"\">上一页</a></span>";
        }

        function setPageList() {
          if (pageindex == i) {
            a[a.length] = "<span>" + i + "</span>";
          } else {
            a[a.length] = "<span><a href=\"\">" + i + "</a></span>";
          }
        }
        //总页数小于10
        if (count <= 10) {
          for (var i = 1; i <= count; i++) {
            setPageList();
          }
        } else { //总页数大于10页
          if (pageindex <= 4) {
            for (var i = 1; i <= 5; i++) {
              setPageList();
            }
            a[a.length] = "...<span><a href=\"\">" + count + "</a></span>";
          } else if (pageindex >= count - 3) {
            a[a.length] = "<span><a href=\"\">1</a></span>...";
            for (var i = count - 4; i <= count; i++) {
              setPageList();
            }
          } else { //当前页在中间部分
            a[a.length] = "<span><a href=\"\">1</a></span>...";
            for (var i = pageindex - 2; i <= pageindex + 2; i++) {
              setPageList();
            }
            a[a.length] = "...<span><a href=\"\">" + count + "</a></span>";
          }
        }

        if (pageindex == count) {
          a[a.length] = "<span class=\"page_next\">下一页</span>";
        } else {
          a[a.length] = "<span class=\"page_next\"><a href=\"\">下一页</a></span>";
        }
        container.innerHTML = a.join("");
        //事件点击
        var pageClick = function() {
          var oAlink = container.getElementsByTagName("span");
          var inx = pageindex; //初始的页码
          oAlink[0].onclick = function() { //点击上一页
            if (inx == 1) {
              return false;
            }
            inx--;
            T.sendAjax(inx);
          };
          for (var i = 1; i < oAlink.length - 1; i++) { //点击页码
            oAlink[i].onclick = function() {
              var childA = this.getElementsByTagName('a');
              if (childA.length) {
                inx = parseInt(childA[0].innerHTML);
                T.sendAjax(inx);
              } else {
                return false;
              }
            };
          }
          oAlink[oAlink.length - 1].onclick = function() { //点击下一页
            if (inx == count) {
              return false;
            }
            inx++;
            T.sendAjax(inx);
          };
          $(document).scrollTop(0);

          //处理ie6下点击span里头的a标签无反应的问题.
          //处理办法：将之前a里头的javascript:void(0)删掉，使用return false来阻止a的默认跳转事件，点击a后事件正常冒泡到span.
          var hrefs = container.getElementsByTagName('a');
          for (var j = 0, jLen = hrefs.length; j < jLen; j++) {
            hrefs[j].onclick = function(e) {
              // e.preventDefault();
              return false;
            }
          }
        }();
        container.style.display = 'block';
      } else {
        container.style.display = 'none';
      }
    };
  };

  Paging.prototype.init = function() {
    var T = this;
    T.sendAjax(1);
  };

  Paging.prototype.updateParams = function(params) {
    var T = this;
    T.defaults.params = params;
    T.sendAjax(1);
  };
  return Paging;
}));
