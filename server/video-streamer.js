const path = require('path');
const fs = require('fs');
const { stat } = require('fs').promises;
const ffmpeg = require('fluent-ffmpeg');
const mime = require('mime');

/**
 * Module exports
 */

module.exports = videoStream;

/**
 * Video stream:
 *
 * Returns sections of a video to allow streaming from htm
 *
 * @param {object} [options]
 * @return {function}
 * @api public
 */
function videoStream(options) {
  const opts = options || {};
  const videoPath = opts.videoPath || 'video';

  return (req, res) => {
    processVideoStream(videoPath, req, res);
  };
}

async function processVideoStream(videoPath, req, res) {
  const videoName = req.params[Object.keys(req.params)[0]];

  const file = path.join(videoPath, videoName);

  const extension = path.extname(videoName);

  console.log(file);

  // if (extension !== '.mp4') {
  //   res.status(415).send({
  //     error: `File type ${extension} is not supported.`,
  //   });
  //   return;
  // }

  const rangeHeader = req.headers.range;
  // if (!rangeHeader) {
  //   res.status(400).send({
  //     error: 'Range header not found in video stream request.',
  //   });
  //   return;
  // }
  // const positions = rangeHeader.replace(/bytes=/, '').split('-');

  const stats = await stat(file);
  // const info = calculateFileInfo(stats.size, positions);

  // writeHeaders(res, info.start, info.end, info.total, info.chunksize);

  // var range = req.headers.range;
  // if (!range) {
  //   // 416 Wrong range
  //   return res.sendStatus(416);
  // }
  // var positions = range.replace(/bytes=/, '').split('-');
  // var start = parseInt(positions[0], 10);
  // var total = stats.size;
  // var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
  // var chunksize = end - start + 1;

  // ffmpeg(file)
  //   .outputFormat('mp4')
  //   .outputOptions([
  //     // '-movflags faststart',
  //     '-frag_size 4096',
  //     // '-cpu-used 2',
  //     // '-deadline realtime',
  //     // '-threads 4',
  //   ])
  //   .videoBitrate(640, true)
  //   .audioBitrate(128)
  //   .audioCodec('aac')
  //   .videoCodec('libx264')
  //   .pipe(res, { end: true });

  // res.writeHead(206, {
  //   'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
  //   'Accept-Ranges': 'bytes',
  //   'Content-Length': chunksize,
  //   'Content-Type': 'video/mp4',
  // });

  // ffmpeg(file)
  //   .audioCodec('aac')
  //   .videoCodec('libx264')
  //   .format('mp4')
  //   .on('end', () => console.log('File converted successfully'))
  //   .on('error', (error) => console.error(error))
  //   .stream()
  //   .pipe(res, { end: true });

  // var stream = fs
  //   .createReadStream(file, { start: start, end: end, autoclose: true })
  //   .on('open', function () {
  //     const ffmpegCommand = ffmpeg()
  //       .input(stream)
  //       .outputFormat('mp4')
  //       .outputOptions([
  //         '-movflags faststart',
  //         '-frag_size 4096',
  //         // '-cpu-used 2',
  //         '-deadline realtime',
  //         // '-threads 4',
  //       ])
  //       // .videoBitrate(640, true)
  //       // .audioBitrate(128)
  //       .audioCodec('aac')
  //       // .videoCodec('libx264')
  //       .videoCodec('libx264')
  //       .output(res)
  //       .run();
  //   })
  //   .on('error', function (err) {
  //     res.end(err);
  //   });

  // fsp
  //   .stat(file)
  //   .then(
  //     (stat) => {
  //       const info = calculateFileInfo(stat.size, positions);

  //       writeHeaders(res, info.start, info.end, info.total, info.chunksize);

  //       const responseStream = fs.createReadStream(file, {
  //         flags: 'r',
  //         start: info.start,
  //         end: info.end + 1,
  //       });

  //       responseStream.pipe(res);
  //     },
  //     (err) => {
  //       console.log('File access error', err);
  //       res.status(404).send({
  //         error: 'File not found on video stream request',
  //       });
  //     }
  //   )
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).send(err);
  //   });

  var range = req.headers.range;

  if (!range) {
    return res.sendStatus(416);
  }

  var positions = range.replace(/bytes=/, '').split('-');
  var start = parseInt(positions[0], 10);
  var total = stats.size;
  var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
  var chunksize = end - start + 1;

  res.writeHead(206, {
    'Transfer-Encoding': 'chunked',

    'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': mime.getType(req.params.filename),
  });

  fs.createReadStream(file, { start: start, end: end, autoClose: true })
    .on('end', function () {
      console.log('Stream Done');
    })
    .on('error', function (err) {
      res.end(err);
    })
    .pipe(res, { end: true });
}

function calculateFileInfo(size, positions) {
  const start = parseInt(positions[0], 10);
  const end = positions[1] ? parseInt(positions[1], 10) : size - 1;

  return {
    total: size,
    start: start,
    end: end,
    chunksize: end - start + 1,
  };
}

function writeHeaders(res, start, end, total, chunkSize) {
  res.writeHead(206, {
    'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    Connection: 'keep-alive',
    'Content-Type': 'video/mp4',
  });
}
