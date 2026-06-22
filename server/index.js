import express from "express";
import cors from "cors";
import { createClient } from "redis";
import { encodeBase62 } from "./services/base62_encoding_service.js";
import { error } from "console";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//initialise redis
const redisClient = createClient({
    url: process.env.REDIS_URL,
   
});

redisClient.on('connect', () => {
    console.log("Redis is connected")
});

redisClient.on('error', (err) => {
    console.log("Redis connection failed", err)
});


// get long url from short url
app.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;

    // Check if URL is provided
    if (!originalUrl) {
        return res.status(400).json({
            status: false,
            error: "Please pass the Long URL"
        });
    }

    // Validate URL
    try {
        const url = new URL(originalUrl);

        if (
            !["http:", "https:"].includes(url.protocol) ||
            !url.hostname.includes(".")
        ) {
            return res.status(400).json({
                status: false,
                error: "Invalid URL"
            });
        }
    } catch(error) {
        console.log("validation failed",error)
   
        return res.status(400).json({
            status: false,
            error: "Invalid URL"
        });
    }

    try {
        const id = await redisClient.incr("global_counter");

        const shortUrlId = encodeBase62(id);

        await redisClient.hSet(
            "urls",
            shortUrlId,
            originalUrl
        );

        return res.status(201).json({
            status: true,
            shortUrl: `${process.env.BACKEND_URL}/${shortUrlId}`
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
});

app.get("/lookup/:shortUrlId", async (req, res) => {
    try {
        const { shortUrlId } = req.params;

        const originalUrl = await redisClient.hGet(
            "urls",
            shortUrlId
        );

        if (!originalUrl) {
            return res.status(404).json({
                status: false,
                error: "Short URL not found"
            });
        }

        return res.json({
            status: true,
            data: originalUrl
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
});

app.get("/analytics/:shortUrlId", async (req, res) => {


    try {
        const { shortUrlId } = req.params;



        const clicks = await redisClient.hGet(
            "clicks",
            shortUrlId
        );



        return res.json({
            status: true,
            shortUrlId,
            clicks: Number(clicks || 0)
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
});
// redirect endpoint
app.get("/:shortUrlId", async (req, res) => {

    try {
        const { shortUrlId } = req.params;

        const originalUrl = await redisClient.hGet(
            "urls",
            shortUrlId
        );

        if (!originalUrl) {
            return res.status(404).json({
                status: false,
                error: "Short URL not found"
            });
        }



        // analytics
        await redisClient.hIncrBy(
            "clicks",
            shortUrlId,
            1
        );


        console.log(
            "Redirecting to:",
            originalUrl
        );

        return res.redirect(originalUrl);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }
});



app.listen(process.env.PORT || 3001, async () => {
    try {
        await redisClient.connect();
        console.log("Backend is running...");
    } catch (error) {
        console.log(error);
    }
});