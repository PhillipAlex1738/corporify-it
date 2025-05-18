
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ErrorDisplay from './ErrorDisplay';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localLoading || isLoading) return; // Prevent multiple submissions
    
    setLocalLoading(true);
    setError(null);
    console.log(`Attempting login with email: ${email}`);
    
    try {
      const { success } = await login(email, password);
      console.log(`Login attempt result: ${success ? 'success' : 'failure'}`);
      if (success) {
        console.log("Login successful, closing modal");
        setTimeout(() => onSuccess(), 500); // Small delay to ensure state changes propagate
      }
    } catch (error: any) {
      console.error(`Login error:`, error);
      setError(error?.message || `Login failed. Please try again.`);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <ErrorDisplay error={error} />
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={localLoading || isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={localLoading || isLoading}
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
            Logging in...
          </>
        ) : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
