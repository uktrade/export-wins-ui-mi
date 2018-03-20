const url = require( 'url' );
const config = require( '../config' );
const financialYear = require( './financial-year' );

const currentFinancialYear = financialYear.getCurrent();

function getParams( obj ){

	const r = [];

	for( let key in obj ){

		const value = obj[ key ];

		if( typeof( value ) !== 'undefined' ){

			r.push( [ key, value ] );
		}
	}

	return r;
}

function addParams( path, params ){

	if( params.length ){

		const separator = ( ~path.indexOf( '?' ) ? '&' : '?' );
		const paramStr = params.map( ( [ key, value ] ) => `${ key }=${ encodeURIComponent( value ) }` ).join( '&' );

		return path + separator + paramStr;
	}

	return path;
}

function addSort( url, key, sortedKey, sortedDir ){

	const isSortedKey = ( sortedKey === key );
	const sortDir = ( isSortedKey ? ( sortedDir === 'asc' ? 'desc' : 'asc' ) : 'asc' );

	return addParams( url, [ [ 'sort[key]', key ], [ 'sort[dir]', sortDir ] ] );
}

function downloadFile( file, type ){

	const params = [];

	if( file.name ){

		params.push( [ 'name', file.name ] );
	}

	if( type ){

		params.push( [ 'type', type ] );
	}

	return addParams( `/downloads/${ file.id }/`, params );
}

module.exports = function( req ){

	const currentUrl = url.parse( req.url ).pathname;
	const basePrefix = '';
	let prefix = basePrefix;

	function addFilters( path ){

		return addParams( path, getParams( req.filters ) );
	}

	function filteredUrl( path ){
		return prefix + addFilters( path );
	}

	if( !req.isDefaultYear ){

		prefix += `/${ req.year }`;
	}

	return {
		addSort,
		downloadFile,

		signout: () => '/sign-out/',
		changeFy: () => '/change-fy/',

		downloads: () => '/downloads/',
		downloadExportFile: ( file ) => downloadFile( file, 'CSV - Export wins' ),
		downloadFdiFile: ( file ) => downloadFile( file, 'CSV - FDI' ),
		downloadInteractionsFile: ( file ) => downloadFile( file, 'CSV - Interactions' ),
		downloadContactsByRegionFile: ( file ) => downloadFile( file, 'CSV - Contacts by region' ),
		downloadCompaniesByRegionFile: ( file ) => downloadFile( file, 'CSV - Companies by region' ),
		downloadContactsBySectorFile: ( file ) => downloadFile( file, 'CSV - Contacts by sector' ),
		downloadCompaniesBySectorFile: ( file ) => downloadFile( file, 'CSV - Companies by sector' ),
		downloadSampleFrameFile: ( file ) => downloadFile( file, 'CSV - Export Client Sample Frame' ),

		index: () => filteredUrl( '/' ),

		experiments: () => addParams( `${ prefix }/experiments/`, [ [ 'path', filteredUrl( currentUrl ) ] ] ),

		selectDate: ( returnPath = addFilters( prefix + currentUrl ) ) => addParams( `${ prefix }/select-date/`, [ [ 'path', returnPath ] ] ),
		selectDateForYear: ( year, returnPath ) => {

			const path = `${ prefix }/select-date/${ year }/`;

			if( returnPath ){

				return addParams( path, [ [ 'path', returnPath ] ] );
			}

			return path;
		},

		current: ( opts ) => {

			let url = currentUrl;

			if( opts && opts.query ){

				url = addParams( url, getParams( opts.query ) );
			}

			return filteredUrl( url );
		},

		currentForYear: ( year ) => {

			let yearPrefix = basePrefix;

			if( year != currentFinancialYear ){

				yearPrefix = ( yearPrefix + '/' + year );
			}

			return ( yearPrefix + currentUrl );
		},

		sectorTeamsOverview: () => filteredUrl( '/sector-teams/' ),
		sectorTeam: ( teamId ) => filteredUrl( `/sector-teams/${ teamId }/` ),
		sectorTeamWins: ( teamId ) => filteredUrl( `/sector-teams/${ teamId }/wins/` ),
		sectorTeamNonHvcWins: ( teamId ) => filteredUrl( `/sector-teams/${ teamId }/non-hvc-wins/` ),
		sectorTeamTopNonHvc: ( teamId ) => filteredUrl( `/sector-teams/${ teamId }/top-non-hvc/` ),

		countries: () => filteredUrl( '/countries/' ),
		country: ( countryId ) => filteredUrl( `/countries/${ countryId }/` ),
		countryWins: ( countryId ) => filteredUrl( `/countries/${ countryId }/wins/` ),
		countryNonHvcWins: ( countryId ) => filteredUrl( `/countries/${ countryId }/non-hvc-wins/` ),
		countryTopNonHvc: ( countryId ) => filteredUrl( `/countries/${ countryId }/top-non-hvc/` ),

		posts: () => filteredUrl( '/posts/' ),
		post: ( postId ) => filteredUrl( `/posts/${ postId }/` ),
		postWins: ( postId ) => filteredUrl( `/posts/${ postId }/wins/` ),
		postNonHvcWins: ( postId ) => filteredUrl( `/posts/${ postId }/non-hvc-wins/` ),
		postTopNonHvc: ( postId ) => filteredUrl( `/posts/${ postId }/top-non-hvc/` ),

		ukRegions: () => filteredUrl( '/uk-regions/' ),
		ukRegion: ( regionId ) => filteredUrl( `/uk-regions/${ regionId }/` ),
		ukRegionWins: ( regionId ) => filteredUrl( `/uk-regions/${ regionId }/wins/` ),
		ukRegionNonHvcWins: ( regionId ) => filteredUrl( `/uk-regions/${ regionId }/non-hvc-wins/` ),
		ukRegionTopNonHvc: ( regionId ) => filteredUrl( `/uk-regions/${ regionId }/top-non-hvc/` ),

		hvcGroup: ( groupId ) => filteredUrl( `/hvc-groups/${ groupId }/` ),
		hvcGroupWins: ( groupId ) => filteredUrl( `/hvc-groups/${ groupId }/wins/` ),

		osRegionsOverview: () => filteredUrl( '/overseas-regions/' ),
		osRegion: ( regionId ) => filteredUrl( `/overseas-regions/${ regionId }/` ),
		osRegionWins: ( regionId ) => filteredUrl( `/overseas-regions/${ regionId }/wins/` ),
		osRegionNonHvcWins: ( regionId ) => filteredUrl( `/overseas-regions/${ regionId }/non-hvc-wins/` ),
		osRegionTopNonHvc: ( regionId ) => filteredUrl( `/overseas-regions/${ regionId }/top-non-hvc/` ),

		hvc: ( hvcId ) => filteredUrl( `/hvc/${ hvcId }/` ),
		hvcWins: ( hvcId ) => filteredUrl( `/hvc/${ hvcId }/wins/` ),

		investment: {

			index: ( tab = {} ) => {

				let param = '';

				if( tab.sectors ){

					param = 'sectors';

				} else if( tab.osRegions ){

					param = 'os-regions';

				} else if( tab.ukRegions ){

					param = 'uk-regions';
				}

				if( param ){

					param = `?tab=${ param }`;
				}

				return filteredUrl( `/investment/${ param }` );
			},

			sectorTeams: () => filteredUrl( `/investment/sector-teams/` ),
			sectorTeam: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/` ),
			sectorTeamHvcPerformance: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/hvc-performance/` ),
			sectorTeamNonHvcPerformance: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/non-hvc-performance/` ),
			sectorTeamHvcProjects: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/hvc-projects/` ),
			sectorTeamNonHvcProjects: ( teamId ) => filteredUrl( `/investment/sector-teams/${ teamId }/non-hvc-projects/` ),

			osRegions: () => filteredUrl( `/investment/overseas-regions/` ),
			osRegion: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/` ),
			osRegionHvcPerformance: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/hvc-performance/` ),
			osRegionNonHvcPerformance: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/non-hvc-performance/` ),
			osRegionHvcProjects: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/hvc-projects/` ),
			osRegionNonHvcProjects: ( teamId ) => filteredUrl( `/investment/overseas-regions/${ teamId }/non-hvc-projects/` ),

			ukRegions: () => filteredUrl( `/investment/uk-regions/` ),
			ukRegion: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/` ),
			ukRegionHvcPerformance: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/hvc-performance/` ),
			ukRegionNonHvcPerformance: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/non-hvc-performance/` ),
			ukRegionHvcProjects: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/hvc-projects/` ),
			ukRegionNonHvcProjects: ( teamId ) => filteredUrl( `/investment/uk-regions/${ teamId }/non-hvc-projects/` )
		}
	};
};
