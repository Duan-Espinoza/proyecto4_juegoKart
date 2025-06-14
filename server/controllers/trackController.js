// server/controllers/trackController.js
const trackService = require('../services/trackService');

const getAllTracks = async (req, res) => {
  try {
    const tracks = await trackService.getAllTracksFromDB();
    console.log("Controlador de pistas: pistas obtenidas correctamente");
    res.json(tracks);
  } catch (error) {
    console.error("Error al obtener pistas:", error.message);
    res.status(500).json({ message: "Error interno al obtener las pistas." });
  }
};

const registerTracksFromFiles = async (req, res) => {
  try {
    await trackService.registerTracks();
    res.json({ message: "Pistas registradas correctamente." });
  } catch (error) {
    console.error("Error al registrar pistas:", error.message);
    res.status(500).json({ message: "Error interno al registrar pistas." });
  }
};

module.exports = {
  getAllTracks,
  registerTracksFromFiles
};
