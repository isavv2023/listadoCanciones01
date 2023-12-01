### Introduccion - Proyecto “Listado de canciones y reproducción de la preview de un MP3”
Este repositorio contiene un proyecto simple que permite buscar información de artistas musicales utilizando la API de Deezer y reproducir la vista previa de sus canciones en formato MP3.

### Archivos
index.js: Contiene la lógica principal del programa.
reproducirMP3.js: Contiene la función para reproducir la vista previa de los archivos MP3.

### Uso
Ejecuta index.js para acceder al menú principal.
Elige entre buscar un artista o reproducir la última búsqueda.
Para buscar un artista, sigue las instrucciones y selecciona una canción para reproducir su vista previa en MP3.

### Definicion

Aplicación terminal (node)
Solicitar un artista
Se muestra sobre este artista, una lista de 10 canciones (obtenidas de Deezer) con 4 campos: 

titulo de la cancion
link a la cancion
link a la imagen de la cancion
link a la preview de su MP3

Después da la opcion de elegir Reproducir ultimo artista buscado. Aquí saldran las 10 canciones anteriores, solo sus titulos, y se puede elegir una canción. Al elegirla, se abrirá el navegador y reproducirá los 30 segundos de la preview de la canción. 

### Instalaciones
Vamos a usar la nomenclatura import con lo que en package.json añadiremos: “type”:”module”.

Hemos instalado: 
inquirer es una biblioteca de Node.js que facilita la creación de interfaces de línea de comandos interactivas. Se usa en nuestro index.js para realizar preguntas al usuario y recibir sus respuestas.

axios es una biblioteca de Node.js que se utiliza para realizar solicitudes HTTP. Aquí se utiliza para hacer solicitudes a la API de Deezer. Esto posibilita buscar artistas, obtener información de canciones y trabajar con los datos recibidos de la API para mostrar información relevante al usuario, como títulos de canciones, enlaces y previsualizaciones de canciones de un artista específico.
colors

fs se emplea para leer y escribir archivos, así como para manipular datos almacenados en archivos en el sistema de archivos local.


Y por si acaso, para que se reprodujera bien el mp3, al usar Linux: mpg123 y sox


### Vistas

Menu para mostrar qué hace el programa: 
 1. Buscar artista
 2. Reproducir ultimo artista
 0. Salir

Menu de aceptacion o entrada de datos: Necesito pedirle al usuario que artista quiere escuchar. Si elige la opcion 1, el usuario escribirá un artista musical. 

Del artista se mostrarán 10 de sus canciones, con los campos:

  	title: song.title,
  	link: song.link,
  	cover: song.album.cover,
  	preview: song.preview,

Si luego elige Reproducir ultimo artista. Saldrán solo los 10 titulos y podrá elegir uno, o marcando el número asignado a la cancion en el menu o con las teclas de flechas. Y si le da a intro, se abrirá la previsualización que deja Deezer de 30 segundos de la canción.

### Notas para el archivo reproducirMP3.js

child_process: Es un módulo de Node.js que permite ejecutar procesos secundarios (comandos de la línea de comandos) desde la aplicación Node.js. 
exec es un método que ejecuta un comando en la terminal y proporciona acceso a los flujos de entrada, salida y error.

node:os: El módulo proporciona información y utilidades relacionadas con el sistema operativo. 
os.arch() devuelve la arquitectura de la CPU del sistema como una cadena de texto.

Los comentarios sobre errores son útiles, pero para dejar la salida en terminal limpia. Y que se pueda seguir probando a elegir artista y escuchar otra canción, se han pasado a comentar. 

