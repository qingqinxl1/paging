## 分页组件使用说明

### 依赖 jQuery 1.9.1+

## 引入方式

### ES6

```
import Paging from '@cnpm/paging';
```

### 普通引入方式

*引入paging/index.js之前需要引入jquery*

`<script type="text/javascript" src="http://n3.static.pg0.cn/fp/paging/dist/index.js">`


### AMD
```
require(['@cnpm/paging'], function(Paging){

  //cookie方法操作

})
```

## 调用方式

```
//创建回调函数
function buildHtml(data) {
  console.log(data);
}

//创建分页实例
var chinasoPage = new Paging({
  //列表渲染完成后的回调函数名，必填
  callback: null,

  //总页数，默认为10页
  totalPage: 10,

  //接口地址，必填
  url: '',

  //请求参数
  params: '',

  //返回数据中总页数的获取字段名，若不传，则默认加载最多10页数据
  jsonTotalPageName: '',

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
 });

chinasoPage.init();
```

## 更新参数
`chinasoPage.updateParams(params);`
