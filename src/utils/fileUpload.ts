import multer from 'multer';
import { S3 } from 'aws-sdk';
import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';

// Configure AWS S3
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
  }
};

// Configure multer upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Function to upload file to S3
export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = 'general'
): Promise<string> => {
  try {
    const fileContent = file.buffer;
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

// Function to delete file from S3
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    const key = fileUrl.split('/').pop();
    if (!key) {
      throw new Error('Invalid file URL');
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
};

// Function to get signed URL for temporary access
export const getSignedUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Expires: expiresIn,
    };

    return await s3.getSignedUrlPromise('getObject', params);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
};

// Function to check if file exists in S3
export const checkFileExists = async (key: string): Promise<boolean> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    };

    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    return false;
  }
};

// Function to get file metadata from S3
export const getFileMetadata = async (key: string): Promise<S3.HeadObjectOutput> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    };

    return await s3.headObject(params).promise();
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw new Error('Failed to get file metadata');
  }
};

// Function to list files in a folder
export const listFiles = async (
  prefix: string,
  maxKeys: number = 1000
): Promise<S3.ListObjectsV2Output> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Prefix: prefix,
      MaxKeys: maxKeys,
    };

    return await s3.listObjectsV2(params).promise();
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files');
  }
};

// Function to copy file within S3
export const copyFile = async (
  sourceKey: string,
  destinationKey: string
): Promise<S3.CopyObjectOutput> => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      CopySource: `${process.env.AWS_S3_BUCKET}/${sourceKey}`,
      Key: destinationKey,
    };

    return await s3.copyObject(params).promise();
  } catch (error) {
    console.error('Error copying file:', error);
    throw new Error('Failed to copy file');
  }
};

export default {
  upload,
  uploadToS3,
  deleteFromS3,
  getSignedUrl,
  checkFileExists,
  getFileMetadata,
  listFiles,
  copyFile,
}; 