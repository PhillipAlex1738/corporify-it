import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
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
          <h1 className="font-playfair text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Corporify It, you agree to be bound by these Terms of Service. If you don't agree to these terms, you should not use our service.
            </p>
            <h2>2. Use of Service</h2>
            <p>
              Corporify provides a text transformation service that converts casual text into professional workplace communication. You may use our service only for lawful purposes and in accordance with these Terms.
            </p>
            <h2>3. User Accounts</h2>
            <p>
              When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <h2>4. Usage Limits</h2>
            <p>
              Free accounts have a limited number of transformations per day. Premium accounts have unlimited transformations. We reserve the right to modify these limits at any time.
            </p>
            <h2>5. Intellectual Property</h2>
            <p>
              The content you submit remains yours. However, you grant us a license to use, process, and store your content as necessary to provide our services.
            </p>
            <h2>6. Modifications to the Service</h2>
            <p>
              We reserve the right to modify or discontinue the service temporarily or permanently with or without notice.
            </p>
            <h2>7. Limitation of Liability</h2>
            <p>
              Corporify and its suppliers shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the jurisdiction where we are established, without regard to its conflict of law provisions.
            </p>
            <p className="text-sm mt-8">Last Updated: April 12, 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
