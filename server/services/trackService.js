// File: server/services/trackService.js
const fs = require('fs');
const path = require('path');
const Track = require('../models/Track');
const pool = require('../config/database');

function loadTracksFromFolder(carpetaPath) {
    const archivos = fs.readdirSync(carpetaPath).filter(file => file.endsWith('.json'));
    const tracks = [];

    for (const archivo of archivos) {
        try {
            const archivoPath = fs.readFileSync(path.join(carpetaPath, archivo), 'utf-8');
            const json = JSON.parse(archivoPath);
            const track = new Track(json);
            tracks.push(track);
        } catch (error) {
            console.error(`Error al procesar el archivo (server/services/trackService) ${archivo}:`, error.message);
        }
    }
    return tracks;
}


async function registerTracks() {
  const carpeta = path.join(__dirname, '../utils');
  const tracks = loadTracksFromFolder(carpeta);

  for (const track of tracks) {
    const [rows] = await pool.execute(
      'SELECT id FROM Track WHERE nameTrack = ?',
      [track.nombre]
    );
    if (rows.length > 0) {
      continue;
    }

    const layout = {
      ancho: track.ancho,
      alto: track.alto,
      anchoCarril: track.anchoCarril,
      simbolos: track.simbolos,
      pista: track.pista,
      inicioJugadores: track.inicioJugadores,
    };

    const layoutJSON = JSON.stringify(layout);

    await pool.execute(
      `INSERT INTO Track (nameTrack, thematic, totalLanes, layout)
       VALUES (?, ?, ?, ?)`,
      [
        track.nombre,
        track.tema,
        track.cantidadCarriles,
        layoutJSON
      ]
    ).catch(error => {
      console.error(`Error al registrar la pista (trackService): ${track.nombre}:`, error.message);
    });
  }

  console.log('✅ Circuitos registrados con éxito.');
}


async function getAllTracksFromDB() {
    try {
        const [rows] = await pool.execute('SELECT * FROM Track');
        return rows.map(row =>  Track.fromDatabase(row)); // Convertir cada fila a una instancia de Track
    } catch (error) {
        console.error("Error al obtener las pistas de la base de datos(server/trackService):", error);
        throw error;
    }
}


async function getTrackIdByName(trackName) {
    try {
        const [rows] = await pool.execute('SELECT id FROM Track WHERE nameTrack = ?', [trackName]);
        if (rows.length === 0) {
            return null; // No se encontró la pista
        }
        console.log(`ID de la pista ${trackName}:`, rows[0].id);
        return rows[0].id; // Retorna el ID de la pista
    } catch (error) {
        console.error(`Error al obtener el ID de la pista (server/trackService): ${trackName}`, error);
        throw error;
    }
}

module.exports = {
    loadTracksFromFolder,
    registerTracks,
    getAllTracksFromDB,
    getTrackIdByName
};