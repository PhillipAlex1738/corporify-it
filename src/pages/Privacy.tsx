
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
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
          <h1 className="font-playfair text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              At Corporify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our text transformation service.
            </p>
            <h2>2. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including:
            </p>
            <ul>
              <li>Account information (email address)</li>
              <li>Text content submitted for transformation</li>
              <li>Usage data and interaction with our service</li>
            </ul>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process your requests and transformations</li>
              <li>Communicate with you about your account</li>
              <li>Monitor and analyze usage patterns</li>
            </ul>
            <h2>4. Data Retention</h2>
            <p>
              We retain your transformed text for a limited period to provide you with a history of your transformations. You can delete your data at any time through your account settings.
            </p>
            <h2>5. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
            </p>
            <h2>6. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-sm mt-8">Last Updated: April 12, 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
