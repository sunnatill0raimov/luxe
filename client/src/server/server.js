const useProductService = () => {
	const _apiBase = 'http://127.0.0.1:3003/api/products'

	// GET ALL PRODUCTS
	const getAllProducts = async () => {
		try {
			const response = await fetch(_apiBase)
			const products = await response.json()

			if (!products.success) return []

			return products.data.map(product => _transformProduct(product))
		} catch (error) {
			console.error('Mahsulotlarni olishda xatolik:', error)
			return []
		}
	}

	// GET ONE PRODUCT
	const getDetailedProduct = async id => {
		try {
			const response = await fetch(`${_apiBase}/${id}`)
			const product = await response.json()

			if (!product.success) return null

			return _transformProduct(product.data)
		} catch (error) {
			console.error('Mahsulotni olishda xatolik:', error)
			return null
		}
	}

	// GET RELATED PRODUCTS
	const getRelatedProduct = async id => {
		try {
			const response = await fetch(`${_apiBase}/${id}/related`)
			const products = await response.json()

			if (!products.success) return []

			return products.data.map(product => _transformProduct(product))
		} catch (error) {
			console.error('Related mahsulotlarni olishda xatolik:', error)
			return []
		}
	}

	// POST PRODUCT
	const postProduct = async productObject => {
		try {
			const response = await fetch(_apiBase, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(productObject),
			})

			const product = await response.json()

			if (!product.success) return null

			return _transformProduct(product.data)
		} catch (error) {
			console.error('POST product error:', error)
			return null
		}
	}

	// PUT PRODUCT (UPDATE)
	const putProduct = async (id, updatedData) => {
		try {
			const response = await fetch(`${_apiBase}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData),
			})

			const result = await response.json()

			if (!result.success) {
				console.error('PUT failed:', result.message)
				return null
			}

			return _transformProduct(result.data)
		} catch (error) {
			console.error('PUT product error:', error)
			return null
		}
	}

	// DELETE PRODUCT
	const deleteProduct = async id => {
		try {
			const response = await fetch(`${_apiBase}/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})

			const product = await response.json()

			if (!product.success) {
				console.error('Delete failed:', product.message)
				return false
			}

			return true
		} catch (error) {
			console.error('Delete error:', error)
			return false
		}
	}

	// CREATE ORDER
	const createOrder = async (orderData) => {
		try {
			const response = await fetch('http://127.0.0.1:3003/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData)
			});
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Create order error:', error);
			return { success: false, message: error.message };
		}
	};

	// GET USER ORDERS (BY PHONE)
	const getUserOrders = async (phone) => {
		try {
			const response = await fetch(`http://127.0.0.1:3003/api/orders/user/${phone}`);
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Get user orders error:', error);
			return { success: false, message: error.message };
		}
	};

	// REGISTER USER
	const registerUser = async (userData) => {
		try {
			const response = await fetch('http://127.0.0.1:3003/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData)
			});
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Register error:', error);
			return { success: false, message: error.message };
		}
	};

	// LOGIN USER
	const loginUser = async (credentials) => {
		try {
			const response = await fetch('http://127.0.0.1:3003/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials)
			});
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Login error:', error);
			return { success: false, message: error.message };
		}
	};

	// GET MY ORDERS (AUTH)
	const getMyOrders = async (token) => {
		try {
			const response = await fetch('http://127.0.0.1:3003/api/orders/my-orders', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Get my orders error:', error);
			return { success: false, message: error.message };
		}
	};

	// TRANSFORM FUNCTION
	const _transformProduct = product => {
		return {
			id: product._id,
			name: product.name,
			price: product.price,
			originalPrice: product.originalPrice,
			category: product.category,
			images: product.images,
			image: product.images?.[0] || product.image || '',
			badge: product.badge,
			rating: product.rating,
			colors: product.colors,
			sizes: product.sizes,
			description: product.description,
			createdAt: product.createdAt,
		}
	}

	// GET ALL ORDERS (ADMIN)
	const getAllOrders = async (token) => {
		try {
			const response = await fetch('http://127.0.0.1:3003/api/orders/all', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Get all orders error:', error);
			return { success: false, message: error.message };
		}
	};


	// DELETE ORDER (ADMIN)
	const deleteOrder = async (orderId, token) => {
		try {
			const url = `http://127.0.0.1:3003/api/orders/${orderId}`;
			console.log('🔗 DELETE URL:', url);
			console.log('🔑 Order ID:', orderId);

			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			console.log('📡 Response status:', response.status);

			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Delete order error:', error);
			return { success: false, message: error.message };
		}
	};


	// UPDATE ORDER STATUS (ADMIN)
	const updateOrderStatus = async (orderId, status, token) => {
		try {
			const response = await fetch(`http://127.0.0.1:3003/api/orders/${orderId}/status`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ status })
			});
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Update order status error:', error);
			return { success: false, message: error.message };
		}
	};

	// GET ALL USERS (ADMIN)
	const getAllUsers = async (token) => {
		try {
			const response = await fetch('http://127.0.0.1:3003/api/auth/users', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			const result = await response.json();
			return result;
		} catch (error) {
			console.error('Get all users error:', error);
			return { success: false, message: error.message };
		}
	};

	return {
		getAllProducts,
		getDetailedProduct,
		getRelatedProduct,
		postProduct,
		deleteProduct,
		putProduct,
		createOrder,
		getUserOrders,
		registerUser,
		loginUser,
		getMyOrders,
		getAllOrders,
		updateOrderStatus,
		deleteOrder,
		getAllUsers,
	}
}

export default useProductService
