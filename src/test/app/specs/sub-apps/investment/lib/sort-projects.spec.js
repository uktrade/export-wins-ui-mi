const sortProjects = require( '../../../../../../app/sub-apps/investment/lib/sort-projects' );

const staticInput = [
			{
				code: 'P-0001',
				jobs: {
					new: 100,
					safe: 200
				},
				stage: 'Pipeline',
				date: 'Sun Dec 10 2017 11:06:27 GMT+0000 (GMT)',
				company: {
					name: 'Walsh - Flatley',
					reference: 'ORG-74384049'
				},
				investmentValue: 1000,
				relationshipManager: 'Tessie Treutel IV'
			},{
				code: 'P-0004',
				jobs: {
					new: 400,
					safe: 300
				},
				stage: 'Won',
				date: 'Mon Dec 11 2017 11:06:27 GMT+0000 (GMT)',
				company: {
					name: 'Boyer and Sons',
					reference: ''
				},
				investmentValue: 2000,
				relationshipManager: 'Mr. Joshua Block'
			},{
				code: 'P-0002',
				jobs: {
					new: 300,
					safe: 400
				},
				stage: 'Pipeline',
				date: 'Sat Dec 9 2017 11:06:27 GMT+0000 (GMT)',
				company: {
					name: 'Herzog and Sons',
					reference: ''
				},
				investmentValue: 4000,
				relationshipManager: 'Helen Bosco'
			},{
				code: 'P-0003',
				jobs: {
					new: 200,
					safe: 100
				},
				stage: 'Something',
				date: 'Fri Dec 8 2017 11:06:27 GMT+0000 (GMT)',
				company: {
					name: 'Fred',
					reference: ''
				},
				investmentValue: 3000,
				relationshipManager: 'Josh Black'
			}
		];

describe( 'Sort Projects', function(){

	describe( 'When there are not any wins', function(){

		it( 'Should return the input and not error', function(){

			const input = {};

			expect( sortProjects( input.hvc ) ).toEqual( input.hvc );
		} );
	} );

	describe( 'When there are some wins', function(){

		let input;

		beforeEach( function(){

			input = JSON.parse( JSON.stringify( staticInput ) );
		} );

		describe( 'With an unknown key', function(){

			it( 'Should return the wins as input', function(){

				const output = sortProjects( input, { key: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortProjects( input, { key: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'With an unknown dir', function(){

			it( 'Should return the wins as input', function(){

				const output = sortProjects( input, { key: 'company', dir: 'blah' } );

				expect( output ).toEqual( input );
			} );

			it( 'Should not set the sortKey or sortDir property', function(){

				const output = sortProjects( input, { key: 'company', dir: 'blah' } );

				expect( output.sortKey ).not.toBeDefined();
				expect( output.sortDir ).not.toBeDefined();
				expect( output.sortName ).not.toBeDefined();
				expect( output.sortDirName ).not.toBeDefined();
			} );
		} );

		describe( 'Without a sort', function(){

			it( 'Should return the wins as input', function(){

				const output = sortProjects( input );

				expect( output ).toEqual( input );
			} );

			it( 'Should set the sortKey or sortDir to the defaults', function(){

				const output = sortProjects( input );

				expect( output.sortKey ).toEqual( 'company' );
				expect( output.sortDir ).toEqual( 'asc' );
				expect( output.sortName ).toEqual( 'Company name' );
				expect( output.sortDirName ).toEqual( 'ascending' );
			} );
		} );

		describe( 'With a known key', function(){

			describe( 'Sort by Company Name', function(){

				const sortKey = sortProjects.KEYS.company;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].company.name ).toEqual( staticInput[ 1 ].company.name );
						expect( output[ 1 ].company.name ).toEqual( staticInput[ 3 ].company.name );
						expect( output[ 2 ].company.name ).toEqual( staticInput[ 2 ].company.name );
						expect( output[ 3 ].company.name ).toEqual( staticInput[ 0 ].company.name );

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
						const output = sortProjects( input, sort );

						expect( output[ 0 ].company.name ).toEqual( staticInput[ 0 ].company.name );
						expect( output[ 1 ].company.name ).toEqual( staticInput[ 2 ].company.name );
						expect( output[ 2 ].company.name ).toEqual( staticInput[ 3 ].company.name );
						expect( output[ 3 ].company.name ).toEqual( staticInput[ 1 ].company.name );
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

							const output = sortProjects( input, { key: sortKey, dir: 'asc' } );

							expect( output[ 0 ].company.name ).toEqual( 'acompany 1' );
							expect( output[ 1 ].company.name ).toEqual( 'Acompany 2' );
							expect( output[ 2 ].company.name ).toEqual( 'bcompany 1' );
							expect( output[ 3 ].company.name ).toEqual( 'Bcompany 2' );
						} );
					} );
				} );
			} );

			describe( 'Sort by project code', function(){

				const sortKey = sortProjects.KEYS.code;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].code ).toEqual( staticInput[ 0 ].code );
						expect( output[ 1 ].code ).toEqual( staticInput[ 2 ].code );
						expect( output[ 2 ].code ).toEqual( staticInput[ 3 ].code );
						expect( output[ 3 ].code ).toEqual( staticInput[ 1 ].code );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Project code' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].code ).toEqual( staticInput[ 1 ].code );
						expect( output[ 1 ].code ).toEqual( staticInput[ 3 ].code );
						expect( output[ 2 ].code ).toEqual( staticInput[ 2 ].code );
						expect( output[ 3 ].code ).toEqual( staticInput[ 0 ].code );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Project code' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by manager', function(){

				const sortKey = sortProjects.KEYS.manager;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].relationshipManager ).toEqual( staticInput[ 2 ].relationshipManager );
						expect( output[ 1 ].relationshipManager ).toEqual( staticInput[ 3 ].relationshipManager );
						expect( output[ 2 ].relationshipManager ).toEqual( staticInput[ 1 ].relationshipManager );
						expect( output[ 3 ].relationshipManager ).toEqual( staticInput[ 0 ].relationshipManager );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Manager' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].relationshipManager ).toEqual( staticInput[ 0 ].relationshipManager );
						expect( output[ 1 ].relationshipManager ).toEqual( staticInput[ 1 ].relationshipManager );
						expect( output[ 2 ].relationshipManager ).toEqual( staticInput[ 3 ].relationshipManager );
						expect( output[ 3 ].relationshipManager ).toEqual( staticInput[ 2 ].relationshipManager );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Manager' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );

				describe( 'Case insensitive sorting', function(){

					describe( 'Ascending', function(){

						it( 'Should sort it correctly', function(){

							const input = [
								{
									relationshipManager: 'Aperson 2'
								},{
									relationshipManager: 'Bperson 2'
								},{
									relationshipManager: 'aperson 1'
								},{
									relationshipManager: 'bperson 1'
								}
							];

							const output = sortProjects( input, { key: sortKey, dir: 'asc' } );

							expect( output[ 0 ].relationshipManager ).toEqual( 'aperson 1' );
							expect( output[ 1 ].relationshipManager ).toEqual( 'Aperson 2' );
							expect( output[ 2 ].relationshipManager ).toEqual( 'bperson 1' );
							expect( output[ 3 ].relationshipManager ).toEqual( 'Bperson 2' );
						} );
					} );
				} );
			} );

			describe( 'Sort by Stage', function(){

				const sortKey = sortProjects.KEYS.stage;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].stage ).toEqual( staticInput[ 0 ].stage );
						expect( output[ 1 ].stage ).toEqual( staticInput[ 2 ].stage );
						expect( output[ 2 ].stage ).toEqual( staticInput[ 3 ].stage );
						expect( output[ 3 ].stage ).toEqual( staticInput[ 1 ].stage );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Stage' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].stage ).toEqual( staticInput[ 1 ].stage );
						expect( output[ 1 ].stage ).toEqual( staticInput[ 3 ].stage );
						expect( output[ 2 ].stage ).toEqual( staticInput[ 2 ].stage );
						expect( output[ 3 ].stage ).toEqual( staticInput[ 0 ].stage );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Stage' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by date', function(){

				const sortKey = sortProjects.KEYS.date;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].date ).toEqual( staticInput[ 3 ].date );
						expect( output[ 1 ].date ).toEqual( staticInput[ 2 ].date );
						expect( output[ 2 ].date ).toEqual( staticInput[ 0 ].date );
						expect( output[ 3 ].date ).toEqual( staticInput[ 1 ].date );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Date' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].date ).toEqual( staticInput[ 1 ].date );
						expect( output[ 1 ].date ).toEqual( staticInput[ 0 ].date );
						expect( output[ 2 ].date ).toEqual( staticInput[ 2 ].date );
						expect( output[ 3 ].date ).toEqual( staticInput[ 3 ].date );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Date' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by Value', function(){

				const sortKey = sortProjects.KEYS.value;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].investmentValue ).toEqual( staticInput[ 0 ].investmentValue );
						expect( output[ 1 ].investmentValue ).toEqual( staticInput[ 1 ].investmentValue );
						expect( output[ 2 ].investmentValue ).toEqual( staticInput[ 3 ].investmentValue );
						expect( output[ 3 ].investmentValue ).toEqual( staticInput[ 2 ].investmentValue );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Value' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].investmentValue ).toEqual( staticInput[ 2 ].investmentValue );
						expect( output[ 1 ].investmentValue ).toEqual( staticInput[ 3 ].investmentValue );
						expect( output[ 2 ].investmentValue ).toEqual( staticInput[ 1 ].investmentValue );
						expect( output[ 3 ].investmentValue ).toEqual( staticInput[ 0 ].investmentValue );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Value' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by New Jobs', function(){

				const sortKey = sortProjects.KEYS.newJobs;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].jobs.new ).toEqual( staticInput[ 0 ].jobs.new );
						expect( output[ 1 ].jobs.new ).toEqual( staticInput[ 3 ].jobs.new );
						expect( output[ 2 ].jobs.new ).toEqual( staticInput[ 2 ].jobs.new );
						expect( output[ 3 ].jobs.new ).toEqual( staticInput[ 1 ].jobs.new );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'New jobs' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].jobs.new ).toEqual( staticInput[ 1 ].jobs.new );
						expect( output[ 1 ].jobs.new ).toEqual( staticInput[ 2 ].jobs.new );
						expect( output[ 2 ].jobs.new ).toEqual( staticInput[ 3 ].jobs.new );
						expect( output[ 3 ].jobs.new ).toEqual( staticInput[ 0 ].jobs.new );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'New jobs' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );

			describe( 'Sort by Safeguarded Jobs', function(){

				const sortKey = sortProjects.KEYS.safeJobs;

				describe( 'Ascending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'asc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].jobs.new ).toEqual( staticInput[ 3 ].jobs.new );
						expect( output[ 1 ].jobs.new ).toEqual( staticInput[ 0 ].jobs.new );
						expect( output[ 2 ].jobs.new ).toEqual( staticInput[ 1 ].jobs.new );
						expect( output[ 3 ].jobs.new ).toEqual( staticInput[ 2 ].jobs.new );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Safeguarded jobs' );
						expect( output.sortDirName ).toEqual( 'ascending' );
					} );
				} );

				describe( 'Descending', function(){

					it( 'Should sort it correctly', function(){

						const sortDir = 'desc';
						const sort = { key: sortKey, dir: sortDir };
						const output = sortProjects( input, sort );

						expect( output[ 0 ].jobs.new ).toEqual( staticInput[ 2 ].jobs.new );
						expect( output[ 1 ].jobs.new ).toEqual( staticInput[ 1 ].jobs.new );
						expect( output[ 2 ].jobs.new ).toEqual( staticInput[ 0 ].jobs.new );
						expect( output[ 3 ].jobs.new ).toEqual( staticInput[ 3 ].jobs.new );

						expect( output.sortKey ).toEqual( sortKey );
						expect( output.sortDir ).toEqual( sortDir );
						expect( output.sortName ).toEqual( 'Safeguarded jobs' );
						expect( output.sortDirName ).toEqual( 'descending' );
					} );
				} );
			} );
		} );
	} );

} );
