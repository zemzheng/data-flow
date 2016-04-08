import flow, { wrap } from "../src";

describe( __filename, function(){
    it( 'import', function(){
        flow.wrap.should.equal( wrap );
    } );

    it( 'wrap func', function(){
        flow.wrap( function(){} ).shouldRun.should.equal( true );
    } );
} );
