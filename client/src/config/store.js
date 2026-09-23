// Centralized store configuration from environment variables
export const STORE_CONFIG = {
  name: import.meta.env.VITE_STORE_NAME || 'Maruti Krushiseva Kendra',
  phone: import.meta.env.VITE_STORE_PHONE || '+919999999999',
  whatsapp: import.meta.env.VITE_STORE_WHATSAPP || '919999999999',
  address: import.meta.env.VITE_STORE_ADDRESS || 'Main Market Road, Maharashtra',
  hours: import.meta.env.VITE_STORE_HOURS || 'Mon–Sat: 8:00 AM – 7:00 PM',
  googleMapsUrl: import.meta.env.VITE_GOOGLE_MAPS_URL || 'https://maps.google.com',
};

export const getWhatsAppUrl = (message) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encoded}`;
};

export const getProductWhatsAppMessage = (productName) =>
  `Hello, I am interested in *${productName}*. Is this product currently available?`;

export const getGeneralWhatsAppMessage = () =>
  `Hello, I would like to know more about your agricultural products.`;
