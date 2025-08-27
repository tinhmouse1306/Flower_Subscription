# Firebase Google Login Fix

## Vấn đề hiện tại
- Lỗi: `auth.signInWithPopup is not a function`
- Google Login không hoạt động

## Các bước đã thực hiện

### 1. ✅ Cập nhật Firebase Config
- Thêm `measurementId: "G-TGE6JYHV8S"`
- Sử dụng `storageBucket: "flowerssubscriptionservice.firebasestorage.app"`
- Thống nhất config trong `firebase.js`

### 2. ✅ Sửa Import
- Import `signInWithPopup` trực tiếp từ `firebase/auth`
- Sử dụng `signInWithPopup(auth, provider)` thay vì `auth.signInWithPopup(provider)`

### 3. ✅ Thêm Debug Logging
- Log Firebase initialization
- Log Auth methods availability
- Log sign-in process

## Cần kiểm tra trong Firebase Console

### 1. Authentication → Sign-in method → Google
- ✅ Google đã được enable
- ❓ Cần kiểm tra **Authorized domains**

### 2. Thêm Authorized Domains
Trong Firebase Console → Authentication → Settings → **Authorized domains**, thêm:
- `localhost`
- `127.0.0.1`
- `[::1]`
- Domain thực tế của bạn (nếu deploy)

### 3. Google Cloud Console
Trong Google Cloud Console → APIs & Services → OAuth consent screen → **Authorized domains**, thêm:
- `localhost`
- `127.0.0.1`
- Domain thực tế của bạn

## Test Steps

1. Mở Developer Tools → Console
2. Refresh trang
3. Kiểm tra các log Firebase initialization
4. Thử click "Đăng nhập với Google"
5. Xem console logs để debug

## Nếu vẫn lỗi

### Kiểm tra Console Logs
- `🔥 Firebase app initialized`
- `🔥 Firebase Auth initialized`
- `✅ signInWithPopup is available`
- `🔍 Starting Google login...`

### Các lỗi có thể gặp
1. **auth/unauthorized-domain**: Cần thêm domain vào Firebase Console
2. **auth/popup-closed-by-user**: User đóng popup
3. **auth/cancelled-popup-request**: Popup bị block bởi browser

## Alternative Solutions

### 1. Sử dụng signInWithRedirect
```javascript
import { signInWithRedirect } from 'firebase/auth';
await signInWithRedirect(auth, provider);
```

### 2. Kiểm tra Browser Settings
- Disable popup blocker
- Allow popups for localhost
- Clear browser cache

### 3. Test với incognito mode
- Mở incognito window
- Thử login Google
- Xem có lỗi gì khác không
