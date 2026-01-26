import React, { useState, useEffect } from 'react';
import { testBackend, testHealth } from '../services/api';
import { FaCheckCircle, FaTimesCircle, FaSync, FaServer, FaDatabase, FaCode } from 'react-icons/fa';

const TestConnection = () => {
  const [status, setStatus] = useState('checking');
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setLoading(true);
    setStatus('checking');
    setError(null);
    
    try {
      // Test basic endpoint
      const basicTest = await testBackend();
      console.log('Basic test passed:', basicTest);
      
      // Test health endpoint
      const health = await testHealth();
      setHealthData(health);
      
      setStatus('connected');
    } catch (err) {
      console.error('Connection failed:', err);
      setStatus('failed');
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <FaServer className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Backend Connection</h2>
            <p className="text-gray-600">JavaKart Spring Boot API</p>
          </div>
        </div>
        
        <button
          onClick={checkConnection}
          disabled={loading}
          className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking...' : 'Test Now'}
        </button>
      </div>

      {/* Status Card */}
      <div className={`rounded-xl p-5 mb-6 ${
        status === 'connected' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' :
        status === 'failed' ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200' :
        'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200'
      }`}>
        <div className="flex items-center">
          <div className={`p-3 rounded-lg mr-4 ${
            status === 'connected' ? 'bg-green-100' :
            status === 'failed' ? 'bg-red-100' :
            'bg-yellow-100'
          }`}>
            {status === 'connected' ? (
              <FaCheckCircle className="text-green-600 text-3xl" />
            ) : status === 'failed' ? (
              <FaTimesCircle className="text-red-600 text-3xl" />
            ) : (
              <FaSync className="text-yellow-600 text-3xl animate-spin" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${
              status === 'connected' ? 'text-green-800' :
              status === 'failed' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              {status === 'connected' ? '✅ Backend Connected Successfully!' :
               status === 'failed' ? '❌ Backend Connection Failed' :
               '⏳ Connecting to Backend...'}
            </h3>
            <p className={`mt-1 ${
              status === 'connected' ? 'text-green-700' :
              status === 'failed' ? 'text-red-700' :
              'text-yellow-700'
            }`}>
              {status === 'connected' ? 'Spring Boot API is responding correctly on port 8080' :
               status === 'failed' ? `Error: ${error || 'Cannot reach backend server'}` :
               'Attempting to connect to JavaKart backend...'}
            </p>
          </div>
        </div>
      </div>

      {/* Connection Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <FaCode className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Frontend</span>
          </div>
          <code className="text-sm font-mono bg-white px-2 py-1 rounded border">localhost:3000</code>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <FaServer className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Backend API</span>
          </div>
          <code className="text-sm font-mono bg-white px-2 py-1 rounded border">localhost:8080/api</code>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <FaDatabase className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Database</span>
          </div>
          <code className="text-sm font-mono bg-white px-2 py-1 rounded border">MySQL javakart_db</code>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium text-gray-700">Status</span>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status === 'connected' ? 'bg-green-100 text-green-800' :
            status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status === 'connected' ? 'Connected' :
             status === 'failed' ? 'Failed' : 'Checking'}
          </span>
        </div>
      </div>

      {/* Response Data */}
      {healthData && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            <FaDatabase className="mr-2" />
            Backend Health Status
          </h3>
          <div className="bg-white rounded-lg p-4 border">
            <pre className="text-sm text-gray-800 overflow-x-auto">
{`{
  "status": "${healthData.status}",
  "service": "${healthData.service}",
  "version": "${healthData.version}",
  "database": "${healthData.database}",
  "timestamp": "${healthData.timestamp}"
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Quick Fix Guide */}
      {status === 'failed' && (
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
          <h3 className="text-lg font-bold text-orange-900 mb-3">🚨 Immediate Fix Required</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
              <div>
                <p className="font-medium text-orange-800">Restart Backend</p>
                <p className="text-sm text-orange-700">Run in backend directory: <code className="bg-orange-100 px-2 py-1 rounded">mvn spring-boot:run</code></p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
              <div>
                <p className="font-medium text-orange-800">Check Port 8080</p>
                <p className="text-sm text-orange-700">Open: <a href="http://localhost:8080/api/test" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">http://localhost:8080/api/test</a></p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
              <div>
                <p className="font-medium text-orange-800">Verify CORS Config</p>
                <p className="text-sm text-orange-700">Make sure CorsConfig.java is in the correct package</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestConnection;