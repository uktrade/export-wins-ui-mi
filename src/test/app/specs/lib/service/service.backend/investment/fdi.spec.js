const proxyquire = require( 'proxyquire' );
const rewire = require( 'rewire' );

const spy = require( '../../../../../helpers/spy' );
const getBackendStub = require( '../../../../../helpers/get-backend-stub' );

const moduleFile = '../../../../../../../app/lib/service/service.backend/investment/fdi';

let getJson;
let fdiService;
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

describe( 'Investment FDI backend service', function(){

	beforeEach( function(){

		req = { cookies: { sessionid: 'test' } };
		getJson = jasmine.createSpy( 'getJson' );
		fdiOverviewYoyTransformer = jasmine.createSpy( 'fdiOverviewYoyTransformer' );
	} );

	describe( 'Single methods', function(){

		beforeEach( function(){

			getJson.and.callFake( () => new Promise( ( resolve ) => resolve() ) );

			fdiService = proxyquire( moduleFile, {
				'../_helpers': { getJson },
				'../../../transformers/fdi/overview-yoy': fdiOverviewYoyTransformer
			} );
		} );

		describe( 'Sector Teams list', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getSectorTeams( req ).then( () => {

					checkBackendArgs( '/mi/fdi/sector_teams/', req );
					done();
				} );
			} );
		} );

		describe( 'Sector Teams overview', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getSectorTeamsOverview( req ).then( () => {

					checkBackendArgs( '/mi/fdi/sector_teams/overview/', req );
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

				fdiService.getSectorTeam( req, teamId ).then( () => {

					checkBackendArgs( `/mi/fdi/sector_teams/${ teamId }/`, req );
					done();
				} );
			} );
		} );

		describe( 'Sector Team HVC details', function(){

			it( 'Should call the correct API', function( done ){

				const teamId = '1';

				//This should not be needed
				//Provide data while using export APIs
				returnData( { results: [ { id: 1, name: 2 } ] } );

				fdiService.getSectorTeamHvc( req, teamId ).then( () => {

					checkBackendArgs( `/mi/fdi/sector_teams/${ teamId }/hvc/`, req );
					done();
				} );
			} );
		} );

		describe( 'Sector Team Non HVC details', function(){

			it( 'Should call the correct API', function( done ){

				const teamId = '1';

				//This should not be needed
				//Provide data while using export APIs
				returnData( { results: [ { id: 1, name: 2 } ] } );

				fdiService.getSectorTeamNonHvc( req, teamId ).then( () => {

					checkBackendArgs( `/mi/fdi/sector_teams/${ teamId }/non_hvc/`, req );
					done();
				} );
			} );
		} );

		describe( 'Overseas Teams list', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getOverseasRegions( req ).then( () => {

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

				fdiService.getOverseasRegion( req, regionId ).then( () => {

					// Use export list for now
					checkBackendArgs( '/mi/os_regions/', req );
					done();
				} );
			} );
		} );

		describe( 'UK Regions Teams list', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getUkRegions( req ).then( () => {

					// Use export list for now
					checkBackendArgs( '/mi/uk_regions/', req );
					done();
				} );
			} );
		} );

		describe( 'UK Region details', function(){

			it( 'Should call the correct API', function( done ){

				const regionId = 'jniawp-rtvz';

				//This should not be needed
				//Provide data while using export APIs
				returnData( getBackendStub( '/investment/fdi/uk_regions/index' ) );

				fdiService.getUkRegion( req, regionId ).then( ( data ) => {

					// Use export list for now
					checkBackendArgs( '/mi/uk_regions/', req );
					expect( data.results.id ).toEqual( regionId );
					done();
				} );
			} );
		} );

		describe( 'FDI overview', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getOverview( req ).then( () => {

					checkBackendArgs( '/mi/fdi/overview/', req );
					done();
				} );
			} );
		} );

		describe( 'getOverviewYoy', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getOverviewYoy( req ).then( () => {

					checkBackendArgs( '/mi/fdi/overview/yoy/', req, fdiOverviewYoyTransformer );
					done();
				} );
			} );
		} );
	} );

	describe( 'Aggregate methods', function(){

		beforeEach( function(){

			fdiService = rewire( moduleFile );
		} );

		function createSpies( names ){

			const spies = {};

			names.forEach( ( name ) => {

				const obj = { response: {}	};

				obj.response[ name ] = true;
				obj.spy = spy( name, obj.response );

				fdiService.__set__( name, obj.spy );
				spies[ name ] = obj;
			} );

			return spies;
		}

		describe( 'Homepage data', function(){

			it( 'Should return the correct data', function( done ){

				const spies = createSpies( [
					'getSectorTeams',
					'getOverseasRegions',
					'getUkRegions',
					'getOverview',
					'getOverviewYoy'
				] );

				fdiService.getHomepageData( req ).then( ( data ) => {

					expect( spies.getSectorTeams.spy ).toHaveBeenCalledWith( req );
					expect( spies.getOverseasRegions.spy ).toHaveBeenCalledWith( req );
					expect( spies.getUkRegions.spy ).toHaveBeenCalledWith( req );
					expect( spies.getOverview.spy ).toHaveBeenCalledWith( req );
					expect( spies.getOverviewYoy.spy ).toHaveBeenCalledWith( req );

					expect( data.sectorTeams ).toEqual( spies.getSectorTeams.response );
					expect( data.overseasRegions ).toEqual( spies.getOverseasRegions.response );
					expect( data.ukRegions ).toEqual( spies.getUkRegions.response );
					expect( data.overview ).toEqual( spies.getOverview.response );
					expect( data.overviewYoy ).toEqual( spies.getOverviewYoy.response );

					done();

				} ).catch( done.fail );
			} );
		} );
	} );

} );
