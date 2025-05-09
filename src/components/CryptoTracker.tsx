
import React, { useState, useEffect } from 'react';
import { Bitcoin, ArrowUp, ArrowDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  id: string;
}

// API key would normally be stored securely in environment variables
// This is a publishable demo API key only
const COINMARKETCAP_API_KEY = '3b7b8184-5426-4b8b-9a48-b2e3df5795d4';

const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  try {
    // For demo purposes, we'll continue to use mock data but structure it as if from an API
    // In a real application, you would make the actual API call:
    /*
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5', {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
      },
    });
    const data = await response.json();
    
    return data.data.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol,
      price: crypto.quote.USD.price,
      change24h: crypto.quote.USD.percent_change_24h,
    }));
    */
    
    // Mock data
    return [
      { id: '1', symbol: 'BTC', price: 52386.24, change24h: 2.5 },
      { id: '2', symbol: 'ETH', price: 2918.87, change24h: -1.2 },
      { id: '3', symbol: 'BNB', price: 589.33, change24h: 0.8 },
      { id: '4', symbol: 'SOL', price: 102.45, change24h: 5.3 },
    ];
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    toast({
      title: 'Failed to fetch crypto data',
      description: 'Could not retrieve the latest crypto prices.',
      variant: 'destructive',
    });
    return [];
  }
};

export function CryptoTracker() {
  const { data: prices = [], isLoading, error } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Animation state to track which price is changing
  const [animatingPrices, setAnimatingPrices] = useState<Record<string, number>>({});
  
  // Update animation states when prices change
  useEffect(() => {
    if (prices.length > 0) {
      const newAnimatingPrices: Record<string, number> = {};
      
      prices.forEach(crypto => {
        newAnimatingPrices[crypto.id] = crypto.price;
      });
      
      setAnimatingPrices(prev => {
        const updatedStates: Record<string, number> = {};
        
        Object.keys(newAnimatingPrices).forEach(id => {
          if (prev[id] !== newAnimatingPrices[id]) {
            updatedStates[id] = newAnimatingPrices[id];
          }
        });
        
        return { ...prev, ...updatedStates };
      });
    }
  }, [prices]);
  
  if (isLoading) {
    return <div className="flex justify-center py-2">Loading crypto prices...</div>;
  }
  
  if (error) {
    return <div className="text-destructive py-2">Failed to load crypto prices</div>;
  }
  
  return (
    <div className="flex space-x-4 overflow-x-auto scrollbar-none py-2">
      <Bitcoin size={18} className="shrink-0 animate-pulse" />
      
      {prices.map(crypto => (
        <div 
          key={crypto.symbol} 
          className={`flex items-center space-x-2 whitespace-nowrap transition-all 
                     ${animatingPrices[crypto.id] === crypto.price ? 'animate-pulse' : ''}`}
        >
          <span className="font-bold">{crypto.symbol}</span>
          <span className="transition-colors">
            ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-xs flex items-center ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {crypto.change24h >= 0 ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
            {Math.abs(crypto.change24h).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
