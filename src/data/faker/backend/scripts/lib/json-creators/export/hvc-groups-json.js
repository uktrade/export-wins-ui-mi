const generateSchema = require( '../../generate-schema' );
const createMonthDate =require( '../../create-month-date' );
const calculateTotals = require( '../../calculate-totals' );

module.exports = {

	createMonths: function( year ){

		return generateSchema( '/hvc_groups/months.schema', year ).then( ( months ) => {

			for( let month of months.results.months ){

				createMonthDate( month );
				calculateTotals( month.totals, [ 'non_export' ] );
				calculateTotals( month.totals.export, [ 'hvc' ] );
			}

			return months;
		} );
	},

	createWinTable: function( year ){

		return generateSchema( '/hvc_groups/win_table.schema', year );
	}
};
