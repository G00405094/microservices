let express = require('express');
let router = express.Router();

let Mongoose = require('mongoose').Mongoose;
let Schema = require('mongoose').Schema;

let oldMong = new Mongoose();
oldMong.connect('mongodb://127.0.0.1:27017/db');

let cvSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  education: String,
  experience: String,
  skills: String,
}, { collection: 'userInfo' });

let cv = oldMong.model('cv', cvSchema);

// Admin server page
router.get('/', async function (req, res, next) {
  res.render('index');
});




// Crud
router.post('/createCV', async function (req, res, next) {
  try {
    const result = await cv.create(req.body); // Await the Mongoose create operation
    res.json({ response: "success", id: result._id }); // Respond with success and the created document ID
  } catch (err) {
    console.error("Error creating CV:", err); // Log the error
    res.status(500).json({ response: "fail", error: err.message }); // Send error response
  }
});


// cRud   Should use GET . . . we'll fix this is Cloud next term
router.post('/readCV', async function (req, res, next) {
  let data;
  if (req.body.cmd == 'all') {
    data = await cv.find().lean()
  }
  else {
    data = await cv.find({ _id: req.body._id }).lean()
  }
  res.json({ cv: data });
})

// crUd   Should use PUT . . . we'll fix this is Cloud next term
router.post('/updateCV', async function (req, res, next) {
  let retVal = { response: "fail" }
  await cv.findOneAndUpdate({ _id: req.body._id }, req.body,
    function (err, res) {
      if (!err) {
        retVal = { response: "success" }
      }
    }
  )
  res.json(retVal);
});

// cruD   Should use DELETE . . . we'll fix this is Cloud next term
router.post('/deleteCV', async function (req, res, next) {
  let retVal = { response: "fail" }
  await cv.deleteOne({ _id: req.body._id },
    function (err, res) {
      if (!err) {
        retVal = { response: "success" }
      }
    }
  )
  res.json(retVal);
});





router.post('/getCV', async function (req, res, next) {
  const cv = await getCv();
  res.json(cv);
});

async function getCv() {
  data = await cv.find().lean();
  return { cv: data };
}

router.post('/saveCv', async function (req, res, next) {
  const cv = await saveCv(req.body);
  res.json(cv);
});

async function saveCv(theCv) {
  console.log('theCv: ' + theCv);
  await cv.create(theCv,
    function (err, res) {
      if (err) {
        console.log('Could not insert new cv')
        return { saveCvResponse: "fail" };
      }
    }
  )
  return { saveCvResponse: "success" };
}

module.exports = router;