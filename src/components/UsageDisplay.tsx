import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

function resetAnonUsageIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const usageJSON = localStorage.getItem('corporify_anon_usage');
    if (usageJSON) {
      const data = JSON.parse(usageJSON);
      if (data.date !== today) {
        localStorage.setItem('corporify_anon_usage', JSON.stringify({ date: today, count: 0 }));
      }
    }
  } catch {
    // ignore
  }
}

const UsageDisplay = () => {
  const { user } = useAuth();
  const [anonUsage, setAnonUsage] = useState(0);
  const FREE_DEMO_DAILY_LIMIT = 5;
  
  // Get anonymous usage count from localStorage
  const getAnonUsage = () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const usageJSON = localStorage.getItem('corporify_anon_usage');
      if (usageJSON) {
        const data = JSON.parse(usageJSON);
        if (data.date === today) return data.count || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  // Update the usage count whenever the component renders
  useEffect(() => {
    resetAnonUsageIfNeeded();
    setAnonUsage(getAnonUsage());
    console.log("UsageDisplay: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
    console.log("UsageDisplay: Anonymous usage:", getAnonUsage());
  }, [user]);
  
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
