const proxyquire = require( 'proxyquire' );

const configStub = { backend: { stub: true } };

const stubs = {
	'../../config': configStub,
	'../logger': require( '../../../helpers/mock-logger' )
};

const backend = proxyquire( '../../../../../app/lib/service/service.backend', stubs );

const parentSectorsList = require( '../../../../../stubs/backend/parent_sectors' );

describe( 'Backend service', function(){

	describe( 'Getting the region name', function(){
	
		it( 'Should return the correct name', function( done ){
		
			backend.getRegionName( 'test', 1 ).then( ( name ) => {

				expect( name ).toEqual( 'North Africa' );
				done();
			} );
		} );
	} );

	describe( 'Getting the list of HVC Groups', function(){
	
		it( 'Should return just the hvc groups', function( done ){
	
			backend.getHvcGroups().then( ( hvcGroup ) => {

				expect( hvcGroup ).toEqual( parentSectorsList );
				done();
			} );
		} );
	} );
} );
