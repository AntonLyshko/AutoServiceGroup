import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold flex items-center mb-4">
              <span className="text-red-600">Auto</span>Service
            </Link>
            <p className="text-gray-400 mb-6">
              Профессиональный ремонт и обслуживание автомобилей любых марок с использованием современного оборудования
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/mechanical-work" className="text-gray-400 hover:text-red-500 transition-colors">
                  Слесарные работы
                </Link>
              </li>
              <li>
                <Link to="/services/diagnostics" className="text-gray-400 hover:text-red-500 transition-colors">
                  Диагностика
                </Link>
              </li>
              <li>
                <Link to="/services/electrical" className="text-gray-400 hover:text-red-500 transition-colors">
                  Электрика
                </Link>
              </li>
              <li>
                <Link to="/services/painting" className="text-gray-400 hover:text-red-500 transition-colors">
                  Покраска
                </Link>
              </li>
              <li>
                <Link to="/services/welding" className="text-gray-400 hover:text-red-500 transition-colors">
                  Сварочные работы
                </Link>
              </li>
              <li>
                <Link to="/services/detailing" className="text-gray-400 hover:text-red-500 transition-colors">
                  Детейлинг
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Контакты</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <PhoneCall size={20} className="text-red-500 mr-3" />
                <a href="tel:+79655118585" className="text-gray-400 hover:text-red-500 transition-colors">
                  +7 965 511 8585
                </a>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="text-red-500 mr-3" />
                <span className="text-gray-400">10:00-22:00</span>
              </div>
              <div className="flex items-start">
                <MapPin size={20} className="text-red-500 mr-3 mt-1" />
                <span className="text-gray-400">Березовский, Транспортников 42А</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-gray-500">
            © {currentYear} AutoService. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;