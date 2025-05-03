import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, MessageCircle } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import Contact from '../components/Contact';

interface ServicePageProps {
  serviceId: string;
}

const ServicePage: React.FC<ServicePageProps> = ({ serviceId }) => {
  const navigate = useNavigate();
  const service = servicesData.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Услуга не найдена</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-900">
      {/* Hero section with background image */}
      <div 
        className="relative h-[50vh] flex items-center"
        style={{ 
          backgroundImage: `url(${service.imageUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 flex items-center text-gray-300 hover:text-red-500 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Назад на главную
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {service.title}
          </h1>
        </div>
      </div>

      {/* Service details */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">О услуге</h2>
            <p className="text-gray-300 text-lg mb-8">{service.fullDescription}</p>
            
            <h3 className="text-2xl font-semibold text-white mb-4">Предоставляемые услуги</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {service.services.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="text-red-500 mr-3 mt-1">
                    <Check size={20} />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Свяжитесь с нами</h3>
              <p className="text-gray-300 mb-6">
                Для получения консультации или записи на сервис напишите нам в WhatsApp или позвоните
              </p>
              <a 
                href="https://wa.me/79655118585" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-md mb-4 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="mr-2" size={20} />
                Написать в WhatsApp
              </a>
              <a 
                href="tel:+79655118585" 
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-semibold py-3 rounded-md mb-4 transition-colors"
              >
                Позвонить
              </a>
              <div className="text-gray-400 text-sm">
                <p className="mb-2">Часы работы: 10:00-22:00</p>
                <p>Адрес: Березовский, Транспортников 42А</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Contact />
    </div>
  );
};

export default ServicePage;