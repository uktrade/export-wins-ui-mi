const url = require( 'url' );
const config = require( '../config' );
const financialYear = require( './financial-year' );

const currentFinancialYear = financialYear.getCurrent();

function getParams( obj ){

	const r = [];

	for( let key in obj ){

		r.push( key + '=' + obj[ key ] );
	}

	return r;
}

module.exports = function( req ){

	const currentUrl = url.parse( req.url ).pathname;
	const basePrefix = '';
	let prefix = basePrefix;

	function addParams( path ){

		const params = getParams( req.filters ).join( '&' );

		return ( path + ( params.length ? ( '?' + params ) : '' ) );
	}

	function filteredUrl( path ){
		return prefix + addParams( path );
	}

	if( !req.isDefaultYear ){

		prefix += `/${ req.year }`;
	}

	return {
		email: () => `mailto:${ config.feedbackEmail }`,
		survey: () => config.feedbackSurvey,

		index: () => filteredUrl( '/' ),

		selectDate: ( returnPath = addParams( prefix + currentUrl ) ) => ( `${ prefix }/select-date/?path=` + encodeURIComponent( returnPath ) ),
		selectDateForYear: ( year, returnPath ) => {

			const path = `${ prefix }/select-date/${ year }/`;

			if( returnPath ){

				return ( path + '?path=' + encodeURIComponent( returnPath ) );
			}

			return path;
		},

		currentForYear: ( year ) => {

			let yearPrefix = basePrefix;

			if( year != currentFinancialYear ){

				yearPrefix = ( yearPrefix + '/' + year );
			}

			return ( yearPrefix + currentUrl );
		},

		sectorTeamsOverview: () => filteredUrl( '/sector-teams/overview/' ),
		sectorTeam: ( teamId ) => filteredUrl( '/sector-teams/' + teamId + '/' ),
		sectorTeamWins: ( teamId ) => filteredUrl( '/sector-teams/' + teamId + '/wins/' ),
		sectorTeamNonHvcWins: ( teamId ) => filteredUrl( '/sector-teams/' + teamId + '/non-hvc-wins/' ),

		countries: () => filteredUrl( '/countries/' ),
		country: ( countryId ) => filteredUrl( '/countries/' + countryId + '/' ),
		countryWins: ( countryId ) => filteredUrl( '/countries/' + countryId + '/wins/' ),
		countryNonHvcWins: ( countryId ) => filteredUrl( '/countries/' + countryId + '/non-hvc-wins/' ),

		hvcGroup: ( groupId ) => filteredUrl( '/hvc-groups/' + groupId + '/' ),
		hvcGroupWins: ( groupId ) => filteredUrl( '/hvc-groups/' + groupId + '/wins/' ),

		osRegionsOverview: () => filteredUrl( '/overseas-regions/overview/' ),
		osRegion: ( regionId ) => filteredUrl( '/overseas-regions/' + regionId + '/' ),
		osRegionWins: ( regionId ) => filteredUrl( '/overseas-regions/' + regionId + '/wins/' ),
		osRegionNonHvcWins: ( regionId ) => filteredUrl( '/overseas-regions/' + regionId + '/non-hvc-wins/' ),

		hvc: ( hvcId ) => filteredUrl( '/hvc/' + hvcId + '/' ),
		hvcWins: ( hvcId ) => filteredUrl( '/hvc/' + hvcId + '/wins/' )
	};
};
