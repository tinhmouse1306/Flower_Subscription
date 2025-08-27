# Quản lý Bouquet - Admin Panel

## 📋 Tổng quan

Trang quản lý Bouquet cho phép admin tạo, xem, chỉnh sửa và xóa các bó hoa trong hệ thống. Mỗi bouquet có thể chứa nhiều loại hoa với số lượng khác nhau.

## 🏗️ Cấu trúc Files

```
src/admin/
├── Bouquets.jsx          # Trang danh sách bouquet
├── AddBouquet.jsx        # Trang thêm bouquet mới
├── ViewBouquet.jsx       # Trang xem chi tiết bouquet
└── EditBouquet.jsx       # Trang chỉnh sửa bouquet
```

## 🔗 Routes

```javascript
// Trong App.jsx
<Route path="/admin/bouquets" element={<Bouquets />} />
<Route path="/admin/bouquets/add" element={<AddBouquet />} />
<Route path="/admin/bouquets/:id" element={<ViewBouquet />} />
<Route path="/admin/bouquets/:id/edit" element={<EditBouquet />} />
```

## 🎯 Tính năng

### 1. **Danh sách Bouquet** (`/admin/bouquets`)
- Hiển thị tất cả bouquet trong hệ thống
- Tìm kiếm theo tên hoặc mô tả
- Thao tác: Xem, Sửa, Xóa
- Thống kê tổng số bouquet

### 2. **Thêm Bouquet mới** (`/admin/bouquets/add`)
- Nhập thông tin cơ bản (tên, mô tả)
- Upload ảnh lên Firebase Storage
- Chọn các loại hoa và số lượng
- Validation đầy đủ

### 3. **Xem chi tiết Bouquet** (`/admin/bouquets/:id`)
- Hiển thị ảnh và thông tin bouquet
- Danh sách các loại hoa trong bouquet
- Thống kê số loại hoa và tổng số bông
- Thao tác: Sửa, Xóa

### 4. **Chỉnh sửa Bouquet** (`/admin/bouquets/:id/edit`)
- Cập nhật thông tin cơ bản
- Thay đổi ảnh (giữ nguyên hoặc upload mới)
- Thêm/bớt/sửa các loại hoa
- Validation đầy đủ

## 🔄 API Endpoints

### Backend API (BE)
```java
// BouquetController.java
@RestController
@RequestMapping("/api/admin/bouquets")
public class BouquetController {
    @PostMapping                    // Tạo bouquet mới
    @GetMapping                     // Lấy danh sách bouquet
    @GetMapping("/{id}")           // Lấy chi tiết bouquet
    @PutMapping("/{id}")           // Cập nhật bouquet
    @DeleteMapping("/{id}")        // Xóa bouquet
}
```

### Frontend API (FE)
```javascript
// Trong api.js
export const adminAPI = {
    getBouquets: () => api.get('/api/admin/bouquets'),
    getBouquetDetail: (id) => api.get(`/api/admin/bouquets/${id}`),
    createBouquet: (data) => api.post('/api/admin/bouquets', data),
    updateBouquet: (id, data) => api.put(`/api/admin/bouquets/${id}`, data),
    deleteBouquet: (id) => api.delete(`/api/admin/bouquets/${id}`),
};
```

## 📊 Data Structure

### Bouquet Entity
```java
public class Bouquet {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private List<BouquetFlower> bouquetFlowers;
}
```

### BouquetFlower Entity
```java
public class BouquetFlower {
    private Long id;
    private Bouquet bouquet;
    private Flower flower;
    private int quantity;
}
```

### Request DTO
```java
public class BouquetRequest {
    private String name;
    private String description;
    private String imageUrl;
    private List<BouquetFlowerRequest> flowers;
}

public class BouquetFlowerRequest {
    private Long flowerId;
    private int quantity;
}
```

## 🖼️ Upload Ảnh

### Firebase Storage
- Ảnh được upload lên Firebase Storage project `swp490-project`
- Thư mục: `bouquets/`
- Format: `bouquets/{timestamp}_{filename}`

### Flow Upload
1. User chọn file ảnh
2. Preview ảnh
3. Upload lên Firebase Storage
4. Lấy URL và lưu vào form
5. Gửi URL cho BE khi submit

## 🔧 Cách sử dụng

### 1. **Truy cập trang**
```
/admin/bouquets
```

### 2. **Thêm bouquet mới**
1. Click "Thêm Bouquet" 
2. Nhập tên và mô tả
3. Upload ảnh
4. Chọn các loại hoa và số lượng
5. Click "Tạo Bouquet"

### 3. **Xem chi tiết**
1. Click "Xem" trên bouquet
2. Xem thông tin và danh sách hoa
3. Thao tác: Sửa hoặc Xóa

### 4. **Chỉnh sửa**
1. Click "Sửa" trên bouquet
2. Cập nhật thông tin
3. Thay đổi ảnh (nếu cần)
4. Thêm/bớt/sửa hoa
5. Click "Cập nhật Bouquet"

## ⚠️ Lưu ý quan trọng

### **Validation**
- Tên bouquet bắt buộc
- Phải có ít nhất 1 loại hoa
- Số lượng hoa phải > 0
- Ảnh phải được upload trước khi tạo

### **Stock Management**
- BE tự động trừ kho khi tạo bouquet
- BE tự động cộng kho khi xóa bouquet
- BE tự động cập nhật kho khi sửa bouquet

### **Error Handling**
- Hiển thị thông báo lỗi chi tiết
- Loading states cho tất cả actions
- Confirmation dialogs cho delete

## 🎨 UI/UX Features

### **Responsive Design**
- Mobile-friendly
- Tablet và desktop optimized
- Sidebar navigation

### **User Experience**
- Loading spinners
- Success/error notifications
- Form validation
- Image preview
- Search functionality

### **Visual Elements**
- Card-based layout
- Hover effects
- Color-coded actions
- Icons cho navigation

## 🔍 Troubleshooting

### **Lỗi thường gặp:**
1. **"Không thể tải danh sách bouquet"**
   - Kiểm tra kết nối mạng
   - Kiểm tra API endpoint

2. **"Upload ảnh thất bại"**
   - Kiểm tra Firebase config
   - Kiểm tra file size và format

3. **"Không thể tạo bouquet"**
   - Kiểm tra validation
   - Kiểm tra stock hoa

### **Debug:**
```javascript
// Kiểm tra API response
console.log('API Response:', response.data);

// Kiểm tra form data
console.log('Form Data:', formData);

// Kiểm tra Firebase upload
console.log('Upload URL:', imageUrl);
```

## 📝 Kết luận

Trang quản lý Bouquet cung cấp đầy đủ tính năng CRUD cho admin:
- ✅ Tạo bouquet mới với upload ảnh
- ✅ Xem danh sách và chi tiết
- ✅ Chỉnh sửa thông tin và hoa
- ✅ Xóa bouquet
- ✅ Tích hợp với Firebase Storage
- ✅ Validation và error handling
- ✅ Responsive design

Hệ thống hoạt động ổn định và dễ sử dụng! 🎉
