
-- This is a placeholder SQL migration file for future implementation
-- Execute this when ready to implement actual platform integrations

-- Create a table to track user platform integrations
CREATE TABLE IF NOT EXISTS public.platform_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  platform_user_id TEXT,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Add platform-specific metadata as JSONB for flexibility
  metadata JSONB,
  
  -- Add constraints
  UNIQUE(user_id, platform)
);

-- Add RLS policies to ensure users can only access their own integrations
ALTER TABLE public.platform_integrations ENABLE ROW LEVEL SECURITY;

-- Users can only view their own integrations
CREATE POLICY "Users can view their own integrations"
  ON public.platform_integrations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own integrations
CREATE POLICY "Users can create their own integrations"
  ON public.platform_integrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own integrations
CREATE POLICY "Users can update their own integrations"
  ON public.platform_integrations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own integrations
CREATE POLICY "Users can delete their own integrations"
  ON public.platform_integrations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create update trigger to keep updated_at current
CREATE OR REPLACE FUNCTION public.update_platform_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_integrations_updated_at
BEFORE UPDATE ON public.platform_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_platform_integrations_updated_at();
