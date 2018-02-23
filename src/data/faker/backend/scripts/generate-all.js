const childProcess = require( 'child_process' );

const scripts = [

	'generate-user',

	'export/generate-global-hvcs',
	'export/generate-global-wins',
	'export/generate-hvc-groups',
	'export/generate-hvc',
	'export/generate-os-region-groups',
	'export/generate-os-regions',
	'export/generate-sector-teams',
	'export/generate-shared',
	'export/generate-countries',

	'investment/fdi/generate-sector-teams',
	'investment/fdi/generate-os-regions',
	'investment/fdi/generate-uk-regions',
	'investment/fdi/generate-performance'
];

for( let script of scripts ){

	childProcess.exec( 'node ./' + script, { cwd: __dirname }, ( e, stdout, stderr ) => {

		if( e ){
			console.log( e );
		}

		console.log( script + ': ' + stdout );

		if( stderr ){
			console.error( stderr );
		}
	} );
}
