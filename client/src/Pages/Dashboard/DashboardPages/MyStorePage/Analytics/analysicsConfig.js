export const config = {
  metrics: [
    {
      iconType: 'users',
      label: 'Visits',
      value: '0',
      id: 'visits',
      iconColor: 'text-green-500'
    },
    {
      iconType: 'mousePointerClick',
      label: 'Clicks',
      value: '0',
      id: 'clicks',
      iconColor: 'text-purple-500'
    },
    {
      iconType: 'clock',
      label: 'CTR',
      value: '0%',
      id: 'ctr',
      iconColor: 'text-blue-500'
    },
    {
      iconType: 'timer',
      label: 'Time to click',
      value: '0s',
      id: 'timeToClick',
      iconColor: 'text-orange-500'
    }
  ],

  chartData: [
    { date: 'Dec 08', uniqueVisits: 0, totalVisits: 0, totalClicks: 0, uniqueClicks: 0 },
    { date: 'Dec 09', uniqueVisits: 0, totalVisits: 0, totalClicks: 0, uniqueClicks: 0 },
    { date: 'Dec 10', uniqueVisits: 0, totalVisits: 0, totalClicks: 0, uniqueClicks: 0 },
    { date: 'Dec 11', uniqueVisits: 0, totalVisits: 0, totalClicks: 0, uniqueClicks: 0 },
    { date: 'Dec 12', uniqueVisits: 0, totalVisits: 0, totalClicks: 0, uniqueClicks: 0 },
    { date: 'Dec 13', uniqueVisits: 5, totalVisits: 4, totalClicks: 0, uniqueClicks: 0 },
    { date: 'Dec 14', uniqueVisits: 3, totalVisits: 3, totalClicks: 0, uniqueClicks: 0 }
  ],

  chartLegend: [
    { color: 'bg-green-200', label: 'Unique Visits', dataKey: 'uniqueVisits' },
    { color: 'bg-purple-200', label: 'Total Visits', dataKey: 'totalVisits' },
    { color: 'bg-blue-200', label: 'Total Clicks', dataKey: 'totalClicks' },
    { color: 'bg-gray-200', label: 'Unique Clicks', dataKey: 'uniqueClicks' }
  ],

  chartColors: {
    uniqueVisits: '#86efac',
    totalVisits: '#c084fc',
    totalClicks: '#93c5fd',
    uniqueClicks: '#e5e7eb'
  },

  timeRanges: [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 3 months', value: '3m' }
  ],

  referrersData: [
    { name: 'Organic', value: 30, color: '#94a3b8', percentage: '30%' },
    { name: 'Instagram', value: 40, color: '#fca5a5', percentage: '40%' },
    { name: 'Twitter', value: 30, color: '#fcd34d', percentage: '30%' }
  ],

  devicesData: [
    { name: 'Mobile', value: 35, color: '#94a3b8', percentage: '35%' },
    { name: 'Tablet', value: 35, color: '#fca5a5', percentage: '35%' },
    { name: 'Desktop', value: 30, color: '#fcd34d', percentage: '30%' }
  ]
};