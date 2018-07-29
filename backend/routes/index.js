const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const download = require('download');
const sharp = require('sharp');

const ImageScraper = require('../scrapers/ImageScraper');
const OgImage = require('../scrapers/OgImage');
const AppleTouchIcon = require('../scrapers/AppleTouchIcon');
const AllImages = require('../scrapers/AllImages');
const TwitterIcon = require('../scrapers/TwitterIcon');
const Favicon = require('../scrapers/Favicon');

const { forkJoin, from, of } = require('rxjs');
const { mergeMap } = require('rxjs/operators');

var minioClient = require('../minio');
var util = require('../util');


let imageScraper = new ImageScraper();

imageScraper.addScraper([
  new OgImage(),
  new AppleTouchIcon(),
  new AllImages(),
  new TwitterIcon(),
  new Favicon()
]);


async function getImages(site) {

  let res = await fetch(site).catch(err => { throw new Error(err); });
  let body = await res.text();

  let imgs = imageScraper.getImages({
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

    let scrapImage$ = from(getImages(res.locals.url));

    const pickFeatured$ = scrapImage$.pipe(
      mergeMap(val => res.locals.save? pushImage(selectFeaturedImage(val)) : of(null))
    );

    forkJoin(scrapImage$, pickFeatured$).subscribe(r => {

      let images = r[0];
      let featured = r[1];
      let descriptions = {};

      Object.keys(images).map(k => {
        descriptions[k] = imageScraper.getScraperDescription(k) || null;
      });

      let result = { images, descriptions };
      if(featured) result.featured = `${req.protocol}://${req.get('host')}/img/${featured.objectName}.${featured.ext}`;

      res.status(200).json(result);
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


router.get('/active_scrapers', function(req, res){

  let info = imageScraper.getScrapersInfo();

  return res.status(200).json({
    scrapers: info
  });
});


module.exports = router;
