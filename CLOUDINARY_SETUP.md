# Cloudinary Setup Guide

## 🚀 Setup Cloudinary cho Flower Subscription App

### ✅ **Đã hoàn thành:**
- **Cloud Name**: `ds7hzpmed`
- **API Key**: `141368458813151`
- **API Secret**: `1lT-dul1f0HuhtHsxskn-dvCEBs`
- **Upload Preset**: `flower_subscription` (cần tạo)
- **84 assets** đã được upload thành công

### 1. Tạo tài khoản Cloudinary ✅
1. Truy cập [https://cloudinary.com/](https://cloudinary.com/)
2. Đăng ký tài khoản miễn phí
3. Đăng nhập vào Dashboard

### 2. Lấy thông tin cấu hình ✅
1. **Cloud Name**: `ds7hzpmed`
2. **API Key**: `141368458813151`
3. **API Secret**: `1lT-dul1f0HuhtHsxskn-dvCEBs`

### 3. Tạo Upload Preset 🔄
1. Vào **Settings** > **Upload**
2. Chọn tab **Upload presets**
3. Click **Add upload preset**
4. Đặt tên preset: `flower_subscription`
5. Chọn **Signing Mode**: `Unsigned` (cho frontend)
6. Trong **Folder**: Đặt tên folder mặc định: `flower-subscription`
7. Click **Save**

### 4. Cấu hình trong code ✅
File `src/config/cloudinary.config.js` đã được cập nhật với credentials thực tế.

#### Cách 1: Cấu hình trực tiếp (Development) ✅
```javascript
export const cloudinaryConfig = {
    cloud_name: 'ds7hzpmed',
    api_key: '141368458813151',
    api_secret: '1lT-dul1f0HuhtHsxskn-dvCEBs',
    upload_preset: 'flower_subscription'
};
```

#### Cách 2: Sử dụng Environment Variables (Production)
Tạo file `.env` trong thư mục gốc:

```env
VITE_CLOUDINARY_CLOUD_NAME=ds7hzpmed
VITE_CLOUDINARY_API_KEY=141368458813151
VITE_CLOUDINARY_API_SECRET=1lT-dul1f0HuhtHsxskn-dvCEBs
VITE_CLOUDINARY_UPLOAD_PRESET=flower_subscription
```

### 5. Cài đặt dependencies ✅
```bash
npm install @cloudinary/url-gen
```

### 6. Cấu trúc thư mục Cloudinary
```
flower-subscription/
├── flowers/          # Hình ảnh hoa
├── bouquets/         # Hình ảnh bouquet
├── packages/         # Hình ảnh gói dịch vụ
└── users/           # Avatar người dùng
```

### 7. Sử dụng trong code ✅

#### Upload hình ảnh:
```javascript
import { uploadImage } from '../utils/imageUpload.js';

const handleUpload = async (file) => {
    try {
        const imageUrl = await uploadImage(file, 'flowers');
        console.log('Uploaded URL:', imageUrl);
    } catch (error) {
        console.error('Upload failed:', error);
    }
};
```

#### Hiển thị hình ảnh với optimization:
```javascript
import CloudinaryImage from '../components/CloudinaryImage.jsx';

// Thumbnail
<CloudinaryImage src={imageUrl} size="thumbnail" alt="Flower" />

// Medium size
<CloudinaryImage src={imageUrl} size="medium" alt="Flower" />

// Custom size
<CloudinaryImage 
    src={imageUrl} 
    size="custom" 
    width={300} 
    height={200} 
    alt="Flower" 
/>
```

### 8. Tính năng Cloudinary

#### ✅ **Image Optimization**
- Tự động resize theo kích thước màn hình
- Compression tự động
- Format optimization (WebP, AVIF)

#### ✅ **Transformations**
- Thumbnail: 150x150px
- Small: 200px width
- Medium: 400px width
- Large: 800px width
- Custom: Tùy chỉnh kích thước

#### ✅ **Performance**
- Lazy loading
- CDN global
- Caching tự động

#### ✅ **Security**
- Upload preset với signing
- Folder organization
- Access control

### 9. Migration từ Firebase Storage ✅

#### Đã thay thế:
- ✅ `uploadImage()` - Upload lên Cloudinary
- ✅ `uploadMultipleImages()` - Upload nhiều ảnh
- ✅ `deleteImage()` - Xóa ảnh từ Cloudinary
- ✅ Image optimization components
- ✅ Các component hiển thị ảnh (Bouquets, Flowers, PackageCard, ViewBouquet)

#### Cần cập nhật:
- 🔄 Các form upload (đã tự động sử dụng Cloudinary)

### 10. Troubleshooting

#### Lỗi upload:
- Kiểm tra upload preset có đúng không
- Kiểm tra cloud name có đúng không
- Kiểm tra CORS settings trong Cloudinary

#### Lỗi hiển thị:
- Kiểm tra URL có đúng format Cloudinary không
- Kiểm tra transformation parameters

### 11. Production Deployment

#### Vercel:
1. Thêm environment variables trong Vercel dashboard
2. Deploy lại ứng dụng

#### Netlify:
1. Thêm environment variables trong Netlify dashboard
2. Deploy lại ứng dụng

---

## 📝 Notes
- Cloudinary free tier: 25GB storage, 25GB bandwidth/month
- Upload preset nên set `unsigned` cho frontend
- Sử dụng `CloudinaryImage` component để tối ưu performance
- Backup ảnh cũ từ Firebase trước khi migrate
- **Status hiện tại**: 84 assets đã upload thành công
