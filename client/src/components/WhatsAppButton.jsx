import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/store';

const WhatsAppButton = ({ message, label = 'WhatsApp Us', className = '', size = 'default' }) => {
  const url = getWhatsAppUrl(message);
  const sizeClass = size === 'lg'
    ? 'py-4 px-8 text-lg'
    : 'py-3 px-6 text-base';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-btn"
      className={`btn-whatsapp ${sizeClass} ${className}`}
    >
      <MessageCircle size={size === 'lg' ? 22 : 18} />
      {label}
    </a>
  );
};

export default WhatsAppButton;
