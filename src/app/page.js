"use client";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
export default function Home() {
  const [entregas, setEntregas] = useState([]);
  const [ordenadas, setOrdenadas] = useState([]);
  const [localizacao, setLocalizacao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [lucro, setLucro] = useState("");
  const [message, setMessage] = useState(null);
  const [lucroTotal, setLucroTotal] = useState(null);
  const [prazoMaximo, setPrazoMaximo] = useState(null);

  function handleSubmit() {
    if (prazo > 0 && lucro > 0 && localizacao.length > 0) {
      setMessage({
        text: "Tudo certo cadastrando entrega!",
        action: "success",
      });
      const entrega = {
        localizacao,
        prazo,
        lucro,
      };
      entregas.push(entrega);
      setEntregas([...entregas]);
      setLucro("");
      setLocalizacao("");
      setPrazo("");
    } else {
      setMessage({
        text: "Verifique os campos do formulario",
        action: "error",
      });
    }
  }

  function jobSequencing() {
    let e = entregas;
    // Ordena entregas do maior lucro para o menor
    e.sort((a, b) => b.lucro - a.lucro);
    let t = Math.max(...e.map((entrega) => entrega.prazo));
    let lucroTotal = 0;
    // Array que armazena slots livres
    let result = new Array(t);
    // O trecho abaixo foi baseado no artigo: https://reintech.io/blog/solving-job-sequencing-problem-in-javascript
    for (let i = 0; i < t; i++) result[i] = false;
    // percorre todas entregas
    for (let i = 0; i < e.length; i++) {
      //Encontra uma posição para essa entrega no espaço mais longe possível
      for (let j = Math.min(t - 1, e[i].prazo - 1); j >= 0; j--) {
        // Caso encontre espaço livre
        if (result[j] == false) {
          // Insere na posição
          result[j] = e[i]; //alterado por mim
          lucroTotal += Number(e[i].lucro); //alterado por mim
          console.log(e[i].localizacao);
          break;
        }
      }
    } // Aqui acaba o trecho baseado no artigo
    console.log(result);
    setOrdenadas(result);
    setLucroTotal(lucroTotal);
    setPrazoMaximo(t);
  }

  return (
    <main className="flex min-h-screen justify-between p-24">
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        message={message?.text}
        severity={message?.action}
      />
      <Card sx={{ width: 350 }} className="flex flex-col items-center pt-4">
        <Typography variant="h5" className="mb-4">
          Cadastrar nova entrega
        </Typography>
        <TextField
          id="outlined-basic"
          label="Localização"
          className="pb-2 w-[80%]"
          variant="outlined"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Lucro Estimado"
          type="number"
          className="pb-2 w-[80%]"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">R$</InputAdornment>
            ),
          }}
          value={lucro}
          onChange={(e) => setLucro(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Prazo"
          type="number"
          className="pb-2 w-[80%]"
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">Dias</InputAdornment>,
            inputProps: { min: 0, max: 7 },
          }}
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSubmit}>
          Cadastrar
        </Button>
      </Card>
      <Card
        sx={{ width: 700 }}
        className="flex flex-col items-center justify-between"
      >
        <Typography variant="h5" className="mt-4">
          Entregas Cadastradas
        </Typography>
        {entregas.length > 0 && (
          <Box className="flex justify-between gap-2 mx-2 my-4 flex-wrap">
            {entregas.map((entrega) => (
              <Card
                key={entrega.localizacao + entrega.prazo + entrega.tempo}
                className="px-2 w-48"
              >
                <Typography>Local:{entrega.localizacao}</Typography>
                <Typography>Lucro Estimado: R$:{entrega.lucro}</Typography>
                <Typography>Prazo: {entrega.prazo} Dias</Typography>
              </Card>
            ))}
          </Box>
        )}
        {entregas.length > 1 && (
          <Button onClick={jobSequencing}>Ordenar</Button>
        )}
        {ordenadas.length > 0 && (
          <Typography variant="h5" className="mt-4">
            Entregas Ordenadas (Lucro R$:{lucroTotal} em {prazoMaximo} dias)
          </Typography>
        )}
        <Box className="flex justify-between gap-2 mx-2 my-4 flex-wrap">
          {ordenadas.map((entrega) => (
            <Card
              key={entrega.localizacao + entrega.prazo + entrega.tempo}
              className="px-2 w-48"
            >
              <Typography>Local:{entrega.localizacao}</Typography>
              <Typography>Lucro Estimado: R$:{entrega.lucro}</Typography>
              <Typography>Prazo: {entrega.prazo} Dias</Typography>
            </Card>
          ))}
        </Box>
      </Card>
    </main>
  );
}
