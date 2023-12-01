import inquirer from "inquirer";
import "colors";
import axios from "axios";
import fs from "fs";
// import { NodeSound } from "node-sound";
import reproducirMP3 from "./reproducirMP3.js"; // Importa la función para reproducir la preview del MP3

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
        name: `${"2.".green} Reproducir último artista`,
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

// Se crea una funcion que sea capaz de tomar el nombre del grupo e imprime: título, link a la canción, a la imagen y a la preview del MP3

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
      throw new Error("Artista no encontrado");
    }
  } catch (error) {
    throw new Error("Error al buscar el artista:", error);
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

    // Procesar la información de las canciones
    const resultados = songs.map(song => ({
      title: song.title,
      link: song.link,
      cover: song.album.cover,
      preview: song.preview,
    }));

    // Devolver los resultados
    return resultados;

  } catch (error) {
    console.error("Error al buscar la información del artista:", error);
    throw new Error("Error al buscar la información del artista:", error);
  }
};

//// Función para que el último artista buscado quede guardado

// Función para leer los datos guardados si se ha hecho alguna búsqueda
function leerDB() {
  if (!fs.existsSync(this.dbPath)) return;

  const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
  const data = JSON.parse(info);
  this.historial = data.historial;
}

//Función para guardar el ultimo artista buscado y su información

function guardarInformacionUltimoArtista() {
  console.log("Guardando informacion de artista buscado...");
  try {
    fs.writeFileSync('bbdd.json', JSON.stringify(ultimoArtistaBuscado));
    console.log("¡Guardado OK!");
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
      console.log('Has escogido la opcion', artista);
      ultimoArtistaBuscado = await buscarInformacionArtista(artista);

      for (const song of ultimoArtistaBuscado) {
        console.log(`Canción: ${song.title}`.yellow);
        console.log(`Enlace: ${song.link}`.green);
        console.log(`Imagen: ${song.cover}`.blue);
        console.log(`Preview: ${song.preview}`.red)
        console.log('---------------------------------');
      }
      break

    case 2:
      if (ultimoArtistaBuscado) {
        const seleccionCancion = await inquirer.prompt([
          {
            type: "list",
            name: "cancion",
            message: "Elige una canción para reproducir su vista previa:",
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
        console.log("No hay último artista para reproducir.");
      }
      break;
    default:
      console.log("Opción no disponible");
      break;
  }

} while (opcionEscogida !== 0);

