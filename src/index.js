/**
 * @author zemzheng (zemzheng@gmail.com)
 * @description 创建一个数据调用流，依赖 Promise
 **/

let DATA = {};

export function clear(){
    DATA = { "404" : get( "404" ) };
}

export function get( name ){
    switch( true ){
        case name instanceof Array:
            return {
                list : parseInput({ list : name, config : {} })
            }
        case 'string' === typeof name:
            return DATA[ name ];
        default:
            return name;
    }
}

export function list(){
    return DATA;
}

export function wrap( func ){
    func.shouldRun = true;
    return func;
}

function parseInput({ config, list }){
    function adjustInput( item, index ){
        let result;
        switch( true ){
            case 'function' === typeof item:
                if( item.shouldRun ){
                    // builder
                    result = adjustInput( item( config ), index );
                } else {
                    // then
                    result = {
                        then  : item,
                        catch : item.catch,
                    }
                }
                break;
            case item && 'function' === typeof item.then:
            case item && 'function' === typeof item.catch:
                result = {
                    then  : 'function' === typeof item.then  && item.then  ,
                    catch : 'function' === typeof item.catch && item.catch ,
                };
                break;
        }
        return result;
    };
    function wrapMethods( item, index ){
        item.index = index;
        let { then : _then, catch : _catch } = item,
            result = {};
        if( _then ){
            result.then = function( data ){
                return _then( data, { config, item, list } );
            }
        }
        if( _catch ){
            result.catch = function( err ){
                return _catch( err, { config, item, list } );
            }
        }
        return result;
    };

    return ( list || [] ).map( adjustInput ).filter( x => x ).map( wrapMethods );
}

export function set( name, config, list, update = false ){
    if( !name || 'string' !== typeof name ) return -1;
    if( get( name ) && !update ) return -2;
    DATA[ name ] = { config, list : parseInput({ config, list }) }
    return 0;
}

export function start( name, data ){
    if( !get( name ) ){
        return start( '404', { name, data } );
    }

    let { list, config } = get( name ),
        i  = 0,
        ii = list.length,
        item;

    let flow = new Promise( function( resolve ){ resolve( data ) } );

    while( i < ii ){
        let { then : _then, catch : _catch } = list[ i++ ];
        if( _then  ) flow = flow.then( _then  );
        if( _catch ) flow = flow.catch( _catch );
    }

    return flow;
}

export default function flow( name ){
    return function( data ){
        return start( name, data );
    }
}


// 错误处理，抛出错误并且
set( '404', {}, [
    (function(){
        let go = function( config ){
            return function( what ){
                var err = new Error( 'Flow no found ' + what.name );
                err.data = config;
                throw err;
            }
        };
        go.shouldRun = true;
        return go;
    })()
] );

flow.new   = flow;
flow.start = start;
flow.get   = get;
flow.set   = set;
flow.list  = list;
flow.wrap  = wrap;
flow.clear = clear;

