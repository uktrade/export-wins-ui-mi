const fs = require( 'fs' );
const path = require( 'path' );
const request = require( 'request' );
const appConfig = require( '../app/config' );

const stubs = [
	[ 'user/me', '/user/me/', false ],
	[ 'sector_teams/index', '/mi/sector_teams/' ],
	[ 'sector_teams/overview', '/mi/sector_teams/overview/' ],
	[ 'sector_teams/sector_team', '/mi/sector_teams/1/' ],
	[ 'sector_teams/campaigns', '/mi/sector_teams/1/campaigns/' ],
	[ 'sector_teams/months', '/mi/sector_teams/1/months/' ],
	[ 'sector_teams/top_non_hvcs', '/mi/sector_teams/1/top_non_hvcs/'],
	[ 'os_regions/index', '/mi/os_regions/' ],
	[ 'os_regions/overview', '/mi/os_regions/overview/' ],
	[ 'os_regions/region', '/mi/os_regions/1/' ],
	[ 'os_regions/campaigns', '/mi/os_regions/1/campaigns/' ],
	[ 'os_regions/months', '/mi/os_regions/1/months/' ],
	[ 'os_regions/top_non_hvcs', '/mi/os_regions/1/top_non_hvcs/' ],
	[ 'os_region_groups/index', '/mi/os_region_groups/' ],
	[ 'hvc_groups/index', '/mi/hvc_groups/' ],
	[ 'hvc_groups/group', '/mi/hvc_groups/1/' ],
	[ 'hvc_groups/months', '/mi/hvc_groups/1/months/' ],
	[ 'hvc_groups/campaigns', '/mi/hvc_groups/1/campaigns/' ],
	[ 'hvc/hvc', '/mi/hvc/E100/' ],
	[ 'hvc/top_wins', '/mi/hvc/E100/top_wins/' ],
	[ 'hvc/win_table', '/mi/hvc/E100/win_table/' ],
	[ 'global_hvcs/index', '/mi/global_hvcs/' ],
	[ 'global_wins/index', '/mi/global_wins/' ]
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
