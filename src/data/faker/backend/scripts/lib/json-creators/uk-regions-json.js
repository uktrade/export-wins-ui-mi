const generateSchema = require( '../generate-schema' );
const calculateTotals = require( '../calculate-totals' );
const createMonthDate = require( '../create-month-date' );
const calculateExportTotals = require( '../calculate-export-totals' );

function calculateTotal( items, itemKeys, valueKey, totalKey ){

	let total = 0;

	for( let itemKey of itemKeys ){

		total += items[ itemKey ][ valueKey ][ totalKey ];
	}

	return total;
}

module.exports = {

	createList: function( year ){

		return generateSchema( '/uk_regions/index.schema', year );
	},

	createWinTable: function( year ){

		return generateSchema( '/uk_regions/win_table.schema', year );
	},

	createRegion: function( year ){

		return generateSchema( '/uk_regions/uk-region.schema', year ).then( ( data ) => {

			const results = data.results;
			const wins = results.wins;
			const export_experience = results.export_experience;
			const experienceKeys = [ 'new_exporters', 'sustainable', 'growth', 'unknown' ];

			calculateTotals( wins, [ 'non_export' ] );
			calculateTotals( wins.export, [ 'hvc', 'non_hvc' ] );
			calculateTotals( export_experience, experienceKeys );

			wins.export.totals.number.confirmed = calculateTotal( wins.export, [ 'hvc', 'non_hvc' ], 'number', 'confirmed' );
			wins.export.totals.number.unconfirmed = calculateTotal( wins.export, [ 'hvc', 'non_hvc' ], 'number', 'unconfirmed' );
			wins.export.totals.number.grand_total = calculateTotal( wins.export, [ 'hvc', 'non_hvc' ], 'number', 'total' );

			wins.export.totals.value.confirmed = calculateTotal( wins.export, [ 'hvc', 'non_hvc' ], 'value', 'confirmed' );
			wins.export.totals.value.unconfirmed = calculateTotal( wins.export, [ 'hvc', 'non_hvc' ], 'value', 'unconfirmed' );
			wins.export.totals.value.grand_total = calculateTotal( wins.export, [ 'hvc', 'non_hvc' ], 'value', 'total' );

			export_experience.total.number.confirmed = calculateTotal( export_experience, experienceKeys, 'number', 'confirmed' );
			export_experience.total.number.unconfirmed = calculateTotal( export_experience, experienceKeys, 'number', 'unconfirmed' );
			export_experience.total.number.total = calculateTotal( export_experience, experienceKeys, 'number', 'total' );

			export_experience.total.value.confirmed = calculateTotal( export_experience, experienceKeys, 'value', 'confirmed' );
			export_experience.total.value.unconfirmed = calculateTotal( export_experience, experienceKeys, 'value', 'unconfirmed' );
			export_experience.total.value.total = calculateTotal( export_experience, experienceKeys, 'value', 'total' );

			return data;
		} );
	},

	createMonths: function( year ){

		return generateSchema( '/uk_regions/months.schema', year ).then( ( months ) => {

			for( let month of months.results.months ){

				createMonthDate( month );
				calculateTotals( month.totals, [ 'non_export' ] );
				calculateTotals( month.totals.export, [ 'hvc', 'non_hvc' ] );
				calculateExportTotals( month.totals.export );
			}

			return months;
		} );
	}
};
