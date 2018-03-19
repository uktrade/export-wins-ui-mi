const sortRegionProgress = require( '../../../../../../app/sub-apps/investment/lib/sort-region-progress' );

const staticInput = [
      {
         "id": 1,
         "name": "sed voluptas neque",
         "short_name": "quia",
         "wins": {
            "verify_win": {
               "count": 100,
               "percent": 0
            },
            "won": {
               "count": 200,
               "percent": 0
            },
            "hvc": {
               "count": 0,
               "percent": 0
            },
            "non_hvc": {
               "count": 0,
               "percent": 0
            },
            "total": 300
         },
         "target": 0,
         "jobs": {
            "new": 150,
            "safe": 50,
            "total": 200
         },
         "pipeline": 0
      },
      {
         "id": 2,
         "name": "cupiditate eos architecto",
         "short_name": "quia",
         "wins": {
            "verify_win": {
               "count": 200,
               "percent": 0
            },
            "won": {
               "count": 250,
               "percent": 0
            },
            "hvc": {
               "count": 0,
               "percent": 0
            },
            "non_hvc": {
               "count": 0,
               "percent": 0
            },
            "total": 450
         },
         "target": 0,
         "jobs": {
            "new": 50,
            "safe": 100,
            "total": 150
         },
         "pipeline": 0
      },
      {
         "id": 3,
         "name": "ducimus quae ab",
         "short_name": "voluptatem",
         "wins": {
            "verify_win": {
               "count": 20,
               "percent": 0
            },
            "won": {
               "count": 10,
               "percent": 0
            },
            "hvc": {
               "count": 0,
               "percent": 0
            },
            "non_hvc": {
               "count": 0,
               "percent": 0
            },
            "total": 30
         },
         "target": 0,
         "jobs": {
            "new": 25,
            "safe": 10,
            "total": 35
         },
         "pipeline": 0
      },
      {
         "id": 4,
         "name": "mollitia quam vel",
         "short_name": "dignissimos",
         "wins": {
            "verify_win": {
               "count": 30,
               "percent": 0
            },
            "won": {
               "count": 70,
               "percent": 0
            },
            "hvc": {
               "count": 0,
               "percent": 0
            },
            "non_hvc": {
               "count": 0,
               "percent": 0
            },
            "total": 100
         },
         "target": 0,
         "jobs": {
            "new": 45,
            "safe": 25,
            "total": 70
         },
         "pipeline": 0
      },
      {
         "id": 5,
         "name": "laudantium quo minus",
         "short_name": "voluptatem",
         "wins": {
            "verify_win": {
               "count": 500,
               "percent": 0
            },
            "won": {
               "count": 200,
               "percent": 0
            },
            "hvc": {
               "count": 0,
               "percent": 0
            },
            "non_hvc": {
               "count": 0,
               "percent": 0
            },
            "total": 700
         },
         "target": 0,
         "jobs": {
            "new": 79,
            "safe": 101,
            "total": 180
         },
         "pipeline": 0
      }
   ];

describe( 'Sort Region Progress', function(){

	describe( 'When there are not any wins', function(){

		it( 'Should return the input and not error', function(){

			const input = [];

			expect( sortRegionProgress( input ) ).toEqual( input );
		} );
	} );

	describe( 'When there are some wins', function(){

		let input;

		beforeEach( function(){

			input = JSON.parse( JSON.stringify( staticInput ) );
		} );

		describe( 'With an unknown key', function(){

			it( 'Should return the wins as input', function(){

				const output = sortRegionProgress( input, { key: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortRegionProgress( input, { key: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'With an unknown dir', function(){

			it( 'Should return the wins as input', function(){

				const output = sortRegionProgress( input, { key: 'region', dir: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortRegionProgress( input, { key: 'region', dir: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'Without a sort', function(){

			it( 'Should return the wins as input', function(){

				const output = sortRegionProgress( input );

				expect( output ).toEqual( input );
			} );

			it( 'Should set the sortKey or sortDir to the defaults', function(){

				const output = sortRegionProgress( input );

				expect( output.sortKey ).toEqual( 'region' );
				expect( output.sortName ).toEqual( 'Region' );
				expect( output.sortDir ).toEqual( 'asc' );
				expect( output.sortDirName ).toEqual( 'ascending' );
			} );
		} );

		describe( 'With a known key', function(){

			function getProperty( obj, property ){

				const parts = property.split( '.' );

				return parts.reduce( ( item, name ) => item[ name ], obj );
			}

			function checkResults( output, property, sortKey, sortDir, sortName, sortDirName, order ){

				for( let i = 0, l = output.length; i < l; i++ ){

					expect( getProperty( output[ i ], property ) ).toEqual( getProperty( staticInput[ order[ i ] ], property) );
				}

				expect( output.sortKey ).toEqual( sortKey );
				expect( output.sortDir ).toEqual( sortDir );
				expect( output.sortName ).toEqual( sortName );
				expect( output.sortDirName ).toEqual( sortDirName );
			}

			function checkDirections( property, sortKey, sortName, resultOrder ){

				const directions = [ [ 'asc', 'ascending', resultOrder ], [ 'desc', 'descending', resultOrder.slice( 0 ).reverse() ] ];

				for( let [ sortDir, sortDescription, results ] of directions ){

					const sort = { key: sortKey, dir: sortDir };
					const output = sortRegionProgress( input, sort );

					checkResults( output, property, sortKey, sortDir, sortName, sortDescription, results );
				}
			}

			describe( 'Sort by Region', function(){

				const sortKey = sortRegionProgress.KEYS.region;

				it( 'Should sort it correctly', function(){

					const sortName = 'Region';
					const resultOrder = [ 1, 2, 4, 3, 0 ];

					checkDirections( 'name', sortKey, sortName, resultOrder );
				} );

				describe( 'Case insensitive sorting', function(){

					describe( 'Ascending', function(){

						it( 'Should sort it correctly', function(){

							const input = [
								{
									name: 'Aregion 2'
								},{
									name: 'Bregion 2'
								},{
									name: 'aregion 1'
								},{
									name: 'bregion 1'
								}
							];

							const output = sortRegionProgress( input, { key: sortKey, dir: 'asc' } );

							expect( output[ 0 ].name ).toEqual( 'aregion 1' );
							expect( output[ 1 ].name ).toEqual( 'Aregion 2' );
							expect( output[ 2 ].name ).toEqual( 'bregion 1' );
							expect( output[ 3 ].name ).toEqual( 'Bregion 2' );
						} );
					} );
				} );
			} );

			describe( 'Sort by total wins', function(){

				it( 'Should sort it correctly', function(){

					const sortKey = sortRegionProgress.KEYS.totalWins;
					const sortName = 'Project wins';
					const resultOrder = [ 2, 3, 0, 1, 4 ];

					checkDirections( 'wins.total', sortKey, sortName, resultOrder );
				} );
			} );

			describe( 'Sort by verify win', function(){

				it( 'Should sort it correctly', function(){

					const sortKey = sortRegionProgress.KEYS.verifyWin;
					const sortName = 'Verify win';
					const resultOrder = [ 2, 3, 0, 1, 4 ];

					checkDirections( 'wins.verify_win', sortKey, sortName, resultOrder );
				} );
			} );

			describe( 'Sort by total jobs', function(){

				it( 'Should sort it correctly', function(){

					const sortKey = sortRegionProgress.KEYS.totalJobs;
					const sortName = 'Total jobs';
					const resultOrder = [ 2, 3, 1, 4, 0 ];

					checkDirections( 'jobs.total', sortKey, sortName, resultOrder );
				} );
			} );

			describe( 'Sort by new jobs', function(){

				it( 'Should sort it correctly', function(){

					const sortKey = sortRegionProgress.KEYS.newJobs;
					const sortName = 'New jobs';
					const resultOrder = [ 2, 3, 1, 4, 0  ];

					checkDirections( 'jobs.new', sortKey, sortName, resultOrder );
				} );
			} );

			describe( 'Sort by safeguarded jobs', function(){

				it( 'Should sort it correctly', function(){

					const sortKey = sortRegionProgress.KEYS.safeJobs;
					const sortName = 'Safeguarded jobs';
					const resultOrder = [ 2, 3, 0, 1, 4  ];

					checkDirections( 'jobs.safe', sortKey, sortName, resultOrder );
				} );
			} );
		} );
	} );
} );
