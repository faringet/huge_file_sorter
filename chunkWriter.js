const fs = require("fs");
async function writeChunk(chunk) {
    chunk.sort();

    return new Promise((resolve, reject) => {
        const chunkFile = `chunk-${Date.now()}.txt`;
        fs.writeFile(chunkFile, chunk.join("\n") + "\n", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(chunkFile);
            }
        });
    });
}

module.exports ={ writeChunk };