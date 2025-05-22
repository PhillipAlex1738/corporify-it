import SupportPageLayout from "@/components/support/SupportPageLayout";
import SEO from "@/components/SEO";

const Privacy = () => {
  // Add schema for the privacy page
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Corporify",
    "description": "Learn how Corporify protects your data and privacy. Our comprehensive privacy policy outlines how we collect, use, and safeguard your information.",
    "mainEntity": {
      "@type": "Article",
      "name": "Corporify Privacy Policy",
      "articleBody": "This privacy policy outlines how Corporify collects, uses, and protects your personal information."
    }
  };

  return (
    <>
      <SEO
        title="Privacy Policy | Data Protection | Corporify"
        description="Learn how we protect your data at Corporify. Our privacy policy outlines our commitment to security, GDPR compliance, and responsible data handling practices."
        path="/privacy"
        keywords="privacy policy, data protection, GDPR compliance, information security, data handling"
        ogType="article"
        schema={privacySchema}
      />
      <SupportPageLayout>
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
          
          <p className="mb-4">
            Your privacy is important to us. This Privacy Policy explains how Corporify collects, uses, and protects your personal information.
          </p>

          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, fill out a form, or contact us. This information may include your name, email address, and any other details you choose to share.
          </p>

          <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to provide, maintain, and improve our services, to communicate with you, and to personalize your experience. We may also use your information for research and analytics purposes.
          </p>

          <h2 className="text-xl font-semibold mb-2">Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to protect your information from unauthorized access, use, or disclosure. These measures include encryption, firewalls, and regular security assessments.
          </p>

          <h2 className="text-xl font-semibold mb-2">GDPR Compliance</h2>
          <p className="mb-4">
            We are committed to complying with the General Data Protection Regulation (GDPR). You have the right to access, correct, or delete your personal information. Contact us at support@corporifyit.io to exercise these rights.
          </p>

          <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website.
          </p>

          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@corporifyit.io.
          </p>
        </div>
      </SupportPageLayout>
    </>
  );
};

export default Privacy;
