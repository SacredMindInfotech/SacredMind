import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  },
});
//key : moon-future-5k-1920x1080-16999.jpg
export const getObjectUrlByKey = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: "sacredmind-private",
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
  return url;
};
async function printURL() {
  const url = await getObjectUrlByKey("moon-future-5k-1920x1080-16999.jpg");
  console.log(url);
}
printURL();
