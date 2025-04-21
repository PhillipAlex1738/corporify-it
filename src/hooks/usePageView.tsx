
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { error } = await supabase
          .rpc('increment_page_view', { page_path: location.pathname });

        if (error) {
          console.error('Error tracking page view:', error);
        }
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackPageView();
  }, [location.pathname]);
};
