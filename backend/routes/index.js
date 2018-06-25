const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const download = require('download');
const sharp = require('sharp');

const ImageScrapper = require('../scrappers/ImageScrapper');
const OgImage = require('../scrappers/OgImage');
const AppleTouchIcon = require('../scrappers/AppleTouchIcon');
const AllImages = require('../scrappers/AllImages');
const TwitterIcon = require('../scrappers/TwitterIcon');
const Favicon = require('../scrappers/Favicon');

var minioClient = require('../minio');
var util = require('../util');


let imageScrapper = new ImageScrapper();

imageScrapper.addScrapper([
  new OgImage(),
  new AppleTouchIcon(),
  new AllImages(),
  new TwitterIcon(),
  new Favicon()
]);


async function getImages(site) {

  let res = await fetch(site).catch(err => { throw new Error(err); });
  let body = await res.text();

  let imgs = imageScrapper.getImages({
    body: body,
    fullUrl: site
  });

  return imgs;
}


function selectFeaturedImage(imgs){
  //return imgs.favicon;
  return imgs.allImages[0];
}


async function pushImage(imgUrl){

  let objectName = util.getNow() + imgUrl.length + Math.abs(util.hashCode(imgUrl)) + Math.round(Math.random() * 1000000000);

  let downloadedImageBuffer = await download(imgUrl);

  // "This module supports reading JPEG, PNG, WebP, TIFF, GIF and SVG images."
  // From: http://sharp.pixelplumbing.com/en/stable/
  let convertedImageBuffer = await sharp(downloadedImageBuffer).resize(200).jpeg().toBuffer();

  let etag = await minioClient.putObject('images', `${objectName}.jpg`, convertedImageBuffer, { 'Content-Type': 'image/jpeg' });

  return {
    etag,
    objectName,
    ext: 'jpg'
  };

}


router.get('/',

  function(req, res, next){

    let url = req.query.url;
    if(!url){
      return next({ message: "Needs an URL", status: 400 });
    }

    res.locals.url = url.trim();
    res.locals.save = req.query.save && req.query.save.toLocaleLowerCase() === "true";

    next();

  },

  function(req, res, next){

    let promise;

    if(!res.locals.save){

      promise = getImages(res.locals.url)

      .then(imgs => {
        return res.status(200).json(imgs);
      });

    } else {

      // Scrap images
      promise = getImages(res.locals.url)

      // Select one image
      .then(selectFeaturedImage)

      // Upload image
      .then(pushImage)

      .then(data => {
        res.status(200).json({
          imageUrl: `${req.protocol}://${req.get('host')}/img/${data.objectName}.${data.ext}`,
          etag: data.etag
        });
      });
    }

    promise.catch(err => {
      err.message = err.message || "Error (GET images route)";
      err.status = err.status || 400;
      next(err);
    });

  }
);


router.get('/img/:objectName', function(req, res, next){

  let objectName = req.params.objectName || null;

  if(objectName == null) next({ message: "URL parameter missing", status: 404 });

  objectName = objectName.trim();

  minioClient.statObject('images', objectName)
  .then(response => {
    res.set({
      'Content-Type': response.metaData['content-type']
    });
  })
  .then(() => minioClient.getObject('images', objectName))
  .then(dataStream => {

    dataStream.on('data', function(chunk){
      res.write(chunk);
    })
    dataStream.on('end', function(){
      return res.end();
    });
    dataStream.on('error', function(err){
      throw err;
    });

  })
  .catch(next);

});


router.get('/active_scrappers', function(req, res){

  let info = imageScrapper.getScrappersInfo();

  return res.status(200).json({
    scrappers: info
  });
});


module.exports = router;
