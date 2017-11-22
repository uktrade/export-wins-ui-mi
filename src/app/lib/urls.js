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

function addSort( url, key, sortedKey, sortedDir ){

	const separator = ( ~url.indexOf( '?' ) ? '&' : '?' );
	const isSortedKey = ( sortedKey === key );
	const sortDir = ( isSortedKey ? ( sortedDir === 'asc' ? 'desc' : 'asc' ) : 'asc' );

	return ( url + separator + `sort[key]=${ key }&sort[dir]=${ sortDir }` );
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
		addSort,

		email: () => `mailto:${ config.feedbackEmail }`,
		survey: () => config.feedbackSurvey,

		downloads: () => '/downloads/',
		downloadFile: ( fileId ) => `/downloads/${ fileId }/`,

		index: () => filteredUrl( '/' ),

		experiments: () => ( `${ prefix }/experiments/?path=` + encodeURIComponent( filteredUrl( currentUrl ) ) ),

		selectDate: ( returnPath = addParams( prefix + currentUrl ) ) => ( `${ prefix }/select-date/?path=` + encodeURIComponent( returnPath ) ),
		selectDateForYear: ( year, returnPath ) => {

			const path = `${ prefix }/select-date/${ year }/`;

			if( returnPath ){

				return ( path + '?path=' + encodeURIComponent( returnPath ) );
			}

			return path;
		},

		current: () => filteredUrl( currentUrl ),

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

		posts: () => filteredUrl( '/posts/' ),
		post: ( postId ) => filteredUrl( '/posts/' + postId + '/' ),
		postWins: ( postId ) => filteredUrl( '/posts/' + postId + '/wins/' ),
		postNonHvcWins: ( postId ) => filteredUrl( '/posts/' + postId + '/non-hvc-wins/' ),

		ukRegions: () => filteredUrl( '/uk-regions/' ),
		ukRegion: ( regionId ) => filteredUrl( '/uk-regions/' + regionId + '/' ),
		ukRegionWins: ( regionId ) => filteredUrl( '/uk-regions/' + regionId + '/wins/' ),
		ukRegionNonHvcWins: ( regionId ) => filteredUrl( '/uk-regions/' + regionId + '/non-hvc-wins/' ),

		hvcGroup: ( groupId ) => filteredUrl( '/hvc-groups/' + groupId + '/' ),
		hvcGroupWins: ( groupId ) => filteredUrl( '/hvc-groups/' + groupId + '/wins/' ),

		osRegionsOverview: () => filteredUrl( '/overseas-regions/overview/' ),
		osRegion: ( regionId ) => filteredUrl( '/overseas-regions/' + regionId + '/' ),
		osRegionWins: ( regionId ) => filteredUrl( '/overseas-regions/' + regionId + '/wins/' ),
		osRegionNonHvcWins: ( regionId ) => filteredUrl( '/overseas-regions/' + regionId + '/non-hvc-wins/' ),

		hvc: ( hvcId ) => filteredUrl( '/hvc/' + hvcId + '/' ),
		hvcWins: ( hvcId ) => filteredUrl( '/hvc/' + hvcId + '/wins/' ),

		investment: {

			index: () => filteredUrl( '/investment/' ),

			sectorTeams: () => filteredUrl( `/investment/sector-teams/` ),
			sectorTeam: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/` ),
			sectorTeamHvcPerformance: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/hvc-performance/` ),
			sectorTeamNonHvcPerformance: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/non-hvc-performance/` ),
			sectorTeamWins: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/wins/` ),
			sectorTeamNonHvcWins: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/non-hvc-wins/` ),

			osRegions: () => filteredUrl( `/investment/overseas-regions/` ),
			osRegion: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/` ),
			osRegionHvcPerformance: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/hvc-performance/` ),
			osRegionNonHvcPerformance: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/non-hvc-performance/` ),
			osRegionWins: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/wins/` ),
			osRegionNonHvcWins: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/non-hvc-wins/` ),

			ukRegions: () => filteredUrl( `/investment/uk-regions/` ),
			ukRegion: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/` ),
			ukRegionHvcPerformance: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/hvc-performance/` ),
			ukRegionNonHvcPerformance: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/non-hvc-performance/` ),
			ukRegionWins: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/wins/` ),
			ukRegionNonHvcWins: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/non-hvc-wins/` )
		}
	};
};
