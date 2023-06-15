var express = require("express");
var router = express.Router();
var { UserClient } = require("./UserClient");
var fs = require("fs");

var prvKey = "";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.post("/", async (req, res, next) => {
  let Key = req.body.pri_key;
  prvKey = Key;
  let isCorrect = 0;
  let msg = "";
  try {
    var client = new UserClient(prvKey);
    isCorrect = 1;
    msg = "Successfully Login";
  } catch (error) {
    msg = "Invalid Key";
  }
  res.send({ privatekey: Key, done: isCorrect, message: msg });
});

router.post("/bloods", (req, res, next) => {
  //console.log("route bloods");
  let pri_key = req.body.pri_key;
  let blood_name = req.body.blood_name;
  let bloodType = req.body.blood_type;
  let acquireStatus = req.body.alloted;
  var client = new UserClient(pri_key);
  client.addblood("add", blood_name, bloodType, acquireStatus);
  res.send({ message: "Successfully Added" });
});

router.post("/acquirebloods", (req, res, next) => {
  let pri_key = req.body.pri_key;
  let blood_name = req.body.blood_name;
  console.log("route blood_name---" + blood_name);
  var client = new UserClient(pri_key);
  client.acquireblood("acquire", blood_name);
  // console.log("route acquirebloods");
  res.send({ message: "Successfully Added" });
});

router.get("/acquireblood", async (req, res) => {
  var bloodClient = new UserClient(prvKey);

  let stateData = await bloodClient.getbloodListings();
  // console.log("listings-----", stateData);
  let bloodList = [];
  let freebloodList = [];
  stateData.data.forEach(bloods => {
    if (!bloods.data) return;
    let decodedbloods = Buffer.from(bloods.data, "base64").toString();
    let bloodDetails = decodedbloods.split(",");

    bloodList.push({
      bloodName: bloodDetails[0],
      bloodType: bloodDetails[1],
      status: bloodDetails[2] == "false" ? "Free" : "Alloted"
    });

    if (bloodDetails[2] == "false") {
      freebloodList.push({
        bloodName: bloodDetails[0]
      });
    }
  });
  res.render("acquireblood", {
    listings: bloodList,
    freebloods: freebloodList
  });
});

router.get("/selectfunction", (req, res) => {
  res.render("selectfunction");
});

router.get("/createblood", async (req, res) => {
  var bloodClient = new UserClient(prvKey);
  let stateData = await bloodClient.getbloodListings();
  // console.log("stateData---", stateData);
  let bloodList = [];
  stateData.data.forEach(bloods => {
    if (!bloods.data) return;
    let decodedbloods = Buffer.from(bloods.data, "base64").toString();
    let bloodDetails = decodedbloods.split(",");

    bloodList.push({
      bloodName: bloodDetails[0],
      bloodType: bloodDetails[1],
      status: bloodDetails[2] == "false" ? "Free" : "Alloted"
    });
  });
  res.render("createblood", { listings: bloodList });
});

router.get("/viewblood", async (req, res) => {
  // console.log("inside viewblood-----");
  var bloodClient = new UserClient(prvKey);
  let stateData = await bloodClient.getEmpbloodListings();
  let empbloodList = [];
  stateData.data.forEach(bloods => {
    if (!bloods.data) return;
    let decodedbloods = Buffer.from(bloods.data, "base64").toString();
    let empbloodDetails = decodedbloods.split(",");

    empbloodList.push({
      bloodName: empbloodDetails[0],
      bloodType: empbloodDetails[1]
    });
  });
  let bloodData = await bloodClient.getbloodListings();
  let bloodList = [];
  bloodData.data.forEach(bloods => {
    if (!bloods.data) return;
    let decodedbloods = Buffer.from(bloods.data, "base64").toString();
    let bloodDetails = decodedbloods.split(",");

    if (bloodDetails[2] == "false") {
      bloodList.push({
        bloodName: bloodDetails[0],
        bloodType: bloodDetails[1]
      });
    }
  });
  res.render("viewblood", {
    empListings: empbloodList,
    bloodListings: bloodList
  });
});

module.exports = router;
