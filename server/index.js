// @ts-check
require('dotenv/config');
const express = require('express');
const { readdir, stat } = require('fs').promises;
const { createReadStream } = require('fs');
const { resolve, parse, relative } = require('path');
const simpleThumbnail = require('simple-thumbnail');
const mime = require('mime');
const ffmpeg = require('fluent-ffmpeg');

const { PORT = 8080, FILES = '.' } = process.env;

const FILES_PATH = resolve(FILES);

const app = express();

console.log('Streaming files from', FILES_PATH);
app.use((request, response, next) => {
  console.log(`${request.method}: ${request.url}`);
  next();
});
app.use('/image', express.static(FILES_PATH));

app.get('/mp4/*', async (request, response) => {
  const { 0: filePath = '' } = request.params;

  const fullPath = resolve(FILES, filePath);
  const stats = await stat(fullPath);
  const fileSize = stats.size;
  const range = request.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = createReadStream(fullPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    response.writeHead(206, head);
    file.pipe(response);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    response.writeHead(200, head);
    createReadStream(fullPath).pipe(response);
  }
});

app.get(['/browse', '/browse/*', '/list'], async (request, response) => {
  const { 0: query = '' } = request.params;

  const path = String(request.query.path) || query.replace(/^\//g, '');

  console.log('Browse', { FILES, path });
  const files = await readdir(resolve(FILES, path));
  const result = files.map(async (base) => {
    const fullPath = resolve(FILES, path, base);
    const { name, ext } = parse(fullPath);
    const stats = await stat(fullPath);
    const isDirectory = stats.isDirectory();

    return {
      name,
      base,
      ext: ext.slice(1),
      fullPath: relative(FILES, fullPath),
      type: isDirectory ? 'application/x-directory' : mime.getType(fullPath),
      isDirectory,
    };
  });

  response.send({ files: await Promise.all(result) });
});

app.get('/thumb/*', (request, response) => {
  const { 0: path, width = '200' } = request.params;
  const fullPath = resolve(FILES, path);
  const mimeType = mime.getType(fullPath);

  if (mimeType?.startsWith('video/')) {
    simpleThumbnail(fullPath, response, `${width}x?`, {
      seek: '00:00:01',
    });
  }
  if (mimeType?.startsWith('image/')) {
    simpleThumbnail(fullPath, response, `${width}x?`);
  }
});

app.get('/convert', async (request, response) => {
  const fullPath = resolve(FILES, String(request.query.file));
  const fileInfo = parse(fullPath);

  ffmpeg(fullPath)
    .output(resolve(fileInfo.dir, `${fileInfo.name}.mp4`))
    .on('end', () => {
      response.send({ success: true });
    })
    .on('error', (error) => {
      console.error(error);
      response.send({ success: false });
    })
    .run();
});

app.use(express.static(resolve('../client/dist')));
app.get('*', (request, response) => {
  response.sendFile(resolve('../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log('Server is ready on port', PORT);
});
