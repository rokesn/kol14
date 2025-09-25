// Polyfill for Solana libraries
import { Buffer } from 'buffer';

// Set up global variables before importing any Solana libraries  
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).Buffer = Buffer;
  (globalThis as any).Buffer = Buffer;
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
// Updated 2025-09-25 11:29:46
