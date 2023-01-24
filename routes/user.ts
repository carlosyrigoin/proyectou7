import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

dotenv.config();

const userRoutes: Router = Router();
const prisma = new PrismaClient();

userRoutes.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({ ok: true, data: users });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

userRoutes.post("/", async (req, res) => {
    try {
        const data = req.body;
        data.password = bcrypt.hashSync(data.password, 8);
        await prisma.user.create({ data });
        res.status(201).json({ ok: true, message: "User creado correctamente" });
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

userRoutes.post("/login", async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            where: { email: req.body.email},
        });
        if (!user) {
            res.status(500).json({ ok: false, message: "Invalid Credientials"});
        }else{
            const isMatch = bcrypt.compareSync(req.body.password, user[0]?.password);
            if (!isMatch) {
                res.status(500).json({ ok: false, message: "Invalid Credientials"});
            }else{
                const token = jwt.sign({ email: req.body.email }, process.env.TOKEN_SECRET ?? "", {
                    expiresIn: "1800s",
                });
                res.status(201).json({ user: user, token: token });
            }
        }
    } catch (error) {
        res.status(500).json({ ok: false, message: error });
    }
});

export default userRoutes;
