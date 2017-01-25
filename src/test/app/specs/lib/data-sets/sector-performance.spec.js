
const dataset = require( '../../../../../app/lib/data-sets/sector-performance' );

const input = {

	"max": 68250000,
	"min": 0,
	"target": 60000000,
	"targetName": "£60m",
	"months": [
		{
			"date": "2016-04",
			"totals": {
				"hvc": {
					confirmed: 5768432,
					unconfirmed: 25
				},
				"nonHvc": {
					confirmed: 129937,
					unconfirmed: 50
				},
				"nonExport": {
					confirmed: 51,
					unconfirmed: 100
				}
			}
		},
		{
			"date": "2016-05",
			"totals": {
				"hvc": {
					confirmed: 9081540,
					unconfirmed: 200
				},
				"nonHvc": {
					confirmed: 155973,
					unconfirmed: 400
				},
				"nonExport": {
					confirmed: 72,
					unconfirmed: 800
				}
			}
		},
		{
			"date": "2016-06",
			"totals": {
				"hvc": {
					confirmed: 13559890,
					unconfirmed: 16
				},
				"nonHvc": {
					confirmed: 161787,
					unconfirmed: 32
				},
				"nonExport": {
					confirmed: 74,
					unconfirmed: 64
				}
			}
		}
	]
};

const hvcGroupInput = {

	"max": 68250000,
	"min": 0,
	"target": 60000000,
	"targetName": "£60m",
	"months": [
		{
			"date": "2016-04",
			"totals": {
				"hvc": {
					confirmed: 5768432,
					unconfirmed: 25
				},
				"nonExport": {
					confirmed: 51,
					unconfirmed: 100
				}
			}
		},
		{
			"date": "2016-05",
			"totals": {
				"hvc": {
					confirmed: 9081540,
					unconfirmed: 200
				},
				"nonExport": {
					confirmed: 72,
					unconfirmed: 800
				}
			}
		},
		{
			"date": "2016-06",
			"totals": {
				"hvc": {
					confirmed: 13559890,
					unconfirmed: 16
				},
				"nonExport": {
					confirmed: 74,
					unconfirmed: 64
				}
			}
		}
	]
};

/* output

	{

			max: input.max,
			min: input.min,
			data: [
				name: 'non hvc',
				mode: 'lines+markers',
				x: [2, 3, 4, 5],
				y: [16, 5, 11, 9],
				marker: {
					color: 'rgb(128, 0, 128)',
					size: 4
				},
				line: {
					color: 'rgb(128, 0, 128)',
					width: 1
				}
			]
		}
*/

describe( 'Sector performance data set for Sector Teams data', function(){

	it( 'Should transform the backend data into a plotly structure', function(){

		const output = dataset.create( input );

		const target = output.data[ 0 ];

		const hvcConfirmed = output.data[ 1 ];
		const hvcUnconfirmed = output.data[ 2 ];

		const nonHvcConfirmed = output.data[ 3 ];
		const nonHvcUnconfirmed = output.data[ 4 ];

		const nonExportConfirmed = output.data[ 5 ];
		const nonExportUnconfirmed = output.data[ 6 ];

		//expect( output.max ).toEqual( input.max );
		//expect( output.min ).toEqual( input.min );

		expect( target.name ).toEqual( '£60m HVC target' );
		expect( target.mode ).toEqual( 'lines' );
		expect( target.x.length ).toEqual( 12 );
		expect( target.x ).toEqual( [ '2016-04', '2016-05', '2016-06', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12', '2017-1', '2017-2', '2017-3' ] );
		expect( target.y.length ).toEqual( 12 );
		expect( target.y ).toEqual( [ 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000 ] );
		expect( target.marker.color ).toBeDefined();
		expect( target.marker.size ).toEqual( 4 );
		expect( target.line.color ).toBeDefined();
		expect( target.line.width ).toEqual( 2 );

		expect( hvcConfirmed.name ).toEqual( 'hvc confirmed' );
		expect( hvcConfirmed.mode ).toEqual( 'lines+markers' );
		expect( hvcConfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( hvcConfirmed.y ).toEqual( [ 5768432, 9081540, 13559890 ] );
		expect( hvcConfirmed.marker.color ).toBeDefined();
		expect( hvcConfirmed.marker.size ).toEqual( 4 );
		expect( hvcConfirmed.line.color ).toBeDefined();
		expect( hvcConfirmed.line.width ).toEqual( 2 );

		expect( hvcUnconfirmed.name ).toEqual( 'incl. unconfirmed' );
		expect( hvcUnconfirmed.mode ).toEqual( 'lines+markers' );
		expect( hvcUnconfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( hvcUnconfirmed.y ).toEqual( [ 25, 200, 16 ] );
		expect( hvcUnconfirmed.marker.color ).toBeDefined();
		expect( hvcUnconfirmed.marker.size ).toEqual( 4 );
		expect( hvcUnconfirmed.line.color ).toBeDefined();
		expect( hvcUnconfirmed.line.width ).toEqual( 2 );
		expect( hvcUnconfirmed.line.dash ).toEqual( 'dashdot' );

		expect( nonHvcConfirmed.name ).toEqual( 'non-HVC confirmed' );
		expect( nonHvcConfirmed.mode ).toEqual( 'lines+markers' );
		expect( nonHvcConfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( nonHvcConfirmed.y ).toEqual( [ 129937, 155973, 161787 ] );
		expect( nonHvcConfirmed.marker.color ).toBeDefined();
		expect( nonHvcConfirmed.marker.size ).toEqual( 4 );
		expect( nonHvcConfirmed.line.color ).toBeDefined();
		expect( nonHvcConfirmed.line.width ).toEqual( 2 );

		expect( nonHvcUnconfirmed.name ).toEqual( 'incl. unconfirmed' );
		expect( nonHvcUnconfirmed.mode ).toEqual( 'lines+markers' );
		expect( nonHvcUnconfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( nonHvcUnconfirmed.y ).toEqual( [ 50, 400, 32 ] );
		expect( nonHvcUnconfirmed.marker.color ).toBeDefined();
		expect( nonHvcUnconfirmed.marker.size ).toEqual( 4 );
		expect( nonHvcUnconfirmed.line.color ).toBeDefined();
		expect( nonHvcUnconfirmed.line.width ).toEqual( 2 );
		expect( nonHvcUnconfirmed.line.dash ).toEqual( 'dashdot' );

		expect( nonExportConfirmed.name ).toEqual( 'non-export confirmed' );
		expect( nonExportConfirmed.mode ).toEqual( 'lines+markers' );
		expect( nonExportConfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( nonExportConfirmed.y ).toEqual( [ 51, 72, 74 ] );
		expect( nonExportConfirmed.marker.color ).toBeDefined();
		expect( nonExportConfirmed.marker.size ).toEqual( 4 );
		expect( nonExportConfirmed.line.color ).toBeDefined();
		expect( nonExportConfirmed.line.width ).toEqual( 2 );

		expect( nonExportUnconfirmed.name ).toEqual( 'incl. unconfirmed' );
		expect( nonExportUnconfirmed.mode ).toEqual( 'lines+markers' );
		expect( nonExportUnconfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( nonExportUnconfirmed.y ).toEqual( [ 100, 800, 64 ] );
		expect( nonExportUnconfirmed.marker.color ).toBeDefined();
		expect( nonExportUnconfirmed.marker.size ).toEqual( 4 );
		expect( nonExportUnconfirmed.line.color ).toBeDefined();
		expect( nonExportUnconfirmed.line.width ).toEqual( 2 );
		expect( nonExportUnconfirmed.line.dash ).toEqual( 'dashdot' );

	} );
} );

describe( 'Sector performance data set for HVC Group data', function(){

	it( 'Should transform the backend data into a plotly structure', function(){

		const output = dataset.create( hvcGroupInput );

		const target = output.data[ 0 ];

		const hvcConfirmed = output.data[ 1 ];
		const hvcUnconfirmed = output.data[ 2 ];

		const nonExportConfirmed = output.data[ 3 ];
		const nonExportUnconfirmed = output.data[ 4 ];

		expect( target.name ).toEqual( '£60m HVC target' );
		expect( target.mode ).toEqual( 'lines' );
		expect( target.x.length ).toEqual( 12 );
		expect( target.x ).toEqual( [ '2016-04', '2016-05', '2016-06', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12', '2017-1', '2017-2', '2017-3' ] );
		expect( target.y.length ).toEqual( 12 );
		expect( target.y ).toEqual( [ 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000, 60000000 ] );
		expect( target.marker.color ).toBeDefined();
		expect( target.marker.size ).toEqual( 4 );
		expect( target.line.color ).toBeDefined();
		expect( target.line.width ).toEqual( 2 );

		expect( hvcConfirmed.name ).toEqual( 'hvc confirmed' );
		expect( hvcConfirmed.mode ).toEqual( 'lines+markers' );
		expect( hvcConfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( hvcConfirmed.y ).toEqual( [ 5768432, 9081540, 13559890 ] );
		expect( hvcConfirmed.marker.color ).toBeDefined();
		expect( hvcConfirmed.marker.size ).toEqual( 4 );
		expect( hvcConfirmed.line.color ).toBeDefined();
		expect( hvcConfirmed.line.width ).toEqual( 2 );

		expect( hvcUnconfirmed.name ).toEqual( 'incl. unconfirmed' );
		expect( hvcUnconfirmed.mode ).toEqual( 'lines+markers' );
		expect( hvcUnconfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( hvcUnconfirmed.y ).toEqual( [ 25, 200, 16 ] );
		expect( hvcUnconfirmed.marker.color ).toBeDefined();
		expect( hvcUnconfirmed.marker.size ).toEqual( 4 );
		expect( hvcUnconfirmed.line.color ).toBeDefined();
		expect( hvcUnconfirmed.line.width ).toEqual( 2 );
		expect( hvcUnconfirmed.line.dash ).toEqual( 'dashdot' );

		expect( nonExportConfirmed.name ).toEqual( 'non-export confirmed' );
		expect( nonExportConfirmed.mode ).toEqual( 'lines+markers' );
		expect( nonExportConfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( nonExportConfirmed.y ).toEqual( [ 51, 72, 74 ] );
		expect( nonExportConfirmed.marker.color ).toBeDefined();
		expect( nonExportConfirmed.marker.size ).toEqual( 4 );
		expect( nonExportConfirmed.line.color ).toBeDefined();
		expect( nonExportConfirmed.line.width ).toEqual( 2 );

		expect( nonExportUnconfirmed.name ).toEqual( 'incl. unconfirmed' );
		expect( nonExportUnconfirmed.mode ).toEqual( 'lines+markers' );
		expect( nonExportUnconfirmed.x ).toEqual( [ '2016-04', '2016-05', '2016-06' ] );
		expect( nonExportUnconfirmed.y ).toEqual( [ 100, 800, 64 ] );
		expect( nonExportUnconfirmed.marker.color ).toBeDefined();
		expect( nonExportUnconfirmed.marker.size ).toEqual( 4 );
		expect( nonExportUnconfirmed.line.color ).toBeDefined();
		expect( nonExportUnconfirmed.line.width ).toEqual( 2 );
		expect( nonExportUnconfirmed.line.dash ).toEqual( 'dashdot' );

	} );
} );
