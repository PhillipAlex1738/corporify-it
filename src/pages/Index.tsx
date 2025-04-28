
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CorporifyForm from '@/components/CorporifyForm';
import SEO from '@/components/SEO';
import { 
  ArrowRight, 
  Zap, 
  Star, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Index = () => {
  const { user } = useAuth();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [demoInput, setDemoInput] = useState('');
  const [demoOutput, setDemoOutput] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  
  useEffect(() => {
    console.log("Index page: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
  }, [user]);

  useEffect(() => {
    if (demoInput) {
      // Simple transformation logic for demo purposes
      const toneMap = {
        professional: "We would like to inform you that the matter is under consideration and we will revert with a decision shortly.",
        diplomatic: "We appreciate your input on this matter and are carefully evaluating all aspects before providing a comprehensive response.",
        friendly: "Thanks for bringing this to our attention! We're looking into it and will get back to you soon with more details.",
        direct: "We're reviewing this matter and will provide our decision by end of week.",
        concise: "Under review. Response expected within 48 hours."
      };
      
      setTimeout(() => {
        setDemoOutput(toneMap[selectedTone as keyof typeof toneMap] || '');
      }, 500);
    } else {
      setDemoOutput('');
    }
  }, [demoInput, selectedTone]);

  // Structured data for rich search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Corporify",
    "applicationCategory": "BusinessApplication",
    "description": "Transform casual messages into polished professional language instantly. Enhance your workplace communication with our AI-powered rewriting tool.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SEO
        title="Corporify - AI Professional Communication Tool"
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-800 leading-tight">
                Transform Casual Messages into Professional Communication in Seconds
              </h1>
              
              <p className="text-lg md:text-xl text-navy-600 max-w-xl">
                The AI-powered tool that helps HR teams maintain consistent professional standards across all workplace communications
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link to="/app">
                  <Button className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-6 rounded-md text-lg">
                    Try Free Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Button variant="outline" className="border-coral-500 text-coral-500 hover:bg-coral-50 px-8 py-6 rounded-md text-lg" onClick={() => setIsVideoModalOpen(true)}>
                  <Clock className="mr-2 h-5 w-5" /> Watch How It Works
                </Button>
              </div>
            </div>
            
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
                <ArrowRight className="h-20 w-20 text-coral-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16 bg-white px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-navy-800">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="h-14 w-14 bg-coral-100 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy-800">Instant Transformation</h3>
              <p className="text-navy-600">Transform casual messages into professional communication instantly</p>
            </div>
            
            <div className="feature-card">
              <div className="h-14 w-14 bg-coral-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-7 w-7 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy-800">Multiple Tone Options</h3>
              <p className="text-navy-600">Choose from 5 professional tones: Formal, Diplomatic, Friendly, Direct, or Concise</p>
            </div>
            
            <div className="feature-card">
              <div className="h-14 w-14 bg-coral-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy-800">Template Library</h3>
              <p className="text-navy-600">100+ pre-approved HR communication templates</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-navy-800">
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
            <div className="text-xl italic text-navy-700 mb-6">
              "Corporify reduced our communication review time by 75% and improved our team's professional image."
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-bold text-xl">SC</span>
              </div>
              <div>
                <p className="font-bold">Sarah Chen</p>
                <p className="text-sm text-navy-600">HR Director at TechCorp</p>
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
            <div className="text-navy-700 font-medium">
              4.8/5 from 1000+ HR Professionals
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Demo */}
      <section className="py-16 bg-white px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-navy-800">
            Try It Yourself
          </h2>
          
          <div className="bg-navy-50 rounded-xl p-6 md:p-10 shadow-md">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block font-medium text-navy-800">Type your casual message here:</label>
                <textarea 
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Hey team! Just wanted to update you on the project..."
                  className="w-full h-40 p-4 rounded-md border border-gray-300 focus:ring-coral-500 focus:border-coral-500"
                />
                
                <div>
                  <label className="block font-medium text-navy-800 mb-2">Select Tone:</label>
                  <select 
                    value={selectedTone} 
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-coral-500 focus:border-coral-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="diplomatic">Diplomatic</option>
                    <option value="friendly">Friendly</option>
                    <option value="direct">Direct</option>
                    <option value="concise">Concise</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block font-medium text-navy-800">Your professional message:</label>
                <div className="w-full h-40 p-4 rounded-md bg-white border border-gray-300 overflow-y-auto">
                  {demoOutput ? (
                    <p>{demoOutput}</p>
                  ) : (
                    <p className="text-gray-400 italic">Your professional message will appear here...</p>
                  )}
                </div>
                
                <Button className="w-full bg-coral-500 hover:bg-coral-600" disabled={!demoInput}>
                  <Zap className="mr-2 h-4 w-4" /> Transform Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Elements */}
      <section className="py-12 bg-white px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-coral-500" />
              <span>256-bit encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-coral-500" />
              <span>GDPR compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-coral-500" />
              <span>SOC 2 certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-coral-500" />
              <span>14-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 corporify-gradient px-4">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your workplace communications?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of HR professionals using Corporify to maintain consistent professional standards.
          </p>
          <Link to="/app">
            <Button className="bg-white text-coral-500 hover:bg-gray-100 px-8 py-6 text-lg">
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
