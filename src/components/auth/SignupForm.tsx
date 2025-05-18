
import React, { useState, useEffect } from 'react';
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
  
  const { signUp, isLoading, user } = useAuth();
  
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
        console.log("Signup timeout reached - resetting loading state");
        setLocalLoading(false);
        setError("Signup request timed out. Please try again.");
      }, 10000); // 10-second timeout
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [localLoading]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localLoading || isLoading) return; // Prevent multiple submissions
    
    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setLocalLoading(true);
    setError(null);
    console.log(`Attempting signup with email: ${email}`);
    
    try {
      const result = await signUp(email, password);
      console.log(`Signup attempt result:`, result);
      
      if (result.success) {
        console.log("Signup successful, closing modal");
        onSuccess();
      } else {
        // Only set error if one wasn't already set in the signup function
        setLocalLoading(false);
      }
    } catch (error: any) {
      console.error(`Signup error:`, error);
      setError(error?.message || `Sign up failed. Please try again.`);
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
