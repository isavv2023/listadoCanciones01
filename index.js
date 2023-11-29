/* const inquirer = require("inquirer");
require("colors"); */

import inquirer from "inquirer";
import "colors";
import fs from "fs"
import { NodeSound } from "node-sound";
import reproducirMP3 from './reproducirMP3.js'; // Importa la función para reproducir MP3

// import { reproducirArtista, reproducirUltimaCancion } from './reproductor.js'; // Importa las funciones de reproducción desde el otro archivo

let ultimaCancionReproducida = null;

// MENU PRINCIPAL
const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar artista`,
      },
      {
        value: 2,
        name: `${"2.".green} Reproducir ultimo artista`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const menuPrincipal = async () => {
  const { opcion } = await inquirer.prompt(preguntas);
  return opcion;
};


// MENU DE USUARIO PARA BUSCAR ARTISTA
const preguntarNombreArtista = [
  {
    type: "input",
    name: "nombreArtista",
    message: "Escribe un nombre de artista musical:",
  },
];

const leerArtista = async () => {
  const { nombreArtista } = await inquirer.prompt(preguntarNombreArtista);
  return nombreArtista;
}

//// Buscar informacion del artista

// - crear una funcion que sea capaz de coger el nombre e imprimir title link etcc llamada buscarInformacionArtista
import axios from 'axios';

// Función para buscar el ID del artista por su nombre
const buscarIdPorNombre = async (nombreArtista) => {
  try {
    const searchUrl = `https://api.deezer.com/search/artist?q=${nombreArtista}`;
    const response = await axios.get(searchUrl);
    const artistasEncontrados = response.data.data;

    if (artistasEncontrados.length > 0) {
      // Devuelve el ID del primer artista encontrado
      return artistasEncontrados[0].id;
    } else {
      throw new Error('Artista no encontrado');
    }
  } catch (error) {
    throw new Error('Error al buscar el artista:', error);
  }
};


// Función para buscar información del artista por su nombre
const buscarInformacionArtista = async (nombreArtista) => {
  try {
    const artistId = await buscarIdPorNombre(nombreArtista);
    const limit = 10; // Limitar la cantidad de canciones a obtener

    const tracklistUrl = `https://api.deezer.com/artist/${artistId}/top?limit=${limit}`;
    const response = await axios.get(tracklistUrl);

    const songs = response.data.data; // Obtener la lista de canciones

    //console.log(songs)

    // hacer un fetch de las canciones en mp3 sabiendo que estan en el trackList

    // node-sound para reproducir sonido

    // se le puede pasar una url con el enlace al mp3...

    // Procesar la información de las canciones
    const resultados = songs.map(song => ({
      title: song.title,
      link: song.link,
      cover: song.album.cover,
      preview: song.preview.url,
    }));

    //  // Imprimir el valor de la variable resultados
    //  console.log(resultados);

    // Devolver los resultados
    return resultados;

  } catch (error) {
    console.error('Error al buscar la información del artista:', error);
    throw new Error('Error al buscar la información del artista:', error);
  }
};

//// Función para obtener la URL de la vista previa del mp3
//const obtenerPreviewMp3URL = (song) => {
//  return song.preview || 'No preview URL available.';
//};

// Resto del código...
// Asegúrate de llamar a buscarInformacionArtista desde el switch case 1 para buscar la información del artista ingresado por el usuario.

//   // Función para reproducir una canción
//   const reproducirArtista = async (artista) => {
//     const canciones = []
//     /* const cancion = canciones[0];
//   
//     const audio = new Audio(cancion.link);
//     audio.play(); */
//   };



function leerDB() {
  if (!fs.existsSync(this.dbPath)) return;

  const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
  const data = JSON.parse(info);
  this.historial = data.historial;
}


/**
 * Funcion para guardar el ultimo artista buscado y su informacion
 */

function guardarInformacionUltimoArtista() {
  console.log('Guardando informacion de artista buscado...')
  try {
    fs.writeFileSync('bbdd.json', JSON.stringify(ultimoArtistaBuscado));
    console.log('¡Guardado OK')
  } catch (error) {
    console.log("Error guardando el artista, por favor intente ejecutar la aplicacion de nuevo", error);
  }

}

// Función para obtener la URL de la vista previa del MP3 a partir de los datos de la canción
const obtenerURLVistaPreviaMP3 = (cancionElegida) => {
  return cancionElegida.preview; // Suponiendo que la URL de vista previa está almacenada en 'preview' de la canción
};

let ultimoArtistaBuscado; // la variable donde vamos a guardar por ejemplo el ultimo artista
let opcionEscogida; // opcion escogida en el menu
let artista;

do {

  opcionEscogida = await menuPrincipal();
  // console.log('Has escogido la opcion', opcionEscogida)

  switch (opcionEscogida) {
    case 0:
      guardarInformacionUltimoArtista()
      process.exit(0) // termino el programa y salgo
      break

    case 1:
      artista = await leerArtista()
      console.log('Has escogido la opcion', artista)
      ultimoArtistaBuscado = await buscarInformacionArtista(artista);

      for (const song of ultimoArtistaBuscado) {
        console.log(`Canción: ${song.title}`.yellow);
        console.log(`Enlace: ${song.link}`.green);
        console.log(`Imagen: ${song.cover}`.blue);
        //console.log(`Preview: ${song.preview.url}`.red)

        // Suponiendo que tienes una canción en una variable llamada 'cancionEjemplo'
        const cancionEjemplo = {
          id: 3135556,
          // ... otros campos de la canción ...
          preview: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-10.mp3",
          // ... otros campos de la canción ...
        }
        // Imprime el campo 'preview' en la consola
        console.log('Preview de la canción:', cancionEjemplo.preview);
        // Verifica si el campo 'preview' existe y si es una URL válida
        if (cancionEjemplo.preview && cancionEjemplo.preview.startsWith('https://')) {
          console.log('El campo preview contiene una URL válida.'/*, cancionEjemplo.preview */);
        } else {
          console.log('El campo preview no contiene una URL válida o no está presente.');
        }


        //// Aquí puedes integrar el código que verifica el campo preview de la canción
        //console.log('Preview de la canción:', song.preview);
        //if (song.preview && song.preview.startsWith('https://')) {
        //  console.log('El campo preview contiene una URL válida:', song.preview);
        //} else {
        //  console.log('El campo preview no contiene una URL válida o no está presente.');
        //}


        //// Obtener la URL de la vista previa del mp3
        //const previewUrl = obtenerPreviewMp3URL(song);
        //
        //console.log(`Preview: ${previewUrl}`);
        console.log('---------------------------------');
      }
      break

    case 2:
      if (ultimoArtistaBuscado) {
        //   reproducirUltimaCancion(ultimoArtistaBuscado); // Llama a la función para reproducir la última canción seleccionada
        // } else {
        //   console.log('No hay último artista para reproducir.');
        // }

        //   const urlPreviewMP3 = obtenerURLVistaPreviaMP3(ultimoArtistaBuscado); // Función para obtener la URL de la vista previa del MP3
        //   reproducirMP3(urlPreviewMP3); // Llama a la función para reproducir el MP3
        // } else {
        //   console.log('No hay último artista para reproducir.');
        // }
        const seleccionCancion = await inquirer.prompt([
          {
            type: 'list',
            name: 'cancion',
            message: 'Elige una canción para reproducir su vista previa:',
            choices: ultimoArtistaBuscado.map((song) => ({
              value: song,
              name: song.title,
            })),
          },
        ]);

        const cancionElegida = seleccionCancion.cancion;
        const urlPreviewMP3 = obtenerURLVistaPreviaMP3(cancionElegida); // Obtiene la URL de la vista previa del MP3 de la canción seleccionada
        reproducirMP3(urlPreviewMP3); // Llama a la función para reproducir el MP3
      } else {
        console.log('No hay último artista para reproducir.');
      }
      break;
    default:
      console.log("Opción no disponible");
      break;
  }

} while (opcionEscogida !== 0);
