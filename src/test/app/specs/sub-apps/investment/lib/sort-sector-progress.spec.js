const sortSectorProgress = require( '../../../../../../app/sub-apps/investment/lib/sort-sector-progress' );

const staticInput = [
      {
         "id": 1,
         "name": "possimus sint dolores",
         "short_name": "et",
         "wins": {
            "hvc": 20,
            "total": 60
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
            "total": 150
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
            "total": 75
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
            "total": 186
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
            "total": 30
         },
         "target": 100,
         "pipeline": 50
      }
   ];

describe( 'Sort Projects', function(){

	describe( 'When there are not any wins', function(){

		it( 'Should return the input and not error', function(){

			const input = {};

			expect( sortSectorProgress( input.hvc ) ).toEqual( input.hvc );
		} );
	} );

	describe( 'When there are some wins', function(){

		let input;

		beforeEach( function(){

			input = JSON.parse( JSON.stringify( staticInput ) );
		} );

		describe( 'With an unknown key', function(){

			it( 'Should return the wins as input', function(){

				const output = sortSectorProgress( input, { key: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortSectorProgress( input, { key: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'With an unknown dir', function(){

			it( 'Should return the wins as input', function(){

				const output = sortSectorProgress( input, { key: 'company', dir: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortSectorProgress( input, { key: 'company', dir: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'Without a sort', function(){

			it( 'Should return the wins as input', function(){

				const output = sortSectorProgress( input );

				expect( output ).toEqual( input );
			} );

			it( 'Should set the sortKey or sortDir to the defaults', function(){

				const output = sortSectorProgress( input );

				expect( output.sortKey ).toEqual( 'sector' );
				expect( output.sortName ).toEqual( 'Sector' );
				expect( output.sortDir ).toEqual( 'asc' );
				expect( output.sortDirName ).toEqual( 'ascending' );
			} );
		} );

		describe( 'With a known key', function(){

			describe( 'Sort by Sector', function(){

				const sortKey = sortSectorProgress.KEYS.sector;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortSectorProgress( input, sort );

						expect( output[ 0 ].name ).toEqual( staticInput[ 1 ].name );
						expect( output[ 1 ].name ).toEqual( staticInput[ 2 ].name );
						expect( output[ 2 ].name ).toEqual( staticInput[ 3 ].name );
						expect( output[ 3 ].name ).toEqual( staticInput[ 0 ].name );
						expect( output[ 4 ].name ).toEqual( staticInput[ 4 ].name );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Sector' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortSectorProgress( input, sort );

						expect( output[ 0 ].name ).toEqual( staticInput[ 4 ].name );
						expect( output[ 1 ].name ).toEqual( staticInput[ 0 ].name );
						expect( output[ 2 ].name ).toEqual( staticInput[ 3 ].name );
						expect( output[ 3 ].name ).toEqual( staticInput[ 2 ].name );
						expect( output[ 4 ].name ).toEqual( staticInput[ 1 ].name );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Sector' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );

				describe( 'Case insensitive sorting', function(){

					describe( 'Ascending', function(){

						it( 'Should sort it correctly', function(){

							const input = [
								{
									name: 'Asector 2'
								},{
									name: 'Bsector 2'
								},{
									name: 'asector 1'
								},{
									name: 'bsector 1'
								}
							];

							const output = sortSectorProgress( input, { key: sortKey, dir: 'asc' } );

							expect( output[ 0 ].name ).toEqual( 'asector 1' );
							expect( output[ 1 ].name ).toEqual( 'Asector 2' );
							expect( output[ 2 ].name ).toEqual( 'bsector 1' );
							expect( output[ 3 ].name ).toEqual( 'Bsector 2' );
						} );
					} );
				} );
			} );

			describe( 'Sort by project wins', function(){

				const sortKey = sortSectorProgress.KEYS.projectWins;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortSectorProgress( input, sort );

						expect( output[ 0 ].wins.total ).toEqual( staticInput[ 4 ].wins.total );
						expect( output[ 1 ].wins.total ).toEqual( staticInput[ 0 ].wins.total );
						expect( output[ 2 ].wins.total ).toEqual( staticInput[ 2 ].wins.total );
						expect( output[ 3 ].wins.total ).toEqual( staticInput[ 1 ].wins.total );
						expect( output[ 4 ].wins.total ).toEqual( staticInput[ 3 ].wins.total );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Project wins' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortSectorProgress( input, sort );

						expect( output[ 0 ].wins.total ).toEqual( staticInput[ 3 ].wins.total );
						expect( output[ 1 ].wins.total ).toEqual( staticInput[ 1 ].wins.total );
						expect( output[ 2 ].wins.total ).toEqual( staticInput[ 2 ].wins.total );
						expect( output[ 3 ].wins.total ).toEqual( staticInput[ 0 ].wins.total );
						expect( output[ 4 ].wins.total ).toEqual( staticInput[ 4 ].wins.total );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Project wins' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by hvc wins', function(){

				const sortKey = sortSectorProgress.KEYS.hvcWins;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortSectorProgress( input, sort );

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
						const output = sortSectorProgress( input, sort );

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
