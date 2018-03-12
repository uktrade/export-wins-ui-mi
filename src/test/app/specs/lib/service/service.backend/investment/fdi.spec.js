const proxyquire = require( 'proxyquire' );
const rewire = require( 'rewire' );

const spy = require( '../../../../../helpers/spy' );
const getBackendStub = require( '../../../../../helpers/get-backend-stub' );

const moduleFile = '../../../../../../../app/lib/service/service.backend/investment/fdi';

let getJson;
let fdiService;
let fdiProjectListTransformer;
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
		fdiProjectListTransformer = jasmine.createSpy( 'fdiProjectListTransformer' );
	} );

	describe( 'Single methods', function(){

		beforeEach( function(){

			getJson.and.callFake( () => new Promise( ( resolve ) => resolve() ) );

			fdiService = proxyquire( moduleFile, {
				'../_helpers': { getJson },
				'../../../transformers/fdi/project-list': fdiProjectListTransformer
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
/*
		describe( 'Sector Team win table', function(){

			it( 'Should call the correct API', function( done ){

				const teamId = '1';

				fdiService.getSectorTeamWinTable( req, teamId ).then( () => {

					checkBackendArgs( `/mi/fdi/sector_teams/${ teamId }/win_table/`, req );
					done();
				} );
			} );
		} );

		describe( 'Sector Team HVC win table', function(){

			it( 'Should call the correct API', function( done ){

				const teamId = '1';
				const stubFile = '/investment/fdi/sector_teams/win_table';
				const transformResponse = { response: true };

				returnData( getBackendStub( stubFile ) );
				fdiProjectListTransformer.and.callFake( () => transformResponse );

				fdiService.getSectorTeamHvcWinTable( req, teamId ).then( ( data ) => {

					checkBackendArgs( `/mi/fdi/sector_teams/${ teamId }/win_table/`, req );
					expect( fdiProjectListTransformer ).toHaveBeenCalledWith( getBackendStub( stubFile ).results.investments.hvc );
					expect( data.results.investments ).toEqual( transformResponse );
					done();
				} );
			} );
		} );
		describe( 'Sector Team Non HVC win table', function(){

			it( 'Should call the correct API', function( done ){

				const teamId = '1';
				const stubFile = '/investment/fdi/sector_teams/win_table';
				const transformResponse = { response: true };

				returnData( getBackendStub( stubFile ) );
				fdiProjectListTransformer.and.callFake( () => transformResponse );

				fdiService.getSectorTeamNonHvcWinTable( req, teamId ).then( ( data ) => {

					checkBackendArgs( `/mi/fdi/sector_teams/${ teamId }/win_table/`, req );
					expect( fdiProjectListTransformer ).toHaveBeenCalledWith( getBackendStub( stubFile ).results.investments.non_hvc );
					expect( data.results.investments ).toEqual( transformResponse );
					done();
				} );
			} );
		} );
*/

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

		describe( 'FDI performance', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getPerformance( req ).then( () => {

					checkBackendArgs( '/mi/fdi/performance/', req );
					done();
				} );
			} );
		} );

		describe( 'FDI sectors performance', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getSectorsPerformance( req ).then( () => {

					checkBackendArgs( '/mi/fdi/performance/tab/sector/', req );
					done();
				} );
			} );
		} );

		describe( 'FDI overseas regions performance', function(){

			it( 'Should call the correct API', function( done ){

				fdiService.getOverseasRegionsPerformance( req ).then( () => {

					checkBackendArgs( '/mi/fdi/performance/tab/os_region/', req );
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

		describe( 'getSectorsHomepageData data', function(){

			it( 'Should return the correct data', function( done ){

				const spies = createSpies( [
					'getPerformance',
					'getSectorsPerformance'
				] );

				fdiService.getSectorsHomepageData( req ).then( ( data ) => {

					expect( spies.getPerformance.spy ).toHaveBeenCalledWith( req );
					expect( spies.getSectorsPerformance.spy ).toHaveBeenCalledWith( req );

					expect( data.performance ).toEqual( spies.getPerformance.response );
					expect( data.sectors ).toEqual( spies.getSectorsPerformance.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'getOverseasRegionsHomepageData data', function(){

			it( 'Should return the correct data', function( done ){

				const spies = createSpies( [
					'getPerformance',
					'getOverseasRegionsPerformance'
				] );

				fdiService.getOverseasRegionsHomepageData( req ).then( ( data ) => {

					expect( spies.getPerformance.spy ).toHaveBeenCalledWith( req );
					expect( spies.getOverseasRegionsPerformance.spy ).toHaveBeenCalledWith( req );

					expect( data.performance ).toEqual( spies.getPerformance.response );
					expect( data.overseasRegions ).toEqual( spies.getOverseasRegionsPerformance.response );

					done();

				} ).catch( done.fail );
			} );
		} );
	} );

} );
