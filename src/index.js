/**
 * 公共分页组件，支持页面中有多个分页
 * @example /demo/paging.html
 */
(function (root, factory) {
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
}(this, function ($) {
  /**
   * 分页构造函数
   * @param  {Object} options 传入的参数，具体说明见defaults
   */
  var Paging = function (options) {
    this.defaults = {
      //列表渲染完成后的回调函数名
      callback: null,
      //总页数，默认为10页
      totalPage: 10,
      //接口地址
      url: '',
      //请求参数
      params: '',
      //返回数据中总页数字段名或者计算总页数函数，若不传，则默认加载最多10页数据
      jsonTotalPage: '',
      //当前页请求参数名，默认为pageNo
      pageIndexName: 'pageNo',
      //第一页数据从0开始还是从1开始，默认从0开始
      pageStart: 0,
      //数据请求类型
      datatype: 'json',
      //jsonp回调参数名
      jsonpName: 'callback',
      //jsonp回调参数值，即响应回来的jsonp函数名
      jsonpCallbackName: '',
      //分页页码放置的外层容器ID
      paginationID: 'pagination',
      //数据渲染成功后是否跳转到页面顶部
      isGoTop: true
    };
    this.defaults = $.extend(this.defaults, options);
  };

  Paging.prototype.sendAjax = function (pageNo) {
    var T = this;
    var defs = T.defaults;
    var params = defs.params;
    var newPageNo = defs.pageStart === 0 ? pageNo - 1 : pageNo;

    var sendOpt = {
      type: 'get',
      url: defs.url,
      data: params + '&' + defs.pageIndexName + '=' + newPageNo,
      dataType: defs.datatype || 'json'
    };

    // 若请求类型为jsonp类型，则设置jsonp相关属性
    if (defs.datatype === 'jsonp') {
      sendOpt.jsonp = defs.jsonpName;
      if (defs.jsonpCallbackName) {
        sendOpt.jsonpCallback = defs.jsonpCallbackName;
      }
    }
    $.ajax(sendOpt).done(function (data) {
      T.buildHtml(data, pageNo);
    });
  };

  /**
   * 列表数据结构生成，仅负责将数据传递给构造函数中的回调函数，不做代码拼接
   * @param  {Object} data ajax请求成功后返回来的数据
   * @param  {Number} pageNo 当前页码
   */
  Paging.prototype.buildHtml = function (data, pageNo) {
    var T = this;
    var defs = T.defaults;

    if (typeof defs.jsonTotalPage === 'function') {
      defs.totalPage = defs.jsonTotalPage(data);
    } else if (typeof defs.jsonTotalPage === 'string') {
      defs.totalPage = eval('data.' + defs.jsonTotalPage);
    }

    //分页页码生成
    T.setPage($('#' + defs.paginationID), defs.totalPage, pageNo);

    if (typeof defs.callback === 'function') {
      defs.callback(data);
    }
  };

  /**
   * 分页页码生成
   * @param  {jQuery Dom} container 分页页码放置的外层div
   * @param  {Number} count 总页数
   * @param  {Number} pageindex 当前页码
   */
  Paging.prototype.setPage = function (container, count, pageindex) {
    var a = [];
    var T = this;
    var i;
    var iPageIdx = parseInt(pageindex, 10);
    var iCount = parseInt(count, 10);
    var pageBar = $('<div class="fp_page_bar"></div>');
    var $pageBar = container.find('.fp_page_bar');

    if (!container) return false;
    if (!$pageBar.length) {
      container.append(pageBar);
      $pageBar = pageBar;
    }

    if (iCount > 1) {
      //总页数少于10 全部显示,大于10 显示前3 后3 中间3 其余....
      if (iPageIdx === 1) {
        a[a.length] = '<span class="page_pre">上一页</span>';
      } else {
        a[a.length] = '<span class="page_pre"><a href="">上一页</a></span>';
      }

      //总页数小于10
      if (iCount <= 10) {
        //列出所有的页码
        for (i = 1; i <= iCount; i += 1) {
          T.setPageList(a, i, iPageIdx);
        }
      } else { //总页数大于10页
        if (iPageIdx <= 4) {
          //当前页码小于等于4时，展示前5的页码，然后...然后展示最后一页页码，例如总共11页当前为第3页，展示如下：
          //1 2 3 4 5 ... 11
          for (i = 1; i <= 5; i += 1) {
            T.setPageList(a, i, iPageIdx);
          }
          a[a.length] = '...<span><a href="">' + iCount + '</a></span>';
        } else if (iPageIdx >= iCount - 3) {
          //当前页码大于等于总页码-3时，展示第一页，然后...然后展示最后5页，如总共11页当前第9页，展示如下：
          //1 ... 7 8 9 10 11
          a[a.length] = '<span><a href="">1</a></span>...';
          for (i = iCount - 4; i <= iCount; i += 1) {
            T.setPageList(a, i, iPageIdx);
          }
        } else {
          //当前页在中间部分(即非前4页，也非后4页)，展示第一页，然后...然后展示当前页码及它的前后两个页码，
          //再然后...后展示最后一页页码，如总共11页当前第6页，展示如下：
          //1 ... 4 5 6 7 8 ... 11
          a[a.length] = '<span><a href="">1</a></span>...';
          for (i = iPageIdx - 2; i <= iPageIdx + 2; i += 1) {
            T.setPageList(a, i, iPageIdx);
          }
          a[a.length] = '...<span><a href="">' + iCount + '</a></span>';
        }
      }

      if (iPageIdx === iCount) {
        a[a.length] = '<span class="page_next">下一页</span>';
      } else {
        a[a.length] = '<span class="page_next"><a href="">下一页</a></span>';
      }
      $pageBar.html(a.join(''));
      container.show();
      T.bindPageClick(container, iPageIdx, iCount);
    } else {
      container.hide();
    }
  };

  Paging.prototype.setPageList = function (aArr, i, curIdx) {
    var a = aArr;
    if (curIdx === i) {
      a[a.length] = '<span>' + i + '</span>';
    } else {
      a[a.length] = '<span><a href="">' + i + '</a></span>';
    }
  };

  /**
   * 分页页码点击事件
   * @param  {jQuery Dom} container 分页页码放置的外层div
   * @param  {Number} pageindex 当前页码
   * @param  {Number} count 总页数
   */
  Paging.prototype.bindPageClick = function (container, pageindex, count) {
    var T = this;
    var oAlink = container.find('span');
    var firstLink = oAlink.first();
    var lastLink = oAlink.last();
    var midLink = oAlink.slice(1, oAlink.length - 1);
    var inx = pageindex; //初始的页码
    var hrefs = container.find('a');

    //点击上一页
    firstLink.on('click', function () {
      if (inx === 1) {
        return false;
      }
      inx -= 1;
      T.sendAjax(inx);
    });

    //点击页码
    midLink.on('click', function () {
      var childA = $(this).find('a');
      if (childA.length) {
        inx = parseInt(childA.text(), 10);
        T.sendAjax(inx);
      } else {
        return false;
      }
    });

    //点击下一页
    lastLink.on('click', function () {
      if (inx === count) {
        return false;
      }
      inx += 1;
      T.sendAjax(inx);
    });

    //页码生成完毕后是否跳转到页面顶部
    if (T.defaults.isGoTop) {
      $(document).scrollTop(0);
    }


    //处理ie6下点击span里头的a标签无反应的问题.
    //处理办法：将之前a里头的javascript:void(0)删掉，使用return false来阻止a的默认跳转事件，点击a后事件正常冒泡到span.
    hrefs.on('click', function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else if (e.returnValue) {
        e.returnValue = false;
      } else {
        return false;
      }
    });
  };

  Paging.prototype.init = function () {
    var T = this;
    T.sendAjax(1);
  };

  /**
   * 更新参数
   * @param  {String} params 参数内容
   */
  Paging.prototype.updateParams = function (params) {
    var T = this;
    T.defaults.params = params;
    T.sendAjax(1);
  };
  return Paging;
}));
