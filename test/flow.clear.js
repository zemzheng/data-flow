import flow, { get, set, clear } from "../src";

describe( 'duz/tool/flow.clear', function(){
    it( 'import', function(){
        flow.clear.should.equal( clear );
    } );

    it( 'clear done', function(){
        clear();
        let func = function(){},
            { list, config } = { list : [ func, { then : func, catch : func }, func ], config : {} };

        flow.set( 'abc', config, list );
        flow.get( 'abc' ).config.should.equal( config );
        clear();
        expect( flow.get( 'abc' ) ).to.equal( undefined );
    } );
} );

