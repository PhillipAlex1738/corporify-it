
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

const UsageDisplay = () => {
  const { user } = useAuth();
  
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

  const anonUsage = getAnonUsage();
  const FREE_DEMO_DAILY_LIMIT = 5;
  
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
      <Progress value={100} className="h-2" />
    </div>
  );
};

export default UsageDisplay;
