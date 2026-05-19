import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    
    // Search, Filter & Sort States
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 6,
        links: []
    });

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    
    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        images: []
    });
    
    // Edit specific states
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        price: '',
        images: []
    });
    const [removeImageIds, setRemoveImageIds] = useState([]);
    
    // Previews
    const [imagePreviews, setImagePreviews] = useState([]);
    const [editImagePreviews, setEditImagePreviews] = useState([]);
    
    const fileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    // SweetAlert2 Dark Theme Toast Configuration
    const showToast = (message, icon = 'success') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#0f172a', // Slate 900
            color: '#f8fafc',      // Slate 50
            iconColor: icon === 'success' ? '#10b981' : '#f43f5e', // Emerald / Rose
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        Toast.fire({
            icon: icon,
            title: message
        });
    };

    // Debounced search & filter effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts(1); // Fetch page 1 when search or filters change
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search, minPrice, maxPrice]);

    // Instant refetch on sort or page change
    useEffect(() => {
        fetchProducts(page);
    }, [sortBy, page]);

    const fetchProducts = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/products', {
                params: {
                    search,
                    min_price: minPrice,
                    max_price: maxPrice,
                    sort_by: sortBy,
                    page: pageNumber,
                    per_page: 6
                }
            });

            // Handle the standardized API response format
            const apiResult = response.data;
            if (apiResult.status === 'success') {
                setProducts(apiResult.data.data);
                setPagination({
                    current_page: apiResult.data.current_page,
                    last_page: apiResult.data.last_page,
                    total: apiResult.data.total,
                    per_page: apiResult.data.per_page,
                    links: apiResult.data.links
                });
                setError(null);
            } else {
                setError(apiResult.message || 'Failed to fetch products.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load products. Check your API configuration.');
        } finally {
            setLoading(false);
        }
    };

    // Handle files changes
    const handleFileChange = (e, isEdit = false) => {
        const files = Array.from(e.target.files);
        
        // Validate each file
        const invalidFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            return !isValidType || !isValidSize;
        });

        if (invalidFiles.length > 0) {
            const errorMsg = invalidFiles.some(f => !['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(f.type))
                ? 'Only JPEG, PNG, JPG, GIF, and WEBP formats are supported.'
                : 'Some files exceed the 5MB size limit.';
            
            showToast(errorMsg, 'error');
            
            if (isEdit) {
                setValidationErrors(prev => ({ ...prev, editImages: errorMsg }));
            } else {
                setValidationErrors(prev => ({ ...prev, images: errorMsg }));
            }
            return;
        }

        setValidationErrors(prev => {
            const copy = { ...prev };
            if (isEdit) delete copy.editImages;
            else delete copy.images;
            return copy;
        });

        const previews = files.map(file => URL.createObjectURL(file));

        if (isEdit) {
            setEditFormData(prev => ({ ...prev, images: files }));
            setEditImagePreviews(previews);
        } else {
            setFormData(prev => ({ ...prev, images: files }));
            setImagePreviews(previews);
        }
    };

    // Create Product Submit
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        
        // Custom Rich Validation
        const errors = {};
        if (!formData.name.trim()) errors.name = ['Product name is required.'];
        if (!formData.price || parseFloat(formData.price) <= 0) errors.price = ['Price must be a valid positive number.'];
        if (!formData.description.trim()) errors.description = ['Description is required.'];
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showToast('Please fill out all fields correctly!', 'error');
            return;
        }
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        
        formData.images.forEach(image => {
            data.append('images[]', image);
        });

        try {
            const response = await axios.post('/api/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.status === 'success') {
                setIsCreateModalOpen(false);
                setFormData({ name: '', description: '', price: '', images: [] });
                setImagePreviews([]);
                fetchProducts(1);
                showToast('Product created successfully!', 'success');
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setValidationErrors(err.response.data.errors || {});
                showToast('Validation failed. Please check fields.', 'error');
            } else {
                showToast('An error occurred while creating the product.', 'error');
            }
        }
    };

    // Edit Product Select
    const handleEditSelect = (product) => {
        setActiveProduct(product);
        setEditFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            images: []
        });
        setRemoveImageIds([]);
        setEditImagePreviews([]);
        setValidationErrors({});
        setIsEditModalOpen(true);
    };

    // Toggle Image Removal during Edit
    const handleToggleImageRemoval = (imageId) => {
        setRemoveImageIds(prev => 
            prev.includes(imageId) 
                ? prev.filter(id => id !== imageId) 
                : [...prev, imageId]
        );
    };

    // Edit Product Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        // Custom Rich Validation
        const errors = {};
        if (!editFormData.name.trim()) errors.name = ['Product name is required.'];
        if (!editFormData.price || parseFloat(editFormData.price) <= 0) errors.price = ['Price must be a valid positive number.'];
        if (!editFormData.description.trim()) errors.description = ['Description is required.'];
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showToast('Please fill out all fields correctly!', 'error');
            return;
        }

        const data = new FormData();
        data.append('name', editFormData.name);
        data.append('description', editFormData.description);
        data.append('price', editFormData.price);
        data.append('_method', 'PUT');

        editFormData.images.forEach(image => {
            data.append('images[]', image);
        });

        removeImageIds.forEach(id => {
            data.append('remove_images[]', id);
        });

        try {
            const response = await axios.post(`/api/products/${activeProduct.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                setIsEditModalOpen(false);
                setRemoveImageIds([]);
                setEditImagePreviews([]);
                fetchProducts(page);
                showToast('Product updated successfully!', 'success');
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setValidationErrors(err.response.data.errors || {});
                showToast('Validation failed.', 'error');
            } else {
                showToast('An error occurred while updating.', 'error');
            }
        }
    };

    // SweetAlert2 Delete Confirmation
    const handleDeleteClick = (product) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${product.name}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            background: '#0f172a', // Slate 900
            color: '#f8fafc',      // Slate 50
            iconColor: '#f43f5e',
            confirmButtonColor: '#6366f1', // Indigo 500
            cancelButtonColor: '#1e293b',  // Slate 800
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-3xl border border-slate-800 backdrop-blur-md',
                confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/20',
                cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold border border-slate-700'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/api/products/${product.id}`);
                    if (response.data.status === 'success') {
                        showToast('Product deleted successfully!', 'success');
                        fetchProducts(page);
                    }
                } catch (err) {
                    console.error(err);
                    showToast('Failed to delete the product.', 'error');
                }
            }
        });
    };

    // Page navigation helper
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setPage(newPage);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Product Hub Manager
                    </h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/25 focus-visible:outline focus-visible:outline-2"
                    >
                        <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        New Product
                    </button>
                </div>
            }
        >
            <Head title="Products Dashboard" />

            <div className="relative min-h-screen py-8 bg-slate-950 text-slate-100">
                {/* Ambient lights */}
                <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-600/5 blur-[128px]"></div>
                <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-[128px]"></div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Live Searching, Sorting and Filters Panel */}
                    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/20 p-6 backdrop-blur-xl">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">Search Products</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-4.5 w-4.5 text-slate-550" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:ring-0 focus:outline-none transition"
                                        placeholder="Search by name or info..."
                                    />
                                </div>
                            </div>

                            {/* Price Filters */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">Min Price ($)</label>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:border-violet-500 focus:ring-0 focus:outline-none transition"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">Max Price ($)</label>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:border-violet-500 focus:ring-0 focus:outline-none transition"
                                        placeholder="1000"
                                    />
                                </div>
                            </div>

                            {/* Sort Ordering */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">Sort Ordering</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                                    className="block w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-250 focus:border-violet-500 focus:ring-0 focus:outline-none transition cursor-pointer"
                                >
                                    <option value="latest">Latest Added</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                    <option value="name_desc">Name: Z to A</option>
                                </select>
                            </div>

                            {/* Reset Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setMinPrice('');
                                        setMaxPrice('');
                                        setSortBy('latest');
                                        setPage(1);
                                    }}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-2.5 text-sm font-semibold text-slate-450 hover:bg-slate-900 hover:text-white transition"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex h-80 items-center justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-violet-500"></div>
                        </div>
                    ) : error ? (
                        <div className="rounded-3xl border border-rose-950/80 bg-rose-950/10 p-6 text-center text-rose-300">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-850 bg-slate-900/10 py-16 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-slate-300">No matching products</h3>
                            <p className="mt-1 text-sm text-slate-500">Adjust your search parameters or filter limits.</p>
                        </div>
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-850/80 bg-slate-950/50 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-950/10">
                                        
                                        {/* Multi Image Carousel */}
                                        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                                            {product.images && product.images.length > 0 ? (
                                                <div className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar">
                                                    {product.images.map((img, index) => (
                                                        <div key={img.id} className="relative h-full w-full flex-shrink-0 snap-center">
                                                            <img
                                                                src={img.image_path}
                                                                alt={`${product.name} - ${index + 1}`}
                                                                className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-103"
                                                            />
                                                            {product.images.length > 1 && (
                                                                <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-slate-350 backdrop-blur-sm">
                                                                    {index + 1} / {product.images.length}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-600">
                                                    No Product Images
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <span className="text-lg font-extrabold text-violet-400">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </span>
                                            </div>
                                            
                                            <p className="text-sm text-slate-400 line-clamp-3 mb-5 flex-1 leading-relaxed">
                                                {product.description}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditSelect(product)}
                                                    className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 text-center text-sm font-semibold text-slate-300 transition hover:bg-slate-850 hover:text-white"
                                                >
                                                    Edit Details
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="rounded-xl bg-rose-950/20 px-3.5 py-2.5 text-rose-450 transition hover:bg-rose-950/60 hover:text-rose-200"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Beautiful Server-Side Pagination Bar */}
                            {pagination.last_page > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    {/* Previous Page */}
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                                    >
                                        Prev
                                    </button>

                                    {/* Numeric Buttons */}
                                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNo) => (
                                        <button
                                            key={pageNo}
                                            onClick={() => handlePageChange(pageNo)}
                                            className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
                                                page === pageNo
                                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                                                    : 'border border-slate-850 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                                            }`}
                                        >
                                            {pageNo}
                                        </button>
                                    ))}

                                    {/* Next Page */}
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === pagination.last_page}
                                        className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* CREATE PRODUCT MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl hover:border-violet-500/20 transition duration-500">
                        <div className="flex items-center justify-between border-b border-slate-800/85 pb-4 mb-6">
                            <h3 className="text-2xl font-black text-white tracking-tight">Create New Product</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white transition duration-300 hover:rotate-90">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-650 focus:border-violet-500 focus:ring-0 focus:outline-none transition duration-200"
                                    placeholder="Enter product title"
                                />
                                {validationErrors.name && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.name[0]}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                                    <div className="relative mt-2">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-extrabold">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-3 text-white focus:border-violet-500 focus:ring-0 focus:outline-none transition duration-200"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {validationErrors.price && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.price[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Upload Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={(e) => handleFileChange(e, false)}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="border-2 border-dashed border-slate-800 hover:border-violet-500/40 bg-slate-950/40 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1 group"
                                    >
                                        <svg className="h-6 w-6 text-violet-400 group-hover:scale-110 transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-xs font-bold text-slate-350">
                                            {formData.images.length > 0 ? `${formData.images.length} images selected` : 'Drag & drop or Click to upload'}
                                        </span>
                                        <span className="text-[10px] text-slate-550">JPEG, PNG, JPG, GIF, WEBP (Max 5MB)</span>
                                    </div>
                                    {validationErrors.images && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.images}</p>}
                                </div>
                            </div>

                            {/* Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 p-3.5 rounded-2xl border border-slate-850 bg-slate-950/40">
                                    {imagePreviews.map((preview, i) => (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-850">
                                            <img src={preview} className="h-full w-full object-cover" alt="Preview" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-650 focus:border-violet-500 focus:ring-0 focus:outline-none resize-none transition duration-200"
                                    placeholder="Write product description here..."
                                ></textarea>
                                {validationErrors.description && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.description[0]}</p>}
                            </div>

                            <div className="flex gap-3 justify-end border-t border-slate-800/80 pt-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="rounded-xl border border-slate-850 bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-850 hover:text-white transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-gradient-to-r from-violet-650 to-indigo-650 px-6 py-2.5 text-sm font-bold text-white hover:from-violet-550 hover:to-indigo-550 transition duration-250 shadow-lg shadow-violet-500/10"
                                >
                                    Create Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PRODUCT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl hover:border-violet-500/20 transition duration-500">
                        <div className="flex items-center justify-between border-b border-slate-800/85 pb-4 mb-6">
                            <h3 className="text-2xl font-black text-white tracking-tight">Edit Product</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition duration-300 hover:rotate-90">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-violet-500 focus:ring-0 focus:outline-none transition duration-200"
                                />
                                {validationErrors.name && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.name[0]}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                                    <div className="relative mt-2">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-extrabold">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-3 text-white focus:border-violet-500 focus:ring-0 focus:outline-none transition duration-200"
                                        />
                                    </div>
                                    {validationErrors.price && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.price[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Add More Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        ref={editFileInputRef}
                                        onChange={(e) => handleFileChange(e, true)}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div
                                        onClick={() => editFileInputRef.current.click()}
                                        className="border-2 border-dashed border-slate-800 hover:border-violet-500/40 bg-slate-950/40 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1 group"
                                    >
                                        <svg className="h-6 w-6 text-violet-400 group-hover:scale-110 transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-xs font-bold text-slate-350">
                                            {editFormData.images.length > 0 ? `${editFormData.images.length} images selected` : 'Drag & drop or Click to upload'}
                                        </span>
                                        <span className="text-[10px] text-slate-550">JPEG, PNG, JPG, GIF, WEBP (Max 5MB)</span>
                                    </div>
                                    {validationErrors.editImages && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.editImages}</p>}
                                </div>
                            </div>

                            {/* Current Images */}
                            {activeProduct && activeProduct.images && activeProduct.images.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Manage Current Images (Click to delete)</label>
                                    <div className="grid grid-cols-4 gap-3 p-3 rounded-2xl border border-slate-850 bg-slate-950/40">
                                        {activeProduct.images.map((img) => {
                                            const isMarkedForRemoval = removeImageIds.includes(img.id);
                                            return (
                                                <div 
                                                    key={img.id} 
                                                    onClick={() => handleToggleImageRemoval(img.id)}
                                                    className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer group"
                                                >
                                                    <img src={img.image_path} className={`h-full w-full object-cover transition ${isMarkedForRemoval ? 'opacity-20 blur-[1px]' : ''}`} alt="Existing" />
                                                    <div className={`absolute inset-0 flex items-center justify-center transition bg-slate-950/40 ${isMarkedForRemoval ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        {isMarkedForRemoval ? (
                                                            <span className="rounded-full bg-rose-500 p-1 text-white shadow">
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </span>
                                                        ) : (
                                                            <span className="rounded-full bg-slate-950/80 p-1 text-rose-400 shadow">
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            {editImagePreviews.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">New Images to Upload</label>
                                    <div className="grid grid-cols-4 gap-3 p-3 rounded-2xl border border-slate-850 bg-slate-950/40">
                                        {editImagePreviews.map((preview, i) => (
                                            <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-850">
                                                <img src={preview} className="h-full w-full object-cover" alt="New Preview" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    rows="4"
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-650 focus:border-violet-500 focus:ring-0 focus:outline-none resize-none transition duration-200"
                                ></textarea>
                                {validationErrors.description && <p className="mt-1.5 text-xs text-rose-450 font-bold">{validationErrors.description[0]}</p>}
                            </div>

                            <div className="flex gap-3 justify-end border-t border-slate-800/80 pt-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="rounded-xl border border-slate-850 bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-850 hover:text-white transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-gradient-to-r from-violet-650 to-indigo-650 px-6 py-2.5 text-sm font-bold text-white hover:from-violet-550 hover:to-indigo-550 transition duration-250 shadow-lg shadow-violet-500/10"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
