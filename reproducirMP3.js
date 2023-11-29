import { exec } from 'child_process';

const reproducirMP3 = (url) => {
    const reproduccion = exec(`xdg-open "${url}"`);

    reproduccion.stderr.on('data', (data) => {
        console.error(`Error al reproducir el audio: ${data}`);
    });

    reproduccion.on('close', (code) => {
        if (code !== 0) {
            console.error(`Error al reproducir el audio. Código: ${code}`);
        } else {
            console.log('Reproducción completada.');
        }
    });
};

export default reproducirMP3;
