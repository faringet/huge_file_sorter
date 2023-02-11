const fs = require('fs');
const readline = require('readline');
const chunkWriter = require('./chunkWriter');
const chunkMerger = require('./chunkMerger');

const BLOCK_SIZE = 64 * 1024 * 1024; // !!!

async function app(fileName) {
    const chunkFiles = [];


    const fileStream = fs.createReadStream(fileName);
    let chunk = [];
    let chunkSize = 0;
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });


    for await (const line of rl) {
        chunk.push(line);
        chunkSize += line.length + 1;

        if (chunkSize >= BLOCK_SIZE) {
            chunkFiles.push(await chunkWriter.writeChunk(chunk));
            chunk = [];
            chunkSize = 0;
        }
    }


    if (chunk.length > 0) {
        chunkFiles.push(await chunkWriter.writeChunk(chunk));
    }


    const outputFile = await chunkMerger.mergeChunks(chunkFiles);

    return outputFile;
}

app('input.txt').then((outputFile) => {
    console.log(`Sorted file: ${outputFile}`);
}).catch((err) => {
    console.error(err);
});