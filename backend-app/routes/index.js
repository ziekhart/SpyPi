const express = require("express");
const axios = require("axios");
const ArData = require("../models/arData");
const router = express.Router();
const exec = require("child_process").exec;
const fs = require("fs");

router.get("/images", function(req, res) {
  fs.readdir('/home/pi/Documents/SpyPi/backend-app/images', (err, files) => {
    res.json(files);
  });
});

router.use('/image', express.static('/home/pi/Documents/SpyPi/backend-app/images'));

router.get("/data", function(req, res) {
  ArData.find()
    .sort({ _id: -1 })
    .limit(100)
    .exec((err, data) => {
      res.json(data);
    });
});

router.post("/data", function(req, res) {
  const d = new ArData();
  const data = req.body.data.split(",");
  d.movementSensed = data[0] === "true";
  d.temperature = data[1];
  d.humidity = data[2];
  d.timeStamp = new Date();
  if (d.movementSensed) {
    var yourscript = exec(
      "cd ./routes chmod u+x af.sh && sh af.sh",
      (error, stdout, stderr) => {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
      }
    );
  }
  d.save((err, ardata) => {
    if (err) return console.error(err);
  });
  res.send(true);
});

module.exports = router;
