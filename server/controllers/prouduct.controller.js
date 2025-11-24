import mongoose from 'mongoose'
import Product from '../models/product.model.js'

export const getProduct = async (req, res) => {
	try {
		const products = await Product.find({})
		res.status(200).json({ success: true, data: products })
	} catch (error) {
		console.error('error in fetching products:', error.message)
		res.status(500).json({ success: false, message: 'Server Error' })
	}
}

export const getSingleProduct = async (req, res) => {
	const { id } = req.params

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(400)
			.json({ success: false, message: 'Invalid Product ID' })
	}

	try {
		const product = await Product.findById(id)

		if (!product) {
			return res.status(404).json({
				success: false,
				message: 'Product not found',
			})
		}

		res.status(200).json({ success: true, data: product })
	} catch (error) {
		console.error('Error fetching single product:', error.message)
		res.status(500).json({ success: false, message: 'Server Error' })
	}
}

export const getRelatedProducts = async (req, res) => {
	const { id } = req.params

	try {
		// Asosiy mahsulotni topamiz
		const product = await Product.findById(id)

		if (!product) {
			return res.status(404).json({
				success: false,
				message: 'Mahsulot topilmadi',
			})
		}

		// Shu product bilan bir xil category bo‘lgan boshqa mahsulotlarni olish
		const relatedProducts = await Product.find({
			category: product.category,
			_id: { $ne: id }, // asosiy product chiqmaydi
		}).limit(10) // ixtiyoriy limit

		res.status(200).json({
			success: true,
			data: relatedProducts,
		})
	} catch (error) {
		console.error('Related product xatosi:', error)
		res.status(500).json({
			success: false,
			message: 'Server xatosi',
		})
	}
}

export const postProduct = async (req, res) => {
	const product = req.body;
	console.log('Received product data:', JSON.stringify(product, null, 2));

	if (!product.name || !product.price || !product.category || !product.images || product.images.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Majburiy maydonlar to‘liq emas",
		});
	}

	try {
		const newProduct = new Product(product);
		await newProduct.save();

		res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
		console.error('Error creating product:', error);
		res.status(500).json({ success: false, message: "Server xatosi: " + error.message });
	}
};

export const putProduct = async (req, res) => {
	const { id } = req.params;

	try {
		const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });

		res.status(200).json({ success: true, data: updated });
	} catch (err) {
		res.status(500).json({ success: false, message: "Yangilashda xato" });
	}
};


export const deleteProduct = async (req, res) => {
	const { id } = req.params

	try {
		await Product.findByIdAndDelete(id)
		res.status(200).json({ success: true, message: 'Product deleted' })
	} catch (error) {
		console.error('error in fetching products:', error.message)
		res.status(404).json({ success: false, message: 'Product not found' })
	}
}
