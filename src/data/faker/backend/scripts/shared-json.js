const generateSchema = require( './lib/generate-schema' );

const calculateTotals = require( './lib/calculate-totals' );
const calculateExportTotals = require( './lib/calculate-export-totals' );
const calculateUnconfirmedPercent = require( './lib/calculate-unconfirmed-percent' );
const createMonthDate = require( './lib/create-month-date' );


module.exports = {

	createIndex: function(){

		return generateSchema( '/shared/index.schema' );
	},

	createSector: function(){

		let sector = generateSchema( '/shared/sector.schema' );
		let results = sector.results;

		calculateTotals( results.wins, [ 'non_export' ] );
		calculateTotals( results.wins.export, [ 'hvc', 'non_hvc' ] );
		calculateExportTotals( results.wins.export );

		return sector;
	},

	createCampaigns: function(){

		let campaigns = generateSchema( '/shared/campaigns.schema' );

		for( let campaign of campaigns.results.campaigns ){

			calculateTotals( campaign.totals, [ 'hvc' ] );
			calculateUnconfirmedPercent( campaign.totals, [ 'progress' ] );
		}

		return campaigns;
	},

	createMonths: function(){

		let months = generateSchema( '/shared/months.schema' );

		for( let month of months.results.months ){

			createMonthDate( month );
			calculateTotals( month.totals, [ 'non_export' ] );
			calculateTotals( month.totals.export, [ 'hvc', 'non_hvc' ] );
			calculateExportTotals( month.totals.export );
		}

		return months;
	},

	createTopNonHvcs: function(){

		return generateSchema( '/shared/top_non_hvcs.schema' );
	}
};
