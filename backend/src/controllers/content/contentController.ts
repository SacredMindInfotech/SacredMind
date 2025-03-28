import { Request, Response } from "express";
import prisma from "../../PrismaClient";
import {
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import s3Client from "../../config/s3Client";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_S3_BUCKET_NAME;

export const createContentController = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const { name, type, courseName } = req.body;

    const s3FilePath = `courses/${courseName}/`;
    const file = req.file;
    const keySuffix = file?.originalname.split(".").pop();
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const fileName = name + "." + keySuffix;
    const uploadParam = {
      Bucket: bucketName,
      Key: s3FilePath + fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(uploadParam));

    const key = `courses/${courseName}/${fileName}`;
    const content = await prisma.content.create({
      data: {
        name,
        type,
        key,
        topic: {
          connect: {
            id: parseInt(topicId),
          },
        },
      },
    });
    res.status(201).json({ message: "Content added successfully", content });
    return;
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateContentByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { contentId } = req.params;
    const { name, courseName, key } = req.body;

    const keySuffix = key.split(".")[1];

    const copyParams = {
      Bucket: bucketName,
      //from where to copy the item -  this need bucket name in path
      CopySource: `${bucketName}/${key}`,
      //to where to copy the item - this dont need bucket name in path
      Key: `courses/${courseName}/${name}.${keySuffix}`,
    };

    await s3Client.send(new CopyObjectCommand(copyParams));

    // Delete the old object
    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Update the content's key in the database
    const content = await prisma.content.update({
      where: { id: parseInt(contentId) },
      data: {
        name,
        key: `courses/${courseName}/${name}.${keySuffix}`,
      },
    });

    res.status(200).json(content);
    return;
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteContentByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { contentId } = req.params;
    const { key } = req.query;

    // Delete the file from S3 bucket
    const deleteParams = {
      Bucket: bucketName,
      Key: key as string,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    await prisma.content.delete({ where: { id: parseInt(contentId) } });
    res.status(200).json({ message: "Content deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
