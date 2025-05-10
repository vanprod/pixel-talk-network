
import React, { useState } from 'react';
import { ExternalLink, BookText } from 'lucide-react'; // Changed Story to BookText
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FriendsManager } from '@/components/FriendsManager';
import { StoryCreator } from '@/components/StoryCreator';

interface LinkItem {
  id: string;
  name: string;
  url: string;
  description?: string;
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
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

// Mock crypto news
const CRYPTO_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin Reaches New All-Time High',
    url: 'https://example.com/news/1',
    source: 'Crypto News',
    date: '2025-05-10'
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Update Scheduled for Next Month',
    url: 'https://example.com/news/2',
    source: 'DeFi Daily',
    date: '2025-05-09'
  },
  {
    id: '3',
    title: 'Top 10 Altcoins to Watch in 2025',
    url: 'https://example.com/news/3',
    source: 'Coin Insider',
    date: '2025-05-08'
  },
  {
    id: '4',
    title: 'New Regulations Impact Crypto Markets',
    url: 'https://example.com/news/4',
    source: 'BlockChain Times',
    date: '2025-05-07'
  }
];

export function ExternalLinksSidebar() {
  const [activeTab, setActiveTab] = useState('news');
  
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news" className="p-4 space-y-4 overflow-y-auto flex-1">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Crypto News</h3>
          <div className="space-y-4">
            {CRYPTO_NEWS.map(news => (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded border hover:bg-muted transition-colors"
              >
                <h4 className="font-medium text-sm">{news.title}</h4>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{news.source}</span>
                  <span>{news.date}</span>
                </div>
              </a>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="links" className="p-4 space-y-4 overflow-y-auto flex-1">
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
        </TabsContent>
        
        <TabsContent value="social" className="overflow-y-auto flex-1">
          <div className="space-y-4">
            <div className="border-b">
              <StoryCreator />
            </div>
            <FriendsManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
