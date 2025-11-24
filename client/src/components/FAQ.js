import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Buyurtmani qanday berish mumkin?",
            answer: "Buyurtma berish uchun mahsulotni tanlang, kerakli rang va o'lchamni belgilang va 'Savatga qo'shish' tugmasini bosing. Keyin savatga o'tib, 'Buyurtmani rasmiylashtirish' tugmasini bosing va kerakli ma'lumotlarni to'ldiring."
        },
        {
            question: "Yetkazib berish qancha vaqt oladi?",
            answer: (
                <>
                    Toshkent shahri bo'ylab yetkazib berish 3-6 <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 font-semibold">soat</span> ichida amalga oshiriladi. Boshqa viloyatlarga yetkazib berish hozircha mavjud emas :( | Barcha buyurtmalar bepul yetkazib beriladi.
                </>
            )
        },
        {
            question: "To'lov usullari qanday?",
            answer: "Biz naqd pul, Click va Payme orqali to'lovni qabul qilamiz. Mahsulot yetkazib berilganda naqd to'lash yoki oldindan onlayn to'lash imkoniyati mavjud."
        },
        {
            question: "Mahsulotni qaytarish mumkinmi?",
            answer: "Ha, agar mahsulot sizga mos kelmasa yoki nuqsoni bo'lsa, 14 kun ichida qaytarish mumkin. Mahsulot yangi holatda bo'lishi va etiketkalari saqlanishi kerak."
        },
        {
            question: "Mahsulot sifati kafolatlanganmi?",
            answer: "Albatta! Barcha mahsulotlarimiz yuqori sifatli materiallardan tayyorlangan va sifat nazoratidan o'tgan. Biz har bir mahsulot uchun 30 kunlik kafolat beramiz."
        },
        {
            question: "O'lchamni qanday tanlash kerak?",
            answer: "Har bir mahsulot sahifasida o'lchamlar jadvali mavjud. Agar o'lchamni tanlashda qiyinchilik bo'lsa, bizning qo'llab-quvvatlash xizmatimiz bilan bog'laning, sizga yordam beramiz."
        },
        {
            question: "Chegirmalar va aksiyalar bormi?",
            answer: "Ha, biz muntazam ravishda chegirmalar va aksiyalar o'tkazamiz. Yangiliklar va maxsus takliflardan xabardor bo'lish uchun bizning ijtimoiy tarmoqlarimizga obuna bo'ling."
        },
        {
            question: "Buyurtmani qanday kuzatish mumkin?",
            answer: "Buyurtma rasmiylashtirilgandan so'ng, siz telefon raqamingizga SMS orqali buyurtma holati haqida xabar olasiz. Shuningdek, bizning qo'llab-quvvatlash xizmatimizga qo'ng'iroq qilib buyurtma holatini bilib olishingiz mumkin."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-20 bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600 mb-4 pb-5">
                        Ko'p beriladigan savollar
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Sizni qiziqtirgan savollar javoblari bilan tanishing
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-purple-600/50"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none group"
                            >
                                <span className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-purple-400' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-5 text-gray-300 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">
                        Javobini topa olmadingizmi?
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Biz bilan bog'laning
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
