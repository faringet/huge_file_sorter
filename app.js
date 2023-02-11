const fs = require('fs');
const readline = require('readline');
const chunkWriter = require('./chunkWriter');
const chunkMerger = require('./chunkMerger');

const BLOCK_SIZE = 500 * 1024 * 1024; // 500 MB - conditional restriction

async function app(fileName) {
    const chunkFiles = [];


    const fileStream = fs.createReadStream(fileName); // Read a fileName
    let chunk = [];
    let chunkSize = 0;
    const rl = readline.createInterface({ // Read line by line using the readline module's
        input: fileStream,
        crlfDelay: Infinity
    });

    // Divide into smaller chunks
    for await (const line of rl) {
        chunk.push(line);
        chunkSize += line.length + 1;

        if (chunkSize >= BLOCK_SIZE) {
            chunkFiles.push(await chunkWriter.writeChunk(chunk));
            chunk = [];
            chunkSize = 0;
        }
    }

    // Write the last chunk
    if (chunk.length > 0) {
        chunkFiles.push(await chunkWriter.writeChunk(chunk));
    }

    // Merge the chunks back together
    return await chunkMerger.mergeChunks(chunkFiles);
}

app('input.txt').then((outputFile) => {
    console.log(`Sorted file: ${outputFile}`);
}).catch((err) => {
    console.error(err);
});