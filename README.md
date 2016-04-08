# data-flow

[![Build Status](https://travis-ci.org/zemzheng/data-flow.svg?branch=master)](https://travis-ci.org/zemzheng/data-flow)

## install

```javascript
npm install data-flow
```

## usage

```javascript
import flow from "data-flow";

// flow.set( '<name>', '<config>', [ /* steps */ ] );
flow.set( 'step1', {}, [
    function( data ){ data.id++; return data;},
    function( data ){ data.id++; return data;},
    function( data ){ data.id++; return data;},
    function( data ){ data.id++; return data.id;},
] );
flow.start( 'step1', { id : 1 } ).then( function( data ){
    console.log( data ); // 4 
} );
```
