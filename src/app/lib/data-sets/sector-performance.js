
const targetColour = 'rgb(0, 0, 0)';
const hvcColour = 'rgb(43,140,196)'; //2B8CC4
const nonHvcColour = 'rgb(111,114,175)'; //6F72AF
const nonExportColour = 'rgb(183,185,215)'; //6F72AF - 50%

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
		
		let nonHvcUnconfirmed = [];
		let nonExportUnconfirmed = [];
		
		let nonHvcConfirmed = [];
		let nonExportConfirmed = [];


		for( let month of ( data.months || [] ) ){

			x.push( month.date );

			target.push( data.target );

			hvcConfirmed.push( month.totals.hvc.confirmed );
			hvcUnconfirmed.push( month.totals.hvc.unconfirmed );
			
			nonExportConfirmed.push( month.totals.nonExport.confirmed );
			nonExportUnconfirmed.push( month.totals.nonExport.unconfirmed );

			if( month.totals.nonHvc ){

				nonHvcConfirmed.push( month.totals.nonHvc.confirmed );
				nonHvcUnconfirmed.push( month.totals.nonHvc.unconfirmed );
			}
		}

		const targetTrace = createTrace( data.targetName + ' HVC target', x, target, targetColour, false, 'lines' );

		const hvcConfirmedTrace = createTrace( 'hvc confirmed', x, hvcConfirmed, hvcColour );
		const hvcUnconfirmedTrace = createTrace( 'incl. unconfirmed', x, hvcUnconfirmed, hvcColour, true );
		
		const nonExportConfirmedTrace = createTrace( 'non-export confirmed', x, nonExportConfirmed, nonExportColour );
		const nonExportUnconfirmedTrace = createTrace( 'incl. unconfirmed', x, nonExportUnconfirmed, nonExportColour, true );

		if( nonHvcConfirmed.length && nonHvcUnconfirmed.length ){

			const nonHvcConfirmedTrace = createTrace( 'non-HVC confirmed', x, nonHvcConfirmed, nonHvcColour );
			const nonHvcUnconfirmedTrace = createTrace( 'incl. unconfirmed', x, nonHvcUnconfirmed, nonHvcColour, true );

			return {

				//max: data.max,
				//min: data.min,
				data: [

					targetTrace,

					hvcConfirmedTrace,
					hvcUnconfirmedTrace,
					
					nonHvcConfirmedTrace,
					nonHvcUnconfirmedTrace,

					nonExportConfirmedTrace,
					nonExportUnconfirmedTrace
				]
			};

		} else {

			return {

				data: [

					targetTrace,

					hvcConfirmedTrace,
					hvcUnconfirmedTrace,
					
					nonExportConfirmedTrace,
					nonExportUnconfirmedTrace
				]
			};
		}	
	}
};
