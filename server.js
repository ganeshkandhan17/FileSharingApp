const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const streamBuffers = require('stream-buffers');
const bodyparser = require("body-parser");
const express = require("express");
const ejs = require('ejs');
const { fileexist, get4id, uid, getdate, gettime } = require("./methods");
const multer = require("multer");
const archiver = require("archiver")
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.engine('html', ejs.renderFile);
let log = (name, dir) => {
  fs.appendFile(
    path.join(__dirname, "log.txt"),
    `${name} \t \t \t \t \t \t./Files/${dir}\t ${getdate()} \t ${gettime()} \t ${uid()} \n`,
    (err) => {
      if (err) throw err;
    }
  );
}

let downloadlog = (dir) => {
  fs.appendFile(
    path.join(__dirname, "log.txt"),
    `Download \t \t \t \t \t \t./Files/${dir}\t ${getdate()} \t ${gettime()} \t ${uid()} \n`,
    (err) => {
      if (err) throw err;
    }
  );
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'Client', "index.html"));
});

app.listen(port, (err) => {
  if (err) throw err;
  else {
    console.log(`Application Running at PORT = ${port}`);
  }
});
let n = get4id()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(path.join(__dirname, "Files"))) {
      fs.mkdirSync(path.join(__dirname, "Files"))
    }
    if (!fs.existsSync(path.join(__dirname, "Files", n))) {
      fs.mkdirSync(path.join(__dirname, "Files", n))
    }
    cb(null, path.join(__dirname, "Files", n))
  },
  filename: (req, file, cb) => {
    log(file.originalname, n)
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage })
app.post("/upload", upload.array("files"), (req, res) => {
  res.send(n)
  n = get4id()
})

app.get("/getfile", (req, res) => {
  res.sendFile(path.join(__dirname, 'Client', 'getfile.html'));
})

app.get("/:code/file", (req, res) => {
  let code = req.params.code;
  let dir
  fileexist(code).then((data) => {
    if (data) {
      res.render(path.join(__dirname, 'Client', 'download.html'), {
        code: code
      })
    }
    else {
      res.send(`<script>window.location.href="/getfile";showalert("Invalid Url")</script>`)
    }
  })
})

app.post('/checkcode', (req, res) => {
  let code = req.body.code;
  fileexist(code).then((data) => {

    if (data) {
      res.send("true")
    }
    else {
      res.send("false")
    }
  })
})

app.get("/:code/filedtl", (req, res) => {
  let code = req.params.code;
  fs.readdir(path.join(__dirname, 'Files', code), (err, data) => {
    res.send(data)
  })
})

app.get('/:code/download', (req, res) => {
  let code = req.params.code;
  downloadlog(code)
  const folderPath = path.join(__dirname, 'Files', code);
  const zipFileName = `${code}.zip`;

  const output = new streamBuffers.WritableStreamBuffer();
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();

  output.on('finish', () => {
    const zipBuffer = output.getContents();
    res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', zipBuffer.length);
    res.send(zipBuffer);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Error Occurs in App: " + err);
});
