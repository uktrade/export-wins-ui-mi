
const dataset = require( '../../../../../app/lib/data-sets/wins' );

const input = {
	"hvcs": { "target": 165000000 },
	"wins": {
		"hvc": {
			"number": {
				"non_confirmed": 49,
				"confirmed": 21,
				"total": 70
			},
			"value": {
				"non_confirmed": 4900000,
				"confirmed": 2100000,
				"total": 7000000
			}
		}/*,
		"non_export": {
			"number": {
				"total": 136,
				"non_confirmed": 97,
				"confirmed": 39
			},
			"value": {
				"total": 312800,
				"non_confirmed": 223100,
				"confirmed": 89700
			}
		},
		"non_hvc": {
			"number": {
				"total": 66,
				"non_confirmed": 48,
				"confirmed": 18
			},
		"value": {
				"total": 6600000,
				"non_confirmed": 4800000,
				"confirmed": 1800000
			}
		}*/
	},
	"name": "Technology"
};


describe( 'Wins data data set', function(){

	it( 'Should return the correct structure', function(){

		const output = dataset.create( input );

		expect( output ).toEqual({

			hvc: [{
				values: [ 30, 70 ],
				labels: [ 'confirmed wins - 30%', 'unconfirmed wins - 70%' ],
				text: [ 21, 49 ],
				type: 'pie',
				hoverinfo: 'none',
				textposition: 'none'
			}]/*,
			nonHvc: [{
				values: [ 27, 73 ],
				labels: [ 'confirmed', 'non confirmed' ],
				text: [ 18, 48 ],
				type: 'pie',
				hoverinfo: 'label+text'
			}],
			nonExport: [{
				values: [ 29, 71 ],
				labels: [ 'confirmed', 'non confirmed' ],
				text: [ 39, 97 ],
				type: 'pie',
				hoverinfo: 'label+text'
			}]*/
		});
	} );
} );
