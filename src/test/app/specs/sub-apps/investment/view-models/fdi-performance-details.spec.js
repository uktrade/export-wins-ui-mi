const performanceDetails = require( '../../../../../../app/sub-apps/investment/view-models/fdi-performance-details' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const names = {
	high: 'High',
	good: 'Good',
	standard: 'Standard'
};

const headings = [
	'Value',
	'% of total',
	'HVC',
	'Non-HVC',
	'New jobs',
	'Safeguarded jobs'
];

const performanceWins = {
	high: [ 'High', 58.11, '4,703', '873', '2,406', '4,902' ],
	good: [ 'Good', 5.78, '101', '2,872', '265', '2,049' ],
	standard: [ 'Standard', 7.04, '857', '4,468', '4,213', '4,551' ],
	totals: [ 'Totals', '', '4,987', '1,844', '63', '3,268' ]
};

const performancePipeline = {
	high: [ 'High', 14.02, '443', '2,979', '4,388', '820' ],
	good: [ 'Good', 69.97, '4,900', '3,825', '1,178', '2,725' ],
	standard: [ 'Standard', 63.88, '158', '3,174', '1,945', '940' ],
	totals: [ 'Totals', '', '3,670', '1,160', '3,166', '4,524' ]
};

describe( 'FDI Performance Details View Model', function(){

	describe( 'With a full response', function(){

		let input;
		let output;

		beforeEach( function(){

			//get stub each time
			input = getBackendStub( '/investment/fdi/performance' ).results;
			output = performanceDetails.create( input );
		} );

		describe( 'Win details', function(){

			it( 'Should convert the response to the correct format', function(){

				expect( output.wins.headings ).toEqual( headings );
				expect( Array.isArray( output.wins.rows ) ).toEqual( true );

				let i = 0;

				for( let type in names ){

					const item = output.wins.rows[ i++ ];
					const data = performanceWins[ type ];

					expect( item ).toEqual( data );
				}

				expect( output.wins.totals ).toEqual( performanceWins.totals );
			} );
		} );

		describe( 'Active pipeline details', function(){

			it( 'Should convert the response to the correct format', function(){

				expect( output.activePipeline.headings ).toEqual( headings );
				expect( Array.isArray( output.activePipeline.rows ) ).toEqual( true );

				let i = 0;

				for( let type in names ){

					const item = output.activePipeline.rows[ i++ ];
					const data = performancePipeline[ type ];

					expect( item ).toEqual( data );
				}

				expect( output.activePipeline.totals ).toEqual( performancePipeline.totals );
			} );
		} );

		describe( 'Pipeline', function(){

			it( 'Should convert the response to the correct format', function(){

				expect( output.pipeline ).toBeDefined();
				expect( output.pipeline.prospect ).toEqual( { count: '3,010', percent: 91 } );
				expect( output.pipeline.assign ).toEqual( { count: '1,116', percent: 36 } );
				expect( output.pipeline.active ).toEqual( { count: '1,978', percent: 84 } );
			} );
		} );
	} );

	describe( 'With no results', function(){

		it( 'Should return an empty data set', function(){

			const emptyResponse = {
				wins: {
					headings,
					rows: [],
					totals: []
				},
				activePipeline: {
					headings,
					rows: [],
					totals: []
				},
				pipeline: {
					active: {},
					prospect: {},
					assign: {}
				}
			};

			expect( performanceDetails.create( null ) ).toEqual( emptyResponse );
			expect( performanceDetails.create() ).toEqual( emptyResponse );
		} );
	} );
} );
