const fs = require("fs");
async function mergeChunks(chunkFiles) {
    const outputFile = "output.txt";
    const outputStream = fs.createWriteStream(outputFile);

    const streams = chunkFiles.map((file) => fs.createReadStream(file));


    for (const stream of streams) {
        stream.pipe(outputStream, { end: false });
        await new Promise((resolve) => stream.on("end", resolve));
    }

    outputStream.end();

    return outputFile;
}

module.exports = { mergeChunks };