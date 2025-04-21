
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
    // Using .from().rpc() instead of direct .rpc() call
    const { data, error } = await supabase
      .from('analytics_pages')
      .rpc('get_total_page_views', { 
        start_date: startDate?.toISOString() 
      });
    
    if (error) throw error;
    return data;
  };

  const fetchUniqueViews = async () => {
    // Using .from().rpc() instead of direct .rpc() call
    const { data, error } = await supabase
      .from('analytics_pages')
      .rpc('get_unique_page_views', { 
        start_date: startDate?.toISOString() 
      });
    
    if (error) throw error;
    return data;
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
