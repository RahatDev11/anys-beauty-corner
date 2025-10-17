
'use client';

import React, { useState, useEffect } from 'react';
import { database, ref, onValue, set, push, remove } from '@/lib/firebase';

const ProductManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('health');
    const [productStockStatus, setProductStockStatus] = useState('in_stock');
    const [productImages, setProductImages] = useState(['']);
    const [productTags, setProductTags] = useState('');
    const [productDescription, setProductDescription] = useState('');

    useEffect(() => {
        const productsRef = ref(database, 'products/');
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const productsData = Object.keys(snapshot.val()).map(key => ({ id: key, ...snapshot.val()[key] }));
                setProducts(productsData);
            } else {
                setProducts([]);
            }
        });
    }, []);

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...productImages];
        newImages[index] = value;
        setProductImages(newImages);
    };

    const addImageField = () => {
        setProductImages([...productImages, '']);
    };

    const resetForm = () => {
        setProductId('');
        setProductName('');
        setProductPrice('');
        setProductCategory('health');
        setProductStockStatus('in_stock');
        setProductImages(['']);
        setProductTags('');
        setProductDescription('');
    };

    const handleEdit = (product: any) => {
        setProductId(product.id);
        setProductName(product.name);
        setProductPrice(product.price);
        setProductCategory(product.category);
        setProductStockStatus(product.stockStatus);
        setProductImages(product.images || ['']);
        setProductTags(product.tags ? product.tags.join(', ') : '');
        setProductDescription(product.description);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            remove(ref(database, `products/${id}`));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name: productName,
            price: parseFloat(productPrice),
            category: productCategory,
            stockStatus: productStockStatus,
            images: productImages.filter(img => img !== ''),
            tags: productTags.split(',').map(tag => tag.trim()),
            description: productDescription,
        };

        if (productId) {
            set(ref(database, `products/${productId}`), productData);
        } else {
            push(ref(database, 'products'), productData);
        }
        resetForm();
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold text-center mb-4 text-lipstick-dark">Product Management</h2>
            
            <form onSubmit={handleSubmit} className="mb-6 border-b pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-gray-700">Product Name</label>
                        <input type="text" id="productName" className="w-full p-2 border rounded" required value={productName} onChange={(e) => setProductName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productPrice" className="block text-gray-700">Price</label>
                        <input type="number" id="productPrice" className="w-full p-2 border rounded" required value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productCategory" className="block text-gray-700">Category</label>
                        <select id="productCategory" className="w-full p-2 border rounded" value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                            <option value="health">Health</option>
                            <option value="cosmetics">Cosmetics</option>
                            <option value="skincare">Skincare</option>
                            <option value="haircare">Haircare</option>
                            <option value="mehandi">Mehandi</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="productStockStatus" className="block text-gray-700">Stock Status</label>
                        <select id="productStockStatus" className="w-full p-2 border rounded" value={productStockStatus} onChange={(e) => setProductStockStatus(e.target.value)}>
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Image URL</label>
                    <div id="imageInputs">
                        {productImages.map((image, index) => (
                            <input key={index} type="text" className="w-full p-2 border rounded mb-2 image-input" placeholder={`Image URL ${index + 1}`} value={image} onChange={(e) => handleImageChange(index, e.target.value)} />
                        ))}
                    </div>
                    <button type="button" onClick={addImageField} className="bg-lipstick-dark text-white px-3 py-1 rounded-sm mt-2 text-sm hover:bg-opacity-80">
                        <i className="fas fa-plus"></i> Add Another Image
                    </button>
                </div>
                <div className="mb-4">
                    <label htmlFor="productTags" className="block text-gray-700">Tags (comma separated)</label>
                    <input type="text" id="productTags" className="w-full p-2 border rounded" value={productTags} onChange={(e) => setProductTags(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="productDescription" className="block text-gray-700">Description</label>
                    <textarea id="productDescription" className="w-full p-2 border rounded" rows={4} required value={productDescription} onChange={(e) => setProductDescription(e.target.value)}></textarea>
                </div>
                <button type="submit" className="bg-lipstick-dark text-white px-4 py-2 rounded hover:bg-opacity-90">Save Product</button>
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90">Reset Form</button>
            </form>

            <h3 className="text-lg font-bold mb-2 text-lipstick-dark">All Products List</h3>
            <div id="productListAdmin" className="space-y-2 max-h-96 overflow-y-auto">
                {products.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 border-b">
                        <span>{product.name}</span>
                        <div>
                            <button onClick={() => handleEdit(product)} className="text-blue-500 hover:underline mr-4">Edit</button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;
