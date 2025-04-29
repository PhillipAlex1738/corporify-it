import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import VideoModal from '@/components/VideoModal';
import { 
  ArrowRight, 
  Zap, 
  Star, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  Clock,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  useEffect(() => {
    console.log("Index page: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
  }, [user]);

  // Structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Corporify It",
    "applicationCategory": "BusinessApplication",
    "description": "Transform casual messages into polished professional language instantly. Enhance your workplace communication with our AI-powered rewriting tool.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // Dropbox video URL
  const dropboxVideoUrl = "https://www.dropbox.com/scl/fi/vw6kr32j33nb479pt78z7/VQQRIMHUHP6F4C33.mp4?rlkey=lv9wpgb5xnfx2f30vmm2z64z2&st=5wy3ubeu&dl=0";

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SEO
        title="Corporify It - AI Professional Communication Tool"
        description="Transform casual messages into professional workplace communication in seconds. The AI-powered tool for HR teams to maintain consistent professional standards."
        path="/"
        keywords="corporate writing, professional emails, business communication, AI writing assistant, workplace communication, email tone"
        structuredData={structuredData}
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-corporate-800 leading-tight">
                Transform Casual Messages into Professional Communication in Seconds
              </h1>
              
              <p className="text-lg md:text-xl text-corporate-600 max-w-xl">
                The AI-powered tool that helps HR teams maintain consistent professional standards across all workplace communications
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link to="/app">
                  <Button className="bg-corporate-800 hover:bg-corporate-700 text-white px-8 py-6 rounded-md text-lg">
                    Try Free Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="border-corporate-800 text-corporate-800 hover:bg-corporate-50 px-8 py-6 rounded-md text-lg"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <Play className="mr-2 h-5 w-5" /> Watch How It Works
                </Button>
              </div>
            </div>
            
            {/* Video Modal */}
            <VideoModal 
              isOpen={isVideoModalOpen} 
              onClose={() => setIsVideoModalOpen(false)} 
              videoUrl={dropboxVideoUrl}
              videoType="external"
              title="How Corporify It Works"
              description="See how Corporify It transforms your casual communication into professional messages in seconds."
            />
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="message-casual animate-message-transform" style={{ animationDelay: "0.2s" }}>
                  <p className="mb-2 font-medium text-gray-500">Original message:</p>
                  <div className="space-y-2">
                    <p>Hey team! 🙌</p>
                    <p>Just FYI - we gotta push back the meeting tmrw bc something came up. Let's do it next week instead? Lmk if that works for u all! 😊</p>
                    <p>Thx!</p>
                  </div>
                </div>
                
                <div className="message-professional animate-message-transform" style={{ animationDelay: "0.6s" }}>
                  <p className="mb-2 font-medium text-gray-500">Professional version:</p>
                  <div className="space-y-2">
                    <p>Dear Team,</p>
                    <p>Please be advised that we need to reschedule tomorrow's meeting due to an unforeseen conflict. I propose we reconvene next week at the same time.</p>
                    <p>Kindly confirm if this adjustment works with your schedules.</p>
                    <p>Thank you for your understanding.</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-30">
                <ArrowRight className="h-20 w-20 text-corporate-800" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section id="features" className="py-16 bg-white px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-corporate-800">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Instant Transformation</h3>
              <p className="text-corporate-600">Transform casual messages into professional communication instantly</p>
            </div>
            
            <div className="feature-card">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Multiple Tone Options</h3>
              <p className="text-corporate-600">Choose from 5 professional tones: Formal, Diplomatic, Friendly, Direct, or Concise</p>
            </div>
            
            <div className="feature-card">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Template Library</h3>
              <p className="text-corporate-600">100+ pre-approved HR communication templates</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section id="testimonials" className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-corporate-800">
            Used by HR teams at Fortune 500 companies
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8 mb-16 opacity-70">
            <div className="h-12">
              <img src="https://placeholder.co/150x60?text=Company+Logo" alt="Company logo" className="h-full" />
            </div>
            <div className="h-12">
              <img src="https://placeholder.co/150x60?text=Company+Logo" alt="Company logo" className="h-full" />
            </div>
            <div className="h-12">
              <img src="https://placeholder.co/150x60?text=Company+Logo" alt="Company logo" className="h-full" />
            </div>
            <div className="h-12">
              <img src="https://placeholder.co/150x60?text=Company+Logo" alt="Company logo" className="h-full" />
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
            <div className="text-xl italic text-corporate-700 mb-6">
              "Corporify It reduced our communication review time by 75% and improved our team's professional image."
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-bold text-xl">SC</span>
              </div>
              <div>
                <p className="font-bold">Sarah Chen</p>
                <p className="text-sm text-corporate-600">HR Director at TechCorp</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-10 gap-2">
            <div className="flex">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-corporate-700 font-medium">
              4.8/5 from 1000+ HR Professionals
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Elements */}
      <section className="py-12 bg-white px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-corporate-800" />
              <span>256-bit encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-corporate-800" />
              <span>GDPR compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-corporate-800" />
              <span>SOC 2 certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-corporate-800" />
              <span>14-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-corporate-gradient px-4">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your workplace communications?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of HR professionals using Corporify It to maintain consistent professional standards.
          </p>
          <Link to="/app">
            <Button className="bg-white text-corporate-800 hover:bg-gray-100 px-8 py-6 text-lg">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
