//*------------------INSTALL MIDDLEWARE------------------*//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//*------------------MAKE STATIC PAGES------------------*//
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

//*------------------OTHER MODULES------------------*//
const db = require('./config/db');
const s3 = require('./s3');

//*------------------DISK STORAGE------------------*//
const diskStorage = multer.diskStorage({ //
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads'); //add uploading file to uploads...
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) { //makes code of 24 characters
          callback(null, uid + path.extname(file.originalname)); //gets code + ext name (i.e. .jpg, etc)
      });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//*------------------MAIN PAGE------------------*//
app.get('/', (req,res) => { //this loads the page
    res.sendFile(__dirname + '/public/index.html');
})

//*------------------DISPLAY IMAGES------------------*//
app.get('/images', (req, res) => {
    return db.getImages().then((results) => {
        // console.log('RESULTS FROM GETIMAGES, SERVER.JS', results)
        res.json(results); // "res.json is deprecated in a favour of res.status().json()"
    }).catch((err) => {
        console.log('ERR WITH GETIMAGES', err)
    })
});


//*------------------UPLOAD IMAGES------------------*//
app.post('/upload', uploader.single('file'), (req, res) => {
    console.log(req.file);
    console.log(typeof req.file);
    console.log(req.body);
    if (req.file) {
        // console.log('trying to upload req.file SUCCESS', req.file);
        s3.upload(req.file).then(() => { //uploading to amazon
            db.uploadImage(req.file.filename, req.body.username, req.body.title, req.body.description)
            console.log('yay it has been uploaded!!!!!!!!')
            res.redirect('/#/'); //REDIRECT PAGE!!!!!!!!!!!!!!!!!
        }).catch((err) => { console.log('ERR IN UPLOAD TO AWS', err) })
    } else {
        console.log('trying to upload req.file FAIL', req.file)
        res.json({
            success: false
        });
    }
});

//*------------------SHOW SINGLE IMAGE WITH COMMENTS------------------*//
app.get('/singleImage/:imageId', (req, res, next) => { //requested from script/controller
    console.log('REQ.PARAMS!!!!', req.params.imageId)
    const imageId = req.params.imageId;
    Promise.all([
        db.getSingleImage(req.params.imageId),
        db.getComments(req.params.imageId).then((results) => {
            console.log('RESULTS OF GETCOMMENTS SERVER.JS', results);
            // console.log('RESULTS OF GETCOMMENTS.ROWS SERVER.JS', results.rows)
            return results;})
    ]).then((results) => {
        return res.json(results);
        res.redirect('/#/'); //REDIRECT PAGE!!!!!!!!!!!!!!!!!
        // if ($scope.images)
    }).catch((err) => { console.log('ERR WITH PROMISE.ALL', err); })
    //     res.json(results);
    //     next();
    //     return db.getComments(imageId).then((results) => {
    //         console.log('RESULTS FROM COMMENTS, SERVER.JS', results);
    //         res.json(results);
    //     }).catch((err) => { console.log('ERR WITH GETCOMMENTS SERVER.JS', err) })
    // }).catch((err) => { console.log('ERR WITH GETSINGLEIMAGE SERVER.JS', err) });
    // console.log('this is also imageid', imageId)
    // Promise.all([
    //     db.getSingleImage(req.params.imageId),
    //     db.getComments(req.params.imageId)
    // ]).then((results) => {
    //     res.json(results);
    // })
});

app.post('/singleImage/:imageId', (req, res) => {
    var imageId = req.params.imageId;
    var username = req.body.username;
    var comment = req.body.comment;
    console.log('USERID', imageId, 'USERNAME', username, 'COMMENT', comment) //not showing
    return db.addComment(imageId, username, comment).then((results) => {
        console.log('results', results)
        return;
        // res.json(results);
    }).catch((err) => { console.log('ERR WITH ADDCOMMENT', err)})
})
// app.listen(process.env.PORT || 8080);
app.listen(process.env.PORT || 8080, () => console.log("I'm listening on port 8080."));
