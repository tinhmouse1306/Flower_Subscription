# Firebase Authentication & Storage Setup

## 📋 Tổng quan

Dự án này sử dụng **2 Firebase project khác nhau** cho các mục đích khác nhau:

### 🔐 **Firebase Authentication** (Google Login)
- **Project**: `flowerssubscriptionservice`
- **Config**: `src/utils/firebaseAuth.js`
- **Mục đích**: Xử lý Google Login
- **Backend**: Không sử dụng Firebase Auth, chỉ dùng JWT

### 📁 **Firebase Storage** (Upload ảnh)
- **Project**: `swp490-project` 
- **Config**: `src/utils/firebase.js`
- **Mục đích**: Lưu trữ ảnh sản phẩm
- **Backend**: Chỉ nhận URL ảnh, không xử lý upload

## 🏗️ Cấu trúc Files

```
src/utils/
├── firebaseAuth.js     # Firebase config cho Authentication (Google Login)
├── firebase.js         # Firebase config cho Storage (Upload ảnh)
├── imageUpload.js      # Utility functions upload ảnh
└── auth.js            # JWT authentication management
```

## 🔄 Flow Authentication

### 1. **Login thường (JWT)**
```
User → FE → BE → JWT Token → FE (lưu vào localStorage)
```

### 2. **Google Login (Firebase + JWT)**
```
User → Google → Firebase Auth → FE → BE → JWT Token → FE (lưu vào localStorage)
```

### 3. **Upload ảnh**
```
User → FE → Firebase Storage → URL → FE → BE (lưu URL vào DB)
```

## ⚠️ Lưu ý quan trọng

### **BE chỉ nhận JWT Token**
- BE không xử lý Firebase token
- BE không có endpoint để validate Firebase token
- Tất cả authentication đều qua JWT token

### **2 hệ thống auth độc lập**
- **Firebase Auth**: Chỉ dùng cho Google Login
- **JWT Auth**: Dùng cho session management
- Không có liên kết trực tiếp giữa 2 hệ thống

### **Storage riêng biệt**
- Ảnh upload lên Firebase Storage project mới
- Authentication dùng Firebase project cũ
- Không xung đột vì dùng cho mục đích khác nhau

## 🛠️ Cách sử dụng

### **Google Login**
```javascript
import { initializeFirebase, getFirebaseAuth, getGoogleProvider } from '../utils/firebaseAuth';

// Initialize Firebase Auth
initializeFirebase();
const auth = getFirebaseAuth();
const provider = getGoogleProvider();

// Google sign in
const result = await signInWithPopup(auth, provider);
```

### **Upload ảnh**
```javascript
import { uploadImage } from '../utils/imageUpload.js';

// Upload to Firebase Storage
const imageUrl = await uploadImage(file, 'flowers');
```

### **JWT Authentication**
```javascript
import { setAuthData, isAuthenticated, getToken } from '../utils/auth';

// Save JWT token
setAuthData(token, userData);

// Check authentication
if (isAuthenticated()) {
    // User is logged in
}
```

## 🔧 Troubleshooting

### **Lỗi thường gặp:**

1. **"Firebase not initialized"**
   - Kiểm tra import đúng file: `firebaseAuth.js` cho auth, `firebase.js` cho storage

2. **"Permission denied"**
   - Kiểm tra Firebase Storage rules
   - Kiểm tra Firebase Auth rules

3. **"JWT token invalid"**
   - BE không nhận Firebase token, chỉ nhận JWT token
   - Cần convert Firebase token thành JWT token

### **Debug:**
```javascript
// Check Firebase Auth
console.log('Firebase Auth:', getFirebaseAuth());

// Check Firebase Storage  
console.log('Firebase Storage:', storage);

// Check JWT token
console.log('JWT Token:', getToken());
```

## 📝 Kết luận

**Không có xung đột** giữa 2 Firebase config vì:
- Dùng cho **mục đích khác nhau** (Auth vs Storage)
- **BE chỉ dùng JWT**, không dùng Firebase Auth
- **FE tách riêng** config cho từng mục đích

Hệ thống hoạt động ổn định với setup hiện tại! 🎉
