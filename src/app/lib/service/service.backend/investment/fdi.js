const { getAll, getJson } = require( '../_helpers' );

/*
const transformFdiProjectList = require( '../../../transformers/fdi/project-list' );

function getSectorTeamWinTable( req, teamId ){

	return getJson( `/mi/fdi/sector_teams/${ teamId }/win_table/`, req );
}
function getSectorTeamHvcWinTable( req, teamId ){

	return getSectorTeamWinTable( req, teamId ).then( ( data ) => {

		data.results.investments = transformFdiProjectList( data.results.investments.hvc );
		return data;
	} );
}

function getSectorTeamNonHvcWinTable( req, teamId ){

	return getSectorTeamWinTable( req, teamId ).then( ( data ) => {

		data.results.investments = transformFdiProjectList( data.results.investments.non_hvc );
		return data;
	} );
}
*/

function getPerformance( req ){

	return getJson( '/mi/fdi/performance/', req );
}

function getSectorsPerformance( req ){

	return getJson( '/mi/fdi/performance/sector/', req );
}

function getOverseasRegionsPerformance( req ){

	return getJson( '/mi/fdi/performance/os_region/', req );
}

function getUkRegionsPerformance( req ){

	return getJson( '/mi/fdi/performance/uk_region/', req );
}

module.exports = {

	getPerformance,
	getSectorsPerformance,
	getOverseasRegionsPerformance,
	getUkRegionsPerformance,

	getSectorsHomepageData: function( req ){

		return getAll( 'getSectorsHomepageData', [

			getPerformance( req ),
			getSectorsPerformance( req )

		], function( data ){

			return {
				performance: data[ 0 ],
				sectors: data[ 1 ]
			};
		} );
	},

	getOverseasRegionsHomepageData: function( req ){

		return getAll( 'getOverseasRegionsHomepageData', [

			getPerformance( req ),
			getOverseasRegionsPerformance( req )

		], function( data ){

			return {
				performance: data[ 0 ],
				overseasRegions: data[ 1 ]
			};
		} );
	},

	getUkRegionsHomepageData: function( req ){

		return getAll( 'getUkRegionsHomepageData', [

			getPerformance( req ),
			getUkRegionsPerformance( req )

		], function( data ){

			return {
				performance: data[ 0 ],
				ukRegions: data[ 1 ]
			};
		} );
	}
};
