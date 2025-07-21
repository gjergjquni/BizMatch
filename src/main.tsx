import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx executing...');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
