// @ts-check
require('dotenv/config');
const express = require('express');
const { readdir, mkdir, stat, unlink, rmdir } = require('fs').promises;
const { createReadStream } = require('fs');
const InternalIp = require('internal-ip');
const { URL } = require('url');
const { resolve, parse, relative } = require('path');
const simpleThumbnail = require('simple-thumbnail');
const mime = require('mime');
const ffmpeg = require('fluent-ffmpeg');

const { PORT = 8080 } = process.env;

const FILES_PATH = resolve(process.env.FILES || '.');

const RE_RELATIVE = /^[\.\/\\]+/;

/**
 * @param {string} base
 * @param {string} path
 */
const sanitizePath = (base, path) => {
  const result = resolve(base, path.replace(RE_RELATIVE, ''));
  if (result.startsWith(base)) return result;
  return null;
};

const app = express();

app.use(express.json());

console.log('Streaming files from', FILES_PATH);
app.use((request, response, next) => {
  console.log(`${request.method}: ${request.url}`);
  next();
});
app.use('/image', express.static(FILES_PATH));

app.get('/mp4/*', async (request, response) => {
  const { 0: filePath = '' } = request.params;

  const fullPath = resolve(FILES_PATH, filePath);
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

  console.log('Browse', { FILES: FILES_PATH, path });
  const files = await readdir(resolve(FILES_PATH, path));
  const result = files.map(async (base) => {
    const fullPath = resolve(FILES_PATH, path, base);
    const { name, ext } = parse(fullPath);
    const stats = await stat(fullPath);
    const isDirectory = stats.isDirectory();

    return {
      name,
      base,
      ext: ext.slice(1),
      fullPath: relative(FILES_PATH, fullPath),
      type: isDirectory ? 'application/x-directory' : mime.getType(fullPath),
      isDirectory,
    };
  });

  response.send({ files: await Promise.all(result) });
});

app.get('/thumb/*', async (request, response) => {
  const { 0: path, width = '200' } = request.params;
  const fullPath = resolve(FILES_PATH, path);
  const mimeType = mime.getType(fullPath);

  try {
    if (mimeType?.startsWith('video/')) {
      await simpleThumbnail(fullPath, response, `${width}x?`, {
        seek: '00:00:01',
      });
    }
    if (mimeType?.startsWith('image/')) {
      await simpleThumbnail(fullPath, response, `${width}x?`);
    }
  } catch (error) {
    // if (!response.headersSent) response.status(500);
    // response.send({ error: error.message ?? error });
  }
});

app.get('/convert', async (request, response) => {
  const fullPath = resolve(FILES_PATH, String(request.query.file));
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

app.post('/action/mkdir', (request, response) => {
  const fullPath = sanitizePath(FILES_PATH, request.body.path || '/');

  mkdir(fullPath)
    .then(() => response.send({ success: true }))
    .catch((error) => response.status(500).send(error));
});

app.post('/action/unlink', (request, response) => {
  const fullPath = sanitizePath(FILES_PATH, request.body.file || '/');

  unlink(fullPath)
    .then(() => response.send({ success: true }))
    .catch((error) => response.status(500).send(error));
});

app.post('/action/rmdir', async (request, response) => {
  try {
    const fullPath = sanitizePath(FILES_PATH, request.body.path || '/');
    await rmdir(fullPath);
    response.send({ success: true });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.use(express.static(resolve('../client/dist')));
app.get('*', (request, response) => {
  response.sendFile(resolve('../client/dist/index.html'));
});

app.listen(PORT, async () => {
  const ip = await InternalIp.v4();
  const address = new URL(`http://${ip}:${PORT}/`);

  console.log(`Server is ready at ${address}`);
});
