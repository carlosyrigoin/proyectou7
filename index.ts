import express, { type Application, Request, Response } from "express";
import dotenv from 'dotenv';
import * as routes from "./routes";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Proyecto u7 (Express + TypeScript Server)');
});

app.use("/api/v1/users", routes.userRoutes);
app.use("/api/v1/songs", routes.songRoutes);
app.use("/api/v1/playlist", routes.playlistRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Servidor Iniciado en http://localhost:${port}`);
});