
import React, { useState, useEffect } from 'react';
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
  
  const { login, isLoading, user } = useAuth();
  
  // Clear error when input changes
  useEffect(() => {
    if (error) setError(null);
  }, [email, password, error]);
  
  // If we already have a user, trigger success callback
  useEffect(() => {
    if (user) {
      console.log("User already logged in, triggering success callback");
      onSuccess();
    }
  }, [user, onSuccess]);
  
  // Safety timeout to prevent infinite loading state
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (localLoading) {
      timeoutId = window.setTimeout(() => {
        console.log("Login timeout reached - resetting loading state");
        setLocalLoading(false);
        setError("Login attempt timed out. Please try again.");
      }, 8000); // Shorter 8-second timeout
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [localLoading]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (localLoading || isLoading) return;
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLocalLoading(true);
    setError(null);
    console.log(`Attempting login with email: ${email}`);
    
    try {
      const result = await login(email, password);
      console.log(`Login attempt result:`, result);
      
      if (result.success) {
        console.log("Login successful, closing modal");
        onSuccess();
      } else {
        // If login returns success: false but no error was thrown
        setError("Login failed. Please check your credentials and try again.");
        setLocalLoading(false);
      }
    } catch (error: any) {
      console.error(`Login error:`, error);
      setError(error?.message || `Login failed. Please try again.`);
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorDisplay error={error} />
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
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
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
        <Input
          id="password"
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
            Logging in...
          </>
        ) : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
