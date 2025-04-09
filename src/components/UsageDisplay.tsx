
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

const UsageDisplay = () => {
  const { user } = useAuth();

  if (!user) return null;

  const { usageCount, usageLimit, isPremium } = user;
  const percentage = isPremium ? 100 : Math.min((usageCount / usageLimit) * 100, 100);
  
  return (
    <div className="w-full mt-2 mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">
          Today's Usage
        </span>
        <span className="text-sm font-medium">
          {usageCount}/{isPremium ? '∞' : usageLimit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default UsageDisplay;
