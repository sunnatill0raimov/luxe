import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, phone, password } = req.body

        const userExists = await User.findOne({ phone })

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan'
            })
        }

        const user = await User.create({
            username,
            phone,
            password
        })

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    phone: user.phone,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id)
                }
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Foydalanuvchi ma\'lumotlari noto\'g\'ri'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body

        const user = await User.findOne({ phone })

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    phone: user.phone,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id)
                }
            })
        } else {
            res.status(401).json({
                success: false,
                message: 'Telefon raqam yoki parol noto\'g\'ri'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 })

        res.json({
            success: true,
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
