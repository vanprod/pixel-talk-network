
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkItem {
  id: string;
  name: string;
  url: string;
  description?: string;
}

// Mock external links
const EXTERNAL_LINKS: LinkItem[] = [
  {
    id: '1',
    name: 'CoinGecko',
    url: 'https://coingecko.com',
    description: 'Cryptocurrency prices and market data'
  },
  {
    id: '2',
    name: 'Binance',
    url: 'https://binance.com',
    description: 'Leading cryptocurrency exchange'
  },
  {
    id: '3',
    name: 'CoinMarketCap',
    url: 'https://coinmarketcap.com',
    description: 'Cryptocurrency market cap rankings'
  },
  {
    id: '4',
    name: 'GitHub',
    url: 'https://github.com',
    description: 'Code repository'
  }
];

export function ExternalLinksSidebar() {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground">External Resources</h3>
      
      <div className="space-y-2">
        {EXTERNAL_LINKS.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 rounded hover:bg-muted transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink size={16} />
              <span className="font-medium">{link.name}</span>
            </div>
            {link.description && (
              <p className="text-xs text-muted-foreground ml-6 mt-1">
                {link.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
