import SupportPageLayout from "@/components/support/SupportPageLayout";
import SEO from "@/components/SEO";

const Terms = () => {
  // Add schema for the terms page
  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Corporify",
    "description": "Review Corporify's terms of service agreement. Learn about the rules, guidelines, and legal terms governing the use of our professional communication tool.",
    "mainEntity": {
      "@type": "Article",
      "name": "Corporify Terms of Service",
      "articleBody": "These terms of service outline the rules and regulations for using Corporify services."
    }
  };

  return (
    <>
      <SEO
        title="Terms of Service | User Agreement | Corporify"
        description="Review Corporify's terms of service and user agreement. Understand the guidelines and legal terms governing the use of our professional communication platform."
        path="/terms"
        keywords="terms of service, user agreement, legal terms, usage policy, service conditions"
        ogType="article"
        schema={termsSchema}
      />
      <SupportPageLayout>
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
          <p className="mb-4">
            Welcome to Corporify! These terms of service ("Terms") govern your
            use of our website and services. By accessing or using our services,
            you agree to be bound by these Terms.
          </p>

          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By using Corporify, you agree to these Terms and our Privacy Policy.
            If you do not agree, do not use our services.
          </p>

          <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
          <p className="mb-4">
            Corporify provides an AI-powered tool that transforms casual messages
            into professional communication.
          </p>

          <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
          <p className="mb-4">
            You may need to create an account to access certain features. You
            are responsible for maintaining the confidentiality of your account
            credentials.
          </p>

          <h2 className="text-xl font-semibold mb-2">4. Acceptable Use</h2>
          <p className="mb-4">
            You agree to use Corporify in compliance with all applicable laws and
            regulations. You will not use our services for any unlawful or
            prohibited purpose.
          </p>

          <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
          <p className="mb-4">
            All content and materials on Corporify are owned by us or our
            licensors and are protected by copyright and other intellectual
            property laws.
          </p>

          <h2 className="text-xl font-semibold mb-2">6. Disclaimer of Warranties</h2>
          <p className="mb-4">
            Corporify is provided "as is" without any warranties, express or
            implied. We do not guarantee the accuracy or reliability of our
            services.
          </p>

          <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
          <p className="mb-4">
            We are not liable for any damages arising out of your use of
            Corporify, including but not limited to direct, indirect, incidental,
            or consequential damages.
          </p>

          <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
          <p className="mb-4">
            We may modify these Terms at any time. Your continued use of
            Corporify after any changes constitutes acceptance of the new Terms.
          </p>

          <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
          <p className="mb-4">
            These Terms are governed by the laws of the jurisdiction in which we
            are located.
          </p>

          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:support@corporifyit.io">support@corporifyit.io</a>.
          </p>
        </div>
      </SupportPageLayout>
    </>
  );
};

export default Terms;
