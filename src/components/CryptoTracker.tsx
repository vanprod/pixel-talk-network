
import React, { useState, useEffect } from 'react';
import { Bitcoin, DollarSign } from 'lucide-react';

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

// Mock crypto data - would be fetched from an API in a real implementation
const MOCK_CRYPTO_DATA: CryptoPrice[] = [
  { symbol: 'BTC', price: 52386.24, change24h: 2.5 },
  { symbol: 'ETH', price: 2918.87, change24h: -1.2 },
  { symbol: 'BNB', price: 589.33, change24h: 0.8 },
  { symbol: 'SOL', price: 102.45, change24h: 5.3 },
];

export function CryptoTracker() {
  const [prices, setPrices] = useState<CryptoPrice[]>(MOCK_CRYPTO_DATA);
  
  useEffect(() => {
    // In a real implementation, this would call an API
    // For demo, we'll just update prices slightly every few seconds
    const interval = setInterval(() => {
      setPrices(currentPrices => 
        currentPrices.map(crypto => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() * 0.01 - 0.005)),
          change24h: crypto.change24h + (Math.random() * 0.4 - 0.2)
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex space-x-4 overflow-x-auto scrollbar-none py-2">
      <Bitcoin size={18} className="shrink-0" />
      
      {prices.map(crypto => (
        <div key={crypto.symbol} className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold">{crypto.symbol}</span>
          <span>${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`text-xs ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
