const proxyquire = require( 'proxyquire' );
const rewire = require( 'rewire' );

const spy = require( '../../../../helpers/spy' );

let configStub;
let getJson;
let getAll;

let monthsSpy;
let monthsVolumeSpy;
let campaignsSpy;
let sectorTeamsOverviewSpy;
let osRegionsOverviewSpy;
let hvcGroupSpy;
let osRegionsSpy;
let winListSpy;
let alphabeticalListSpy;

let req = {};
let exportService;


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

describe( 'Export backend service', function(){

	let oldTimeout;

	beforeEach( function(){

		configStub = { backend: { stub: false, fake: false, mock: false } };
		oldTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

		req = {
			cookies: { sessionid: '123abc' },
			year: '2017'
		};
	} );

	afterEach( function(){

		jasmine.DEFAULT_TIMEOUT_INTERVAL = oldTimeout;
	} );

	describe( 'Single methods', function(){

		beforeEach( function(){

			monthsSpy = jasmine.createSpy( 'months' );
			monthsVolumeSpy = jasmine.createSpy( 'months-volume' );
			campaignsSpy = jasmine.createSpy( 'campaigns' );
			sectorTeamsOverviewSpy = jasmine.createSpy( 'sector-teams-overview' );
			osRegionsOverviewSpy = jasmine.createSpy( 'os-regions-overview' );
			hvcGroupSpy = jasmine.createSpy( 'hvc-group' );
			osRegionsSpy = jasmine.createSpy( 'os-regions' );
			winListSpy = jasmine.createSpy( 'win-list' );
			alphabeticalListSpy = jasmine.createSpy( 'alphabetical-list' );

			getJson = jasmine.createSpy( 'getJson' ).and.callFake( function( /* path, req */ ){

				return new Promise( ( resolve/*, reject */ ) => {

					resolve();
				} );
			} );
			getAll = jasmine.createSpy( 'getAll' );

			exportService = proxyquire( '../../../../../../app/lib/service/service.backend/export', {
				'../../../config': configStub,
				'./_helpers': { getJson, getAll },
				'../../transformers/export/months': monthsSpy,
				'../../transformers/export/months-volume': monthsVolumeSpy,
				'../../transformers/export/campaigns': campaignsSpy,
				'../../transformers/export/sector-teams-overview': sectorTeamsOverviewSpy,
				'../../transformers/export/os-regions-overview': osRegionsOverviewSpy,
				'../../transformers/export/hvc-group': hvcGroupSpy,
				'../../transformers/export/os-regions': osRegionsSpy,
				'../../transformers/export/win-list': winListSpy,
				'../../transformers/export/alphabetical-list': alphabeticalListSpy
			} );
		} );

		describe( 'Getting the sector team overview', function(){

			it( 'Should use the sector teams overview transformer', function( done ){

				exportService.getSectorTeamsOverview( req ).then( () => {

					checkBackendArgs( '/mi/sector_teams/overview/', req, sectorTeamsOverviewSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the sector team', function(){

			it( 'Should use the sector transformer', function( done ){

				const teamId = '3';

				exportService.getSectorTeam( req, teamId ).then( () => {

					checkBackendArgs( `/mi/sector_teams/${ teamId }/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the sector team months', function(){

			it( 'Should use the months transformer', function( done ){

				const teamId = '4';

				exportService.getSectorTeamMonths( req, teamId ).then( () => {

					checkBackendArgs( `/mi/sector_teams/${ teamId }/months/`, req, monthsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the sector team campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const teamId = '5';

				exportService.getSectorTeamCampaigns( req, teamId ).then( () => {

					checkBackendArgs( `/mi/sector_teams/${ teamId }/campaigns/`, req, campaignsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the sector team top non HVCs', function(){

			describe( 'Without an all param', function(){

				it( 'Should use the call the correct endpoint', function( done ){

					const teamId = '5';

					exportService.getSectorTeamTopNonHvc( req, teamId ).then( () => {

						checkBackendArgs( `/mi/sector_teams/${ teamId }/top_non_hvcs/`, req );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'With the all param set to true', function(){

				it( 'Should use the call the correct endpoint', function( done ){

					const teamId = '5';

					exportService.getSectorTeamTopNonHvc( req, teamId, true ).then( () => {

						checkBackendArgs( `/mi/sector_teams/${ teamId }/top_non_hvcs/?all=1`, req );
						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the sector team win table', function(){

			it( 'Should use the win list transformer', function( done ){

				const teamId = '5';

				exportService.getSectorTeamWinTable( req, teamId ).then( () => {

					checkBackendArgs( `/mi/sector_teams/${ teamId }/win_table/`, req, winListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the list of countries', function(){

			it( 'Should call the correct API and transform the response', function( done ){

				exportService.getCountries( req ).then( () => {

					checkBackendArgs( `/mi/countries/`, req, alphabeticalListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the details of a country', function(){

			it( 'Should call the correct API', function( done ){

				const countryCode = 'SI';

				exportService.getCountry( req, countryCode ).then( () => {

					checkBackendArgs( `/mi/countries/${ countryCode }/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the campaigns of a country', function(){

			it( 'Should call the correct API', function( done ){

				const countryCode = 'SI';

				exportService.getCountryCampaigns( req, countryCode ).then( () => {

					checkBackendArgs( `/mi/countries/${ countryCode }/campaigns/`, req, campaignsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the months of a country', function(){

			it( 'Should call the correct API', function( done ){

				const countryCode = 'SI';

				exportService.getCountryMonths( req, countryCode ).then( () => {

					checkBackendArgs( `/mi/countries/${ countryCode }/months/`, req, monthsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the top_non_hvcs of a country', function(){

			describe( 'Without an all param', function(){

				it( 'Should call the correct API', function( done ){

					const countryCode = 'SI';

					exportService.getCountryTopNonHvc( req, countryCode ).then( () => {

						checkBackendArgs( `/mi/countries/${ countryCode }/top_non_hvcs/`, req );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'With the all param set to true', function(){

				it( 'Should call the correct API', function( done ){

					const countryCode = 'SI';

					exportService.getCountryTopNonHvc( req, countryCode, true ).then( () => {

						checkBackendArgs( `/mi/countries/${ countryCode }/top_non_hvcs/?all=1`, req );
						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the win_table of a country', function(){

			it( 'Should call the correct API', function( done ){

				const countryCode = 'SI';

				exportService.getCountryWinTable( req, countryCode ).then( () => {

					checkBackendArgs( `/mi/countries/${ countryCode }/win_table/`, req, winListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the list of posts', function(){

			it( 'Should call the correct API and transform the response', function( done ){

				exportService.getPosts( req ).then( () => {

					checkBackendArgs( `/mi/posts/`, req, alphabeticalListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the details of a post', function(){

			it( 'Should call the correct API', function( done ){

				const postId = 'australia-sydney';

				exportService.getPost( req, postId ).then( () => {

					checkBackendArgs( `/mi/posts/${ postId }/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the campaigns of a post', function(){

			it( 'Should call the correct API', function( done ){

				const postId = 'australia-sydney';

				exportService.getPostCampaigns( req, postId ).then( () => {

					checkBackendArgs( `/mi/posts/${ postId }/campaigns/`, req, campaignsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the months of a post', function(){

			it( 'Should call the correct API', function( done ){

				const postId = 'australia-sydney';

				exportService.getPostMonths( req, postId ).then( () => {

					checkBackendArgs( `/mi/posts/${ postId }/months/`, req, monthsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the top_non_hvcs of a post', function(){

			describe( 'Without an all param', function(){

				it( 'Should call the correct API', function( done ){

					const postId = 'australia-sydney';

					exportService.getPostTopNonHvc( req, postId ).then( () => {

						checkBackendArgs( `/mi/posts/${ postId }/top_non_hvcs/`, req );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'With the all param set to true', function(){

				it( 'Should call the correct API', function( done ){

					const postId = 'australia-sydney';

					exportService.getPostTopNonHvc( req, postId, true ).then( () => {

						checkBackendArgs( `/mi/posts/${ postId }/top_non_hvcs/?all=1`, req );
						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the win_table of a post', function(){

			it( 'Should call the correct API', function( done ){

				const postId = 'australia-sydney';

				exportService.getPostWinTable( req, postId ).then( () => {

					checkBackendArgs( `/mi/posts/${ postId }/win_table/`, req, winListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the list of UK Regions', function(){

			it( 'Should call the correct API', function( done ){

				exportService.getUkRegions( req ).then( () => {

					checkBackendArgs( `/mi/uk_regions/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the UK Regions overview', function(){

			it( 'Should call the correct API', function( done ){

				exportService.getUkRegionsOverview( req ).then( () => {

					checkBackendArgs( `/mi/uk_regions/overview/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the details of a UK Region', function(){

			it( 'Should call the correct API', function( done ){

				const regionId = 'a-uk-region';

				exportService.getUkRegion( req, regionId ).then( () => {

					checkBackendArgs( `/mi/uk_regions/${ regionId }/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the months of a UK Region', function(){

			it( 'Should call the correct API', function( done ){

				const regionId = 'a-uk-region';

				exportService.getUkRegionMonths( req, regionId ).then( () => {

					checkBackendArgs( `/mi/uk_regions/${ regionId }/months/`, req, monthsVolumeSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the top_non_hvcs of a UK Region', function(){

			describe( 'Without an all param', function(){

				it( 'Should call the correct API', function( done ){

					const regionId = 'a-uk-region';

					exportService.getUkRegionTopNonHvc( req, regionId ).then( () => {

						checkBackendArgs( `/mi/uk_regions/${ regionId }/top_non_hvcs/`, req );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'With the all param set to true', function(){

				it( 'Should call the correct API', function( done ){

					const regionId = 'a-uk-region';

					exportService.getUkRegionTopNonHvc( req, regionId, true ).then( () => {

						checkBackendArgs( `/mi/uk_regions/${ regionId }/top_non_hvcs/?all=1`, req );
						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the win_table of a UK Region', function(){

			it( 'Should call the correct API', function( done ){

				const regionId = 'a-uk-region';

				exportService.getUkRegionWinTable( req, regionId ).then( () => {

					checkBackendArgs( `/mi/uk_regions/${ regionId }/win_table/`, req, winListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the Grouped overseas regions list', function(){

			it( 'Should call the correct API', function( done ){

				exportService.getOverseasRegionGroups( req ).then( () => {

					checkBackendArgs( `/mi/os_region_groups/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions overview', function(){

			it( 'Should use the overseas regions overview transformer', function( done ){

				exportService.getOverseasRegionsOverview( req ).then( () => {

					checkBackendArgs( `/mi/os_regions/overview/`, req, osRegionsOverviewSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions list', function(){

			it( 'Should use the os-regions transformer', function( done ){

				exportService.getOverseasRegions( req ).then( () => {

					checkBackendArgs( `/mi/os_regions/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas region', function(){

			it( 'Should use the sector transformer', function( done ){

				const regionId = '1';

				exportService.getOverseasRegion( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions months', function(){

			it( 'Should use the months transformer', function( done ){

				const regionId = '2';

				exportService.getOverseasRegionMonths( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/months/`, req, monthsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const regionId = '3';

				exportService.getOverseasRegionCampaigns( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/campaigns/`, req, campaignsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions top non HVCs', function(){

			describe( 'Without an all param', function(){

				it( 'Should call the correct endpoint', function( done ){

					const regionId = '4';

					exportService.getOverseasRegionTopNonHvc( req, regionId ).then( () => {

						checkBackendArgs( `/mi/os_regions/${ regionId }/top_non_hvcs/`, req );
						done();

					} ).catch( done.fail );
				} );
			} );

			describe( 'With the all param set to true', function(){

				it( 'Should call the correct endpoint', function( done ){

					const regionId = '4';

					exportService.getOverseasRegionTopNonHvc( req, regionId, true ).then( () => {

						checkBackendArgs( `/mi/os_regions/${ regionId }/top_non_hvcs/?all=1`, req );
						done();

					} ).catch( done.fail );
				} );
			} );
		} );

		describe( 'Getting the overseas region win table', function(){

			it( 'Should use the win list transformer', function( done ){

				const regionId = '5';

				exportService.getOverseasRegionWinTable( req, regionId ).then( () => {

					checkBackendArgs( `/mi/os_regions/${ regionId }/win_table/`, req, winListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the HVC detail', function(){

			it( 'Should return the hvc detail', function( done ){

				const hvcId = 'E100';

				exportService.getHvc( req, hvcId ).then( () => {

					checkBackendArgs( `/mi/hvc/${ hvcId }/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the HVC markets', function(){

			it( 'Should return the hvc markets', function( done ){

				const hvcId = 'E100';

				exportService.getHvcMarkets( req, hvcId ).then( () => {

					checkBackendArgs( `/mi/hvc/${ hvcId }/top_wins/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the HVC win table', function(){

			it( 'Should return the hvc win list', function( done ){

				const hvcId = 'E100';

				exportService.getHvcWinList( req, hvcId ).then( () => {

					checkBackendArgs( `/mi/hvc/${ hvcId }/win_table/`, req, winListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the global HVCs', function(){

			it( 'Should return the global HVCs', function( done ){

				exportService.getGlobalHvcs( req ).then( () => {

					checkBackendArgs( `/mi/global_hvcs/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the global wins', function(){

			it( 'Should return the global wins', function( done ){

				exportService.getGlobalWins( req ).then( () => {

					checkBackendArgs( `/mi/global_wins/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the list of HVC Groups', function(){

			it( 'Should return just the hvc groups', function( done ){

				exportService.getHvcGroups( req ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/`, req );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting an hvc group', function(){

			it( 'Should use the hvc group transformer', function( done ){

				const groupId = '1';

				exportService.getHvcGroup( req, groupId ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/${ groupId }/`, req, hvcGroupSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting an hvc group campaigns', function(){

			it( 'Should use the campaigns transformer', function( done ){

				const groupId = '2';

				exportService.getHvcGroupCampaigns( req, groupId ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/${ groupId }/campaigns/`, req, campaignsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting an hvc group months', function(){

			it( 'Should use the months transformer', function( done ){

				const groupId = '3';

				exportService.getHvcGroupMonths( req, groupId ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/${ groupId }/months/`, req, monthsSpy );
					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the hvc group win table', function(){

			it( 'Should use the win list transformer', function( done ){

				const groupId = '5';

				exportService.getHvcGroupWinTable( req, groupId ).then( () => {

					checkBackendArgs( `/mi/hvc_groups/${ groupId }/win_table/`, req, winListSpy );
					done();

				} ).catch( done.fail );
			} );
		} );
	} );


	describe( 'Aggregate methods', function(){

		beforeEach( function(){

			let aggConfigStub = Object.assign( {}, configStub );
			aggConfigStub.backend.timeout = 25;

			exportService = rewire( '../../../../../../app/lib/service/service.backend/export' );

			exportService.__set__( 'config', aggConfigStub );
		} );

		function createSpies( names ){

			const spies = {};

			names.forEach( ( name ) => {

				const obj = { response: {}	};

				obj.response[ name ] = true;
				obj.spy = spy( name, obj.response );

				exportService.__set__( name, obj.spy );
				spies[ name ] = obj;
			} );

			return spies;
		}

		describe( 'Getting the Sector Team info', function(){

			it( 'Should return several bits of data', function( done ){

				const teamId = 3;

				const spies = createSpies( [
					'getSectorTeam',
					'getSectorTeamMonths',
					'getSectorTeamTopNonHvc',
					'getSectorTeamCampaigns'
				] );

				exportService.getSectorTeamInfo( req, teamId ).then( ( data ) => {

					expect( spies.getSectorTeam.spy ).toHaveBeenCalledWith( req, teamId );
					expect( spies.getSectorTeamMonths.spy ).toHaveBeenCalledWith( req, teamId );
					expect( spies.getSectorTeamTopNonHvc.spy ).toHaveBeenCalledWith( req, teamId );
					expect( spies.getSectorTeamCampaigns.spy ).toHaveBeenCalledWith( req, teamId );

					expect( data.wins ).toEqual( spies.getSectorTeam.response );
					expect( data.months ).toEqual( spies.getSectorTeamMonths.response );
					expect( data.topNonHvc ).toEqual( spies.getSectorTeamTopNonHvc.response );
					expect( data.campaigns ).toEqual( spies.getSectorTeamCampaigns.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the Overseas Region Info', function(){

			it( 'Should return several bits of data', function( done ){

				const regionId = 3;

				const spies = createSpies( [
					'getOverseasRegion',
					'getOverseasRegionMonths',
					'getOverseasRegionTopNonHvc',
					'getOverseasRegionCampaigns'
				] );

				exportService.getOverseasRegionInfo( req, regionId ).then( ( data ) => {

					expect( spies.getOverseasRegion.spy ).toHaveBeenCalledWith( req, regionId );
					expect( spies.getOverseasRegionMonths.spy ).toHaveBeenCalledWith( req, regionId );
					expect( spies.getOverseasRegionTopNonHvc.spy ).toHaveBeenCalledWith( req, regionId );
					expect( spies.getOverseasRegionCampaigns.spy ).toHaveBeenCalledWith( req, regionId );

					expect( data.wins ).toEqual( spies.getOverseasRegion.response );
					expect( data.months ).toEqual( spies.getOverseasRegionMonths.response );
					expect( data.topNonHvc ).toEqual( spies.getOverseasRegionTopNonHvc.response );
					expect( data.campaigns ).toEqual( spies.getOverseasRegionCampaigns.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the Country Info', function(){

			it( 'Should return several bits of data', function( done ){

				const countryId = 3;

				const spies = createSpies( [
					'getCountry',
					'getCountryMonths',
					'getCountryTopNonHvc',
					'getCountryCampaigns'
				] );

				exportService.getCountryInfo( req, countryId ).then( ( data ) => {

					expect( spies.getCountry.spy ).toHaveBeenCalledWith( req, countryId );
					expect( spies.getCountryMonths.spy ).toHaveBeenCalledWith( req, countryId );
					expect( spies.getCountryTopNonHvc.spy ).toHaveBeenCalledWith( req, countryId );
					expect( spies.getCountryCampaigns.spy ).toHaveBeenCalledWith( req, countryId );

					expect( data.wins ).toEqual( spies.getCountry.response );
					expect( data.months ).toEqual( spies.getCountryMonths.response );
					expect( data.topNonHvc ).toEqual( spies.getCountryTopNonHvc.response );
					expect( data.campaigns ).toEqual( spies.getCountryCampaigns.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the Post Info', function(){

			it( 'Should return several bits of data', function( done ){

				const postId = 'australia-sydney';

				const spies = createSpies( [
					'getPost',
					'getPostMonths',
					'getPostTopNonHvc',
					'getPostCampaigns'
				] );

				exportService.getPostInfo( req, postId ).then( ( data ) => {

					expect( spies.getPost.spy ).toHaveBeenCalledWith( req, postId );
					expect( spies.getPostMonths.spy ).toHaveBeenCalledWith( req, postId );
					expect( spies.getPostTopNonHvc.spy ).toHaveBeenCalledWith( req, postId );
					expect( spies.getPostCampaigns.spy ).toHaveBeenCalledWith( req, postId );

					expect( data.wins ).toEqual( spies.getPost.response );
					expect( data.months ).toEqual( spies.getPostMonths.response );
					expect( data.topNonHvc ).toEqual( spies.getPostTopNonHvc.response );
					expect( data.campaigns ).toEqual( spies.getPostCampaigns.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the UK Region Info', function(){

			it( 'Should return several bits of data', function( done ){

				const regionId = 'some-uk-region';

				const spies = createSpies( [
					'getUkRegion',
					'getUkRegionTopNonHvc',
					'getUkRegionMonths'
				] );

				exportService.getUkRegionInfo( req, regionId ).then( ( data ) => {

					expect( spies.getUkRegion.spy ).toHaveBeenCalledWith( req, regionId );
					expect( spies.getUkRegionMonths.spy ).toHaveBeenCalledWith( req, regionId );
					expect( spies.getUkRegionTopNonHvc.spy ).toHaveBeenCalledWith( req, regionId );

					expect( data.wins ).toEqual( spies.getUkRegion.response );
					expect( data.months ).toEqual( spies.getUkRegionMonths.response );
					expect( data.topNonHvc ).toEqual( spies.getUkRegionTopNonHvc.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the overseas regions overview groups', function(){

			it( 'Should get the OS groups and OS overview and merge them', function( done ){

				const spies = createSpies( [
					'getOverseasRegionGroups',
					'getOverseasRegionsOverview'
				] );

				const osRegionsOverviewGroupsSpyResponse = { osRegionsOverviewGroupsSpyResponse: true };
				const osRegionsOverviewGroupsSpy = spy( 'os-regions-overview-groups', osRegionsOverviewGroupsSpyResponse );

				exportService.__set__( 'transformOverseasRegionsOverviewGroups', osRegionsOverviewGroupsSpy );

				exportService.getOverseasRegionsOverviewGroups( req ).then( ( items ) => {

					expect( osRegionsOverviewGroupsSpy ).toHaveBeenCalledWith( spies.getOverseasRegionGroups.response, spies.getOverseasRegionsOverview.response );
					expect( osRegionsOverviewGroupsSpy.calls.count() ).toEqual( 1 );

					expect( items ).toEqual( osRegionsOverviewGroupsSpyResponse  );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the HVC Group Info', function(){

			it( 'Should return several bits of data', function( done ){

				const groupId = 3;

				const spies = createSpies( [
					'getHvcGroup',
					'getHvcGroupMonths',
					'getHvcGroupCampaigns'
				] );

				exportService.getHvcGroupInfo( req, groupId ).then( ( data ) => {

					expect( spies.getHvcGroup.spy ).toHaveBeenCalledWith( req, groupId );
					expect( spies.getHvcGroupMonths.spy ).toHaveBeenCalledWith( req, groupId );
					expect( spies.getHvcGroupCampaigns.spy ).toHaveBeenCalledWith( req, groupId );

					expect( data.wins ).toEqual( spies.getHvcGroup.response );
					expect( data.months ).toEqual( spies.getHvcGroupMonths.response );
					expect( data.campaigns ).toEqual( spies.getHvcGroupCampaigns.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the home page data', function(){

			it( 'Should return all bits of data', function( done ){

				const spies = createSpies( [
					'getSectorTeams',
					'getOverseasRegionGroups',
					'getGlobalHvcs',
					'getGlobalWins',
					'getUkRegions'
				] );

				exportService.getHomepageData( req ).then( ( data ) => {

					expect( spies.getSectorTeams.spy ).toHaveBeenCalledWith( req );
					expect( spies.getOverseasRegionGroups.spy ).toHaveBeenCalledWith( req );
					expect( spies.getGlobalHvcs.spy ).toHaveBeenCalledWith( req );
					expect( spies.getGlobalWins.spy ).toHaveBeenCalledWith( req );
					expect( spies.getUkRegions.spy ).toHaveBeenCalledWith( req );

					expect( data.sectorTeams ).toEqual( spies.getSectorTeams.response );
					expect( data.overseasRegionGroups ).toEqual( spies.getOverseasRegionGroups.response );
					expect( data.globalHvcs ).toEqual( spies.getGlobalHvcs.response );
					expect( data.globalWins ).toEqual( spies.getGlobalWins.response );
					expect( data.ukRegions ).toEqual( spies.getUkRegions.response );

					done();

				} ).catch( done.fail );
			} );
		} );

		describe( 'Getting the HVC Info', function(){

			it( 'Should return both bits of data', function( done ){

				const hvcId = 'E100';

				const spies = createSpies( [
					'getHvc',
					'getHvcMarkets'
				] );

				exportService.getHvcInfo( req, hvcId ).then( ( data ) => {

					expect( spies.getHvc.spy ).toHaveBeenCalledWith( req, hvcId );
					expect( spies.getHvcMarkets.spy ).toHaveBeenCalledWith( req, hvcId );

					expect( data.hvc ).toEqual( spies.getHvc.response );
					expect( data.markets ).toEqual( spies.getHvcMarkets.response );

					done();

				} ).catch( done.fail );
			} );
		} );
	} );

	describe( 'Mocked mode', function(){

		it( 'Should require the mocks', function(){

			const winResponse = { win: true };
			const win = spy( 'win', winResponse );

			const exportService = proxyquire( '../../../../../../app/lib/service/service.backend/export', {
				'../../../config': { backend: { stub: false, fake: false, mock: true } },
				'../../../../data/mocks': { win }
			} );

			expect( exportService.getWin() ).toEqual( winResponse );
			expect( win ).toHaveBeenCalled();
		} );
	} );
} );
