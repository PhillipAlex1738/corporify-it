
import { useState } from "react";
import SupportPageLayout from "@/components/support/SupportPageLayout";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import SEO from "@/components/SEO";

const Feedback = () => {
  const [submitted, setSubmitted] = useState(false);

  // Add schema for the feedback page
  const feedbackSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "User Feedback - Corporify",
    "description": "Share your experience and suggestions for Corporify. Help us improve our professional communication tool with your valuable feedback.",
    "mainEntity": {
      "@type": "ContactPoint",
      "contactType": "feedback",
      "email": "feedback@corporifyit.io"
    }
  };

  return (
    <>
      <SEO
        title="Submit Feedback & Suggestions | Corporify"
        description="Share your thoughts and suggestions about Corporify's professional communication tools. Your feedback directly shapes our product improvements and new features."
        path="/feedback"
        keywords="user feedback, product suggestions, user experience, feature requests, improvement ideas"
        ogType="website"
        schema={feedbackSchema}
      />
      <SupportPageLayout>
        <article>
          <header>
            <h1 className="text-3xl font-bold mb-4">Your Feedback Matters</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Help us improve Corporify by sharing your experience and suggestions.
            </p>
          </header>
          
          {submitted ? (
            <section className="text-center">
              <h2 className="text-2xl font-bold mb-4">Thank you for your feedback!</h2>
              <p className="text-gray-600">We appreciate your input and will use it to improve Corporify.</p>
            </section>
          ) : (
            <FeedbackForm onSubmit={() => setSubmitted(true)} />
          )}
        </article>
      </SupportPageLayout>
    </>
  );
};

export default Feedback;
