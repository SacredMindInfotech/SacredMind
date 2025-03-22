import { Request, Response } from "express";
import prisma from "../../PrismaClient";
import axios from "axios";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import dotenv from "dotenv";

dotenv.config();

export const getContentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        modules: {
          orderBy: { serialNumber: "asc" },
          include: {
            topics: {
              orderBy: { serialNumber: "asc" },
              include: {
                contents: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(course);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};


const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID;
const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
);

export const getContentByKeyController=async(req:Request,res:Response)=>{
  try{
    const {filePath}=req.query;
    if(!filePath){
      res.status(400).json({message:"File path is required"});
      return;
    }
    if (!CLOUDFRONT_DOMAIN || !CLOUDFRONT_KEY_PAIR_ID || !CLOUDFRONT_PRIVATE_KEY) {
      throw new Error("Missing CloudFront environment variables");
    }

    const signedUrl = generateSignedUrl(filePath as string);

    const response = await axios.get(signedUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Cache-Control", "no-store"); // Ensures users can't cache the content
    res.setHeader("Content-Disposition", `inline; filename="${filePath}"`);

    // @ts-ignore
    response.data.pipe(res);

  }
  catch(error){
    console.error("Error streaming file:", error);
    res.status(500).json({ error: "Failed to stream file" });
    return;
  }
}


const generateSignedUrl = (filePath: string, expiresInSeconds = 36000) => {
  const expiresAt = new Date(
    Math.floor(Date.now()) + expiresInSeconds
  ).toISOString();

  const signedUrl = getSignedUrl({
    keyPairId: CLOUDFRONT_KEY_PAIR_ID as string,
    privateKey: CLOUDFRONT_PRIVATE_KEY as string,
    url: `${CLOUDFRONT_DOMAIN}/${filePath}`,
    dateLessThan: expiresAt,
  });

  return signedUrl;
};