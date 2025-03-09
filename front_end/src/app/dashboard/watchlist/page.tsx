import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { StockTable } from '@/components/dashboard/watchlist/stock-table';

export const metadata = { title: `Watch List | Dashboard | ${config.site.name}` } satisfies Metadata;

const testStockData = [
  {
    id: '1',
    name: 'NVIDIA Corporation',
    code: 'NVDA',
    exchange: 'NASDAQ',
    marketPrice: 850.32,
    dailyChange: 5.24,
  },
  {
    id: '2',
    name: 'Apple Inc.',
    code: 'AAPL',
    exchange: 'NASDAQ',
    marketPrice: 178.12,
    dailyChange: -1.45,
  },
  {
    id: '3',
    name: 'Tesla, Inc.',
    code: 'TSLA',
    exchange: 'NASDAQ',
    marketPrice: 695.21,
    dailyChange: -12.87,
  },
];

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Watch List</Typography>
      </div>

      <StockTable rows={testStockData} count={testStockData.length} page={0} rowsPerPage={5} />
    </Stack>
  );
}
