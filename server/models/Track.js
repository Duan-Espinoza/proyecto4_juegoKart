class Track {
    constructor({ metadata, dimensiones, caracteristicas_pista, simbolos, pista, inicio_jugadores }) {
        this.nombre = metadata.nombre;
        this.tema = metadata.tema;
        this.ancho = dimensiones.ancho;
        this.alto = dimensiones.alto;
        this.cantidadCarriles = caracteristicas_pista.cantidad_carriles;
        this.anchoCarril = caracteristicas_pista.ancho_carril;
        this.simbolos = simbolos;
        this.pista = pista;
        this.inicioJugadores = inicio_jugadores;
}

    static fromDatabase(row) {
        let layout;

        // ✅ Verificar si es un string JSON
        if (typeof row.layout === 'string') {
            try {
            layout = JSON.parse(row.layout);
            } catch (err) {
            throw new Error(`Layout no es un string JSON válido: ${row.layout}`);
            }
        // ✅ Verificar si es un objeto
        } else if (typeof row.layout === 'object') {
            layout = row.layout;
        } else {
            throw new Error(`Layout no es un string ni un objeto: ${row.layout}`);
        }

        return new Track({
            metadata: {
            nombre: row.nameTrack,
            tema: row.thematic,
            },
            dimensiones: {
            ancho: layout.ancho,
            alto: layout.alto,
            },
            caracteristicas_pista: {
            cantidad_carriles: row.totalLanes,
            ancho_carril: layout.anchoCarril,
            },
            simbolos: layout.simbolos || [],
            pista: layout.pista || [],
            inicio_jugadores: layout.inicioJugadores || [],
        });
}


  toDBObject() {
    return {
      nombre: this.nombre,
      tema: this.tema,
      ancho: this.ancho,
      alto: this.alto,
      cantidadCarriles: this.cantidadCarriles,
      anchoCarril: this.anchoCarril,
      simbolos: JSON.stringify(this.simbolos),
      pista: JSON.stringify(this.pista),
      inicioJugadores: JSON.stringify(this.inicioJugadores),
    };
  }
}

module.exports = Track;
