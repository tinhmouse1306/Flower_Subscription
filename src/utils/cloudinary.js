// Cloudinary configuration and utilities
import { Cloudinary } from '@cloudinary/url-gen';
import { cloudinaryConfig } from '../config/cloudinary.config.js';

// Initialize Cloudinary
export const cld = new Cloudinary({
    cloud: {
        cloudName: cloudinaryConfig.cloud_name
    }
});

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file, folder = 'flowers') => {
    try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.upload_preset);
        formData.append('folder', folder);

        // Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.secure_url; // Return the secure URL
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

// Upload multiple images to Cloudinary
export const uploadMultipleImagesToCloudinary = async (files, folder = 'flowers') => {
    try {
        const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Error uploading multiple images to Cloudinary:', error);
        throw new Error('Failed to upload images to Cloudinary');
    }
};

// Delete image from Cloudinary (if needed)
export const deleteImageFromCloudinary = async (publicId) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = generateSignature(publicId, timestamp);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/destroy`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    signature: signature,
                    api_key: cloudinaryConfig.api_key,
                    timestamp: timestamp,
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Delete failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};

// Generate signature for delete operation (if needed)
const generateSignature = (publicId, timestamp) => {
    // This would require a backend endpoint to generate the signature securely
    // For now, we'll return a placeholder
    return 'signature-placeholder';
};

// Transform image URL for different sizes/qualities
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
    const {
        width = 'auto',
        height = 'auto',
        quality = 'auto',
        format = 'auto',
        crop = 'fill'
    } = options;

    if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
        return originalUrl;
    }

    // Add transformation parameters to the URL
    const baseUrl = originalUrl.split('/upload/')[0] + '/upload/';
    const imagePath = originalUrl.split('/upload/')[1];

    const transformations = [
        `w_${width}`,
        `h_${height}`,
        `q_${quality}`,
        `f_${format}`,
        `c_${crop}`
    ].join(',');

    return `${baseUrl}${transformations}/${imagePath}`;
};

// Get thumbnail URL
export const getThumbnailUrl = (originalUrl, size = 150) => {
    return getOptimizedImageUrl(originalUrl, {
        width: size,
        height: size,
        crop: 'fill'
    });
};

// Get medium size URL
export const getMediumUrl = (originalUrl, width = 400) => {
    return getOptimizedImageUrl(originalUrl, {
        width: width,
        height: 'auto',
        crop: 'scale'
    });
};

// Get large size URL
export const getLargeUrl = (originalUrl, width = 800) => {
    return getOptimizedImageUrl(originalUrl, {
        width: width,
        height: 'auto',
        crop: 'scale'
    });
};

export default {
    uploadImageToCloudinary,
    uploadMultipleImagesToCloudinary,
    deleteImageFromCloudinary,
    getOptimizedImageUrl,
    getThumbnailUrl,
    getMediumUrl,
    getLargeUrl,
    cld
};
