
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CorporifyForm from '@/components/CorporifyForm';
import SEO from '@/components/SEO';

const AppPage = () => {
  const { user } = useAuth();

  // Enhanced schema data for the app page
  const appPageSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Corporify Message Editor",
    "applicationCategory": "BusinessApplication",
    "description": "Transform casual messages into professionally-crafted business communications with our AI-powered editor. Perfect for emails, Slack messages, and internal communications.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Web browser"
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SEO
        title="Professional Message Transformer | Corporify Editor"
        description="Transform casual messages into professional workplace communications instantly. Our AI-powered tool helps you craft perfect business emails, Slack messages, and team communications."
        path="/app"
        keywords="professional message editor, email rewriter, corporate language generator, business communication tool, workplace message transformer"
        schema={appPageSchema}
        ogType="website"
        ogImage="https://corporifyit.io/app-og-image.png"
      />
      
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-corporate-800 mb-4">
              Corporify It Professional Communication Tool
            </h1>
            <p className="text-lg text-corporate-600 max-w-2xl mx-auto">
              Transform your casual messages into polished, professional communications with our AI-powered tool.
            </p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <CorporifyForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppPage;
