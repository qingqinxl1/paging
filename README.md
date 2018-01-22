## 分页组件使用说明

### 依赖 jQuery 1.9.1+

## 引入方式

### ES6

`import Paging from '@cnpm/paging';`

### 普通引入方式

*引入paging/index.js之前需要引入jquery*

`<script type="text/javascript" src="http://n3.static.pg0.cn/fp/paging/dist/paging.js">`


### AMD
```javascript
require(['@cnpm/paging'], function(Paging){

  //cookie方法操作

})
```

## 调用方式

```javascript
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

  //jsonp回调参数值，即响应回来的jsonp函数名，不传的话默认为jquery自动生成
  jsonpCallbackName: '',

  //分页页码放置的外层容器ID
  paginationID: 'pagination',

  //数据渲染成功后是否跳转到页面顶部
  isGoTop: true
 });

chinasoPage.init();
```

### 参数调用说明
参数名 | 参数调用例子
--- | ---
jsonTotalPage | 可以是字符串类型，如：totalPage 或者函数类型
- | jsonTotalPage: function(data){
- | return Math.floor(data.totalCount / data.pageSize);
- | }

## 更新参数
```javascript
//params为&符号连接的字符串，如：&pageno=1&channel=XXX
chinasoPage.updateParams(params);
```
