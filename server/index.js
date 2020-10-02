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

// const streamer = videoStreamer({ videoPath: FILES_PATH });

// app.get('/stream/*', (request, response) => {
//   return streamer(request, response);
// });
app.get('/stream/*', videoStreamer({ videoPath: FILES_PATH }));

app.get(['/browse', '/browse/*'], async (request, response) => {
  const { 0: query = '' } = request.params;

  const path = query.replace(/^\//g, '');

  console.log('Browse', { FILES, path });
  const files = await readdir(resolve(FILES, path));
  const result = [];

  for (const file of files) {
    if ((await stat(resolve(FILES, path, file))).isDirectory()) {
      result.push(`${file}/`);
    } else {
      result.push(file);
    }
  }

  response.send({ files: result });
});

app.get('/thumb/*', (request, response) => {
  const { 0: path, width = '200' } = request.params;

  simpleThumbnail(resolve(FILES_PATH, path), response, `${width}x?`, {seek: '00:00:01'});
});

app.use(express.static(resolve('../client/dist')));
app.get('*', (request, response) => {
  response.sendFile(resolve('../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log('Server is ready on port', PORT);
});
