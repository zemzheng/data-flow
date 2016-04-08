import flow, { start, set, get, clear } from "../src";

function buildCase( run ){
    return function(){
        it( 'step', function( done ){
            let isDone;
            run(
                [
                    ( input ) => input + 1,
                ],
                1
            ).then( ( input ) => {
                isDone = true;
                input.should.equal( 2 );
            } ).then( () => {
                done( isDone ? undefined : new Error( 'no catch' ) )
            } );
        } );
        it( 'step by step', function( done ){
            let isDone;
            run(
                [
                    ( input ) => input + 1,
                    ( input ) => input + 2,
                ],
                1
            ).then( ( input ) => {
                isDone = true;
                input.should.equal( 4 );
            } ).then( () => {
                done( isDone ? undefined : new Error( 'no catch' ) )
            } );
        } );
        it( 'catch', function( done ){
            let input = 'error', isDone;
            run(
                [
                    ( input ) => {
                        throw new Error( input )
                    }
                ],
                input
            ).catch( ( err ) => {
                isDone = true;
                err.message.should.equal( input );
            } ).then( () => {
                done( isDone ? undefined : new Error( 'no catch' ) )
            } );
        } );
        it( 'catch to then', function( done ){
            let input = 'error', isDone;
            run(
                [
                    ( input ) => {
                        throw new Error( input )
                    },
                    { catch : ( err ) => { return err.message } }
                ],
                input
            ).then( ( message ) => {
                isDone = true;
                message.should.equal( input );
            } ).then( () => {
                done( isDone ? undefined : new Error( 'no catch' ) )
            } );
        } );

        it( 'flow in flow', function( done ){
            let input = 1, isDone;
            run(
                [
                    ( input ) => run( [
                        ( input ) => input + 1
                    ], input )
                ], 
                input
            ).then( ( input ) => {
                isDone = true;
                input.should.equal( 2 );
            } ).then( () => {
                done( isDone ? undefined : new Error( 'no catch' ) )
            } );
        } );
    }
}

describe( __filename, function(){
    it( 'import', function(){
        flow.start.should.equal( start );
        flow.clear.should.equal( clear );
        flow.set.should.equal( set );
        flow.get.should.equal( get );
    } );

    describe( 'anonymous', buildCase( start ) );
    describe( 'get - set', buildCase( function( list, input ){
        clear();
        let tmpName = `R${ +new Date }-${ Math.random() }`;
        set( tmpName, {}, list );
        return start( tmpName, input );
    } ) );
    describe( 'flow', buildCase( function( list, input ){
        clear();
        let tmpName = `R${ +new Date }-${ Math.random() }`;
        set( tmpName, {}, list );
        return flow( tmpName )( input );
    } ) );
} );
