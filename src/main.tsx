
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set app title
document.title = "Hadra";

createRoot(document.getElementById("root")!).render(<App />);
