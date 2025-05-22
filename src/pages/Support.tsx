import SupportPageLayout from "@/components/support/SupportPageLayout";
import ContactForm from "@/components/support/ContactForm";
import SupportInfo from "@/components/support/SupportInfo";
import SEO from "@/components/SEO";

const Support = () => {
  // Add schema for the support page
  const supportSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Customer Support - Corporify",
    "description": "Get help with Corporify. Our dedicated support team is ready to assist you with any questions about our professional communication tool.",
    "mainEntity": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "availableLanguage": ["English"],
      "email": "support@corporifyit.io"
    }
  };

  return (
    <>
      <SEO
        title="Customer Support & Help Center | Corporify"
        description="Get expert assistance with Corporify's professional communication tools. Our support team is ready to help with account issues, feature questions, and technical support."
        path="/support"
        keywords="customer support, help center, technical assistance, service support, contact us"
        ogType="website"
        schema={supportSchema}
      />
      <SupportPageLayout>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ContactForm />
          </div>
          <div>
            <SupportInfo />
          </div>
        </div>
      </SupportPageLayout>
    </>
  );
};

export default Support;
