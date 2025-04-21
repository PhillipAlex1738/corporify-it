
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackFormData {
  user_email: string;
  functionality_rating: number;
  ui_rating: number;
  recommendation_rating: number;
  additional_comments?: string;
}

// Define the feedback table structure to properly type our Supabase operations
interface FeedbackTable {
  id: string;
  user_email: string;
  functionality_rating: number;
  ui_rating: number;
  recommendation_rating: number;
  additional_comments?: string;
  created_at: string;
}

const FeedbackForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    defaultValues: {
      user_email: "",
      functionality_rating: 5,
      ui_rating: 5,
      recommendation_rating: 5,
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      // Use the REST API directly since TypeScript doesn't know about our new table yet
      const response = await fetch(`https://omxtrdmtdrdovculcywf.supabase.co/rest/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teHRyZG10ZHJkb3ZjdWxjeXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjc0OTYsImV4cCI6MjA1OTc0MzQ5Nn0.X3d2EfZyqAbJofb98ypnJt7tH7jKx1PdG58DRgZ9qQo',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify([data])
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: "Thank you for your feedback!",
        description: "Your response has been recorded successfully.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting feedback",
        description: "Please try again later.",
      });
      console.error("Feedback submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="user_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormDescription>
                Your email address will help us follow up if needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="functionality_rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How would you rate Corporify's functionality?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Rate from 1 (poor) to 5 (excellent)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ui_rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How would you rate our user interface?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Rate from 1 (poor) to 5 (excellent)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendation_rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How likely are you to recommend Corporify?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Rate from 1 (unlikely) to 5 (very likely)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additional_comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share any additional thoughts or suggestions..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
