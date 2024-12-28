import multer, { memoryStorage } from "multer";
import { S3Client } from "@aws-sdk/client-s3";

// Setup AWS S3 Client
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // },
});

// Setup Multer (use memoryStorage to handle file buffers directly)
export const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit files to 100MB each
});
