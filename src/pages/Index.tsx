
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { 
  ArrowRight, 
  Zap, 
  Star, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  Clock,
  Play,
  ExternalLink,
  Building,
  Shield,
  BarChart,
  Mail,
  AlertCircle,
  Slack
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  const [demoMessage, setDemoMessage] = useState("");
  const [corporifiedMessage, setCorporifiedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    console.log("Index page: User auth state:", user ? `Authenticated as ${user.email}` : "Not authenticated");
  }, [user]);

  // Simulate message transformation for demo
  const transformMessage = () => {
    if (!demoMessage.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const casualMessage = demoMessage;
      let professionalMessage = "";
      
      // Simple transformation rules for demo purposes
      if (casualMessage.toLowerCase().includes("meeting")) {
        professionalMessage = `Dear Team,\n\nI would like to inform you about an upcoming meeting scheduled for this project.\n\nPlease review the attached documents prior to our discussion.\n\nBest regards,\n[Your Name]`;
      } else if (casualMessage.toLowerCase().includes("deadline")) {
        professionalMessage = `Dear Colleagues,\n\nThis is a friendly reminder about the approaching deadline for our current project.\n\nKindly ensure all deliverables are submitted by the specified date.\n\nThank you for your attention to this matter.\n\nBest regards,\n[Your Name]`;
      } else {
        professionalMessage = `Dear Recipient,\n\nThank you for your message. I appreciate your input on this matter.\n\nI will review the information provided and respond appropriately at my earliest convenience.\n\nKind regards,\n[Your Name]`;
      }
      
      setCorporifiedMessage(professionalMessage);
      setIsProcessing(false);
    }, 1500);
  };

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

  // Direct Dropbox video URL - updated with raw=1 parameter
  const dropboxVideoUrl = "https://dl.dropboxusercontent.com/scl/fi/vw6kr32j33nb479pt78z7/VQQRIMHUHP6F4C33.mp4?rlkey=lv9wpgb5xnfx2f30vmm2z64z2&raw=1";

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <SEO
        title="AI-Powered Tool to Professionalize Work Messages | Corporify It"
        description="Corporify It instantly transforms casual or blunt workplace messages into polished, professional communication. Trusted by HR and Fortune 500 teams."
        path="/"
        keywords="corporate writing, professional emails, business communication, AI writing assistant, workplace communication, email tone, AI to make emails sound professional, Slack tone rewriter for teams, HR-approved communication assistant"
        structuredData={structuredData}
      />
      
      <Header />
      
      {/* Hero Section with Interactive Demo */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-cream to-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-corporate-800 leading-tight">
                Transform Casual Messages into Professional Communication
              </h1>
              
              <p className="text-lg md:text-xl text-corporate-600 max-w-xl leading-relaxed">
                The AI-powered tool trusted by HR teams to maintain consistent professional standards across all workplace communications
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link to="/app">
                  <Button className="bg-corporate-800 hover:bg-corporate-700 text-white px-8 py-6 rounded-md text-lg shadow-lg hover:shadow-xl transition-all">
                    Try It Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <a 
                  href={dropboxVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    className="border-corporate-800 text-corporate-800 hover:bg-corporate-50 px-6 py-6 rounded-md text-lg"
                  >
                    <Play className="mr-2 h-5 w-5" /> Watch Demo
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-medium text-lg mb-4 text-corporate-800">Try it yourself:</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="demo-input" className="block text-sm font-medium text-corporate-600 mb-1">
                    Enter your casual message:
                  </label>
                  <textarea 
                    id="demo-input"
                    className="w-full border border-gray-200 rounded-md p-3 h-32 focus:ring-1 focus:ring-corporate-500 focus:border-corporate-500"
                    placeholder="Example: Hey team! Just dropping a note about the upcoming meeting next week. Let me know if you can make it!"
                    value={demoMessage}
                    onChange={(e) => setDemoMessage(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={transformMessage}
                    disabled={isProcessing || !demoMessage.trim()}
                    className="bg-corporate-600 hover:bg-corporate-700 text-white px-6 py-2"
                  >
                    {isProcessing ? "Transforming..." : "Corporify It"}
                    {isProcessing ? <Clock className="ml-2 h-5 w-5 animate-spin" /> : <Zap className="ml-2 h-5 w-5" />}
                  </Button>
                </div>
                
                {corporifiedMessage && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-corporate-600 mb-1">
                      Professional version:
                    </label>
                    <div className="bg-corporate-50 border border-corporate-100 rounded-md p-3 whitespace-pre-line">
                      {corporifiedMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Features */}
      <section id="features" className="py-16 bg-white px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-corporate-800">
            Key Features
          </h2>
          
          <p className="text-center text-corporate-600 max-w-2xl mx-auto mb-16">
            Our AI-powered tool helps HR teams and professionals maintain consistent communication standards
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Instant Transformation</h3>
              <p className="text-corporate-600">Transform casual messages into professional communication instantly with our AI technology</p>
            </div>
            
            <div className="feature-card hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Multiple Tone Options</h3>
              <p className="text-corporate-600">Choose from 5 professional tones: Formal, Diplomatic, Friendly, Direct, or Concise</p>
            </div>
            
            <div className="feature-card hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Template Library</h3>
              <p className="text-corporate-600">Access 100+ pre-approved HR communication templates for common workplace scenarios</p>
            </div>
            
            <div className="feature-card hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <Slack className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Platform Integration</h3>
              <p className="text-corporate-600">Seamlessly works with Slack, Gmail, and Microsoft Teams to professionalize all your communications</p>
            </div>
            
            <div className="feature-card hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Enterprise Security</h3>
              <p className="text-corporate-600">SOC 2 certified with full GDPR compliance and 256-bit encryption for maximum data protection</p>
            </div>
            
            <div className="feature-card hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-14 w-14 bg-corporate-100 rounded-full flex items-center justify-center mb-6">
                <BarChart className="h-7 w-7 text-corporate-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-corporate-800">Analytics Dashboard</h3>
              <p className="text-corporate-600">Track usage patterns and improvement metrics across your organization</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-corporate-50">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-corporate-800">
            Choose Your Plan
          </h2>
          
          <p className="text-center text-corporate-600 max-w-2xl mx-auto mb-12">
            Get started with our free demo or choose a premium plan that suits your needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Demo */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-corporate-800">Free Demo</h3>
                <div className="flex items-baseline justify-center my-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">5 Free Transformations Per Day</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Basic Professional Tone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Instant Results</p>
                  </div>
                </div>
              </div>
              
              <Link to="/app" className="block w-full">
                <Button className="w-full bg-corporate-800 hover:bg-corporate-900 font-medium">
                  Get Started Now
                </Button>
              </Link>
            </div>
            
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-corporate-800">Basic Plan</h3>
                <div className="flex items-baseline justify-center my-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Unlimited Transformations</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">All Tone Options</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Saved History</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Basic Templates</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Email Support</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-corporate-800 hover:bg-corporate-900 font-medium"
                disabled
              >
                <Clock className="mr-2 h-4 w-4" /> Coming Soon
              </Button>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-corporate-500 hover:shadow-lg transition-all relative">
              <div className="absolute top-0 right-0 bg-corporate-800 text-white text-xs font-bold px-3 py-1 transform translate-y-0 rounded-bl rounded-tr">
                POPULAR
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-corporate-800">Professional Plan</h3>
                <div className="flex items-baseline justify-center my-4">
                  <span className="text-3xl font-bold">$19.99</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Everything in Basic</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Advanced Tone Customization</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Custom Templates</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Multi-Language Support</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Priority Support</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">API Access (Limited)</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-corporate-800 hover:bg-corporate-900 font-medium"
                disabled
              >
                <Clock className="mr-2 h-4 w-4" /> Coming Soon
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>All plans include our basic security features. Enterprise solutions with custom requirements available upon request.</p>
            <p className="mt-2">Join our waitlist to be notified when premium plans become available.</p>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-corporate-800">
            How It Works
          </h2>
          
          <p className="text-center text-corporate-600 max-w-2xl mx-auto mb-12">
            Get started with Corporify It in three simple steps
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-corporate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <p className="text-2xl font-bold text-corporate-800">1</p>
              </div>
              <h3 className="text-xl font-bold mb-2 text-corporate-800">Enter Your Message</h3>
              <p className="text-corporate-600">Type or paste your casual message in the text box</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-corporate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <p className="text-2xl font-bold text-corporate-800">2</p>
              </div>
              <h3 className="text-xl font-bold mb-2 text-corporate-800">Select Tone</h3>
              <p className="text-corporate-600">Choose the appropriate professional tone for your audience</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-corporate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <p className="text-2xl font-bold text-corporate-800">3</p>
              </div>
              <h3 className="text-xl font-bold mb-2 text-corporate-800">Get Results</h3>
              <p className="text-corporate-600">Instantly receive your professionally rewritten message</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-10">
            <Link to="/app">
              <Button className="bg-corporate-800 hover:bg-corporate-700 text-white px-8 py-3 rounded-md">
                Try It Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-corporate-50 px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-corporate-800">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-10">
            <div>
              <h3 className="text-xl font-bold mb-2 text-corporate-800">Can Corporify It work with Slack and Gmail?</h3>
              <p className="text-corporate-600">Yes! Simply copy and paste your message into Corporify It to get an instant professional rewrite. We also offer browser extensions for seamless integration.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2 text-corporate-800">How secure is my data with Corporify It?</h3>
              <p className="text-corporate-600">We take data security seriously. Corporify It is SOC 2 certified, GDPR compliant, and uses 256-bit encryption. Your messages are never stored after processing.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2 text-corporate-800">Do you offer enterprise solutions?</h3>
              <p className="text-corporate-600">Yes, our enterprise plan includes dedicated account management, custom tone settings aligned with your brand voice, and company-wide analytics.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2 text-corporate-800">What languages are supported?</h3>
              <p className="text-corporate-600">Currently, Corporify It supports English, with Spanish, French, and German in beta. We're adding new languages regularly based on customer demand.</p>
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
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/app">
              <Button className="bg-white text-corporate-800 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg">
                Start Your Free Trial Today
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm opacity-75">No credit card required. Free trial includes 5 transformations per day.</p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
