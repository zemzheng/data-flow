import flow, { get, set, clear } from "../src";

describe( __filename, function(){
    it( 'import', function(){
        flow.set.should.equal( set );
    } );

    it( 'set done', function(){
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

    it( 'set miss', function(){
        clear();
        let func = function(){},
            { list, config } = { list : [ func, {}, func ], config : {} };

        flow.set( 'abc', config, list );

        flow.get( 'abc' ).list.length.should.equal( list.length - 1 );
        flow.get( 'abc' ).list[0].then.should.be.a( 'function' );
        flow.get( 'abc' ).list[1].then.should.be.a( 'function' );
        expect( flow.get( 'abc' ).list[1].catch ).to.equal( undefined );
        flow.get( 'abc' ).config.should.equal( config );
    } );
} );

