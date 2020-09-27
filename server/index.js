require('dotenv/config');
const express = require('express');
const { readdir, stat } = require('fs').promises;
const { resolve } = require('path');
const videoStreamer = require('./video-streamer');
const simpleThumbnail = require('simple-thumbnail');

const { PORT = 8080, FILES = '.' } = process.env;

const FILES_PATH = resolve(FILES);

const app = express();

console.log('Streaming files from', FILES_PATH);
app.use('/image', express.static(FILES_PATH));
app.get('/stream/:videoName', videoStreamer({ videoPath: FILES_PATH }));

app.get(['/browse', '/browse/*'], async (request, response) => {
  const query = request.params[0] || '';

  console.log('Browse', { FILES, query });
  const files = await readdir(resolve(FILES, query));
  const result = [];

  for (const file of files) {
    if (await (await stat(resolve(FILES, query, file))).isDirectory()) continue;
    result.push(file);
  }

  response.send({ files: result });
});

app.get('/thumb/*', (request, response) => {
  const { 0: path, width = '200' } = request.params;

  simpleThumbnail(resolve(FILES_PATH, path), response, `${width}x?`);
});

app.use(express.static(resolve('../client/dist')));

app.listen(PORT, () => {
  console.log('Server is ready on port', PORT);
});
