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

export const flowerPreferences = [
    {
        id: 1,
        name: "Hoa theo mùa",
        description: "Hoa tươi theo từng mùa trong năm",
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop"
    },
    {
        id: 2,
        name: "Hoa theo màu sắc",
        description: "Chọn hoa theo màu sắc yêu thích",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop"
    },
    {
        id: 3,
        name: "Hoa theo dịp lễ",
        description: "Hoa đặc biệt cho các dịp lễ tết",
        image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200&h=200&fit=crop"
    },
    {
        id: 4,
        name: "Hoa theo phong thủy",
        description: "Hoa mang lại may mắn và tài lộc",
        image: "https://images.unsplash.com/photo-1496062031456-52d2a2c0b0c3?w=200&h=200&fit=crop"
    }
];

export const seasonalFlowers = [
    {
        season: "Xuân",
        flowers: [
            { id: 1, name: "Hoa Đào", price: 80000, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop" },
            { id: 2, name: "Hoa Mai", price: 120000, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop" },
            { id: 3, name: "Hoa Cúc Vạn Thọ", price: 60000, image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200&h=200&fit=crop" }
        ]
    },
    {
        season: "Hạ",
        flowers: [
            { id: 4, name: "Hoa Sen", price: 100000, image: "https://images.unsplash.com/photo-1496062031456-52d2a2c0b0c3?w=200&h=200&fit=crop" },
            { id: 5, name: "Hoa Hướng Dương", price: 90000, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop" },
            { id: 6, name: "Hoa Cúc Tím", price: 70000, image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200&h=200&fit=crop" }
        ]
    },
    {
        season: "Thu",
        flowers: [
            { id: 7, name: "Hoa Cúc Vàng", price: 80000, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop" },
            { id: 8, name: "Hoa Hồng Mùa Thu", price: 110000, image: "https://images.unsplash.com/photo-1496062031456-52d2a2c0b0c3?w=200&h=200&fit=crop" },
            { id: 9, name: "Hoa Cẩm Chướng", price: 75000, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop" }
        ]
    },
    {
        season: "Đông",
        flowers: [
            { id: 10, name: "Hoa Cúc Trắng", price: 85000, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop" },
            { id: 11, name: "Hoa Hồng Đỏ", price: 120000, image: "https://images.unsplash.com/photo-1496062031456-52d2a2c0b0c3?w=200&h=200&fit=crop" },
            { id: 12, name: "Hoa Lan Tím", price: 150000, image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200&h=200&fit=crop" }
        ]
    }
];

export const colorPreferences = [
    {
        color: "Đỏ",
        meaning: "Tình yêu, may mắn",
        flowers: [1, 11, 12],
        hex: "#FF0000"
    },
    {
        color: "Hồng",
        meaning: "Tình yêu nhẹ nhàng, lãng mạn",
        flowers: [3, 8, 9],
        hex: "#FFC0CB"
    },
    {
        color: "Vàng",
        meaning: "Tình bạn, niềm vui",
        flowers: [2, 5, 7],
        hex: "#FFFF00"
    },
    {
        color: "Trắng",
        meaning: "Trong sáng, thuần khiết",
        flowers: [1, 10, 12],
        hex: "#FFFFFF"
    },
    {
        color: "Tím",
        meaning: "Sang trọng, bí ẩn",
        flowers: [6, 12],
        hex: "#800080"
    }
];

export const specialOccasions = [
    {
        id: 1,
        name: "Sinh nhật",
        description: "Hoa tươi cho ngày sinh nhật đặc biệt",
        image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop",
        flowers: [1, 2, 5, 8],
        price: 150000
    },
    {
        id: 2,
        name: "Valentine",
        description: "Hoa lãng mạn cho ngày tình yêu",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop",
        flowers: [1, 3, 8, 11],
        price: 200000
    },
    {
        id: 3,
        name: "8/3 - Quốc tế Phụ nữ",
        description: "Hoa tươi cho những người phụ nữ đặc biệt",
        image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=200&h=200&fit=crop",
        flowers: [2, 3, 5, 9],
        price: 180000
    },
    {
        id: 4,
        name: "Tết Nguyên Đán",
        description: "Hoa truyền thống cho năm mới",
        image: "https://images.unsplash.com/photo-1496062031456-52d2a2c0b0c3?w=200&h=200&fit=crop",
        flowers: [1, 2, 3],
        price: 250000
    }
];

export const studentDiscounts = [
    {
        id: 1,
        name: "Giảm giá sinh viên",
        description: "Giảm 15% cho tất cả sinh viên",
        discount: 15,
        code: "STUDENT15",
        validUntil: "2024-12-31"
    },
    {
        id: 2,
        name: "Giảm giá gói dài hạn",
        description: "Giảm 20% cho gói 6 tháng",
        discount: 20,
        code: "LONGTERM20",
        validUntil: "2024-12-31"
    },
    {
        id: 3,
        name: "Giảm giá nhóm",
        description: "Giảm 25% khi đăng ký nhóm 3 người trở lên",
        discount: 25,
        code: "GROUP25",
        validUntil: "2024-12-31"
    }
];

export const deliveryTimeSlots = [
    {
        id: 1,
        time: "08:00 - 10:00",
        description: "Sáng sớm",
        available: true
    },
    {
        id: 2,
        time: "10:00 - 12:00",
        description: "Giữa sáng",
        available: true
    },
    {
        id: 3,
        time: "14:00 - 16:00",
        description: "Đầu chiều",
        available: true
    },
    {
        id: 4,
        time: "16:00 - 18:00",
        description: "Cuối chiều",
        available: true
    },
    {
        id: 5,
        time: "18:00 - 20:00",
        description: "Tối",
        available: false
    }
];

export const subscriptionPlans = [
    {
        id: 1,
        name: "Gói 1 tháng",
        duration: 1,
        price: 150000,
        originalPrice: 180000,
        description: "Thử nghiệm dịch vụ"
    },
    {
        id: 2,
        name: "Gói 3 tháng",
        duration: 3,
        price: 400000,
        originalPrice: 540000,
        description: "Tiết kiệm 10%",
        popular: true
    },
    {
        id: 3,
        name: "Gói 6 tháng",
        duration: 6,
        price: 720000,
        originalPrice: 1080000,
        description: "Tiết kiệm 20%"
    },
    {
        id: 4,
        name: "Gói 12 tháng",
        duration: 12,
        price: 1200000,
        originalPrice: 2160000,
        description: "Tiết kiệm 30%"
    }
];

export const paymentMethods = [
    {
        id: 1,
        name: "Tiền mặt",
        description: "Thanh toán khi nhận hàng",
        icon: "💵"
    },
    {
        id: 2,
        name: "Chuyển khoản ngân hàng",
        description: "Chuyển khoản qua ngân hàng",
        icon: "🏦"
    },
    {
        id: 3,
        name: "Ví điện tử",
        description: "Momo, ZaloPay, VNPay",
        icon: "📱"
    },
    {
        id: 4,
        name: "Thẻ tín dụng",
        description: "Visa, Mastercard",
        icon: "💳"
    }
];

export const notifications = [
    {
        id: 1,
        type: "delivery",
        title: "Đơn hàng đang được giao",
        message: "Đơn hàng #12345 của bạn đang được giao. Dự kiến đến trong 30 phút.",
        time: "2024-01-20T10:30:00",
        read: false
    },
    {
        id: 2,
        type: "reminder",
        title: "Nhắc nhở giao hàng",
        message: "Ngày mai sẽ có giao hàng theo lịch trình của bạn.",
        time: "2024-01-19T20:00:00",
        read: true
    },
    {
        id: 3,
        type: "promotion",
        title: "Ưu đãi đặc biệt",
        message: "Giảm 20% cho gói hoa mùa xuân. Áp dụng đến hết tháng 2.",
        time: "2024-01-18T15:00:00",
        read: false
    }
];
