import NodeSound from 'node-sound';
import inquirer from 'inquirer';

let ultimaCancionReproducida = null;

const reproducirArtista = async (artista) => {
	if (!artista || !artista.length) {
    	console.log('No hay canciones para reproducir.');
    	return;
	}

	let cancionSeleccionada = null;

	do {
    	const seleccionCancion = await inquirer.prompt([
        	{
            	type: 'list',
            	name: 'cancion',
            	message: 'Elige una canción para reproducir:',
            	choices: artista.map((song, index) => ({
                	value: index,
                	name: song.title,
            	})),
        	},
    	]);

    	cancionSeleccionada = artista[seleccionCancion.cancion];

    	if (!cancionSeleccionada.preview || !cancionSeleccionada.preview.startsWith('https://')) {
        	console.log('La canción seleccionada no tiene vista previa disponible.');
    	}
	} while (!cancionSeleccionada.preview || !cancionSeleccionada.preview.startsWith('https://'));

	ultimaCancionReproducida = cancionSeleccionada;

	const audio = NodeSound.play(cancionSeleccionada.preview, (err) => {
    	if (err) {
        	console.error('Error al reproducir la canción:', err);
    	}
	});

	audio.on('complete', () => {
    	console.log('Reproducción completada.');
	});

	audio.on('error', (err) => {
    	console.error('Error al reproducir la canción:', err);
	});
};

const reproducirUltimaCancion = () => {
	if (!ultimaCancionReproducida) {
    	console.log('No hay canción previa para reproducir.');
    	return;
	}

	const audio = NodeSound.play(ultimaCancionReproducida.preview, (err) => {
    	if (err) {
        	console.error('Error al reproducir la canción:', err);
    	}
	});

	audio.on('complete', () => {
    	console.log('Reproducción completada.');
	});

	audio.on('error', (err) => {
    	console.error('Error al reproducir la canción:', err);
    });
};

export { reproducirArtista, reproducirUltimaCancion };

