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

const getTrackIdByName = async (req, res) => {
  const trackName = req.params.trackName;
  try {
    const trackId = await trackService.getTrackIdByName(trackName);
    console.log(`Controlador de pistas: ID de pista obtenida para ${trackName}:`, trackId);
    if (!trackId) {
      return res.status(404).json({ message: "Pista no encontrada." });
    }
    res.json({ id: trackId });
  } catch (error) {
    console.error("Error al obtener pista:", error.message);
    res.status(500).json({ message: "Error interno al obtener pista." });
  }
};

module.exports = {
  getAllTracks,
  registerTracksFromFiles,
  getTrackIdByName
};