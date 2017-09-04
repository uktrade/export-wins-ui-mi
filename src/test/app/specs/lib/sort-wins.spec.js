const sortWins = require( '../../../../app/lib/sort-wins' );

const staticInput = [
	{
		hvc: {
			code: "A188",
			name: "quis et sint"
		},
		id: "f516e3b3-f166-406c-80f6-0322d571de02",
		win_date: "Fri Aug 25 2017 12:55:02 GMT+0100 (BST)",
		status: {
			name: "Not yet sent",
			modifyer: "not-sent"
		},
		company: {
			name: "O'Reilly Group",
			cdms_id: "6926"
		},
		export_amount: 100,
		lead_officer: {
			name: "Eldon Kihn"
		}
	},{
		hvc: {
			code: "A110",
			name: "sit quasi quam"
		},
		id: "71697f35-604d-460b-9f8b-a27b06def40d",
		win_date: "Fri Aug 25 2017 06:05:23 GMT+0100 (BST)",
		status: {
			name: "Confirmed",
			modifyer: "confirmed"
		},
		company: {
			name: "Ward - Emmerich",
			cdms_id: "3610"
		},
		export_amount: 1000,
		lead_officer: {
			name: "Ludwig Williamson"
		}
	},{
		hvc: {
			code: "A26",
			name: "labore saepe architecto"
		},
		id: "1faf7a49-5b63-48ce-8d32-4e3608390855",
		win_date: "Thu Aug 24 2017 15:58:06 GMT+0100 (BST)",
		status: {
			name: "Rejected",
			modifyer: "rejected"
		},
		company: {
			name: "Kertzmann Group",
			cdms_id: "19065"
		},
		export_amount: 500,
		credit: false,
		lead_officer: {
			name: "Donnell Windler"
		}
	},{
		hvc: {
			code: "A26",
			name: "labore saepe architecto"
		},
		id: "1faf7a49-5b63-48ce-8d32-4e3608390855",
		win_date: "Thu Aug 24 2017 15:58:06 GMT+0100 (BST)",
		status: {
			name: "Rejected",
			modifyer: "rejected"
		},
		company: {
			name: "Kertzmann Group",
			cdms_id: "19065"
		},
		export_amount: 500,
		credit: false,
		lead_officer: {
			name: "Donnell Windler"
		}
	}
];

describe( 'sortWins', function(){

	describe( 'When there are not any wins', function(){

		it( 'Should return the input and not error', function(){

			const input = {};

			expect( sortWins( input.hvc ) ).toEqual( input.hvc );
		} );
	} );

	describe( 'When there are some wins', function(){

		let input;

		beforeEach( function(){

			input = JSON.parse( JSON.stringify( staticInput ) );
		} );

		describe( 'With an unknown key', function(){

			it( 'Should return the wins as input', function(){

				const output = sortWins( input, { key: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Shout not set the sortKey or sortDir property', function(){

				const output = sortWins( input, { key: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'With an unknown dir', function(){

			it( 'Should return the wins as input', function(){

				const output = sortWins( input, { key: 'company', dir: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Shout not set the sortKey or sortDir property', function(){

				const output = sortWins( input, { key: 'company', dir: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'Without a sort', function(){

			it( 'Should return the wins as input', function(){

				const output = sortWins( input );

				expect( output ).toEqual( input );
			} );

			it( 'Should set the sortKey or sortDir to the defaults', function(){

				const output = sortWins( input );

				expect( output.sortKey ).toEqual( 'company' );
				expect( output.sortDir ).toEqual( 'asc' );
				expect( output.sortName ).toEqual( 'Company name' );
				expect( output.sortDirName ).toEqual( 'ascending' );
			} );
		} );

		describe( 'With a known key', function(){

			describe( 'Sort by Company Name', function(){

				const sortKey = 'company';

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].company.name ).toEqual( staticInput[ 3 ].company.name );
						expect( output[ 1 ].company.name ).toEqual( staticInput[ 2 ].company.name );
						expect( output[ 2 ].company.name ).toEqual( staticInput[ 0 ].company.name );
						expect( output[ 3 ].company.name ).toEqual( staticInput[ 1 ].company.name );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Company name' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].company.name ).toEqual( staticInput[ 1 ].company.name );
						expect( output[ 1 ].company.name ).toEqual( staticInput[ 0 ].company.name );
						expect( output[ 2 ].company.name ).toEqual( staticInput[ 2 ].company.name );
						expect( output[ 3 ].company.name ).toEqual( staticInput[ 3 ].company.name );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Company name' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );

				describe( 'Case insensitive sorting', function(){

					describe( 'Ascending', function(){

						it( 'Should sort it correctly', function(){

							const input = [
								{
									company: {
										name: 'Acompany 2'
									}
								},{
									company: {
										name: 'Bcompany 2'
									}
								},{
									company: {
										name: 'acompany 1'
									}
								},{
									company: {
										name: 'bcompany 1'
									}
								}
							];

							const output = sortWins( input, { key: sortKey, dir: 'asc' } );

							expect( output[ 0 ].company.name ).toEqual( 'acompany 1' );
							expect( output[ 1 ].company.name ).toEqual( 'Acompany 2' );
							expect( output[ 2 ].company.name ).toEqual( 'bcompany 1' );
							expect( output[ 3 ].company.name ).toEqual( 'Bcompany 2' );
						} );
					} );
				} );
			} );

			describe( 'Sort by HVC Code', function(){

				const sortKey = 'hvc';

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].hvc.code ).toEqual( staticInput[ 3 ].hvc.code );
						expect( output[ 1 ].hvc.code ).toEqual( staticInput[ 2 ].hvc.code );
						expect( output[ 2 ].hvc.code ).toEqual( staticInput[ 1 ].hvc.code );
						expect( output[ 3 ].hvc.code ).toEqual( staticInput[ 0 ].hvc.code );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'HVC code' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].hvc.code ).toEqual( staticInput[ 0 ].hvc.code );
						expect( output[ 1 ].hvc.code ).toEqual( staticInput[ 1 ].hvc.code );
						expect( output[ 2 ].hvc.code ).toEqual( staticInput[ 2 ].hvc.code );
						expect( output[ 3 ].hvc.code ).toEqual( staticInput[ 3 ].hvc.code );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'HVC code' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by Lead officer name', function(){

				const sortKey = 'officer';

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].lead_officer.name ).toEqual( staticInput[ 3 ].lead_officer.name );
						expect( output[ 1 ].lead_officer.name ).toEqual( staticInput[ 2 ].lead_officer.name );
						expect( output[ 2 ].lead_officer.name ).toEqual( staticInput[ 0 ].lead_officer.name );
						expect( output[ 3 ].lead_officer.name ).toEqual( staticInput[ 1 ].lead_officer.name );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Lead officer' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].lead_officer.name ).toEqual( staticInput[ 1 ].lead_officer.name );
						expect( output[ 1 ].lead_officer.name ).toEqual( staticInput[ 0 ].lead_officer.name );
						expect( output[ 2 ].lead_officer.name ).toEqual( staticInput[ 2 ].lead_officer.name );
						expect( output[ 3 ].lead_officer.name ).toEqual( staticInput[ 3 ].lead_officer.name );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Lead officer' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );

				describe( 'Case insensitive sorting', function(){

					describe( 'Ascending', function(){

						it( 'Should sort it correctly', function(){

							const input = [
								{
									lead_officer: {
										name: 'Aperson 2'
									}
								},{
									lead_officer: {
										name: 'Bperson 2'
									}
								},{
									lead_officer: {
										name: 'aperson 1'
									}
								},{
									lead_officer: {
										name: 'bperson 1'
									}
								}
							];

							const output = sortWins( input, { key: sortKey, dir: 'asc' } );

							expect( output[ 0 ].lead_officer.name ).toEqual( 'aperson 1' );
							expect( output[ 1 ].lead_officer.name ).toEqual( 'Aperson 2' );
							expect( output[ 2 ].lead_officer.name ).toEqual( 'bperson 1' );
							expect( output[ 3 ].lead_officer.name ).toEqual( 'Bperson 2' );
						} );
					} );
				} );
			} );

			describe( 'Sort by Win date', function(){

				const sortKey = 'date';

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].win_date ).toEqual( staticInput[ 3 ].win_date );
						expect( output[ 1 ].win_date ).toEqual( staticInput[ 2 ].win_date );
						expect( output[ 2 ].win_date ).toEqual( staticInput[ 1 ].win_date );
						expect( output[ 3 ].win_date ).toEqual( staticInput[ 0 ].win_date );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Win date' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].win_date ).toEqual( staticInput[ 0 ].win_date );
						expect( output[ 1 ].win_date ).toEqual( staticInput[ 1 ].win_date );
						expect( output[ 2 ].win_date ).toEqual( staticInput[ 2 ].win_date );
						expect( output[ 3 ].win_date ).toEqual( staticInput[ 3 ].win_date );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Win date' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by Export value', function(){

				const sortKey = 'value';

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].export_amount ).toEqual( staticInput[ 0 ].export_amount );
						expect( output[ 1 ].export_amount ).toEqual( staticInput[ 2 ].export_amount );
						expect( output[ 2 ].export_amount ).toEqual( staticInput[ 3 ].export_amount );
						expect( output[ 3 ].export_amount ).toEqual( staticInput[ 1 ].export_amount );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Export value' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].export_amount ).toEqual( staticInput[ 1 ].export_amount );
						expect( output[ 1 ].export_amount ).toEqual( staticInput[ 2 ].export_amount );
						expect( output[ 2 ].export_amount ).toEqual( staticInput[ 3 ].export_amount );
						expect( output[ 3 ].export_amount ).toEqual( staticInput[ 0 ].export_amount );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Export value' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by Status', function(){

				const sortKey = 'status';

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].status.name ).toEqual( staticInput[ 1 ].status.name );
						expect( output[ 1 ].status.name ).toEqual( staticInput[ 0 ].status.name );
						expect( output[ 2 ].status.name ).toEqual( staticInput[ 2 ].status.name );
						expect( output[ 3 ].status.name ).toEqual( staticInput[ 3 ].status.name );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Status' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortWins( input, sort );

						expect( output[ 0 ].status.name ).toEqual( staticInput[ 3 ].status.name );
						expect( output[ 1 ].status.name ).toEqual( staticInput[ 2 ].status.name );
						expect( output[ 2 ].status.name ).toEqual( staticInput[ 0 ].status.name );
						expect( output[ 3 ].status.name ).toEqual( staticInput[ 1 ].status.name );
						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Status' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );
		} );
	} );
} );
