import React from 'react';
import TestConnection from './components/TestConnection';
import './styles/App.css';
import { FaShoppingCart, FaRocket, FaCheck, FaBolt, FaShieldAlt, FaTruck } from 'react-icons/fa';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                <FaShoppingCart className="text-white text-3xl" />
              </div>
              <h1 className="text-5xl font-bold mb-4">JavaKart</h1>
              <p className="text-xl text-blue-100">Full-Stack E-Commerce Platform</p>
              <p className="text-blue-200 mt-2">React + Spring Boot + MySQL</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/20 rounded-xl">
                  <FaRocket className="text-2xl mx-auto mb-2" />
                  <p className="font-bold">React 18</p>
                </div>
                <div className="text-center p-4 bg-white/20 rounded-xl">
                  <FaBolt className="text-2xl mx-auto mb-2" />
                  <p className="font-bold">Spring Boot</p>
                </div>
                <div className="text-center p-4 bg-white/20 rounded-xl">
                  <FaShieldAlt className="text-2xl mx-auto mb-2" />
                  <p className="font-bold">JWT Auth</p>
                </div>
                <div className="text-center p-4 bg-white/20 rounded-xl">
                  <FaTruck className="text-2xl mx-auto mb-2" />
                  <p className="font-bold">Razorpay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* System Status */}
        <div className="mb-10">
          <TestConnection />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <a 
            href="http://localhost:8080/swagger-ui/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <FaCheck className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">API Docs</h3>
            </div>
            <p className="text-green-100">Complete Swagger documentation for all endpoints</p>
            <div className="mt-4 text-sm opacity-80">localhost:8080/swagger-ui</div>
          </a>
          
          <a 
            href="http://localhost:3000/login" 
            className="group bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <FaShieldAlt className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Login</h3>
            </div>
            <p className="text-purple-100">User authentication with JWT tokens</p>
            <div className="mt-4 text-sm opacity-80">Try: admin / Admin@123</div>
          </a>
          
          <a 
            href="http://localhost:3000/products" 
            className="group bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 rounded-xl mr-4">
                <FaShoppingCart className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Products</h3>
            </div>
            <p className="text-orange-100">Browse complete product catalog</p>
            <div className="mt-4 text-sm opacity-80">Filter, search, add to cart</div>
          </a>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">React</div>
              <p className="text-gray-600">Frontend UI</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">Spring</div>
              <p className="text-gray-600">Backend API</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">MySQL</div>
              <p className="text-gray-600">Database</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="text-4xl font-bold text-red-600 mb-2">JWT</div>
              <p className="text-gray-600">Authentication</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center text-gray-500">
          <div className="inline-flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Frontend Running</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Backend Port 8080</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span>Database Connected</span>
            </div>
          </div>
          <p className="mt-4 text-sm">
            JavaKart E-Commerce Platform • Full Stack Development
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;