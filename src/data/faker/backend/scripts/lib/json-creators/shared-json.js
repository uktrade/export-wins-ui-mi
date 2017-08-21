const generateSchema = require( '../generate-schema' );

const calculateTotals = require( '../calculate-totals' );
const calculateExportTotals = require( '../calculate-export-totals' );
const calculateUnconfirmedPercent = require( '../calculate-unconfirmed-percent' );
const createMonthDate = require( '../create-month-date' );


module.exports = {

	createIndex: function( year ){

		return generateSchema( '/shared/index.schema', year );
	},

	createSector: function( year ){

		return generateSchema( '/shared/sector.schema', year ).then( ( sector ) => {

			let results = sector.results;

			calculateTotals( results.wins, [ 'non_export' ] );
			calculateTotals( results.wins.export, [ 'hvc', 'non_hvc' ] );
			calculateExportTotals( results.wins.export );

			return sector;
		} );
	},

	createCampaigns: function( year ){

		return generateSchema( '/shared/campaigns.schema', year ).then( ( campaigns ) => {

			for( let campaign of campaigns.results.campaigns ){

				calculateTotals( campaign.totals, [ 'hvc' ] );
				calculateUnconfirmedPercent( campaign.totals, [ 'progress' ] );
			}

			return campaigns;
		} );
	},

	createMonths: function( year ){

		return generateSchema( '/shared/months.schema', year ).then( ( months ) => {

			for( let month of months.results.months ){

				createMonthDate( month );
				calculateTotals( month.totals, [ 'non_export' ] );
				calculateTotals( month.totals.export, [ 'hvc', 'non_hvc' ] );
				calculateExportTotals( month.totals.export );
			}

			return months;
		} );
	},

	createTopNonHvcs: function( year ){

		return generateSchema( '/shared/top_non_hvcs.schema', year );
	}
};
