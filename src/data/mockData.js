// Mock data cho ứng dụng Flowers Subscription

export const flowerPackages = [
    {
        id: 1,
        name: "Gói Sinh Viên Cơ Bản",
        description: "Hoa tươi mỗi tuần, phù hợp cho sinh viên",
        price: 150000,
        originalPrice: 200000,
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
        features: [
            "1 bó hoa tươi mỗi tuần",
            "Giao hàng miễn phí",
            "Hoa theo mùa",
            "Có thể hủy bất cứ lúc nào"
        ],
        category: "basic",
        popular: true
    },
    {
        id: 2,
        name: "Gói Premium",
        description: "Hoa cao cấp với nhiều loại đa dạng",
        price: 250000,
        originalPrice: 350000,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        features: [
            "2 bó hoa tươi mỗi tuần",
            "Hoa cao cấp, đa dạng",
            "Giao hàng miễn phí",
            "Tặng kèm chậu trồng",
            "Hỗ trợ 24/7"
        ],
        category: "premium",
        popular: false
    },
    {
        id: 3,
        name: "Gói Tiết Kiệm",
        description: "Tiết kiệm chi phí với gói dài hạn",
        price: 120000,
        originalPrice: 180000,
        image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=300&fit=crop",
        features: [
            "1 bó hoa tươi mỗi tuần",
            "Cam kết 3 tháng",
            "Giảm giá 20%",
            "Giao hàng miễn phí"
        ],
        category: "budget",
        popular: false
    }
];

export const deliveryOptions = [
    {
        id: 1,
        name: "1 lần/tuần",
        description: "Giao hàng vào thứ 7 hàng tuần",
        price: 0
    },
    {
        id: 2,
        name: "2 lần/tuần",
        description: "Giao hàng thứ 3 và thứ 7",
        price: 50000
    },
    {
        id: 3,
        name: "3 lần/tuần",
        description: "Giao hàng thứ 2, thứ 4, thứ 6",
        price: 100000
    }
];

export const users = [
    {
        id: 1,
        name: "Nguyễn Thị Anh",
        email: "anh.nguyen@student.hcmus.edu.vn",
        phone: "0901234567",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        subscription: {
            packageId: 1,
            deliveryOption: 1,
            startDate: "2024-01-15",
            status: "active"
        }
    },
    {
        id: 2,
        name: "Trần Văn Bình",
        email: "binh.tran@student.hcmus.edu.vn",
        phone: "0909876543",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        subscription: {
            packageId: 2,
            deliveryOption: 2,
            startDate: "2024-01-10",
            status: "active"
        }
    }
];

export const orders = [
    {
        id: 1,
        userId: 1,
        packageId: 1,
        deliveryOption: 1,
        status: "delivered",
        orderDate: "2024-01-15",
        deliveryDate: "2024-01-20",
        totalAmount: 150000,
        items: [
            {
                id: 1,
                name: "Bó hoa hồng đỏ",
                quantity: 1,
                price: 150000
            }
        ]
    },
    {
        id: 2,
        userId: 2,
        packageId: 2,
        deliveryOption: 2,
        status: "pending",
        orderDate: "2024-01-18",
        deliveryDate: "2024-01-23",
        totalAmount: 300000,
        items: [
            {
                id: 2,
                name: "Bó hoa cúc vàng",
                quantity: 1,
                price: 150000
            },
            {
                id: 3,
                name: "Bó hoa hồng trắng",
                quantity: 1,
                price: 150000
            }
        ]
    }
];

export const flowerTypes = [
    {
        id: 1,
        name: "Hoa Hồng",
        image: "https://images.unsplash.com/photo-1496062031456-52d2a2c0b0c3?w=200&h=200&fit=crop",
        colors: ["Đỏ", "Trắng", "Hồng", "Vàng"]
    },
    {
        id: 2,
        name: "Hoa Cúc",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
        colors: ["Vàng", "Trắng", "Tím"]
    },
    {
        id: 3,
        name: "Hoa Lan",
        image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200&h=200&fit=crop",
        colors: ["Tím", "Trắng", "Vàng"]
    },
    {
        id: 4,
        name: "Hoa Cẩm Chướng",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop",
        colors: ["Hồng", "Trắng", "Đỏ"]
    }
];

export const testimonials = [
    {
        id: 1,
        name: "Nguyễn Thị Mai",
        student: "Sinh viên ĐH Kinh tế TP.HCM",
        content: "Dịch vụ rất tốt! Hoa luôn tươi và đẹp. Giá cả phù hợp với sinh viên.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 2,
        name: "Lê Văn Nam",
        student: "Sinh viên ĐH Bách Khoa TP.HCM",
        content: "Giao hàng đúng hẹn, hoa chất lượng cao. Rất hài lòng với dịch vụ!",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 3,
        name: "Phạm Thị Hoa",
        student: "Sinh viên ĐH Sư phạm TP.HCM",
        content: "Dịch vụ subscription rất tiện lợi, không cần lo nghĩ về việc mua hoa mỗi tuần.",
        rating: 4,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    }
];
