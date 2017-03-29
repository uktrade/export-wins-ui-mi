
const targetColour = 'rgb(0, 0, 0)';
const hvcColour = 'rgb(43,140,196)'; //2B8CC4

function createTargetTrace( name, x, y ){

	let traceX = [].concat( x );

	do {

		let date = new Date( traceX[ traceX.length - 1 ] );

		date.setMonth( date.getMonth() + 1 );

		traceX.push( date.getFullYear() + '-' + ( date.getMonth() + 1 ) );
		y.push( y[ y.length - 1 ] );

	} while( traceX.length < 12 );

	let trace = {
		name,
		x: traceX,
		y,
		mode: 'lines',
		marker: {
			color: targetColour,
			size: 4
		},
		line: {
			color: targetColour,
			width: 2
		}
	};

	return trace;
}

function createTrace( name, x, y, color, dashed, mode ){

	let trace = {
		name,
		x,
		y,
		mode: ( mode || 'lines+markers' ),
		marker: {
			color,
			size: 4
		},
		line: {
			color,
			width: 2
		}
	};

	if( dashed ){

		trace.line.dash = 'dashdot';
	}

	return trace;
}

module.exports = {

	create: function( data ){

		let x = [];

		let target = [];

		let hvcConfirmed = [];
		let hvcUnconfirmed = [];

		for( let month of ( data.months || [] ) ){

			x.push( month.date );

			target.push( data.target );

			hvcConfirmed.push( month.totals.export.hvc.value.confirmed );
			hvcUnconfirmed.push( month.totals.export.hvc.value.total );
		}

		const targetTrace = createTargetTrace( 'HVC target', x, target );

		const hvcConfirmedTrace = createTrace( 'confirmed', x, hvcConfirmed, hvcColour );
		const hvcUnconfirmedTrace = createTrace( 'incl. unconfirmed', x, hvcUnconfirmed, hvcColour, true );

		return {

			data: [

				targetTrace,

				hvcConfirmedTrace,
				hvcUnconfirmedTrace
			]
		};
	}
};
