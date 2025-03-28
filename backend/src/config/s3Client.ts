import { S3Client } from "@aws-sdk/client-s3"

const region = process.env.AWS_S3_BUCKET_REGION
const accessKeyId = process.env.AWS_S3_ACCESS_KEY
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region: region!,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!
  }
})

export default s3Client;