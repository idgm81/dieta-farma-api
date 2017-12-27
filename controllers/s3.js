const aws                       = require('aws-sdk');
const s3Config                  = require('../config/s3')

/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */

aws.config.update(s3Config.s3Options)

module.exports.getUrl = function(req, res) {

/*
 * Respond to POST requests to /signed-request.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the file.
 */

  const s3 = new aws.S3();
  const fileName = req.body.file;
  const fileCategory = req.body.category;
  const fileType = req.body.type;
  const s3Params = {
    Bucket: s3Config.s3Options.bucket,
    Key: `${fileCategory}/${fileName}`,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      return res.status(500).json(err);
    }
    const returnData = {
      signedRequest: data,
      url: `https://s3.${s3Config.s3Options.region}.amazonaws.com/${s3Config.s3Options.bucket}/${fileCategory}/${fileName}`
    };
    return res.status(200).json(returnData);
  });
};
