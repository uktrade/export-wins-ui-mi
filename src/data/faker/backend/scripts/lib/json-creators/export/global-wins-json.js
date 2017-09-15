const generateSchema = require( '../../generate-schema' );
const calculateTotals = require( '../../calculate-totals' );

module.exports = {

	createWins: function( year ){

		return generateSchema( '/global_wins/index.schema', year ).then( ( globalWins ) => {

			const wins = globalWins.results.wins;

			calculateTotals( wins, [ 'hvc', 'non_hvc', 'total' ] );

			return globalWins;
		} );
	}
};
