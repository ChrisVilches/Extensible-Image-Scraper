var Minio = require('minio');

var minioClient = new Minio.Client({
  endPoint: '127.0.0.1',
  port: 9000,
  secure: false,
  accessKey: process.env.minioAccessKey,
  secretKey: process.env.minioSecretKey
});

let bucketName = 'images';

minioClient.bucketExists(bucketName, function(err, exists) {
  if(err) {
    return console.log(err);
  }
  if(!exists) {
    minioClient.makeBucket(bucketName, 'us-east-1', function(err){
      if (err) throw new Error(err);
    });
  }
});

module.exports = minioClient;
