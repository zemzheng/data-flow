# data-flow

[![Build Status](https://travis-ci.org/zemzheng/data-flow.svg?branch=master)](https://travis-ci.org/zemzheng/data-flow)

代码里总有一些 step 是要逐个执行，每一个 stepN 依赖上一个 stepN-1 的结果
```javascript
function step1(){ /* ... */ };
function step2(){ /* ... */ };
function step3(){ /* ... */ };
function step4(){ /* ... */ };
// step1 --> 4
step4( step3( step2( step1() ) ) );
```

所以在 underscore 里面我们看到这个方法 [_.compose](http://underscorejs.org/#compose)
```javascript
_.compose( step4, step3, step2, step1 );
```

但是 stepN 不一定总是成功完成，而且 stepN 有可能是一个异步(async)的过程

所以这里提供一个 DataFlow 的模式来处理上面的情况
```javascript
DataFlow.set( '<name>', { /* init config */ }, [ step1, step2, step3, step4, ... ] );
DataFlow.start( '<name>' /*, <init-data> */ );
```

## Base

* 依赖 promise

## Install

```javascript
npm install data-flow
```

## Usage

```javascript
import DataFlow from "data-flow"; // ES6
// or
var DataFlow = require( 'data-flow' ); // ES5

// Let's go
DataFlow.set( '<name>', '<config>', [ /* steps */ ] );

DataFlow.start( '<name>', <init-data> );
```

## Options

TODO

## Case

* API 设置 

有一个接口 api/get-list，可以使用 DataFlow 封装一下[ES5](http://babeljs.io/repl/#?evaluate=true&presets=es2015%2Cstage-0&experimental=false&loose=false&spec=false&code=%2F%2F%20%E8%AE%BE%E7%BD%AE%E6%8E%A5%E5%8F%A3%0D%0Afunction%20stepAjax(%20data%2C%20%7B%20config%20%7D%20)%7B%0D%0A%20%20%20%20let%20%7B%20url%20%7D%20%3D%20config%3B%0D%0A%20%20%20%20%2F%2F%20return%20Promise%20of%20an%20ajax(%20url%2C%20data%20)%0D%0A%7D%0D%0ADataFlow.set(%20'api%2Fget-list'%2C%20%7B%20url%20%3A%20'url%2Fto%2Fapi'%20%7D%2C%20stepAjax%20)%3B%0D%0A%0D%0A%2F%2F%20%E8%B0%83%E7%94%A8%E6%8E%A5%E5%8F%A3%0D%0A%2F%2F%20%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8%0D%0ADataFlow.start(%20'api-get-list'%2C%20%7B%20%2F*%20data%20*%2F%20%7D%20)%3B%0D%0A%2F%2F%20%E5%B0%81%E8%A3%85%E8%B0%83%E7%94%A8%0D%0Alet%20api%20%3D%20DataFlow(%20'api-get-list'%20)%3B%0D%0Aapi(%7B%20%2F*%20data%20*%2F%20%7D))

```javascript
// 设置接口
function buildAjaxStep( { url, method = 'get' } ){
    return ( data ) => {
        // @return {Promise}
        return ajax[ method ]( url, data )
    }
}
// 匿名使用
    DataFlow.start( [ buildAjaxStep({ url : 'api/get-list' }) ], /* data */ );

// 封装调用

    // 封装
    DataFlow.set( 'get-list', {}, [ buildAjaxStep({ url : 'api/get-list' }) ] );

    // 调用
    DataFlow.start( 'get-list', { /* data */ } );
    // or
    DataFlow( 'get-list' )( /* data */ );

```api/get-list

现在希望每次调用 api/get-list 的时候打个 log [ES5](http://babeljs.io/repl/#?evaluate=true&presets=es2015%2Cstage-0&experimental=false&loose=false&spec=false&code=function%20logAjax(%20data%2C%20%7B%20config%20%7D%20)%7B%0D%0A%20%20%20%20console.log(%20config%20)%3B%0D%0A%20%20%20%20return%20data%3B%0D%0A%7D%0D%0ADataFlow.set(%20'api%2Fget-list'%2C%20%7B%20url%20%3A%20'url%2Fto%2Fapi'%20%7D%2C%20%5B%20logAjax%2C%20stepAjax%20%5D%20)%3B)
```javascript
function logAjax( data, { config } ){
    console.log( config );
    return data;
}
DataFlow.set( 'api/get-list', { url : 'url/to/api' }, [ logAjax, stepAjax ] );
```
