
import multer from "multer";

const storage = multer.memoryStorage()
export const uploadS3 = multer({ storage: storage })