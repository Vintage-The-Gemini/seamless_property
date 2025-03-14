import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ type = 'success', message, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 transform ${isVisible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
      <div className={`${bgColor} ${textColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md`}>
        <Icon className="h-5 w-5" />
        <p className="flex-1">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;