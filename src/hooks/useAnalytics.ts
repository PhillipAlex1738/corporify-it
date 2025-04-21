
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
    const query = supabase
      .from('analytics_pages')
      .select(`
        path,
        analytics_page_views (count)
      `)
      .eq('analytics_page_views.created_at', startDate ? 'created_at >= $1' : 'true', startDate?.toISOString())
      .order('path');

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to match expected format
    return data?.map(item => ({
      page_path: item.path,
      total_views: parseInt(item.analytics_page_views[0]?.count || '0')
    })) || [];
  };

  const fetchUniqueViews = async () => {
    // For unique views, count distinct page views by page path
    const query = supabase
      .from('analytics_pages')
      .select(`
        path,
        analytics_page_views (
          id
        )
      `)
      .eq('analytics_page_views.created_at', startDate ? 'created_at >= $1' : 'true', startDate?.toISOString())
      .order('path');

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
