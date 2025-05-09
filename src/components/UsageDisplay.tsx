
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { FREE_DEMO_DAILY_LIMIT } from '@/hooks/useCorporify';
import { toast } from "sonner";

function resetAnonUsageIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const usageJSON = localStorage.getItem('corporify_anon_usage');
    if (usageJSON) {
      const data = JSON.parse(usageJSON);
      if (data.date !== today) {
        console.log(`UsageDisplay: Resetting anonymous usage from ${data.date} to ${today}`);
        localStorage.setItem('corporify_anon_usage', JSON.stringify({ date: today, count: 0 }));
      }
    }
  } catch (error) {
    console.error('UsageDisplay: Error resetting anonymous usage:', error);
  }
}

const UsageDisplay = () => {
  const { user } = useAuth();
  const [anonUsage, setAnonUsage] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('');
  
  // Get anonymous usage count from localStorage
  const getAnonUsage = () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const usageJSON = localStorage.getItem('corporify_anon_usage');
      if (usageJSON) {
        const data = JSON.parse(usageJSON);
        if (data.date === today) return data.count || 0;
      }
      
      // If no usage found or it's for a different date, initialize to 0
      if (!usageJSON || JSON.parse(usageJSON).date !== today) {
        localStorage.setItem('corporify_anon_usage', JSON.stringify({ date: today, count: 0 }));
      }
      
      return 0;
    } catch (error) {
      console.error('UsageDisplay: Error getting anonymous usage:', error);
      return 0;
    }
  };

  // Update the usage count whenever the component renders
  useEffect(() => {
    try {
      resetAnonUsageIfNeeded();
      setAnonUsage(getAnonUsage());
      setLastRefreshTime(new Date().toISOString());
      console.log("UsageDisplay: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
      console.log("UsageDisplay: Anonymous usage:", getAnonUsage());
    } catch (error) {
      console.error("UsageDisplay: Error in initial usage check:", error);
    }
  }, [user]);
  
  // Add event listener for storage changes to update counter in real-time
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'corporify_anon_usage') {
        try {
          console.log("UsageDisplay: Storage event detected for corporify_anon_usage");
          setAnonUsage(getAnonUsage());
          setLastRefreshTime(new Date().toISOString());
        } catch (error) {
          console.error("UsageDisplay: Error handling storage event:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-window updates
    const handleCustomStorageChange = () => {
      try {
        console.log("UsageDisplay: Custom event 'corporifyUsageUpdated' detected");
        setAnonUsage(getAnonUsage());
        setLastRefreshTime(new Date().toISOString());
      } catch (error) {
        console.error("UsageDisplay: Error handling custom event:", error);
      }
    };
    
    window.addEventListener('corporifyUsageUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('corporifyUsageUpdated', handleCustomStorageChange);
    };
  }, []);

  // Force refresh every 2 seconds to catch any changes in localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const newUsage = getAnonUsage();
        if (newUsage !== anonUsage) {
          console.log(`UsageDisplay: Usage updated from ${anonUsage} to ${newUsage}`);
          setAnonUsage(newUsage);
          setLastRefreshTime(new Date().toISOString());
        }
      } catch (error) {
        console.error("UsageDisplay: Error in interval refresh:", error);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [anonUsage]);
  
  // For anonymous users, show limited usage
  if (!user) {
    const usagePercent = (anonUsage / FREE_DEMO_DAILY_LIMIT) * 100;
    return (
      <div className="w-full mt-2 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">
            Today's Usage (Free Demo)
          </span>
          <span className="text-sm font-medium">
            {anonUsage} / {FREE_DEMO_DAILY_LIMIT}
          </span>
        </div>
        <Progress value={usagePercent} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          Sign in for unlimited transformations
        </p>
      </div>
    );
  }

  // For authenticated users, show unlimited usage
  return (
    <div className="w-full mt-2 mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">
          Today's Usage
        </span>
        <span className="text-sm font-medium">
          Unlimited
        </span>
      </div>
      <Progress value={100} className="h-2 bg-corporate-100" />
      <p className="text-xs text-corporate-600 mt-1">
        You have unlimited transformations as a signed-in user
      </p>
    </div>
  );
};

export default UsageDisplay;
