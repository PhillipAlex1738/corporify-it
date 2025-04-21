
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateSessionId } from '@/utils/session';
import { useToast } from '@/hooks/use-toast';

export const usePageView = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        console.log('Tracking page view for:', location.pathname);
        const sessionId = getOrCreateSessionId();
        
        // Updated to match the expected parameter structure
        const { error } = await supabase.rpc('increment_page_view', { 
          page_path: location.pathname
        });

        if (error) {
          console.error('Error tracking page view:', error);
        } else {
          console.log('Successfully tracked page view for:', location.pathname);
        }
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackPageView();
  }, [location.pathname]);
};
