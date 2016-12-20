
function createName( name, amount ){

	return ( name + ' wins - ' + amount + '%' );
}

function createPieTrace( data ){

	const parts = ( 100 / data.number.total );
	const values = [ Math.round( parts * data.number.confirmed ), Math.round( parts * data.number.non_confirmed ) ];

	return {
		values,
		labels: [ createName( 'confirmed', values[ 0 ] ), createName( 'unconfirmed', values[ 1 ] ) ],
		text: [ data.number.confirmed , data.number.non_confirmed ],
		type: 'pie',
		hoverinfo: 'none',
		textposition: 'none'
	};
}

module.exports = {

	create: function( data ){

		return {
			hvc: [ createPieTrace( data.wins.hvc ) ]//,
			//nonHvc: [ createPieTrace( data.wins.non_hvc ) ],
			//nonExport: [ createPieTrace( data.wins.non_export ) ]
		};
	}
};
