
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Feedback = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8 flex-1">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-3xl font-bold mb-2">Your Feedback Matters</h1>
          <p className="text-muted-foreground mb-8">
            Help us improve Corporify by sharing your experience. Your feedback is valuable to us.
          </p>
          
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;
