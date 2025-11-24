import React from 'react'
import { Star, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const ReviewList = ({ reviews, onReviewDeleted }) => {
    const { user } = useAuth()

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Haqiqatan ham bu sharhni o\'chirmoqchimisiz?')) {
            return
        }

        try {
            const response = await fetch(
                `http://localhost:3003/api/reviews/${reviewId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Xatolik yuz berdi')
            }

            toast.success('Sharh o\'chirildi')
            if (onReviewDeleted) {
                onReviewDeleted(reviewId)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className='text-center py-8 text-gray-400'>
                <p>Hozircha sharhlar yo'q. Birinchi bo'lib fikr bildiring!</p>
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            {reviews.map((review) => (
                <div key={review._id} className='bg-gray-800/50 p-4 rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center space-x-2'>
                            <span className='font-semibold text-white'>
                                {review.user?.username || 'Foydalanuvchi'}
                            </span>
                            <span className='text-gray-500 text-sm'>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <div className='flex text-yellow-400'>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            {user && user.isAdmin && (
                                <button
                                    onClick={() => handleDelete(review._id)}
                                    className='text-red-500 hover:text-red-400 transition-colors'
                                    title="Sharhni o'chirish"
                                >
                                    <Trash2 className='w-4 h-4' />
                                </button>
                            )}
                        </div>
                    </div>
                    <p className='text-gray-300'>{review.comment}</p>
                </div>
            ))}
        </div>
    )
}

export default ReviewList
