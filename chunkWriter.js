const fs = require("fs");

/**
 * Write a chunk to disk.
 *
 * @param {Array} chunk - An array of strings representing a chunk of the file
 * @returns {Promise} A promise that resolves with the file name of the written chunk
 */
async function writeChunk(chunk) {
    chunk.sort(); // Sort the chunk

    return new Promise((resolve, reject) => {
        const chunkFile = `chunk-${Date.now()}.txt`; // Generate unique file name for each chunk (milliseconds since 1 January 1970 UTC)
        fs.writeFile(chunkFile, chunk.join("\n") + "\n", (err) => { // Join elements with newline characters and adding a final newline character at the end of the file
            if (err) {
                reject(err);
            } else {
                resolve(chunkFile);
            }
        });
    });
}

module.exports ={ writeChunk };