-- -- KEYS[1] = base key (example: rate:user:123)
-- -- ARGV[1] = limit
-- -- ARGV[2] = window size in seconds
-- -- ARGV[3] = current timestamp in seconds

-- local key = KEYS[1]
-- local limit = tonumber(ARGV[1])
-- local window = tonumber(ARGV[2])
-- local now = tonumber(ARGV[3])



-- local currentWindow= math.floor(now/window)
-- local previousWindow = currentWindow-1

-- local currentKey = key.. ":" .. currentWindow
-- local previousKey = key.. ":" .. previousWindow

-- local currentCount = tonumber(redis.call("GET",currentKey)) or 0
-- local previousCount = tonumber(redis.call("GET",previousKey)) or 0


-- local elapsed = now%window
-- local weight = (window-elapsed)/window


-- local effictiveCount = currentCount + (previousCount*weight)


-- if effictiveCount>=limit then
--     return {0,effictiveCount}
-- end

-- currentCount = redis.call("INCR",currentKey)

-- redis.call("EXPIRE",currentKey,window*2)

-- return {1,effictiveCount+1}

-- KEYS[1] = client key (example: rate:client:<id>)
-- KEYS[2] = company key (example: rate:company:<id>)
-- ARGV[1] = client limit
-- ARGV[2] = company limit
-- ARGV[3] = window size in seconds
-- ARGV[4] = current timestamp in seconds

local clientKey = KEYS[1]
local companyKey = KEYS[2]

local clientLimit = tonumber(ARGV[1])
local companyLimit = tonumber(ARGV[2])
local window = tonumber(ARGV[3])
local now = tonumber(ARGV[4])


local currentWindow = math.floor(now / window)
local previousWindow = currentWindow - 1

local function getCounts(key)
    local currentKey = key .. ":" .. currentWindow
    local prevKey = key .. ":" .. previousWindow
    local currentCount = tonumber(redis.call("GET", currentKey)) or 0
    local previousCount = tonumber(redis.call("GET", prevKey)) or 0
    local elapsed = now % window
    local weight = (window - elapsed) / window
    local effective = currentCount + previousCount * weight
    return currentKey, effective
end


local clientCurrentKey, clientEffective = getCounts(clientKey)

local companyCurrentKey, companyEffective = getCounts(companyKey)


if clientEffective >= clientLimit then
    return {0, clientEffective, companyEffective}
end

if companyEffective >= companyLimit then
    return {0, clientEffective, companyEffective}
end


redis.call("INCR", clientCurrentKey)
redis.call("EXPIRE", clientCurrentKey, window * 2)

redis.call("INCR", companyCurrentKey)
redis.call("EXPIRE", companyCurrentKey, window * 2)

return {1, clientEffective + 1, companyEffective + 1}