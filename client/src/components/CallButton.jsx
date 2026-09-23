import { Phone } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

const CallButton = ({ label = 'Call Store', className = '', size = 'default' }) => {
  const sizeClass = size === 'lg' ? 'py-4 px-8 text-lg' : 'py-3 px-6 text-base';

  return (
    <a
      href={`tel:${STORE_CONFIG.phone}`}
      id="call-store-btn"
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 inline-flex items-center gap-2 ${sizeClass} ${className}`}
    >
      <Phone size={size === 'lg' ? 22 : 18} />
      {label}
    </a>
  );
};

export default CallButton;
