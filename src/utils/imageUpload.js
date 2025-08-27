import { uploadImageToCloudinary, uploadMultipleImagesToCloudinary, deleteImageFromCloudinary } from "./cloudinary.js";

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in Cloudinary (e.g., 'flowers', 'bouquets', 'packages')
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (file, folder = 'images') => {
    try {
        const imageUrl = await uploadImageToCloudinary(file, folder);
        return imageUrl;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files to upload
 * @param {string} folder - The folder path in Cloudinary
 * @returns {Promise<string[]>} - Array of secure URLs
 */
export const uploadMultipleImages = async (files, folder = 'images') => {
    try {
        const urls = await uploadMultipleImagesToCloudinary(files, folder);
        return urls;
    } catch (error) {
        console.error('Error uploading multiple images to Cloudinary:', error);
        throw new Error('Failed to upload images to Cloudinary');
    }
};

/**
 * Delete image from Cloudinary (if needed in the future)
 * @param {string} imageUrl - The URL of the image to delete
 */
export const deleteImage = async (imageUrl) => {
    try {
        // Extract the public ID from the Cloudinary URL
        const urlParts = imageUrl.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];

        await deleteImageFromCloudinary(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};
