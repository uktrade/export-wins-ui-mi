const fs = require( 'fs' );
const path = require( 'path' );
const request = require( 'request' );
const appConfig = require( '../app/config' );

const stubs = [
	[ 'user/me', '/user/me/', false ],
	[ 'csv/all_files', '/csv/all_files/', false ],

	[ 'sector_teams/index', '/mi/sector_teams/' ],
	[ 'sector_teams/overview', '/mi/sector_teams/overview/' ],
	[ 'sector_teams/sector_team', '/mi/sector_teams/1/' ],
	[ 'sector_teams/campaigns', '/mi/sector_teams/1/campaigns/' ],
	[ 'sector_teams/months', '/mi/sector_teams/1/months/' ],
	[ 'sector_teams/top_non_hvcs', '/mi/sector_teams/1/top_non_hvcs/'],
	[ 'sector_teams/win_table', '/mi/sector_teams/1/win_table/'],

	[ 'os_regions/index', '/mi/os_regions/' ],
	[ 'os_regions/overview', '/mi/os_regions/overview/' ],
	[ 'os_regions/region', '/mi/os_regions/1/' ],
	[ 'os_regions/campaigns', '/mi/os_regions/1/campaigns/' ],
	[ 'os_regions/months', '/mi/os_regions/1/months/' ],
	[ 'os_regions/top_non_hvcs', '/mi/os_regions/1/top_non_hvcs/' ],
	[ 'os_regions/win_table', '/mi/os_regions/1/win_table/' ],

	[ 'os_region_groups/index', '/mi/os_region_groups/' ],

	[ 'hvc_groups/index', '/mi/hvc_groups/' ],
	[ 'hvc_groups/group', '/mi/hvc_groups/1/' ],
	[ 'hvc_groups/months', '/mi/hvc_groups/1/months/' ],
	[ 'hvc_groups/campaigns', '/mi/hvc_groups/1/campaigns/' ],
	[ 'hvc_groups/win_table', '/mi/hvc_groups/1/win_table/' ],

	[ 'hvc/hvc', '/mi/hvc/E100/' ],
	[ 'hvc/top_wins', '/mi/hvc/E100/top_wins/' ],
	[ 'hvc/win_table', '/mi/hvc/E100/win_table/' ],

	[ 'global_hvcs/index', '/mi/global_hvcs/' ],
	[ 'global_wins/index', '/mi/global_wins/' ],

	[ 'countries/index', '/mi/countries/' ],
	[ 'countries/country', '/mi/countries/AU/' ],
	[ 'countries/campaigns', '/mi/countries/AU/campaigns/' ],
	[ 'countries/months', '/mi/countries/AU/months/' ],
	[ 'countries/top_non_hvcs', '/mi/countries/AU/top_non_hvcs/' ],
	[ 'countries/win_table', '/mi/countries/AU/win_table/' ],

	[ 'posts/index', '/mi/posts/' ],
	[ 'posts/post', '/mi/posts/australia-melbourne/' ],
	[ 'posts/campaigns', '/mi/posts/australia-melbourne/campaigns/' ],
	[ 'posts/months', '/mi/posts/australia-melbourne/months/' ],
	[ 'posts/top_non_hvcs', '/mi/posts/australia-melbourne/top_non_hvcs/' ],
	[ 'posts/win_table', '/mi/posts/australia-melbourne/win_table/' ],

	[ 'uk_regions/index', '/mi/uk_regions/' ],
	[ 'uk_regions/overview', '/mi/uk_regions/overview/' ],
	[ 'uk_regions/region', '/mi/uk_regions/yorkshire-and-the-humber/' ],
	[ 'uk_regions/win_table', '/mi/uk_regions/yorkshire-and-the-humber/win_table/' ],
	[ 'uk_regions/top_non_hvcs', '/mi/uk_regions/yorkshire-and-the-humber/top_non_hvcs/' ],

	[ 'investment/fdi/performance/index', '/mi/fdi/performance/' ],
	[ 'investment/fdi/performance/tab.sectors', '/mi/fdi/performance/tab/sector/' ],

	[ 'investment/fdi/sector_teams/index', '/mi/fdi/sector_teams/' ],
	[ 'investment/fdi/sector_teams/win_table', '/mi/fdi/sector_teams/1/win_table/' ],

	[ 'investment/fdi/os_regions/index', '/mi/os_regions/' ],
	[ 'investment/fdi/uk_regions/index', '/mi/uk_regions/' ]
];

const years = [ 2016, 2017 ];
const today = new Date();
const folderSuffix = [ today.getFullYear(), today.getMonth() + 1, today.getDate(), today.toLocaleTimeString( 'en-US', { hour12: false } ) ].join( '-' );

function mkdirp( filePath ){

  const dirname = path.dirname( filePath );

  if( fs.existsSync( dirname ) ){

    return true;
  }

  mkdirp( dirname );
  fs.mkdirSync( dirname );
}

function fetch( urlPath, file, year = 2016 ){

	const fileWithPath = path.resolve( __dirname, `stubs/backend_${ folderSuffix }/`, `${ file }.json` );

	mkdirp( fileWithPath );

	const writeStream = fs.createWriteStream( fileWithPath );

	request( `${ appConfig.backend.href }${ urlPath }?year=${ year }` )
		.on( 'error ', function( err ){ console.error( err ); } )
		.on( 'end', function(){ console.log( 'Written: %s', file ); } )
		.pipe( writeStream );

	writeStream.on( 'error', function( err ){ console.log( err ); } );
}

for( let [ file, urlPath, multiYear = true ] of stubs ){

	if( multiYear ){

		for( let year of years ){

			fetch( urlPath, `${ file }.${ year }`, year );
		}

	} else {

		fetch( urlPath, file );
	}
}
