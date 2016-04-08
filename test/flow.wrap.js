import flow, { wrap } from "../src";

describe( 'duz/tool/flow.wrap', function(){
    it( 'import', function(){
        flow.wrap.should.equal( wrap );
    } );

    it( 'wrap func', function(){
        flow.wrap( function(){} ).shouldRun.should.equal( true );
    } );
} );
