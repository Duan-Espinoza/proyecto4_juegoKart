import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function GameConfig() {
  const [gameType, setGameType] = useState("");
  const [track, setTrack] = useState("");
  const [laps, setLaps] = useState("");
  const [players, setPlayers] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-6 grid gap-6 max-w-md mx-auto">
      <Card>
        <CardContent className="p-4 grid gap-4">
          <h2 className="text-xl font-semibold text-center">Configuración de partida</h2>
          <Select onValueChange={setGameType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de juego" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carrera">Carrera</SelectItem>
              <SelectItem value="contrarreloj">Contrarreloj</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setTrack}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar pista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pista1">Pista 1</SelectItem>
              <SelectItem value="pista2">Pista 2</SelectItem>
              <SelectItem value="pista3">Pista 3</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setShowDetails(true)}>Continuar</Button>
        </CardContent>
      </Card>

      {showDetails && (
        <Card>
          <CardContent className="p-4 grid gap-4">
            <Select onValueChange={setTrack}>
              <SelectTrigger>
                <SelectValue placeholder="Pista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pista1">Pista 1</SelectItem>
                <SelectItem value="pista2">Pista 2</SelectItem>
                <SelectItem value="pista3">Pista 3</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Número de vueltas"
              value={laps}
              onChange={(e) => setLaps(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Cantidad de jugadores"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
