import { Loader2 } from 'lucide-react';

const Loading = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
    <Loader2 size={36} className="animate-spin text-green-600" />
    <p className="text-base font-medium">{text}</p>
  </div>
);

export default Loading;
