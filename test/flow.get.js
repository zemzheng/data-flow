import flow, { get, set, clear } from "../src";

describe( 'duz/tool/flow.get', function(){
    it( 'import', function(){
        clear();
        flow.get.should.equal( get );
    } );

    it( 'get func', function(){
        clear();
        let func = function(){},
            { list, config } = { list : [ func, { then : func, catch : func }, func ], config : {} };

        flow.set( 'abc', config, list );

        flow.get( 'abc' ).list.length.should.equal( list.length );
        flow.get( 'abc' ).list[0].then.should.be.a( 'function' );
        flow.get( 'abc' ).list[1].then.should.be.a( 'function' );
        flow.get( 'abc' ).list[1].catch.should.be.a( 'function' );
        flow.get( 'abc' ).config.should.equal( config );
    } );
} );

