const aws                       = require('aws-sdk');
const s3Config                  = require('../config/s3')

/*
 * Respond to POST requests to /signed-request.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the file.
 *
 */
module.exports.getUrl = function(req, res) {
  const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: s3Config.region // Change for your Region, check inside your browser URL for S3 bucket ?region=...
  });
  const userId = (process.env.NODE_ENV === 'development') ? 'tmp' : req.body.userId
  const fileName = req.body.file;
  const fileCategory = req.body.category;
  const fileType = req.body.type;
  const s3Params = {
    Bucket: s3Config.bucket,
    Key: `${userId}/${fileCategory}/${fileName}`,
    Expires: 60,
    ContentType: fileType,
    ACL: 'private'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      return res.status(500).json(err);
    }

    const response = {
      signedRequest: data,
      url: `https://s3.${s3Config.region}.amazonaws.com/${s3Config.bucket}/${userId}/${fileCategory}/${fileName}`
    };
    return res.status(200).json(response);
  });
};
