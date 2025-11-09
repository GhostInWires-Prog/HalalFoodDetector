export type HalalStatus = 'Halal' | 'Haram' | 'Doubtful';

export type ScanRecord = {
  id: string;
  productName: string;
  brand: string;
  scannedAt: string;
  status: HalalStatus;
  summary: string;
};

export type DashboardSnapshot = {
  lastScan?: ScanRecord;
  pendingReviews: number;
  verifiedCount: number;
  flaggedCount: number;
  quickTips: string[];
  insights: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
};

const mockHistory: ScanRecord[] = [
  {
    id: 'scan-001',
    productName: 'EverPure Onion Chips',
    brand: 'CrispyFields',
    scannedAt: 'Today • 10:12 AM',
    status: 'Doubtful',
    summary: 'Contains flavour enhancer E635 sourced from ambiguous yeast extract suppliers.',
  },
  {
    id: 'scan-002',
    productName: 'Organic Almond Milk',
    brand: 'PureHarvest',
    scannedAt: 'Yesterday • 6:45 PM',
    status: 'Halal',
    summary: 'No red-flag additives detected. Supplier certified by HalalFood Authority.',
  },
  {
    id: 'scan-003',
    productName: 'Instant Chicken Stock',
    brand: 'KitchenCraft',
    scannedAt: 'Wed • 3:07 PM',
    status: 'Haram',
    summary: 'Hydrolyzed animal protein uses non-certified poultry enzymes.',
  },
  {
    id: 'scan-004',
    productName: 'Matcha Latte Sachet',
    brand: 'ZenBrew',
    scannedAt: 'Tue • 11:22 AM',
    status: 'Doubtful',
    summary: 'Contains mono- and diglycerides without source disclosure.',
  },
];

const dashboardSnapshot: DashboardSnapshot = {
  lastScan: mockHistory[0],
  pendingReviews: 3,
  verifiedCount: 18,
  flaggedCount: 5,
  quickTips: [
    'Verify emulsifiers (E471/E472) origin with suppliers.',
    'Look for halal certification logo near the batch ID.',
    'Cross-check animal enzymes against our certified list.',
  ],
  insights: [
    {
      id: 'insight-1',
      icon: 'shield-checkmark',
      title: 'Certification Monitor',
      description: '7 of your favourite brands renewed their halal certificates this quarter.',
    },
    {
      id: 'insight-2',
      icon: 'leaf',
      title: 'New Vegan Matches',
      description: 'Plant-based alternatives now cover 80% of your frequently scanned categories.',
    },
  ],
};

const chatbotSeed = [
  {
    id: 'chat-1',
    author: 'assistant' as const,
    content: 'Assalamualaikum! Need help confirming if something is halal, haram, or doubtful today?',
    timestamp: 'Today • 09:45 AM',
  },
  {
    id: 'chat-2',
    author: 'user' as const,
    content: 'Waalaikum assalam! Please short-list haram additives for dairy drinks.',
    timestamp: 'Today • 09:46 AM',
  },
  {
    id: 'chat-3',
    author: 'assistant' as const,
    content:
      'Sure. Watch out for gelatine, carmine (E120), and rennet enzymes unless they are halal certified. Anything else?',
    timestamp: 'Today • 09:47 AM',
  },
];

export const halalGuidanceService = {
  getDashboardSnapshot(): DashboardSnapshot {
    return dashboardSnapshot;
  },

  getScanHistory(): ScanRecord[] {
    return mockHistory;
  },

  getChatSeed() {
    return chatbotSeed;
  },
};


