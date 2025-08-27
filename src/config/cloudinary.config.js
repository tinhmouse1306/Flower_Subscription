// Cloudinary configuration
export const cloudinaryConfig = {
    // Your actual Cloudinary credentials
    cloud_name: 'ds7hzpmed',
    api_key: '141368458813151',
    api_secret: '1lT-dul1f0HuhtHsxskn-dvCEBs',
    upload_preset: 'flower_subscription' // You need to create this upload preset
};

// Instructions for setup:
// 1. Go to https://cloudinary.com/ and create an account
// 2. Get your Cloud Name, API Key, and API Secret from your dashboard
// 3. Create an upload preset in Settings > Upload > Upload presets
// 4. Replace the values above with your actual credentials
// 5. For production, use environment variables:
//    VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
//    VITE_CLOUDINARY_API_KEY=your-api-key
//    VITE_CLOUDINARY_API_SECRET=your-api-secret
//    VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
