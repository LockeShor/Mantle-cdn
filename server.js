const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const crypto = require('crypto');

const server = http.createServer((req, res) => {
  console.log(req.method, req.url)
  if (req.method.toLowerCase() === 'post') {
    // handle file upload
    const form = formidable({ multiples: false, uploadDir: path.join(__dirname, 'videos') });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }
      const oldPath = files.file.filepath;
      const newFilename = crypto.randomBytes(32).toString('hex');
      console.log("UPLOADED: " + newFilename + getContentExt(files.file.mimetype))
      const newPath = path.join(__dirname, 'videos', newFilename + getContentExt(files.file.mimetype));

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }

        res.writeHead(200, { 'Location': '/' + newFilename + getContentExt(files.file.mimetype) });
        res.end(newFilename + getContentExt(files.file.mimetype));
      });
    });
  } else {

    if(req.url === '/'){
        res.statusCode = 404;
        res.end('You must input a file name, example: /video.mp4');
        return;
    }

    // serve video file
    const filePath = path.join(__dirname, 'videos', req.url.slice(1));

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 404;
        res.end('File Not Found: ' + req.url.slice(1));
        return;
      }

      const extname = path.extname(filePath);
      const contentType = getContentType(extname);
      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  }
});

function getContentType(extname) {
  switch (extname) {
    case '.mp4':
      return 'video/mp4';
    case '.webm':
      return 'video/webm';
    case '.ogg':
      return 'video/ogg';
    default:
      return 'application/octet-stream';
  }
}

function getContentExt(contentname) {
    switch (contentname) {
      case 'video/mp4':
        return '.mp4';
      case 'video/webm':
        return '.webm';
      case 'video/ogg':
        return '.ogg';
      default:
        return '.mp4';
    }
  }

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
