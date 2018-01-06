//*------------------UPLOAD IMAGE------------------*//
const express = require('express');
const app = express();
const knox = require('knox');
const config = require('./config/config.json');
const fs = require('fs');
let secrets; //these are for the amazon thing...

//*------------------AWS CLIENT------------------*//
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./config/secrets.json');
}

const client = knox.createClient({
    key: secrets.awsKey,
    secret: secrets.awsSecret,
    bucket: 'imgboard-anne-sp'
});

//*------------------UPLOAD TO AWS------------------*//
module.exports.upload = function(file) {
    return new Promise(function(resolve, reject) {
        const s3Request = client.put(file.filename, {
            'Content-Type': file.mimetype,
            'Content-Length': file.size,
            'x-amz-acl': 'public-read'
        });
        const readStream = fs.createReadStream(file.path);
        readStream.pipe(s3Request);
        s3Request.on('response', s3Response => {
            const wasSuccessful = s3Response.statusCode == 200;
            if (wasSuccessful) {
                resolve()
            }
            else {
                s3Response.statusCode == 404; 
                reject()
            }
        })
    })
}
