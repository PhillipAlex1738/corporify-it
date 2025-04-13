
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SupportPageLayoutProps {
  children: ReactNode;
}

const SupportPageLayout = ({ children }: SupportPageLayoutProps) => {
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
        
        <div className="max-w-5xl mx-auto">
          <h1 className="font-playfair text-3xl font-bold mb-2">Customer Support</h1>
          <p className="text-muted-foreground mb-8">
            Need help with Corporify? We're here for you. Fill out the form below or check our FAQ.
          </p>
          
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPageLayout;
