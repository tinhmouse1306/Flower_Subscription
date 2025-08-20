import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Flower
} from 'lucide-react';

const AdminFlowers = () => {
    const [flowers, setFlowers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Mock data
        setFlowers([
            {
                id: 1,
                name: 'Hoa Hồng Đỏ',
                category: 'Hoa Hồng',
                price: 150000,
                status: 'active',
                stock: 50,
                description: 'Hoa hồng đỏ tươi thắm, phù hợp cho các dịp lễ tình yêu',
                image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&h=150&fit=crop'
            },
            {
                id: 2,
                name: 'Hoa Cúc Trắng',
                category: 'Hoa Cúc',
                price: 80000,
                status: 'active',
                stock: 30,
                description: 'Hoa cúc trắng tinh khôi, mang ý nghĩa thanh cao',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop'
            },
            {
                id: 3,
                name: 'Hoa Lan Tím',
                category: 'Hoa Lan',
                price: 200000,
                status: 'inactive',
                stock: 15,
                description: 'Hoa lan tím quý phái, thích hợp làm quà tặng cao cấp',
                image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=150&h=150&fit=crop'
            },
            {
                id: 4,
                name: 'Hoa Hướng Dương',
                category: 'Hoa Hướng Dương',
                price: 120000,
                status: 'active',
                stock: 25,
                description: 'Hoa hướng dương tươi sáng, mang lại năng lượng tích cực',
                image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=150&h=150&fit=crop'
            }
        ]);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại hoa này?')) {
            setFlowers(prev => prev.filter(flower => flower.id !== id));
            console.log(`Deleting flower with id: ${id}`);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setFlowers(prev => prev.map(flower =>
            flower.id === id ? { ...flower, status: newStatus } : flower
        ));
        console.log(`Flower ${id} status changed to: ${newStatus}`);
    };

    return (
        <AdminLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý loại hoa</h1>
                    <p className="text-gray-600">Thêm, sửa, xóa và quản lý các loại hoa trong hệ thống</p>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm loại hoa..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64"
                                />
                            </div>
                            <button className="btn-secondary">
                                <Filter size={16} className="mr-2" />
                                Lọc
                            </button>
                        </div>
                        <button className="btn-primary">
                            <Plus size={16} className="mr-2" />
                            Thêm hoa mới
                        </button>
                    </div>
                </div>

                {/* Flowers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {flowers.map((flower) => (
                        <div key={flower.id} className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="relative">
                                <img
                                    src={flower.image}
                                    alt={flower.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`text-xs px-2 py-1 rounded ${flower.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {flower.status === 'active' ? 'Có sẵn' : 'Tạm hết'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{flower.name}</h3>
                                    <div className="flex space-x-1">
                                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                            <Eye size={16} />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(flower.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{flower.category}</p>
                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{flower.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-bold text-gray-900">
                                        {flower.price.toLocaleString()}đ
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Còn: {flower.stock}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <select
                                        value={flower.status}
                                        onChange={(e) => handleStatusChange(flower.id, e.target.value)}
                                        className="w-full text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="active">Có sẵn</option>
                                        <option value="inactive">Tạm hết</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng số loại hoa</div>
                        <div className="text-2xl font-bold text-gray-900">{flowers.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Có sẵn</div>
                        <div className="text-2xl font-bold text-green-600">
                            {flowers.filter(flower => flower.status === 'active').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tạm hết</div>
                        <div className="text-2xl font-bold text-red-600">
                            {flowers.filter(flower => flower.status === 'inactive').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm font-medium text-gray-500">Tổng tồn kho</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {flowers.reduce((sum, flower) => sum + flower.stock, 0)}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminFlowers;
