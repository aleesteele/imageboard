//*------------------MIDDLEWARE + SETUP------------------*//
const spicedPg = require('spiced-pg');
const db = process.env.DATABASE_URL || spicedPg(`postgres:postgres:postgrespsql@localhost:5432/imageboard`);
const s3Url = require('./config.json'); //verification of config

//*------------------GET ALL IMAGES------------------*//
module.exports.getImages = function() {
    const query = `
        SELECT * FROM images
        ORDER BY created_at DESC`;
    return db.query(query).then((results) => {
       return results.rows; //returning results!!
   }).catch((err) => { console.log('ERR WITH GETIMAGES', err); });
}

//*------------------UPLOAD IMAGE------------------*//
module.exports.uploadImage = function(image, username, title, description) {
    const query = `
        INSERT INTO images (image, username, title, description)
        VALUES ($1, $2, $3, $4)`
    const params = [image, username, title, description]
    return db.query(query, params).then((results) => {
        // console.log('RESULTS OF UPLOADIMAGE', results.rows)
        return results.rows //returning back image upload stuff!
    }).catch((err) => { console.log('ERR WITH UPLOADIMAGES', err) });
}

//*------------------GET SINGLE IMAGE------------------*//
module.exports.getSingleImage = function(imageId) {
    const query = `
        SELECT id, image, username, title, description
        FROM images
        WHERE id = $1`
    const params = [ imageId ]
    return db.query(query, params).then((results) => {
        console.log('RESULTS OF GETSINGLEIMG DB.JS', results.rows)
        return results.rows
    }).catch((err) => { console.log('ERR WITH GETSINGLEIMAGE', err) })
}

//*------------------ADD COMMENT------------------*//
module.exports.addComment = function(imageId, username, comment) {
    const query = `
        INSERT INTO comments (image_id, username, comment)
        VALUES ($1, $2, $3)`
    const params = [ imageId, username, comment ]
    return db.query(query, params).then((results) => {
        // console.log('RESULTS OF UPLOADCOMMENT results', results)
        // console.log('RESULTS OF UPLOADCOMMENT results.rows', results.rows)
        // console.log('RESULTS OF UPLOADCOMMENT results.rows[0]', results.rows[0])
        return results.rows
    }).catch((err) => { console.log('ERR WITH UPLOADCOMMENT', err) })
}

//*------------------SHOW COMMENTS------------------*//
module.exports.getComments = function(imageId) {
    const query = `
        SELECT * FROM comments
        WHERE image_id = $1
        ORDER BY created_at DESC`
    const params = [ imageId ]
    return db.query(query, params).then((results) => {
        console.log('RESULTS OF GETCOMMENTS DB.JS', results.rows)
        return results.rows;
    }).catch((err) => { console.log('ERR WITH GETCOMMENTS DB.JS', err) })
}
