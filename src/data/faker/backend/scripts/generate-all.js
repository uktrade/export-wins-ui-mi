const childProcess = require( 'child_process' );

const scripts = [
	'generate-global-hvcs',
	'generate-global-wins',
	'generate-hvc-groups',
	'generate-hvc',
	'generate-os-region-groups',
	'generate-os-regions',
	'generate-sector-teams',
	'generate-shared',
	'generate-user'
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
