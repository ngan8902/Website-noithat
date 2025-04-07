function validateTimestamp(timestamp) {
    return !timestamp || isNaN(timestamp) ? Date.now() : timestamp;
}

module.exports = {
    validateTimestamp
}