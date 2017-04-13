const createScale = require( '../graphs/create-scale' );

const GRAPH_HEIGHT = 250;
const months = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];
const types = {
	hvc: {
		confirmed: {
			name: 'HVC confirmed',
			modifyer: 'hvc-confirmed'
		},
		unconfirmed: {
			name: 'HVC unconfirmed',
			modifyer: 'hvc-unconfirmed'
		}
	},
	nonHvc: {
		confirmed: {
			name: 'Non-HVC confirmed',
			modifyer: 'non-hvc-confirmed'
		},
		unconfirmed: {
			name: 'Non-HVC unconfirmed',
			modifyer: 'non-hvc-unconfirmed'
		}
	},
	nonExport: {
		confirmed: {
			name: 'non export confirmed',
			modifyer: 'non-export-confirmed'
		},
		unconfirmed: {
			name: 'non export unconfirmed',
			modifyer: 'non-export-unconfirmed'
		}
	}
};

function createDateLabel( dateStr ){

	const d = new Date( dateStr );
	const month = months[ d.getMonth() ];
	const year = d.getFullYear();

	return `${ month } ${ year }`;
}

function createStyles( valuePercentage ){

	const height = ( GRAPH_HEIGHT * ( valuePercentage / 100 ) );

	return {
		height: ( height + 'px' ),
		margin: ( ( GRAPH_HEIGHT - height ) + 'px' )
	};
}

module.exports = {

	create: function( monthsData ){

		const data = Object.create( monthsData.results );
		const months = [];
		const keys = [];
		const keyTypes = {
			hvc: false,
			nonHvc: false,
			nonExport: false
		};

		let max = data.target;

		keys.push({
			name: `${data.targetName} target`,
			modifyer: 'target'
		});

		function checkType( type, bars, totals ){

			if( totals[ type ] ){

				bars.push({

					name: types[ type ].confirmed.name,
					modifyer: types[ type ].confirmed.modifyer,
					value: totals[ type ].confirmed
				});

				bars.push({

					name: types[ type ].unconfirmed.name,
					modifyer: types[ type ].unconfirmed.modifyer,
					value: totals[ type ].unconfirmed
				});

				if( !keyTypes[ type ] ){

					keys.push( types[ type ].confirmed );
					keys.push( types[ type ].unconfirmed );
					keyTypes[ type ] = true;
				}

				max = Math.max( max, totals[ type ].confirmed, totals[ type ].unconfirmed );
			}
		}

		data.months.forEach( ( month ) => {

			const bars = [];
			const totals = month.totals;

			checkType( 'hvc', bars, totals );
			checkType( 'nonHvc', bars, totals );
			checkType( 'nonExport', bars, totals );

			months.push( { date: createDateLabel( month.date ), bars } );
		} );

		const scale = createScale( max );
		const scaleMax = scale[ 5 ];
		const scaleBase = ( 100 / scaleMax );

		months.forEach( function( month ){

			month.bars.map( function( bar ){

				const percent = Math.round( scaleBase * bar.value );

				bar.style = createStyles( percent );

				return bar;
			} );
		} );

		data.months = months;
		data.dateRange = monthsData.date_range;
		data.keys = keys;
		data.scale = {
			p0: scale[ 0 ],
			p20: scale[ 1 ],
			p40: scale[ 2 ],
			p60: scale[ 3 ],
			p80: scale[ 4 ],
			p100: scaleMax,
			targetOffset: ( Math.round( ( GRAPH_HEIGHT / scaleMax ) * data.target ) + 'px' )
		};

		return data;
	}
};
