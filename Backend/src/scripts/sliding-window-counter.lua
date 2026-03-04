-- KEYS[1] = base key (example: rate:user:123)
-- ARGV[1] = limit
-- ARGV[2] = window size in seconds
-- ARGV[3] = current timestamp in seconds

local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])



local currentWindow= math.floor(now/window)
local previousWindow = currentWindow-1

local currentKey = key.. ":" .. currentWindow
local previousKey = key.. ":" .. previousWindow

local currentCount = tonumber(redis.call("GET",currentKey)) or 0
local previousCount = tonumber(redis.call("GET",previousKey)) or 0


local elapsed = now%window
local weight = (window-elapsed)/window


local effictiveCount = currentCount + (previousCount*weight)


if effictiveCount>=limit then
    return {0,effictiveCount}
end

currentCount = redis.call("INCR",currentKey)

redis.call("EXPIRE",currentKey,window*2)

return {1,effictiveCount+1}