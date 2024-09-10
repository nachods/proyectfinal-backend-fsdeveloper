const path = require('path');

function getFileName(file) {
    if (!file || !file.path) {
        throw new Error('No se proporcionó un archivo válido');
    }

    const filePath = file.path;

    // Imprime la ruta completa para depuración
    console.log('Ruta Completa del Archivo:', filePath);

    // Utiliza path.basename para obtener el nombre del archivo
    const fileName = path.basename(filePath);
    console.log('Nombre del Archivo:', fileName);

    // Devuelve solo el nombre del archivo, ya que debe estar en la carpeta 'uploads'
    return fileName;
}

module.exports = {
    getFileName,
}
