import { createWriteStream } from "fs";
import { mkdir, unlink } from "fs/promises";
import { FileUpload } from "graphql-upload";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = "uploads";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class ImageService {
  static async ensureUploadDir() {
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      console.error("Error creating upload directory:", error);
    }
  }

  static async validateImage(file: FileUpload): Promise<void> {
    const { mimetype, createReadStream } = await file;

    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG and WebP are allowed.",
      );
    }

    const stream = createReadStream();
    let size = 0;

    for await (const chunk of stream) {
      size += chunk.length;
      if (size > MAX_FILE_SIZE) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }
    }
  }

  static async uploadImage(file: FileUpload): Promise<string> {
    await this.validateImage(file);
    await this.ensureUploadDir();

    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    return new Promise((resolve, reject) => {
      const stream = createReadStream();
      const writeStream = createWriteStream(filePath);

      stream
        .pipe(writeStream)
        .on("finish", () => {
          const url = `/uploads/${uniqueFilename}`;
          resolve(url);
        })
        .on("error", reject);
    });
  }

  static async uploadMultipleImages(files: FileUpload[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  static async deleteImage(url: string): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), url);
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
}
