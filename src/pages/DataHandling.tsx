
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Shield, Lock, Server } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DataHandling = () => {
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
          <h1 className="font-playfair text-3xl font-bold mb-6">Data Handling Documentation</h1>
          
          <div className="grid gap-8 mb-8">
            <div className="flex gap-4 items-start">
              <div className="bg-corporate-50 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-corporate-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Data Security</h2>
                <p className="text-muted-foreground">
                  All data transmitted to and from our servers is encrypted using industry-standard TLS encryption.
                  Your text submissions are processed on secure servers and are not stored permanently unless you've
                  explicitly saved them to your history.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-corporate-50 p-3 rounded-lg">
                <Lock className="h-6 w-6 text-corporate-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Data Storage</h2>
                <p className="text-muted-foreground">
                  We store minimal information necessary to provide our service. This includes your account details
                  (email) and your recent transformation history. We use Supabase, a secure database provider with
                  robust security measures.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-corporate-50 p-3 rounded-lg">
                <Server className="h-6 w-6 text-corporate-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
                <p className="text-muted-foreground">
                  Our text transformation leverages AI language models. Your submitted text is securely processed
                  through these services. We do not share your personal information with these providers beyond what is
                  necessary to deliver our service.
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <h2>Data Retention</h2>
            <p>
              We retain your transformation history for 30 days on free accounts and 90 days on premium accounts. After this period,
              historical data is automatically purged from our systems. You can manually delete your history at any time.
            </p>
            
            <h2>Data Access</h2>
            <p>
              Only authorized personnel have access to our databases and systems. All access is logged and monitored
              to prevent unauthorized use. We employ the principle of least privilege to minimize data access.
            </p>
            
            <h2>Your Data Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of your personal data</li>
              <li>Request deletion of your data</li>
              <li>Object to our processing of your data</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            
            <p>
              To exercise these rights, please contact our support team through the Customer Support page.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DataHandling;
