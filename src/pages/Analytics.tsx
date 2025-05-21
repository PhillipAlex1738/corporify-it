
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, subDays } from 'date-fns';
import { Loader2, BarChart3, Users } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<string>('all');
  
  // Calculate date filters based on the selected time range
  const getDateFilter = (): Date | undefined => {
    switch (timeRange) {
      case '7days':
        return subDays(new Date(), 7);
      case '30days':
        return subDays(new Date(), 30);
      case 'all':
      default:
        return undefined;
    }
  };

  const { totalViews, uniqueViews, isLoading, error } = useAnalytics(getDateFilter());

  // Combine total and unique views data for the chart
  const chartData = totalViews.map(page => {
    const uniqueViewCount = uniqueViews.find(u => u.page_path === page.page_path)?.unique_views || 0;
    return {
      name: page.page_path.replace('/', '') || 'Home',
      total: page.total_views,
      unique: uniqueViewCount
    };
  });

  const totalPageViews = totalViews.reduce((sum, item) => sum + item.total_views, 0);
  const totalUniqueViews = uniqueViews.reduce((sum, item) => sum + item.unique_views, 0);

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | Corporify</title>
        <meta name="description" content="View page analytics and user activity statistics" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 py-10 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-corporate-800 mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track and analyze page views and user activity
              </p>
            </div>
            
            <div className="flex justify-end mb-6">
              <Select 
                value={timeRange} 
                onValueChange={(value) => setTimeRange(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-corporate-600" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">
                Error loading analytics data. Please try again.
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Page Views
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalPageViews}</div>
                      <p className="text-xs text-muted-foreground">
                        Total page visits across all pages
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Unique Page Views
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalUniqueViews}</div>
                      <p className="text-xs text-muted-foreground">
                        Unique page visits across all pages
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Page Views Analytics</CardTitle>
                    <CardDescription>
                      Comparison of total vs unique page views per page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartContainer 
                      config={{
                        total: { label: "Total Views" },
                        unique: { label: "Unique Views" }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={70} 
                            tickFormatter={(value) => value || 'Home'}
                          />
                          <YAxis />
                          <ChartTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    {payload.map((entry, index) => (
                                      <div key={`tooltip-${index}`}>
                                        {entry.name === 'total' ? 'Total Views: ' : 'Unique Views: '}
                                        {entry.value}
                                      </div>
                                    ))}
                                  </ChartTooltipContent>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="total" fill="#4f46e5" name="total" />
                          <Bar dataKey="unique" fill="#10b981" name="unique" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Page View Details</CardTitle>
                    <CardDescription>
                      Detailed breakdown of views by page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Page</TableHead>
                          <TableHead className="text-right">Total Views</TableHead>
                          <TableHead className="text-right">Unique Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {totalViews.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No analytics data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          totalViews.map((page) => {
                            const uniqueViewCount = uniqueViews.find(u => u.page_path === page.page_path)?.unique_views || 0;
                            return (
                              <TableRow key={page.page_path}>
                                <TableCell className="font-medium">
                                  {page.page_path || '/'}
                                </TableCell>
                                <TableCell className="text-right">
                                  {page.total_views}
                                </TableCell>
                                <TableCell className="text-right">
                                  {uniqueViewCount}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AnalyticsPage;
