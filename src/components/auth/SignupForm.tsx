
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ErrorDisplay from './ErrorDisplay';

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localLoading || isLoading) return; // Prevent multiple submissions
    
    setLocalLoading(true);
    setError(null);
    console.log(`Attempting signup with email: ${email}`);
    
    try {
      const { success } = await signUp(email, password);
      console.log(`Signup attempt result: ${success ? 'success' : 'failure'}`);
      if (success) {
        console.log("Signup successful, closing modal");
        setTimeout(() => onSuccess(), 500); // Small delay to ensure state changes propagate
      }
    } catch (error: any) {
      console.error(`Signup error:`, error);
      setError(error?.message || `Sign up failed. Please try again.`);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorDisplay error={error} />
      
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={localLoading || isLoading}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
        <Input
          id="signup-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={localLoading || isLoading}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-corporate-800 hover:bg-corporate-900"
        disabled={localLoading || isLoading}
      >
        {(localLoading || isLoading) ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;
