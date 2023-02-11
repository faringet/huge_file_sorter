const fs = require("fs");

/**
 * Merge multiple chunk files into a single file.
 *
 * @param {Array} chunkFiles - An array of file names of the chunk files
 * @returns {Promise} A promise that resolves with the file name of the merged file
 */
async function mergeChunks(chunkFiles) {
    const outputFile = "output.txt";
    const outputStream = fs.createWriteStream(outputFile); // Write sorted data to a file

    const streams = chunkFiles.map((file) => fs.createReadStream(file));

    // Read from each chunk file and write to the output file
    for (const stream of streams) {
        stream.pipe(outputStream, { end: false }); // Output stream should not be closed when the input stream ends
        await new Promise((resolve) => stream.on("end", resolve)); // Output stream waits for the current read stream to end before moving on to the next stream
    }

    outputStream.end();

    return outputFile;
}

module.exports = { mergeChunks };