
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const feedbackSchema = z.object({
  user_email: z.string().email("Please enter a valid email address"),
  functionality_rating: z.number().int().min(1).max(5),
  ui_rating: z.number().int().min(1).max(5),
  recommendation_rating: z.number().int().min(1).max(5),
  additional_comments: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

// Add the onSubmit prop to the component interface
interface FeedbackFormProps {
  onSubmit?: () => void;
}

const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      user_email: "",
      functionality_rating: 5,
      ui_rating: 5,
      recommendation_rating: 5,
      additional_comments: "",
    },
  });

  const handleSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("feedback").insert([{
        user_email: data.user_email,
        functionality_rating: data.functionality_rating,
        ui_rating: data.ui_rating,
        recommendation_rating: data.recommendation_rating,
        additional_comments: data.additional_comments || null,
      }]);

      if (error) {
        console.error("Feedback submission error:", error);
        throw error;
      }

      toast({
        title: "Thank you for your feedback!",
        description: "Your response has been recorded successfully.",
      });
      
      // Call the onSubmit callback if provided
      if (onSubmit) onSubmit();
      
      navigate("/");
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      toast({
        variant: "destructive",
        title: "Error submitting feedback",
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="feedback-form-heading">
      <h2 id="feedback-form-heading" className="text-2xl font-bold mb-6">Share Your Feedback</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <fieldset>
            <legend className="sr-only">Your Contact Information</legend>
            <FormField
              control={form.control}
              name="user_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} aria-required="true" />
                  </FormControl>
                  <FormDescription>
                    Your email address will help us follow up if needed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

          <fieldset>
            <legend className="sr-only">Rating Questions</legend>
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
                      aria-required="true"
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
                      aria-required="true"
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
                      aria-required="true"
                    />
                  </FormControl>
                  <FormDescription>
                    Rate from 1 (unlikely) to 5 (very likely)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

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
    </section>
  );
};

export default FeedbackForm;
