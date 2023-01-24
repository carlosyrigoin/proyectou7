import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import * as jwt from "jsonwebtoken";

dotenv.config();

const songRoutes: Router = Router();
const prisma = new PrismaClient();

songRoutes.get("/", async (req, res) => {
    try {
        const token = req.headers["authorization"];
        let songs = [];
        
        if (token == null){
            songs = await prisma.song.findMany({
                where: {public: true}
            });
        }else{
            songs = await prisma.song.findMany();
        }
        res.status(200).json({ ok: true, data: songs });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

songRoutes.post("/", async (req, res) => {
    try {
        const data = req.body;
        await prisma.song.create({ data });
        res.status(201).json({ ok: true, message: "Song creado correctamente" });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

songRoutes.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const song = await prisma.song.findUnique({
            where: {id: Number(id)}
        });
        res.status(200).json({ ok: true, data: song });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

export default songRoutes;
