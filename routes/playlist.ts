import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const playlistRoutes: Router = Router();
const prisma = new PrismaClient();

playlistRoutes.get("/", async (req, res) => {
    try {
        const playlists = await prisma.playlist.findMany();
        res.status(200).json({ ok: true, data: playlists });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

playlistRoutes.post("/", async (req, res) => {
    try {
        const {name, user_id, songs} = req.body;

        let playlist = await prisma.playlist.create({
            data: {
                name: name,
                user: { connect: { id: user_id } }
            }
        });
        for (let i = 0; i < songs.length; i++) {
            let song = await prisma.song.create({
                data: songs[i]
            });
            
            let playlistsong = await prisma.playlistsong.create({
                data: {
                    playlist: { connect: { id: playlist.id } },
                    song: { connect: { id: song.id } }
                }
            });
        }

        res.status(201).json({ ok: true, message: "Playlist creado correctamente" });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});


playlistRoutes.post("/addsong", async (req, res) => {
    try {
        const {playlist_id, song_id} = req.body;
        let playlistsong = await prisma.playlistsong.create({
            data: {
                playlist_id: playlist_id,
                song_id: song_id
            }
        });
        res.status(201).json({ ok: true, message: "Song add to playlist" });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

playlistRoutes.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const song = await prisma.playlistsong.findMany({
            where: {playlist_id: Number(id)}
        });
        res.status(200).json({ ok: true, data: song });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

export default playlistRoutes;