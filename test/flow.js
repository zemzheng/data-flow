import flow from "../src";

describe( 'duz/tool/flow', function(){
    it( '404', function( done ){
        flow.start( 'unknow-api', {} )
            .catch( function( err ){
                if( /Flow\sno\sfound/.test( err.message ) ){
                    return true;
                } else {
                    return false;
                }
                // done();
            } )
            .then( function( result ){
                expect( result ).to.be.equal( true );
            } )
            .then( done )
            .catch( done )
    } );

    it( 'base', function( done ){
        flow.set( 'step1', {}, [
            function( data ){ data.id++; return data;},
            function( data ){ data.id++; return data;},
            function( data ){ data.id++; return data;},
            ] );
        flow.start( 'step1', { id : 1 } ).then( function( data ){
            data.id.should.equal( 4 );
            done();
        } );
    } );

    it( 'simple input', function( done ){
        var mark = +new Date;
        flow.set( 'simple-input', {}, [
            function( input ){
                input.should.equal( mark );
                return mark
            },
            function( input ){
                input.should.equal( mark );
                return { mark : mark };
            },
            function( input ){
                input.mark.should.equal( mark );
            }
        ] );
        flow.start( 'simple-input', mark ).then( done );
    } );

    it( 'simple input - catch error', function( done ){
        var mark = +new Date;
        flow.set( 'simple-input-catch-error', {}, [
            function( input ){
                input.should.equal( mark );
                return 1
            },
            (function(){
                var toFlow = function( config ){
                        function then( input ){
                            try{
                                input.should.not.equal( mark );
                            } catch( e ){
                                done( e );
                            }
                            throw new Error( mark );
                        }
                        then.catch = function( err ){
                            err.message.should.equal( mark + '' );
                            return mark;
                        }
                        return then;
                    }
                toFlow.shouldRun = true;
                return toFlow;
            })(),
            function( input ){
                input.should.equal( mark );
                return { mark : mark };
            },
            function( input ){
                input.mark.should.equal( mark );
            }
        ] );
        flow.start( 'simple-input-catch-error', mark ).then( done ).catch( done );
    } );

    it( 'flow in flow', function( done ){
        var mark = +new Date;
        flow.set( 'flow-1', {}, [ function( input ){ input.should.equal( mark ); done(); } ] );
        flow.set( 'flow-2', {}, [ flow( 'flow-1' ) ] );
        flow.start( 'flow-2', mark );
    } );

    it( 'wrap func', function(){
        flow.wrap( function(){} ).shouldRun.should.equal( true );
    } );


} );

