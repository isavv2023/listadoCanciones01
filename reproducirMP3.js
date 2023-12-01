import { exec } from 'child_process';
import os from 'node:os'

const reproducirMP3 = (url) => {
    
	// const comando = os.arch() === 'x64' ? 'xdg-open' : 'open'

	let comando = '';
    
	if(os.arch() === 'x64'){
    	comando = 'xdg-open';
	}else{
    	comando = 'open';
	}

	const reproduccion = exec(`${comando} "${url}"`);

	reproduccion.stderr.on('data', (data) => {
    	//console.error(`Error al reproducir el audio: ${data}`);
	});

	reproduccion.on('close', (code) => {
    	if (code !== 0) {
        	// console.error(`Error al reproducir el audio. Código: ${code}`);
    	} else {
        	console.log("Reproducción completada.");
    	}
	});
};

export default reproducirMP3;


