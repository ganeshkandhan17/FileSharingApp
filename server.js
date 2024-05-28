const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const bodyparser = require("body-parser");
const express = require("express");
const {get4id, uid, getdate, gettime } = require("./methods");
const multer=require("multer");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
app.use("/public",express.static(path.join(__dirname,"public")))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
let log = (name,dir)=> {
    console.log("File Uploaded")
    fs.appendFile(
      path.join(__dirname, "log.txt"),
      `${name} \t \t \t \t \t \t./Files/${dir}\t ${getdate()} \t ${gettime()} \t ${uid()} \n`,
      (err) => {
        if (err) throw err;
      }
    );
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, (err) => {
  if (err) throw err;
  else {
    console.log(`Application Running at PORT = ${port}`);
  }
});
let n=get4id()
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    if(!fs.existsSync(path.join(__dirname,"Files"))){
      fs.mkdirSync(path.join(__dirname,"Files"))
    }
    if(!fs.existsSync(path.join(__dirname,"Files",n))){
      fs.mkdirSync(path.join(__dirname,"Files",n))
    }
    cb(null,path.join(__dirname,"Files",n))
  },
  filename: (req, file, cb) => {
    log(file.originalname,n)
    cb(null, file.originalname);
  },
});
let upload=multer({storage : storage})
app.post("/upload",upload.array("files"),(req,res)=>{
  let n=get4id()
})

process.on("uncaughtException", (err) => {
  console.log("Error Occurs in App: " + err);
});
