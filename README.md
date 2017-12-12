## 分页组件使用说明

### 依赖 jQuery 1.9.1+

## 引入方式

### ES6

```
import Paging from '@cnpm/paging';
```

### 普通引入方式

*引入paging/index.js之前需要引入jquery*

`<script type="text/javascript" src="node_modules/@cnpm/paging/index.js">`


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
     callback: buildHtml, //列表渲染完成后的回调函数名，必填
     totalPage: 15, //默认总页数，可不传，默认为10
     url: '/data/search', //接口地址，必填
     params: 'q=食药&t=event&sm=1&so=1&n=20', //请求参数
     jsonTotalPageName: 'data.paramsVO.n', //返回数据中总页数的获取字段名，若不传，则默认加载最多10页数据
     pageIndexName: 'pageNo', //当前页请求参数名，默认为pageNo
     pageStart: 0, //第一页数据从0开始还是从1开始，默认从0开始
     datatype: 'json', //数据请求类型
     jsonpName: 'callback', //若请求类型为jsonp，默认请求为‘&callback=XXXXX’，传入参数将替换callback
     jsonpCallbackName: '' //默认jquery随机生成，例如传入odata则请求为callback=odata，响应为odata({...})
 });

chinasoPage.init();
```

## 更新参数
`chinasoPage.updateParams(params);`
