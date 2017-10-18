const proxyquire = require( 'proxyquire' );
const rewire = require( 'rewire' );

const spy = require( '../../../../helpers/spy' );

const moduleFile = '../../../../../../app/lib/service/service.backend/investment';

let getJson;
let investmentService;
let fdiOverviewTransformer;
let fdiOverviewYoyTransformer;
let req;

function checkBackendArgs( path, req, transformer ){

	const args = getJson.calls.argsFor( 0 );

	expect( args[ 0 ] ).toEqual( path );
	expect( args[ 1 ] ).toEqual( req );

	if( transformer ){

		expect( args[ 2 ] ).toEqual( transformer );

	} else {

		expect( args[ 2 ] ).toBeUndefined();
	}
}

function returnData( data ){

	getJson.and.callFake( () => new Promise( ( resolve ) => resolve( data ) ) );
}

describe( 'Investment backend service', function(){

	beforeEach( function(){

		req = { cookies: { sessionid: 'test' } };
		getJson = jasmine.createSpy( 'getJson' );
		fdiOverviewTransformer = jasmine.createSpy( 'fdiOverviewTransformer' );
		fdiOverviewYoyTransformer = jasmine.createSpy( 'fdiOverviewYoyTransformer' );
	} );

	describe( 'Single methods', function(){

		beforeEach( function(){

			getJson.and.callFake( () => new Promise( ( resolve ) => resolve() ) );

			investmentService = proxyquire( moduleFile, {
				'./_helpers': { getJson },
				'../../transformers/fdi/overview': fdiOverviewTransformer,
				'../../transformers/fdi/overview-yoy': fdiOverviewYoyTransformer
			} );
		} );

		describe( 'Sector Teams list', function(){

			it( 'Should call the correct API', function( done ){

				investmentService.getSectorTeams( req ).then( () => {

					// Use export list for now
					checkBackendArgs( '/mi/sector_teams/', req );
					done();
				} );
			} );
		} );

		describe( 'Sector Team details', function(){

			it( 'Should call the correct API', function( done ){

				const teamId = '1';

				//This should not be needed
				//Provide data while using export APIs
				returnData( { results: [ { id: 1, name: 2 } ] } );

				investmentService.getSectorTeam( req, teamId ).then( () => {

					// Use export list for now
					checkBackendArgs( `/mi/sector_teams/`, req );
					done();
				} );
			} );
		} );

		describe( 'Overseas Teams list', function(){

			it( 'Should call the correct API', function( done ){

				investmentService.getOverseasRegions( req ).then( () => {

					// Use export list for now
					checkBackendArgs( '/mi/os_regions/', req );
					done();
				} );
			} );
		} );

		describe( 'Overseas Region details', function(){

			it( 'Should call the correct API', function( done ){

				const regionId = '1';

				//This should not be needed
				//Provide data while using export APIs
				returnData( { results: [ { id: 1, name: 2 } ] } );

				investmentService.getOverseasRegion( req, regionId ).then( () => {

					// Use export list for now
					checkBackendArgs( `/mi/os_regions/`, req );
					done();
				} );
			} );
		} );

		describe( 'FDI overview', function(){

			it( 'Should call the correct API', function( done ){

				investmentService.getFdiOverview( req ).then( () => {

					checkBackendArgs( '/mi/fdi/overview/', req, fdiOverviewTransformer );
					done();
				} );
			} );
		} );

		describe( 'getFdiOverviewYoy', function(){

			it( 'Should call the correct API', function( done ){

				investmentService.getFdiOverviewYoy( req ).then( () => {

					checkBackendArgs( '/mi/fdi/overview/yoy/', req, fdiOverviewYoyTransformer );
					done();
				} );
			} );
		} );
	} );

	describe( 'Aggregate methods', function(){

		beforeEach( function(){

			investmentService = rewire( moduleFile );
		} );

		function createSpies( names ){

			const spies = {};

			names.forEach( ( name ) => {

				const obj = { response: {}	};

				obj.response[ name ] = true;
				obj.spy = spy( name, obj.response );

				investmentService.__set__( name, obj.spy );
				spies[ name ] = obj;
			} );

			return spies;
		}

		describe( 'Homepage data', function(){

			it( 'Should return the correct data', function( done ){

				const spies = createSpies( [
					'getSectorTeams',
					'getOverseasRegions',
					'getFdiOverview',
					'getFdiOverviewYoy'
				] );

				investmentService.getHomepageData( req ).then( ( data ) => {

					expect( spies.getSectorTeams.spy ).toHaveBeenCalledWith( req );
					expect( spies.getOverseasRegions.spy ).toHaveBeenCalledWith( req );
					expect( spies.getFdiOverview.spy ).toHaveBeenCalledWith( req );
					expect( spies.getFdiOverviewYoy.spy ).toHaveBeenCalledWith( req );

					expect( data.sectorTeams ).toEqual( spies.getSectorTeams.response );
					expect( data.overseasRegions ).toEqual( spies.getOverseasRegions.response );
					expect( data.overview ).toEqual( spies.getFdiOverview.response );
					expect( data.overviewYoy ).toEqual( spies.getFdiOverviewYoy.response );

					done();

				} ).catch( done.fail );
			} );
		} );
	} );

} );
