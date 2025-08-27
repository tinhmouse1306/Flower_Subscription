import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";
import app, { storage } from "./firebase.js";

/**
 * Upload image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'flowers', 'bouquets', 'packages')
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImage = async (file, folder = 'images') => {
    try {
        // Ensure authenticated session for write rules if required
        try {
            const auth = getAuth(app);
            if (!auth.currentUser) {
                await signInAnonymously(auth);
            }
        } catch (authErr) {
            // Continue if rules are public; log for debugging
            console.warn('Firebase anonymous auth not available:', authErr?.message);
        }
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `${folder}/${timestamp}_${file.name}`;

        // Create a reference to the file location
        const storageRef = ref(storage, fileName);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {string} folder - The folder path in storage
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleImages = async (files, folder = 'images') => {
    try {
        const uploadPromises = files.map(file => uploadImage(file, folder));
        const downloadURLs = await Promise.all(uploadPromises);
        return downloadURLs;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw new Error('Failed to upload images');
    }
};

/**
 * Delete image from Firebase Storage (if needed in the future)
 * @param {string} imageUrl - The URL of the image to delete
 */
export const deleteImage = async (imageUrl) => {
    try {
        // Extract the file path from the URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0];

        // Create a reference to the file
        const storageRef = ref(storage, fileName);

        // Delete the file
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
};
