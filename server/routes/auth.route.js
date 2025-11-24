import express from 'express'
import { registerUser, loginUser, getAllUsers } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

// EN: GET - Get all users (Admin only)
// UZ: Barcha foydalanuvchilarni olish (Admin uchun)
router.get('/users', protect, getAllUsers)

export default router
