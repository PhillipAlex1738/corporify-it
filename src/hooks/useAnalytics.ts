
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type ViewStats = {
  page_path: string;
  total_views: number;
  unique_views: number;
  first_view: string;
  last_view: string;
}

export const useAnalytics = (startDate?: Date) => {
  const fetchTotalViews = async () => {
    // Instead of RPC, use direct query to get total page views
    let query = supabase
      .from('analytics_pages')
      .select(`
        path,
        analytics_page_views (count)
      `)
      .order('path');
      
    // Add date filter if startDate is provided
    if (startDate) {
      query = query.gte('analytics_page_views.created_at', startDate.toISOString());
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to match expected format
    return data?.map(item => ({
      page_path: item.path,
      total_views: parseInt(item.analytics_page_views[0]?.count || '0', 10)
    })) || [];
  };

  const fetchUniqueViews = async () => {
    // For unique views, count distinct page views by page path
    let query = supabase
      .from('analytics_pages')
      .select(`
        path,
        analytics_page_views (
          id
        )
      `)
      .order('path');
      
    // Add date filter if startDate is provided
    if (startDate) {
      query = query.gte('analytics_page_views.created_at', startDate.toISOString());
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform to count unique views
    return data?.map(item => ({
      page_path: item.path,
      unique_views: new Set(item.analytics_page_views.map(view => view.id)).size
    })) || [];
  };

  const totalViews = useQuery({
    queryKey: ['totalPageViews', startDate],
    queryFn: fetchTotalViews
  });

  const uniqueViews = useQuery({
    queryKey: ['uniquePageViews', startDate],
    queryFn: fetchUniqueViews
  });

  return {
    totalViews: totalViews.data ?? [],
    uniqueViews: uniqueViews.data ?? [],
    isLoading: totalViews.isLoading || uniqueViews.isLoading,
    error: totalViews.error || uniqueViews.error
  };
};
