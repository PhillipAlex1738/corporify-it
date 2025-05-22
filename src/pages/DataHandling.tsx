import SupportPageLayout from "@/components/support/SupportPageLayout";
import SEO from "@/components/SEO";

const DataHandling = () => {
  // Add schema for the data handling page
  const dataHandlingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Data Handling Practices - Corporify",
    "description": "Understand how Corporify securely processes and stores your data. Learn about our encryption standards, data retention policies, and compliance with privacy regulations.",
    "mainEntity": {
      "@type": "Article",
      "name": "Corporify Data Handling Practices",
      "articleBody": "This document outlines how Corporify handles, processes, and secures user data."
    }
  };

  return (
    <>
      <SEO
        title="Data Handling & Security Practices | Corporify"
        description="Learn about Corporify's data handling protocols, encryption standards, and security measures. We prioritize protecting your sensitive business communications with enterprise-grade security."
        path="/data-handling"
        keywords="data handling, data security, information protection, encryption standards, data privacy"
        ogType="article"
        schema={dataHandlingSchema}
      />
      <SupportPageLayout>
        <section className="container max-w-5xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Data Handling Practices</h1>
          <p className="mb-6">
            At Corporify, we are committed to protecting the privacy and security of your data. This page outlines our practices for handling and securing your information.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Data Collection</h2>
            <p>
              We collect data necessary to provide and improve our services. This includes:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>User Data:</strong> Information you provide when using our services, such as text inputs for transformation.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our services, such as features used and frequency of use.
              </li>
              <li>
                <strong>Technical Data:</strong> Information about your device and connection, such as IP address, browser type, and operating system.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Data Usage</h2>
            <p>
              We use your data to:
            </p>
            <ul className="list-disc pl-5">
              <li>
                Provide and improve our services.
              </li>
              <li>
                Personalize your experience.
              </li>
              <li>
                Communicate with you about updates and support.
              </li>
              <li>
                Ensure the security and integrity of our platform.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p>
              We implement robust security measures to protect your data from unauthorized access, use, or disclosure. These measures include:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Encryption:</strong> We use industry-standard encryption to protect your data in transit and at rest.
              </li>
              <li>
                <strong>Access Controls:</strong> We restrict access to your data to authorized personnel only.
              </li>
              <li>
                <strong>Regular Audits:</strong> We conduct regular security audits to identify and address potential vulnerabilities.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
            <p>
              We retain your data only for as long as necessary to provide our services and as required by law. When your data is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
            <p>
              We do not share your personal data with third parties except as necessary to provide our services or as required by law. This may include:
            </p>
            <ul className="list-disc pl-5">
              <li>
                Service providers who assist us in providing our services (e.g., hosting providers, payment processors).
              </li>
              <li>
                Legal authorities when required by law.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-5">
              <li>
                Access your data.
              </li>
              <li>
                Correct inaccuracies in your data.
              </li>
              <li>
                Request deletion of your data.
              </li>
              <li>
                Object to the processing of your data.
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at <a href="mailto:support@corporifyit.io">support@corporifyit.io</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p>
              If you have any questions or concerns about our data handling practices, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:support@corporifyit.io">support@corporifyit.io</a>
            </p>
          </section>
        </section>
      </SupportPageLayout>
    </>
  );
};

export default DataHandling;
