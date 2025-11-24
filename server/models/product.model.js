import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	originalPrice: {
		type: Number,
		default: null,
	},
	category: {
		type: String,
		required: true,
	},
	images: {
		type: [String],
		required: true,
	},
	badge: {
		type: String,
		default: '',
	},
	rating: {
		type: Number,
		default: 0,
	},
	colors: {
		type: [String],
		default: [],
	},
	sizes: {
		type: [String],
		default: [],
	},
	description: {
		type: String,
		default: '',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

const Product = mongoose.model('Product', productSchema)

export default Product
