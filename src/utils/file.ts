import { createWriteStream, createReadStream, unlink } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const mkdirAsync = promisify(fs.mkdir);
const rmdirAsync = promisify(fs.rmdir);

interface FileInfo {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

// Constants
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = 'uploads';

// Function to generate a unique filename
export const generateUniqueFilename = (originalname: string): string => {
  const ext = originalname.split('.').pop()?.toLowerCase() || '';
  return `${uuidv4()}.${ext}`;
};

// Function to create directory if it doesn't exist
export const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error creating directory: ${error.message}`);
    }
    throw new Error('Unknown error occurred while creating directory');
  }
};

// Function to save file
export const saveFile = async (
  file: Express.Multer.File,
  directory: string
): Promise<FileInfo> => {
  await ensureDirectoryExists(directory);

  const filename = generateUniqueFilename(file.originalname);
  const filePath = join(directory, filename);

  const writeStream = createWriteStream(filePath);
  const readStream = createReadStream(file.path);

  await new Promise((resolve, reject) => {
    readStream.pipe(writeStream);
    readStream.on('end', resolve);
    readStream.on('error', reject);
  });

  // Delete temporary file
  await fs.promises.unlink(file.path);

  return {
    filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: filePath,
  };
};

// Function to delete file
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while deleting file');
  }
};

// Function to delete directory
export const deleteDirectory = async (dirPath: string): Promise<void> => {
  try {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error deleting directory: ${error.message}`);
    }
    throw new Error('Unknown error occurred while deleting directory');
  }
};

// Function to get file extension
export const getFileExtension = (filePath: string): string => {
  return path.extname(filePath).toLowerCase();
};

// Function to check if file exists
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await statAsync(filePath);
    return true;
  } catch {
    return false;
  }
};

// Function to get file size
export const getFileSize = async (filePath: string): Promise<number> => {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error getting file size: ${error.message}`);
    }
    throw new Error('Unknown error occurred while getting file size');
  }
};

// Function to validate file type
export const isValidFileType = (filePath: string): boolean => {
  const extension = getFileExtension(filePath);
  return ALLOWED_EXTENSIONS.includes(extension);
};

// Function to validate file size
export const isValidFileSize = (
  size: number,
  maxSize: number
): boolean => {
  return size <= maxSize;
};

// Function to read file
export const readFile = async (filePath: string): Promise<Buffer> => {
  try {
    return await fs.promises.readFile(filePath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while reading file');
  }
};

// Function to write file
export const writeFile = async (filePath: string, data: string | Buffer): Promise<void> => {
  try {
    await fs.promises.writeFile(filePath, data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error writing file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while writing file');
  }
};

// Function to append to file
export const appendToFile = async (
  filePath: string,
  data: string | Buffer
): Promise<void> => {
  try {
    await fs.promises.appendFile(filePath, data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error appending to file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while appending to file');
  }
};

// Function to copy file
export const copyFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
  try {
    await fs.promises.copyFile(sourcePath, destinationPath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error copying file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while copying file');
  }
};

// Function to move file
export const moveFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
  try {
    await fs.promises.rename(sourcePath, destinationPath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error moving file: ${error.message}`);
    }
    throw new Error('Unknown error occurred while moving file');
  }
};

// Function to list directory contents
export const listDirectory = async (dirPath: string): Promise<string[]> => {
  try {
    return await fs.promises.readdir(dirPath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error listing files: ${error.message}`);
    }
    throw new Error('Unknown error occurred while listing files');
  }
};

// Function to get file stats
export const getFileStats = async (filePath: string): Promise<fs.Stats> => {
  try {
    return await fs.promises.stat(filePath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error getting file stats: ${error.message}`);
    }
    throw new Error('Unknown error occurred while getting file stats');
  }
};

// Function to create temporary file
export const createTempFile = async (
  data: string | Buffer,
  prefix: string = 'temp-',
  suffix: string = '.tmp'
): Promise<string> => {
  const tempDir = join(process.cwd(), 'temp');
  await ensureDirectoryExists(tempDir);

  const filename = `${prefix}${uuidv4()}${suffix}`;
  const filePath = join(tempDir, filename);

  await writeFile(filePath, data);
  return filePath;
};

// Function to clean up temporary files
export const cleanupTempFiles = async (
  maxAge: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<void> => {
  const tempDir = join(process.cwd(), 'temp');
  const files = await listDirectory(tempDir);
  const now = Date.now();

  for (const file of files) {
    const filePath = join(tempDir, file);
    const stats = await getFileStats(filePath);
    const age = now - stats.mtime.getTime();

    if (age > maxAge) {
      await deleteFile(filePath);
    }
  }
};

// Upload file
export const uploadFile = async (
  file: Express.Multer.File,
  directory: string
): Promise<string> => {
  try {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = join(directory, fileName);

    const writeStream = createWriteStream(filePath);
    const readStream = createReadStream(file.path);

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream);
      readStream.on('end', resolve);
      readStream.on('error', reject);
    });

    // Delete temporary file
    await fs.promises.unlink(file.path);

    return fileName;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Validate file type
export const validateFileType = (file: Express.Multer.File): boolean => {
  return ALLOWED_EXTENSIONS.includes(file.mimetype);
};

// Validate file size
export const validateFileSize = (file: Express.Multer.File): boolean => {
  return file.size <= MAX_SIZE;
};

// Generate file name
export const generateFileName = (originalName: string): string => {
  const extension = getFileExtension(originalName);
  return `${uuidv4()}.${extension}`;
};

// Get file path
export const getFilePath = (fileName: string, directory: string): string => {
  return join(directory, fileName);
};

// Get file URL
export const getFileUrl = (fileName: string, directory: string): string => {
  return `${process.env.API_URL}/uploads/${directory}/${fileName}`;
};

// Upload image
export const uploadImage = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds limit');
  }

  return uploadFile(file, 'images');
};

// Upload document
export const uploadDocument = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds limit');
  }

  return uploadFile(file, 'documents');
};

// Upload video
export const uploadVideo = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds limit');
  }

  return uploadFile(file, 'videos');
};

// Upload audio
export const uploadAudio = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds limit');
  }

  return uploadFile(file, 'audio');
};

// Upload restaurant image
export const uploadRestaurantImage = async (
  file: Express.Multer.File,
  restaurantId: string
): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds limit');
  }

  const directory = join('restaurants', restaurantId);
  return uploadFile(file, directory);
};

// Upload menu item image
export const uploadMenuItemImage = async (
  file: Express.Multer.File,
  restaurantId: string,
  menuItemId: string
): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds limit');
  }

  const directory = join('restaurants', restaurantId, 'menu', menuItemId);
  return uploadFile(file, directory);
};

// Upload user avatar
export const uploadUserAvatar = async (
  file: Express.Multer.File,
  userId: string
): Promise<string> => {
  if (!validateFileType(file)) {
    throw new Error('Invalid file type');
  }

  if (!validateFileSize(file)) {
    throw new Error('File size exceeds limit');
  }

  const directory = join('users', userId);
  return uploadFile(file, directory);
};

export const getMaxFileSize = (): number => {
  return MAX_SIZE;
};

export const getUploadDirectory = (): string => {
  return UPLOAD_DIR;
};

export default {
  generateUniqueFilename,
  ensureDirectoryExists,
  saveFile,
  deleteFile,
  deleteDirectory,
  getFileExtension,
  fileExists,
  getFileSize,
  isValidFileType,
  isValidFileSize,
  readFile,
  writeFile,
  appendToFile,
  copyFile,
  moveFile,
  listDirectory,
  getFileStats,
  createTempFile,
  cleanupTempFiles,
  uploadFile,
  validateFileType,
  validateFileSize,
  generateFileName,
  getFilePath,
  getFileUrl,
  uploadImage,
  uploadDocument,
  uploadVideo,
  uploadAudio,
  uploadRestaurantImage,
  uploadMenuItemImage,
  uploadUserAvatar,
  getMaxFileSize,
  getUploadDirectory,
}; 