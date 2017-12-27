module.exports = {
  s3Options: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET
  }
};
