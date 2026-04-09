const Redis = require("ioredis");
const fs = require("fs");
const path = require("path");

let redis;

if (process.env.REDIS_URL) {
    // Production (Render)
    redis = new Redis(process.env.REDIS_URL);
} else {
    // Local development
    redis = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
    });
}

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

const luaScriptPath = path.resolve(__dirname, "../scripts/sliding-window-counter.lua");
const luaScript = fs.readFileSync(luaScriptPath, "utf8");

redis.defineCommand("slidingWindowCounter", {
    numberOfKeys: 2,
    lua: luaScript,
});

module.exports = redis;
