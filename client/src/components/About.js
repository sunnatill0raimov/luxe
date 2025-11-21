import React from 'react';
import { Award, Users, Truck, Shield } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Award,
      title: 'Premium Sifat',
      description: 'Faqat eng yuqori sifatli materiallar va zamonaviy texnologiyalar ishlatiladi'
    },
    {
      icon: Users,
      title: 'Mijozlar Fikri',
      description: '98% mijozlar qoniqishi va ijobiy sharhlar bizning eng katta yutug\'imiz'
    },
    {
      icon: Truck,
      title: 'Tez Yetkazish',
      description: 'Barcha buyurtmalar 24-48 soat ichida yetkaziladi'
    },
    {
      icon: Shield,
      title: 'Kafolat',
      description: 'Barcha mahsulotlar uchun 1 yil kafolat beriladi'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Biz haqimizda
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            2015-yildan beri fashion industriyasida yetakchi pozitsiyada turib,
            mijozlarimizga eng zamonaviy va sifatli mahsulotlarni taqdim etib kelmoqdamiz
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="text-center bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-accent transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
                <feature.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Bizning Hikoya
              </h3>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Luxury Fashion Store 2015-yilda kichik bir do'kon sifatida boshlangan.
                  Bugungi kunda biz O'zbekistonning yetakchi fashion brendlaridan biriga aylandik.
                </p>
                <p>
                  Bizning jamoamiz fashion sohasidagi eng tajribali mutaxassislardan iborat.
                  Har bir mahsulotimizni alohida e'tibor va mehr bilan yaratamiz.
                </p>
                <p>
                  Kelajakda ham innovatsion yechimlar va zamonaviy tendentsiyalar bilan
                  mijozlarimizni hayratda qoldirishda davom etamiz.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="/professional-woman-artist.jpg"
                alt="Bizning jamoa"
                className="w-full h-96 object-cover rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-accent/20 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
