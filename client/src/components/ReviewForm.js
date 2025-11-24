import React, { useState } from 'react'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const ReviewForm = ({ productId, onReviewAdded }) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [hoveredRating, setHoveredRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { user, isAuthenticated } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isAuthenticated) {
            toast.error('Sharh qoldirish uchun tizimga kiring')
            return
        }

        if (rating === 0) {
            toast.error('Iltimos, baho qo\'ying')
            return
        }

        if (!comment.trim()) {
            toast.error('Iltimos, fikringizni yozing')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('http://localhost:3003/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Xatolik yuz berdi')
            }

            const newReview = await response.json()
            toast.success('Sharhingiz qabul qilindi!')
            setRating(0)
            setComment('')
            if (onReviewAdded) {
                onReviewAdded(newReview)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className='bg-gray-800/30 p-6 rounded-lg text-center'>
                <p className='text-gray-400 mb-3'>
                    Sharh qoldirish uchun tizimga kiring
                </p>
                <a
                    href='/login'
                    className='inline-block bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 rounded-lg font-medium transition-colors'
                >
                    Kirish
                </a>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className='bg-gray-800/30 p-6 rounded-lg'>
            <h3 className='text-lg font-semibold text-white mb-4'>Fikr bildirish</h3>

            <div className='mb-4'>
                <label className='block text-sm text-gray-400 mb-2'>Bahoyingiz</label>
                <div className='flex space-x-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type='button'
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className='focus:outline-none'
                        >
                            <Star
                                className={`w-6 h-6 transition-colors ${star <= (hoveredRating || rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-600'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className='mb-4'>
                <label className='block text-sm text-gray-400 mb-2'>Fikringiz</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-accent resize-none h-32'
                    placeholder='Mahsulot haqida fikringiz...'
                />
            </div>

            <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-accent hover:bg-accent/90 text-accent-foreground py-2 rounded-lg font-semibold transition-colors disabled:opacity-50'
            >
                {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>
        </form>
    )
}

export default ReviewForm
