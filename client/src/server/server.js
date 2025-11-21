const useProductService = () => {
	const _apiBase = 'http://localhost:3003/api/products'

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

	// TRANSFORM FUNCTION
	const _transformProduct = product => {
		return {
			id: product._id,
			name: product.name,
			price: product.price,
			old_price: product.old_price,
			categoryId: product.categoryId,
			images: product.images,
			image: product.images?.[0] || product.image || '',
			status: product.status,
			rating: product.rating,
			colors: product.colors,
			dimensions: product.dimensions,
			description: product.description,
			createdAt: product.createdAt,
		}
	}

	return {
		getAllProducts,
		getDetailedProduct,
		getRelatedProduct,
		postProduct,
		deleteProduct,
		putProduct,
	}
}

export default useProductService
