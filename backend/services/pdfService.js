import pdf from 'pdf-parse';
import cloudinary from '../config/cloudinary.js';

class PDFService {
  async extractText(buffer) {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async uploadToCloudinary(buffer, filename) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'research-papers',
          public_id: `paper_${Date.now()}_${filename}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              cloudinaryId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  async deleteFromCloudinary(cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(cloudinaryId, { resource_type: 'raw' });
      return true;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return false;
    }
  }
}

export default new PDFService();
