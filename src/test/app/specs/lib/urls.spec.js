const proxyquire = require( 'proxyquire' );
const spy = require( '../../helpers/spy' );

const defaultYear = 2017;
const nonDefaultYear = 2016;

describe( 'urls middleware', function(){

	let middleware;
	let req;
	let getFinancialYearSpy;

	beforeEach( function(){

		getFinancialYearSpy = spy( 'getFinancialYear', 2017 );
		middleware = proxyquire( '../../../../app/lib/urls' , {
			'./financial-year': { getCurrent: getFinancialYearSpy }
		} );

		req = {
			url: '/my/test/'
		};
	} );

	function checkUrl( req, method, args, output ){

		const urls = middleware( req );

		let methodFn = method.split( '.' ).reduce( ( urls, property ) => urls[ property ], urls );

		expect( methodFn( ...args ) ).toEqual( output );
	}

	function checkYearlyUrls( req, method, args, output ){

		let defaultOutput = output;
		let nonDefaultOutput = ( '/' + nonDefaultYear + output );

		if( Array.isArray( output ) ){

			defaultOutput = output[ 0 ];
			nonDefaultOutput = output[ 1 ];
		}

		req.isDefaultYear = true;
		req.year = defaultYear;

		checkUrl( req, method, args, defaultOutput );

		req.isDefaultYear = false;
		req.year = nonDefaultYear;

		checkUrl( req, method, args, nonDefaultOutput );
	}

	function checkFilteredUrls( req, method, args, output ){

		const separator = ( ~output.indexOf( '?' ) ? '&' : '?' );
		req.filters = {};
		checkYearlyUrls( req, method, args, output );

		req.filters = { a: 1, b: 2 };
		checkYearlyUrls( req, method, args, ( output + separator + 'a=1&b=2' ) );
	}

	describe( 'Index', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'index', [], '/' );
		} );
	} );

	describe( 'Sign out', function(){

		it( 'Should return the correct URLs', function(){

			checkUrl( req, 'signout', [], '/sign-out/' );
		} );
	} );

	describe( 'Experiments', function(){

		it( 'Should return the correct URL', function(){

			checkYearlyUrls( req, 'experiments', [], [ '/experiments/?path=%2Fmy%2Ftest%2F', '/2016/experiments/?path=%2F2016%2Fmy%2Ftest%2F' ] );
		} );
	} );

	describe( 'Change Financial Year', function(){

		it( 'Should return the correct URL', function(){

			checkUrl( req, 'changeFy', [], '/change-fy/' );
		} );
	} );

	describe( 'selectDate', function(){

		const methodName = 'selectDate';

		describe( 'When a return path is not specified', function(){

			describe( 'When the current url has filters', function(){

				it( 'Should URL encode the characters', function(){

					req.filters = { a: 1, b: 2 };
					checkYearlyUrls( req, methodName, [], [ '/select-date/?path=%2Fmy%2Ftest%2F%3Fa%3D1%26b%3D2', '/2016/select-date/?path=%2F2016%2Fmy%2Ftest%2F%3Fa%3D1%26b%3D2' ] );
				} );
			} );

			describe( 'When the return path does not have filters', function(){

				it( 'Should return the URL encoded path', function(){

					checkYearlyUrls( req, methodName, [], [ '/select-date/?path=%2Fmy%2Ftest%2F', '/2016/select-date/?path=%2F2016%2Fmy%2Ftest%2F' ] );
				} );
			} );
		} );

		describe( 'When a return path is specified', function(){

			it( 'Should use the return URL endoced path', function(){

				checkYearlyUrls( req, methodName, [ '/my/return-test/' ], '/select-date/?path=%2Fmy%2Freturn-test%2F' );
			} );
		} );
	} );

	describe( 'selectDateForYear', function(){

		const methodName = 'selectDateForYear';

		describe( 'When there is a return path ', function(){

			it( 'Should return the path', function(){

				checkYearlyUrls( req, methodName, [ '2016', '/my/test/' ], '/select-date/2016/?path=%2Fmy%2Ftest%2F' );
			} );
		} );

		describe( 'When there is not a return path', function(){

			it( 'Should return the path', function(){

				checkYearlyUrls( req, methodName, [ 2017 ], '/select-date/2017/' );
			} );
		} );
	} );

	describe( 'Downloads', function(){

		describe( 'The list page', function(){

			it( 'Should return the correct URL', function(){

				expect( middleware( req ).downloads() ).toEqual( '/downloads/' );
			} );
		} );

		describe( 'Downloading a file', function(){

			describe( 'With just an id', function(){

				describe( 'Without an action type', function(){

					it( 'Should return the correct URL', function(){

						const file = {	id: '12'	};

						expect( middleware( req ).downloadFile( file ) ).toEqual( `/downloads/${ file.id }/` );
					} );
				} );

				describe( 'With an action type', function(){

					it( 'Should return the correct URL', function(){

						const file = {	id: '12'	};
						const type = 'CSV - Type A';

						expect( middleware( req ).downloadFile( file, type ) ).toEqual( `/downloads/${ file.id }/?type=${ encodeURIComponent( type ) }` );
					} );
				} );
			} );

			describe( 'With a name', function(){

				describe( 'Without an action type', function(){

					it( 'Should return the correct URL', function(){

						const file = {
							id: '12',
							name: 'a test'
						};

						expect( middleware( req ).downloadFile( file ) ).toEqual( `/downloads/${ file.id }/?name=${ encodeURIComponent( file.name ) }` );
					} );
				} );

				describe( 'With an action type', function(){

					it( 'Should return the correct URL', function(){

						const file = {
							id: '12',
							name: 'a test'
						};
						const type = 'CSV - Type B';

						expect( middleware( req ).downloadFile( file, type ) ).toEqual( `/downloads/${ file.id }/?name=${ encodeURIComponent( file.name ) }&type=${ encodeURIComponent( type ) }` );
					} );
				} );
			} );
		} );

		describe( 'Types of downloads', function(){

			function checkTypes( name, type ){

				const fileWithId = { id: '100' };
				const fileWithName = {
					id: '12',
					name: 'a test'
				};

				expect( middleware( req )[ name ]( fileWithId, type ) ).toEqual( `/downloads/${ fileWithId.id }/?type=${ encodeURIComponent( type ) }` );
				expect( middleware( req )[ name ]( fileWithName, type ) ).toEqual( `/downloads/${ fileWithName.id }/?name=${ encodeURIComponent( fileWithName.name ) }&type=${ encodeURIComponent( type ) }` );
			}

			it( 'Should use the correct type', function(){

				checkTypes( 'downloadExportFile', 'CSV - Export wins' );
				checkTypes( 'downloadFdiFile', 'CSV - FDI' );
				checkTypes( 'downloadInteractionsFile', 'CSV - Interactions' );
				checkTypes( 'downloadContactsByRegionFile', 'CSV - Contacts by region' );
				checkTypes( 'downloadCompaniesByRegionFile', 'CSV - Companies by region' );
				checkTypes( 'downloadContactsBySectorFile', 'CSV - Contacts by sector' );
				checkTypes( 'downloadCompaniesBySectorFile', 'CSV - Companies by sector' );
				checkTypes( 'downloadSampleFrameFile', 'CSV - Export Client Sample Frame' );
			} );
		} );
	} );

	describe( 'currentForYear', function(){

		describe( 'Without any query params', function(){

			it( 'Should return the URL', function(){

				req.url = '/year/test/';
				expect( middleware( req ).currentForYear( 2016 ) ).toEqual( '/2016/year/test/' );
				expect( middleware( req ).currentForYear( 2017 ) ).toEqual( '/year/test/' );
			} );
		} );

		describe( 'With query params', function(){

			it( 'Should strip the params from the URL', function(){

				req.url = '/year/test/?a=1&b=2';
				expect( middleware( req ).currentForYear( 2016 ) ).toEqual( '/2016/year/test/' );
				expect( middleware( req ).currentForYear( 2017 ) ).toEqual( '/year/test/' );
			} );
		} );
	} );

	describe( 'addSort', function(){

		function checkWithAndWithoutParams( key, inputKey, inputDir, outputDir ){

			const url = '/my/test/params/';
			const paramUrl = ( url + '?a=1&b=2' );
			const sortParams = `sort[key]=${ key }&sort[dir]=${ outputDir }`;

			expect( middleware( req ).addSort( url, key, inputKey, inputDir ) ).toEqual( url + '?' + sortParams );
			expect( middleware( req ).addSort( paramUrl, key, inputKey, inputDir ) ).toEqual( paramUrl + '&' + sortParams );
		}

		describe( 'When the key is the same as the sort key', function(){

			const key = 'company';
			const inputKey = key;

			describe( 'When the sort dir is ascending', function(){

				it( 'Should set the sort dir to descending', function(){

					checkWithAndWithoutParams( key, inputKey, 'asc', 'desc' );
				} );
			} );

			describe( 'When the sort key is descending', function(){

				it( 'Should set the sort key to ascending', function(){

					checkWithAndWithoutParams( key, inputKey, 'desc', 'asc' );
				} );
			} );
		} );

		describe( 'When the key is not the same as the sort key', function(){

			it( 'Should set the sort dir as ascending', function(){

				checkWithAndWithoutParams( 'date', 'company', 'asc', 'asc' );
			} );
		} );
	} );

	describe( 'Current', function(){

		describe( 'Without any arguments', function(){

			it( 'Should return the current URL', function(){

				checkFilteredUrls( req, 'current', [], req.url );
			} );
		} );

		describe( 'With query arguments', function(){

			describe( 'When there is a value', function(){

				it( 'Should return the current URL with the query arguments', function(){

					checkFilteredUrls( req, 'current', [ { query: { tab: 'blah' } } ], req.url + '?tab=blah' );
				} );
			} );

			describe( 'When the value is undefined', function(){

				it( 'Should return the current URL without the query arguments', function(){

					let tab;

					checkFilteredUrls( req, 'current', [ { query: { tab } } ], req.url );
				} );
			} );
		} );
	} );

	describe( 'Sector Teams', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'sectorTeamsOverview', [], '/sector-teams/' );
			checkFilteredUrls( req, 'sectorTeam', [ 1 ], '/sector-teams/1/' );
			checkFilteredUrls( req, 'sectorTeamWins', [ 2 ], '/sector-teams/2/wins/' );
			checkFilteredUrls( req, 'sectorTeamNonHvcWins', [ 3 ], '/sector-teams/3/non-hvc-wins/' );
			checkFilteredUrls( req, 'sectorTeamTopNonHvc', [ 4 ], '/sector-teams/4/top-non-hvc/' );
		} );
	} );

	describe( 'Countries', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'countries', [ 1 ], '/countries/' );
			checkFilteredUrls( req, 'country', [ 'AU' ], '/countries/AU/' );
			checkFilteredUrls( req, 'countryWins', [ 'AU' ], '/countries/AU/wins/' );
			checkFilteredUrls( req, 'countryNonHvcWins', [ 'AU' ], '/countries/AU/non-hvc-wins/' );
			checkFilteredUrls( req, 'countryTopNonHvc', [ 'AU' ], '/countries/AU/top-non-hvc/' );
		} );
	} );

	describe( 'Posts', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'posts', [ 1 ], '/posts/' );
			checkFilteredUrls( req, 'post', [ 'a-post-name' ], '/posts/a-post-name/' );
			checkFilteredUrls( req, 'postWins', [ 'a-post-name' ], '/posts/a-post-name/wins/' );
			checkFilteredUrls( req, 'postNonHvcWins', [ 'a-post-name' ], '/posts/a-post-name/non-hvc-wins/' );
			checkFilteredUrls( req, 'postTopNonHvc', [ 'a-post-name' ], '/posts/a-post-name/top-non-hvc/' );
		} );
	} );

	describe( 'UK Regions', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'ukRegions', [ 1 ], '/uk-regions/' );
			checkFilteredUrls( req, 'ukRegion', [ 'a-region-name' ], '/uk-regions/a-region-name/' );
			checkFilteredUrls( req, 'ukRegionWins', [ 'a-region-name' ], '/uk-regions/a-region-name/wins/' );
			checkFilteredUrls( req, 'ukRegionNonHvcWins', [ 'a-region-name' ], '/uk-regions/a-region-name/non-hvc-wins/' );
			checkFilteredUrls( req, 'ukRegionTopNonHvc', [ 'a-region-name' ], '/uk-regions/a-region-name/top-non-hvc/' );
		} );
	} );

	describe( 'HVC Groups', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'hvcGroup', [ 1 ], '/hvc-groups/1/' );
			checkFilteredUrls( req, 'hvcGroupWins', [ 2 ], '/hvc-groups/2/wins/' );
		} );
	} );

	describe( 'Overseas Regions', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'osRegionsOverview', [], '/overseas-regions/' );
			checkFilteredUrls( req, 'osRegion', [ 1 ], '/overseas-regions/1/' );
			checkFilteredUrls( req, 'osRegionWins', [ 2 ], '/overseas-regions/2/wins/' );
			checkFilteredUrls( req, 'osRegionNonHvcWins', [ 3 ], '/overseas-regions/3/non-hvc-wins/' );
			checkFilteredUrls( req, 'osRegionTopNonHvc', [ 4 ], '/overseas-regions/4/top-non-hvc/' );
		} );

		describe( 'Sorted win tables', function(){

			it( 'Should return the correct URLs', function(){


			} );
		} );
	} );

	describe( 'HVC', function(){

		it( 'Should return the correct URLs', function(){

			checkFilteredUrls( req, 'hvc', [ 1 ], '/hvc/1/' );
			checkFilteredUrls( req, 'hvcWins', [ 2 ], '/hvc/2/wins/' );
		} );
	} );

	describe( 'Investment', function(){

		describe( 'Index', function(){

			describe( 'Without a tab specified', function(){

				it( 'Should return the correct url', function(){

					checkFilteredUrls( req, 'investment.index', [], '/investment/' );
				} );
			} );

			describe( 'With the sectors tab specified', function(){

				it( 'Should return the correct url', function(){

					checkFilteredUrls( req, 'investment.index', [ { sectors: true } ], '/investment/?tab=sectors' );
				} );
			} );

			describe( 'With the overseas regions tab specified', function(){

				it( 'Should return the correct url', function(){

					checkFilteredUrls( req, 'investment.index', [ { osRegions: true } ], '/investment/?tab=os-regions' );
				} );
			} );

			describe( 'With the uk regions tab specified', function(){

				it( 'Should return the correct url', function(){

					checkFilteredUrls( req, 'investment.index', [ { ukRegions: true } ], '/investment/?tab=uk-regions' );
				} );
			} );
		} );
	} );
} );
