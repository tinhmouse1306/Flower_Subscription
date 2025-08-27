# Hướng dẫn Upload ảnh lên Firebase Storage

## Tổng quan

Dự án này sử dụng Firebase Storage để lưu trữ ảnh. Flow hoạt động như sau:

1. **FE upload ảnh lên Firebase Storage**
2. **FE nhận URL ảnh từ Firebase**
3. **FE gửi URL ảnh cho BE**
4. **BE lưu URL ảnh vào database**

## Cấu hình Firebase

### 1. Firebase Config
File: `src/utils/firebase.js`
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBH6ae_JIKW-1JN-UX_WV6ddz90oAyB40I",
  authDomain: "swp490-project.firebaseapp.com",
  projectId: "swp490-project",
  storageBucket: "swp490-project.firebasestorage.app",
  messagingSenderId: "25259148696",
  appId: "1:25259148696:web:ccb3b235c68f11d59a17ed",
  measurementId: "G-VPS2MW27GS"
};
```

### 2. Dependencies
Firebase đã được cài đặt trong `package.json`:
```json
{
  "dependencies": {
    "firebase": "^12.1.0"
  }
}
```

## Cách sử dụng

### 1. Import utility functions
```javascript
import { uploadImage, uploadMultipleImages } from '../utils/imageUpload.js';
```

### 2. Upload một ảnh
```javascript
const handleUpload = async (file) => {
  try {
    const imageUrl = await uploadImage(file, 'flowers'); // folder name
    console.log('Uploaded URL:', imageUrl);
    // Gửi imageUrl cho BE
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 3. Upload nhiều ảnh
```javascript
const handleMultipleUpload = async (files) => {
  try {
    const imageUrls = await uploadMultipleImages(files, 'bouquets');
    console.log('Uploaded URLs:', imageUrls);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## Components có sẵn

### 1. ImageUpload Component
File: `src/components/ImageUpload.jsx`
- Component đơn giản để upload ảnh
- Có preview ảnh
- Trả về URL qua callback

```javascript
import ImageUpload from '../components/ImageUpload.jsx';

<ImageUpload 
  onImageUploaded={(imageUrl) => {
    console.log('Uploaded:', imageUrl);
  }}
  folder="flowers"
/>
```

### 2. FlowerFormWithImage Component
File: `src/components/FlowerFormWithImage.jsx`
- Form tạo flower với upload ảnh tích hợp
- Tự động upload ảnh trước khi submit form
- Validation đầy đủ

```javascript
import FlowerFormWithImage from '../components/FlowerFormWithImage.jsx';

<FlowerFormWithImage 
  onSubmit={async (formData) => {
    // formData.imageUrl đã có URL ảnh
    await createFlower(formData);
  }}
/>
```

## Demo Pages

### 1. ImageUploadDemo
File: `src/pages/ImageUploadDemo.jsx`
- Page demo upload ảnh đơn giản
- Hiển thị kết quả upload

### 2. Cách truy cập demo
Thêm route vào `App.jsx`:
```javascript
import ImageUploadDemo from './pages/ImageUploadDemo.jsx';

// Trong routes
<Route path="/demo-upload" element={<ImageUploadDemo />} />
```

## Cấu trúc thư mục Firebase Storage

```
swp490-project.firebasestorage.app/
├── flowers/           # Ảnh hoa
│   ├── 1234567890_rose.jpg
│   └── 1234567891_tulip.jpg
├── bouquets/          # Ảnh bó hoa
│   ├── 1234567892_bouquet1.jpg
│   └── 1234567893_bouquet2.jpg
├── packages/          # Ảnh gói subscription
│   └── 1234567894_package1.jpg
└── demo/              # Ảnh demo
    └── 1234567895_demo.jpg
```

## Lưu ý quan trọng

1. **BE chỉ nhận URL**: BE không xử lý file upload, chỉ nhận URL ảnh
2. **Validation**: Luôn validate file type và size trước khi upload
3. **Error handling**: Xử lý lỗi upload và hiển thị thông báo cho user
4. **Loading states**: Hiển thị loading khi đang upload
5. **Preview**: Luôn có preview ảnh trước khi upload

## Troubleshooting

### Lỗi thường gặp:
1. **Firebase not initialized**: Kiểm tra firebase config
2. **Permission denied**: Kiểm tra Firebase Storage rules
3. **File too large**: Giới hạn kích thước file upload
4. **Network error**: Kiểm tra kết nối internet

### Debug:
```javascript
// Kiểm tra Firebase config
console.log('Firebase config:', firebaseConfig);

// Kiểm tra storage instance
console.log('Storage instance:', storage);

// Log upload progress
const snapshot = await uploadBytes(storageRef, file);
console.log('Upload progress:', snapshot);
```
