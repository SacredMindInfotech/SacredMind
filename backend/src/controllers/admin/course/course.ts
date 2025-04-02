import { Request, Response } from "express";
import prisma from "../../../PrismaClient";
import { createCourseSchema } from "../../../validations/adminRoute/createCourseSchema";
import { updateCourseSchema } from "../../../validations/adminRoute/updateCourseSchema";
import s3Client from "../../../config/s3Client";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.AWS_S3_PUBLIC_BUCKET_NAME;

export const createCourseController = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "Upload a course banner image" });
      return;
    }

    if (req.body.published) {
      req.body.published = req.body.published === "true";
    }
    if (req.body.price) {
      req.body.price = Number(req.body.price);
    }
    if (req.body.categoryId) {
      req.body.categoryId = Number(req.body.categoryId);
    }
    // Parse JSON strings back to arrays
    ["overview", "learningOutcomes", "requirements", "forwhom"].forEach(
      (field) => {
        if (req.body[field]) {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (e) {
            console.error(`Error parsing ${field}:`, e);
          }
        }
      }
    );

    const validatedData = createCourseSchema.safeParse(req.body);
    if (!validatedData.success) {
      console.log(validatedData.error.errors);
      res.status(400).json({ error: validatedData.error.errors });
      return;
    }
    const {
      title,
      description,
      price,
      categoryId,
      published,
      overview,
      learningOutcomes,
      requirements,
      forwhom,
      language,
    } = validatedData.data;

    const keySuffix = file?.originalname.split(".").pop();
    const s3FilePath = `CourseBannerImages/`;
    const imageName = title + "." + keySuffix;
    const uploadParam = {
      Bucket: bucketName,
      Key: s3FilePath + imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(uploadParam));

    const imageUrl =
      " https://sacredmind-public.s3.eu-north-1.amazonaws.com/" +
      s3FilePath +
      imageName;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        category: {
          connect: { id: categoryId },
        },
        published,
        overview,
        learningOutcomes,
        requirements,
        forwhom,
        language,
      },
    });

    res.status(201).json(course);
    return;
  } catch (e: any) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateCourseByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Course ID is required" });
      return;
    }
    const file = req.file;

    if (req.body.published) {
      req.body.published = req.body.published === "true";
    }
    if (req.body.isActive) {
      req.body.isActive = req.body.isActive === "true";
    }
    if (req.body.showCourseNotice) {
      req.body.showCourseNotice = req.body.showCourseNotice === "true";
    }
    if (req.body.price) {
      req.body.price = Number(req.body.price);
    }
    if (req.body.categoryId) {
      req.body.categoryId = Number(req.body.categoryId);
    }

    const validatedData = updateCourseSchema.safeParse(req.body);
    if (!validatedData.success) {
      console.log(validatedData.error.errors);
      res.status(400).json({ error: validatedData.error.errors });
      return;
    }

  
    const course = await prisma.course.findUnique({
      where: {
        id: Number(id),
      },
    });

    const s3FilePath = `CourseBannerImages/`;
    const keySuffix = file?.originalname.split(".").pop();
    const imageName = validatedData.data.title + "." + keySuffix;
    let imageUrl=course?.imageUrl;
    let deleteImage = false;

    if (!req.body.imageUrl && course?.imageUrl !== null) {
      const deleteParams = {
        Bucket: bucketName,
        Key: "CourseBannerImages/" + course?.imageUrl.split("/").pop(),
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
      deleteImage = true;
    }

    if (file) {
      const uploadParam = {
        Bucket: bucketName,
        Key: s3FilePath + imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParam));
      deleteImage = false;
      imageUrl =
        " https://sacredmind-public.s3.eu-north-1.amazonaws.com/" +s3FilePath +imageName;
    }

    const {
      title,
      description,
      price,
      categoryId,
      published,
      overview,
      learningOutcomes,
      requirements,
      forwhom,
      language,
      isActive,
      showCourseNotice,
      courseNotice,
    } = validatedData.data;

    // update data object with only provided fields
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = price;

    if (imageUrl) updateData.imageUrl = deleteImage ? null : imageUrl;
    
    if (categoryId) {
      updateData.category = { connect: { id: Number(categoryId) } };
    }
    if (typeof published !== "undefined") updateData.published = published;
    if (typeof isActive !== "undefined") updateData.isActive = isActive;
    if (typeof showCourseNotice !== "undefined")
      updateData.showCourseNotice = showCourseNotice;
    if (overview) updateData.overview = overview;
    if (learningOutcomes) updateData.learningOutcomes = learningOutcomes;
    if (requirements) updateData.requirements = requirements;
    if (forwhom) updateData.forwhom = forwhom;
    if (language) updateData.language = language;
    if (courseNotice) updateData.courseNotice = courseNotice;


    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json(updatedCourse);
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteCourseByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Course ID is required" });
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    })
    const keyPrefix = "CourseBannerImages/";
    const keySuffix = course?.imageUrl?.split("/").pop();
    const deleteParams = {
      Bucket: bucketName,
      Key: keyPrefix + keySuffix,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Course deleted successfully" });
    return;
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getEnrollmentsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Course ID is required" });
      return;
    }
    const enrolledUsers = await prisma.userCourse.findMany({
      where: { courseId: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const formattedUsers = enrolledUsers.map((enrollment) => ({
      id: enrollment.user.id,
      email: enrollment.user.email,
      firstName: enrollment.user.firstName,
      lastName: enrollment.user.lastName,
      role: enrollment.user.role,
      enrolledAt: enrollment.enrolledAt,
    }));

    res.status(200).json(formattedUsers);
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const addUserToCourseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    if (!courseId || !userId) {
      res.status(400).json({ error: "Course ID and User ID are required" });
      return;
    }

    // Check if the user is already enrolled in the course
    const existingEnrollment = await prisma.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId),
        },
      },
    });

    if (existingEnrollment) {
      res
        .status(400)
        .json({ error: "User is already enrolled in this course" });
      return;
    }

    // Add user to course
    await prisma.userCourse.create({
      data: {
        userId: Number(userId),
        courseId: Number(courseId),
      },
    });

    res.status(200).json({ message: "User added to course successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeUserFromCourseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    if (!courseId || !userId) {
      res.status(400).json({ error: "Course ID and User ID are required" });
      return;
    }

    // Check if the user is enrolled in the course
    const existingEnrollment = await prisma.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId),
        },
      },
    });

    if (!existingEnrollment) {
      res.status(400).json({ error: "User is not enrolled in this course" });
      return;
    }

    // Remove user from course
    await prisma.userCourse.delete({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId),
        },
      },
    });

    res.status(200).json({ message: "User removed from course successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
