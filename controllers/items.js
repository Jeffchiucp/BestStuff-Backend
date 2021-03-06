//var router = express.Router({mergeParams: true});

var db = require('../models')
var Upload = require('s3-uploader')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

var client = new Upload('my_s3_bucket', {
  aws: {
    path: 'assets/img/',
    region: 'us-west-1',
    acl: 'public-read'
  },

  cleanup: {
    versions: true,
    original: false
  },

  original: {
    awsImageAcl: 'private'
  },

  versions: [{
    maxHeight: 1040,
    maxWidth: 1040,
    format: 'jpg',
    suffix: '-large',
    quality: 80,
    awsImageExpires: 31536000,
    awsImageMaxAge: 31536000
  },{
    maxWidth: 780,
    aspect: '3:2!h',
    suffix: '-medium'
  },{
    maxWidth: 320,
    aspect: '16:9!h',
    suffix: '-small'
  },{
    maxHeight: 100,
    aspect: '1:1',
    format: 'png',
    suffix: '-thumb1'
  },{
    maxHeight: 250,
    maxWidth: 250,
    aspect: '1:1',
    suffix: '-thumb2'
  }]
});

module.exports = (app) => {

  // INDEX
  app.get('/items', (req, res) => {
    res.json({message: "Success"})
  });
  // SHOW
  app.get('/items/:id', (req, res) => {
    res.json({message: "Success"})
    const itemId = req.params.id;
    db.Item.findById(itemId).then((item) => {
      res.json(item);
    });
  });

  // CREATE
  app.post('/items/create', (req, res) => {
    console.log("HERE IS THE BODY", req.body)

    db.Item.create(req.body).then((item) => {
      res.json({msg: 'successfully added', item});
    }).catch((err) => {
      if (err) {
        res.json(err);
      }
    })
  });

  // PHOTO TEST
  app.post('/photo/create', upload.single('photoUpload'), (req, res) => {

    // check if there is a photo in the request (via multer)
    // if there is a photo, upload it to AWS

    client.upload('/some/image.jpg', {}, function(err, versions, meta) {
      if (err) { throw err; }

      return new Promise((resolve, reject) => {
        resolve()
      })
      versions.forEach(function(image) {
        console.log(image.width, image.height, image.url);
        // 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg
      });
    });

  })

  // UPDATE
  app.put('/items/:id/edit', (req, res) => {
    const itemId = req.body.params;
    db.Item.update(itemId).then((item) => {
      res.json(200);
      res.json({msg: 'successfully updated', item});
    }).catch((err) => {
      if(err) {
        res.json(err)
      }
    });
  });


  // DESTROY
  app.delete('/items/:id', (req, res) => {
    const itemId = req.body.params;
    db.Item.destroy(itemId).then((item) => {
      res.status(200);
      res.json({msg: 'successfully deleted', item});
    }).catch((err) => {
      if (err) {
        res.json(err);
      }
    });
  });

  //VOTE UP
  app.post('items/:id/vote-up', function (req, res) {
    if( !req.user ) {
      console.log('Sign in to vote!');
      res.status(400).send('User is not signed in')
    }else {
      db.Item.findById(req.params.id).then(function (err, item) {
        console.log("Upvoat uId:", req.user.id);
        res.status(200).send('Vote was send successfully!!')
      }).catch((err) => {
        console.log("Upvote error:", err.message);
        res.status(400).send(err.message)
      })
    }
  });
  //
  // // VOTE DOWN
  // app.put('items/:id/vote-down', function (req, res) {
  //     db.Item.findById(req.params.id).exec(function (err, item) {
  //
  //       item.downVote.push(req.params._id);
  //       item.voteScore = post.voteTotal - 1;
  //
  //       res.status(200);
  //       console.log("User voted down on item");
  //
  //     })
  // });
};
