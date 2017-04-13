const viewModel = require( '../../../../../app/lib/view-models/monthly-performance' );

function createViewModel( data ){

	return viewModel.create( {
		date_range: {
			start: 10000,
			end: 30000
		},
		results: data
	} );
}

describe( 'Monthly Performance view model', function(){

	describe( 'Create', function(){

		describe( 'With just HVC data', function(){

			let output;
			const hvcData = {

				target: 1000,
				targetName: '£0.01m',
				months: [
					{
						date: '2017-01',
						totals: {
							hvc: {
								confirmed: 100,
								unconfirmed: 200
							}
						}
					},{
						date: '2017-02',
						totals: {
							hvc: {
								confirmed: 300,
								unconfirmed: 400
							}
						}
					}
				]
			};

			beforeEach( function(){

				output = createViewModel( hvcData );
			} );

			it( 'Should output the date range', function(){

				expect( output.dateRange ).toEqual( { start: 10000, end: 30000 } );
			} );

			it( 'Should create the view model with just HVC data', function(){

				const month1 = output.months[ 0 ];
				const month2 = output.months[ 1 ];

				expect( month1.bars.length ).toEqual( 2 );
				expect( month2.bars.length ).toEqual( 2 );

				expect( month1.date ).toEqual( 'Jan 2017' );
				expect( month1.bars[ 0 ].name ).toEqual( 'HVC confirmed' );
				expect( month1.bars[ 0 ].modifyer ).toEqual( 'hvc-confirmed' );
				expect( month1.bars[ 0 ].value ).toEqual( 100 );

				expect( month1.bars[ 1 ].name ).toEqual( 'HVC unconfirmed' );
				expect( month1.bars[ 1 ].modifyer ).toEqual( 'hvc-unconfirmed' );
				expect( month1.bars[ 1 ].value ).toEqual( 200 );

				expect( month2.date ).toEqual( 'Feb 2017' );
				expect( month2.bars[ 0 ].name ).toEqual( 'HVC confirmed' );
				expect( month2.bars[ 0 ].modifyer ).toEqual( 'hvc-confirmed' );
				expect( month2.bars[ 0 ].value ).toEqual( 300 );

				expect( month2.bars[ 1 ].name ).toEqual( 'HVC unconfirmed' );
				expect( month2.bars[ 1 ].modifyer ).toEqual( 'hvc-unconfirmed' );
				expect( month2.bars[ 1 ].value ).toEqual( 400 );
			} );

			it( 'Should create a key with just hvc', function(){

				expect( output.keys.length ).toEqual( 3 );
				expect( output.keys[ 0 ].name ).toEqual( '£0.01m target' );
				expect( output.keys[ 0 ].modifyer ).toEqual( 'target' );
				expect( output.keys[ 1 ].name ).toEqual( 'HVC confirmed' );
				expect( output.keys[ 1 ].modifyer ).toEqual( 'hvc-confirmed' );
				expect( output.keys[ 2 ].name ).toEqual( 'HVC unconfirmed' );
				expect( output.keys[ 2 ].modifyer ).toEqual( 'hvc-unconfirmed' );
			} );
		} );

		describe( 'With HVC and non export data', function(){

			let output;
			const hvcAndNonExportData = {

				target: 1000,
				targetName: '£1m',
				months: [
					{
						date: '2017-03',
						totals: {
							hvc: {
								confirmed: 500,
								unconfirmed: 600
							},
							nonExport: {
								confirmed: 700,
								unconfirmed: 800
							}
						}
					},{
						date: '2017-04',
						totals: {
							hvc: {
								confirmed: 900,
								unconfirmed: 1000
							},
							nonExport: {
								confirmed: 1100,
								unconfirmed: 1200
							}
						}
					}
				]
			};

			beforeEach( function(){

				output = createViewModel( hvcAndNonExportData );
			} );

			it( 'Should create the view model with HVC and non export data', function(){

				const month1 = output.months[ 0 ];
				const month2 = output.months[ 1 ];

				expect( month1.bars.length ).toEqual( 4 );
				expect( month2.bars.length ).toEqual( 4 );

				expect( month1.date ).toEqual( 'Mar 2017' );

				expect( month1.bars[ 0 ].name ).toEqual( 'HVC confirmed' );
				expect( month1.bars[ 0 ].modifyer ).toEqual( 'hvc-confirmed' );
				expect( month1.bars[ 0 ].value ).toEqual( 500 );

				expect( month1.bars[ 1 ].name ).toEqual( 'HVC unconfirmed' );
				expect( month1.bars[ 1 ].modifyer ).toEqual( 'hvc-unconfirmed' );
				expect( month1.bars[ 1 ].value ).toEqual( 600 );

				expect( month1.bars[ 2 ].name ).toEqual( 'non export confirmed' );
				expect( month1.bars[ 2 ].modifyer ).toEqual( 'non-export-confirmed' );
				expect( month1.bars[ 2 ].value ).toEqual( 700 );

				expect( month1.bars[ 3 ].name ).toEqual( 'non export unconfirmed' );
				expect( month1.bars[ 3 ].modifyer ).toEqual( 'non-export-unconfirmed' );
				expect( month1.bars[ 3 ].value ).toEqual( 800 );

				expect( month2.date ).toEqual( 'Apr 2017' );

				expect( month2.bars[ 0 ].name ).toEqual( 'HVC confirmed' );
				expect( month2.bars[ 0 ].modifyer ).toEqual( 'hvc-confirmed' );
				expect( month2.bars[ 0 ].value ).toEqual( 900 );

				expect( month2.bars[ 1 ].name ).toEqual( 'HVC unconfirmed' );
				expect( month2.bars[ 1 ].modifyer ).toEqual( 'hvc-unconfirmed' );
				expect( month2.bars[ 1 ].value ).toEqual( 1000 );

				expect( month2.bars[ 2 ].name ).toEqual( 'non export confirmed' );
				expect( month2.bars[ 2 ].modifyer ).toEqual( 'non-export-confirmed' );
				expect( month2.bars[ 2 ].value ).toEqual( 1100 );

				expect( month2.bars[ 3 ].name ).toEqual( 'non export unconfirmed' );
				expect( month2.bars[ 3 ].modifyer ).toEqual( 'non-export-unconfirmed' );
				expect( month2.bars[ 3 ].value ).toEqual( 1200 );
			} );

			it( 'Should create a key with hvc and non export', function(){

				expect( output.keys.length ).toEqual( 5 );

				expect( output.keys[ 0 ].name ).toEqual( '£1m target' );
				expect( output.keys[ 0 ].modifyer ).toEqual( 'target' );

				expect( output.keys[ 1 ].name ).toEqual( 'HVC confirmed' );
				expect( output.keys[ 1 ].modifyer ).toEqual( 'hvc-confirmed' );

				expect( output.keys[ 2 ].name ).toEqual( 'HVC unconfirmed' );
				expect( output.keys[ 2 ].modifyer ).toEqual( 'hvc-unconfirmed' );

				expect( output.keys[ 3 ].name ).toEqual( 'non export confirmed' );
				expect( output.keys[ 3 ].modifyer ).toEqual( 'non-export-confirmed' );

				expect( output.keys[ 4 ].name ).toEqual( 'non export unconfirmed' );
				expect( output.keys[ 4 ].modifyer ).toEqual( 'non-export-unconfirmed' );
			} );
		} );

		describe( 'Just non-hvc data', function(){

			let output;
			const nonHvcData = {

				target: 1000,
				targetName: '£1m',
				months: [
					{
						date: '2017-05',
						totals: {
							nonHvc: {
								confirmed: 1300,
								unconfirmed: 1400
							}
						}
					},{
						date: '2017-06',
						totals: {
							nonHvc: {
								confirmed: 1500,
								unconfirmed: 1600
							}
						}
					}
				]
			};

			beforeEach( function(){

				output = createViewModel( nonHvcData );
			} );

			it( 'Should create the view model with non hvc data', function(){

				const month1 = output.months[ 0 ];
				const month2 = output.months[ 1 ];

				expect( month1.bars.length ).toEqual( 2 );
				expect( month2.bars.length ).toEqual( 2 );

				expect( month1.date ).toEqual( 'May 2017' );
				expect( month1.bars[ 0 ].name ).toEqual( 'Non-HVC confirmed' );
				expect( month1.bars[ 0 ].modifyer ).toEqual( 'non-hvc-confirmed' );
				expect( month1.bars[ 0 ].value ).toEqual( 1300 );

				expect( month1.bars[ 1 ].name ).toEqual( 'Non-HVC unconfirmed' );
				expect( month1.bars[ 1 ].modifyer ).toEqual( 'non-hvc-unconfirmed' );
				expect( month1.bars[ 1 ].value ).toEqual( 1400 );

				expect( month2.date ).toEqual( 'Jun 2017' );
				expect( month2.bars[ 0 ].name ).toEqual( 'Non-HVC confirmed' );
				expect( month2.bars[ 0 ].modifyer ).toEqual( 'non-hvc-confirmed' );
				expect( month2.bars[ 0 ].value ).toEqual( 1500 );

				expect( month2.bars[ 1 ].name ).toEqual( 'Non-HVC unconfirmed' );
				expect( month2.bars[ 1 ].modifyer ).toEqual( 'non-hvc-unconfirmed' );
				expect( month2.bars[ 1 ].value ).toEqual( 1600 );
			} );

			it( 'Should create a key with non hvc', function(){

				expect( output.keys.length ).toEqual( 3 );

				expect( output.keys[ 0 ].name ).toEqual( '£1m target' );
				expect( output.keys[ 0 ].modifyer ).toEqual( 'target' );

				expect( output.keys[ 1 ].name ).toEqual( 'Non-HVC confirmed' );
				expect( output.keys[ 1 ].modifyer ).toEqual( 'non-hvc-confirmed' );

				expect( output.keys[ 2 ].name ).toEqual( 'Non-HVC unconfirmed' );
				expect( output.keys[ 2 ].modifyer ).toEqual( 'non-hvc-unconfirmed' );
			} );
		} );
	} );

	describe( 'With hvc, non hvc and non export data', function(){

		let output;

		const hvcNonHvcAndNonExportData = {

				target: 1000,
				targetName: '£1m',
				months: [
					{
						date: '2017-03',
						totals: {
							hvc: {
								confirmed: 1700,
								unconfirmed: 1800
							},
							nonExport: {
								confirmed: 1900,
								unconfirmed: 2000
							},
							nonHvc: {
								confirmed: 2100,
								unconfirmed: 2200
							}
						}
					}
				]
			};

			beforeEach( function(){

				output = createViewModel( hvcNonHvcAndNonExportData );
			} );

		it( 'Should create the bars in the correct order', function(){

			const month = output.months[ 0 ];

			expect( month.bars.length ).toEqual( 6 );
			expect( month.bars[ 0 ].modifyer ).toEqual( 'hvc-confirmed' );
			expect( month.bars[ 1 ].modifyer ).toEqual( 'hvc-unconfirmed' );
			expect( month.bars[ 2 ].modifyer ).toEqual( 'non-hvc-confirmed' );
			expect( month.bars[ 3 ].modifyer ).toEqual( 'non-hvc-unconfirmed' );
			expect( month.bars[ 4 ].modifyer ).toEqual( 'non-export-confirmed' );
			expect( month.bars[ 5 ].modifyer ).toEqual( 'non-export-unconfirmed' );
		} );

		it( 'Should create the keys in the correct order', function(){

			expect( output.keys.length ).toEqual( 7 );
			expect( output.keys[ 0 ].modifyer ).toEqual( 'target' );
			expect( output.keys[ 1 ].modifyer ).toEqual( 'hvc-confirmed' );
			expect( output.keys[ 2 ].modifyer ).toEqual( 'hvc-unconfirmed' );
			expect( output.keys[ 3 ].modifyer ).toEqual( 'non-hvc-confirmed' );
			expect( output.keys[ 4 ].modifyer ).toEqual( 'non-hvc-unconfirmed' );
			expect( output.keys[ 5 ].modifyer ).toEqual( 'non-export-confirmed' );
			expect( output.keys[ 6 ].modifyer ).toEqual( 'non-export-unconfirmed' );
		} );
	} );

	describe( 'The scale', function(){

		describe( 'When the target is the highest value', function(){

			const highTargetData = {

				target: 1000,
				months: [
					{
						date: '2017-03',
						totals: {
							hvc: {
								confirmed: 250,
								unconfirmed: 500
							}
						}
					}
				]
			};

			it( 'Should create the scale with the target as the highest', function(){

				const output = createViewModel( highTargetData );

				expect( output.scale.p100 ).toEqual( 1000 );
				expect( output.scale.p80 ).toEqual( 800 );
				expect( output.scale.p60 ).toEqual( 600 );
				expect( output.scale.p40 ).toEqual( 400 );
				expect( output.scale.p20 ).toEqual( 200 );
				expect( output.scale.p0 ).toEqual( 0 );
			} );
		} );

		describe( 'When the confirmed is the highest value', function(){

			const highConfirmedData = {

				target: 100,
				months: [
					{
						date: '2017-03',
						totals: {
							hvc: {
								confirmed: 500,
								unconfirmed: 250
							}
						}
					}
				]
			};

			it( 'Should create the scale with the confirmed as the highest', function(){

				const output = createViewModel( highConfirmedData );

				expect( output.scale.p100 ).toEqual( 500 );
				expect( output.scale.p80 ).toEqual( 400 );
				expect( output.scale.p60 ).toEqual( 300 );
				expect( output.scale.p40 ).toEqual( 200 );
				expect( output.scale.p20 ).toEqual( 100 );
				expect( output.scale.p0 ).toEqual( 0 );
			} );
		} );

		describe( 'The target styles', function(){

			const targetData = {
				target: 500,
				months: [
					{
						date: '2017-03',
						totals: {
							hvc: {
								confirmed: 250,
								unconfirmed: 100
							}
						}
					}
				]
			};

			it( 'Should calculate the target styles', function(){

				const output = createViewModel( targetData );

				expect( output.scale.targetOffset ).toEqual( '250px' );
			} );
		} );
	} );

	describe( 'The bar styles', function(){

		const barData = {
			target: 500,
			months: [
				{
					date: '2017-03',
					totals: {
						hvc: {
							confirmed: 250,
							unconfirmed: 100
						}
					}
				}
			]
		};

		it( 'Should calculate the bar styles', function(){

			const output = createViewModel( barData );
			const bars = output.months[ 0 ].bars;

			expect( bars[ 0 ].style.height ).toEqual( '125px' );
			expect( bars[ 0 ].style.margin ).toEqual( '125px' );

			expect( bars[ 1 ].style.height ).toEqual( '50px' );
			expect( bars[ 1 ].style.margin ).toEqual( '200px' );
		} );
	} );
} );

