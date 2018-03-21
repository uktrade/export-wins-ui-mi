const sortMarketProgress = require( '../../../../../../app/sub-apps/investment/lib/sort-market-progress' );

const staticInput = [
      {
         "id": 1,
         "name": "possimus sint dolores",
         "short_name": "et",
         "wins": {
            "hvc": 20,
            "nonHvc": 60
         },
         "target": 100,
         "pipeline": 200
      },
      {
         "id": 2,
         "name": "earum impedit molestiae",
         "short_name": "nobis",
         "wins": {
            "hvc": 50,
            "nonHvc": 150
         },
         "target": 200,
         "pipeline": 300
      },
      {
         "id": 3,
         "name": "et omnis eaque",
         "short_name": "nostrum",
         "wins": {
            "hvc": 25,
            "nonHvc": 75
         },
         "target": 100,
         "pipeline": 200
      },
      {
         "id": 4,
         "name": "expedita qui cumque",
         "short_name": "qui",
         "wins": {
            "hvc": 63,
            "nonHvc": 186
         },
         "target": 500,
         "pipeline": 100
      },
      {
         "id": 5,
         "name": "reiciendis quis rerum",
         "short_name": "placeat",
         "wins": {
            "hvc": 10,
            "nonHvc": 30
         },
         "target": 100,
         "pipeline": 50
      }
   ];

describe( 'Sort Market Progress', function(){

	describe( 'When there are not any wins', function(){

		it( 'Should return the input and not error', function(){

			const input = {};

			expect( sortMarketProgress( input ) ).toEqual( input );
		} );
	} );

	describe( 'When there are some wins', function(){

		let input;

		beforeEach( function(){

			input = JSON.parse( JSON.stringify( staticInput ) );
		} );

		describe( 'With an unknown key', function(){

			it( 'Should return the wins as input', function(){

				const output = sortMarketProgress( input, { key: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortMarketProgress( input, { key: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'With an unknown dir', function(){

			it( 'Should return the wins as input', function(){

				const output = sortMarketProgress( input, { key: 'market', dir: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortMarketProgress( input, { key: 'market', dir: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'Without a sort', function(){

			it( 'Should return the wins as input', function(){

				const output = sortMarketProgress( input );

				expect( output ).toEqual( input );
			} );

			it( 'Should set the sortKey or sortDir to the defaults', function(){

				const output = sortMarketProgress( input );

				expect( output.sortKey ).toEqual( 'market' );
				expect( output.sortName ).toEqual( 'Market' );
				expect( output.sortDir ).toEqual( 'asc' );
				expect( output.sortDirName ).toEqual( 'ascending' );
			} );
		} );

		describe( 'With a known key', function(){

			describe( 'Sort by Market', function(){

				const sortKey = sortMarketProgress.KEYS.market;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortMarketProgress( input, sort );

						expect( output[ 0 ].name ).toEqual( staticInput[ 1 ].name );
						expect( output[ 1 ].name ).toEqual( staticInput[ 2 ].name );
						expect( output[ 2 ].name ).toEqual( staticInput[ 3 ].name );
						expect( output[ 3 ].name ).toEqual( staticInput[ 0 ].name );
						expect( output[ 4 ].name ).toEqual( staticInput[ 4 ].name );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Market' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortMarketProgress( input, sort );

						expect( output[ 0 ].name ).toEqual( staticInput[ 4 ].name );
						expect( output[ 1 ].name ).toEqual( staticInput[ 0 ].name );
						expect( output[ 2 ].name ).toEqual( staticInput[ 3 ].name );
						expect( output[ 3 ].name ).toEqual( staticInput[ 2 ].name );
						expect( output[ 4 ].name ).toEqual( staticInput[ 1 ].name );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Market' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );

				describe( 'Case insensitive sorting', function(){

					describe( 'Ascending', function(){

						it( 'Should sort it correctly', function(){

							const input = [
								{
									name: 'Amarket 2'
								},{
									name: 'Bmarket 2'
								},{
									name: 'amarket 1'
								},{
									name: 'bmarket 1'
								}
							];

							const output = sortMarketProgress( input, { key: sortKey, dir: 'asc' } );

							expect( output[ 0 ].name ).toEqual( 'amarket 1' );
							expect( output[ 1 ].name ).toEqual( 'Amarket 2' );
							expect( output[ 2 ].name ).toEqual( 'bmarket 1' );
							expect( output[ 3 ].name ).toEqual( 'Bmarket 2' );
						} );
					} );
				} );
			} );

			describe( 'Sort by non HVC wins', function(){

				const sortKey = sortMarketProgress.KEYS.nonHvcWins;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortMarketProgress( input, sort );

						expect( output[ 0 ].wins.nonHvc ).toEqual( staticInput[ 4 ].wins.nonHvc );
						expect( output[ 1 ].wins.nonHvc ).toEqual( staticInput[ 0 ].wins.nonHvc );
						expect( output[ 2 ].wins.nonHvc ).toEqual( staticInput[ 2 ].wins.nonHvc );
						expect( output[ 3 ].wins.nonHvc ).toEqual( staticInput[ 1 ].wins.nonHvc );
						expect( output[ 4 ].wins.nonHvc ).toEqual( staticInput[ 3 ].wins.nonHvc );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Non HVC wins' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortMarketProgress( input, sort );

						expect( output[ 0 ].wins.nonHvc ).toEqual( staticInput[ 3 ].wins.nonHvc );
						expect( output[ 1 ].wins.nonHvc ).toEqual( staticInput[ 1 ].wins.nonHvc );
						expect( output[ 2 ].wins.nonHvc ).toEqual( staticInput[ 2 ].wins.nonHvc );
						expect( output[ 3 ].wins.nonHvc ).toEqual( staticInput[ 0 ].wins.nonHvc );
						expect( output[ 4 ].wins.nonHvc ).toEqual( staticInput[ 4 ].wins.nonHvc );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Non HVC wins' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by hvc wins', function(){

				const sortKey = sortMarketProgress.KEYS.hvcWins;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortMarketProgress( input, sort );

						expect( output[ 0 ].wins.hvc ).toEqual( staticInput[ 4 ].wins.hvc );
						expect( output[ 1 ].wins.hvc ).toEqual( staticInput[ 0 ].wins.hvc );
						expect( output[ 2 ].wins.hvc ).toEqual( staticInput[ 2 ].wins.hvc );
						expect( output[ 3 ].wins.hvc ).toEqual( staticInput[ 1 ].wins.hvc );
						expect( output[ 4 ].wins.hvc ).toEqual( staticInput[ 3 ].wins.hvc );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'HVC wins' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortMarketProgress( input, sort );

						expect( output[ 0 ].wins.hvc ).toEqual( staticInput[ 3 ].wins.hvc );
						expect( output[ 1 ].wins.hvc ).toEqual( staticInput[ 1 ].wins.hvc );
						expect( output[ 2 ].wins.hvc ).toEqual( staticInput[ 2 ].wins.hvc );
						expect( output[ 3 ].wins.hvc ).toEqual( staticInput[ 0 ].wins.hvc );
						expect( output[ 4 ].wins.hvc ).toEqual( staticInput[ 4 ].wins.hvc );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'HVC wins' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );
		} );
	} );
} );
