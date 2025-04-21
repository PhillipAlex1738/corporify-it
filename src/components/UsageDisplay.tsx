
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

// Show nothing for anon (not signed in). For signed-in, show unlimited info.
const UsageDisplay = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Authenticated users now have unlimited usage for this demo.
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
