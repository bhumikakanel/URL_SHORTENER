import express from "express";
import cors from "cors";
import { createClient } from "redis";
import { encodeBase62 } from "./services/base62_encoding_service.js";
import { error } from "console";

const app = express();

app.use(cors());
app.use(express.json());

//initialise redis
const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on('connect', () => {
    console.log("Redis is connected")
});

redisClient.on('error', (err) => {
    console.log("Redis connection failed", err)
});




//shorten a url
app.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.json({
            status: false,
            error: "Please pass the Long URL"
        });
    }

    try {
        const id = await redisClient.incr('global_counter'); //redis key which stores a number
        const shortUrlId = encodeBase62(id);

        await redisClient.hSet('urls', shortUrlId, originalUrl);

        res.json({
            status: 'true',
            data: shortUrlId,
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            error: error
        });
    }

});

//get long url from short url
app.get("/:shortUrlId", async (req,res) => {
    const shortUrlId = req.params.shortUrlId;
    const originalUrl = await redisClient.hGet("urls", shortUrlId);

    if (!originalUrl) {
        return res.status(404).json({
            status: false,
            error: "Short URL not found"
        });
    }

    return res.redirect(originalUrl);


})

app.listen((3001), async () => {
    try {
        await redisClient.connect();
        console.log("Backend is running...");
    } catch (error) {
        console.log(error);
    }
});