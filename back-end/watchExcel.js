const chokidar = require('chokidar');
const importMoviesFromExcel = require('./importMovies');

const excelFilePath = './film.xlsx';

// Surveillance du fichier Excel pour détecter les modifications
function watchExcelFile(filePath) {
  const watcher = chokidar.watch(filePath, {
    ignored: /(^|[\/\\])\../, // Ignorer les fichiers cachés
    persistent: true
  });

  // Événement déclenché lors d'une modification du fichier
  watcher.on('change', path => {
    console.log(`Fichier ${path} modifié, mise à jour de la base de données...`);
    importMoviesFromExcel(path);
  });

  console.log(`Surveillance des modifications du fichier sur ${excelFilePath}`);
}

module.exports = watchExcelFile;
