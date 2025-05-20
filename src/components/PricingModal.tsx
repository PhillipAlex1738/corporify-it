
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Check, Zap, Globe, Headphones } from 'lucide-react';
import PaymentButton from '@/components/PaymentButton';

type PricingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="corporify-gradient p-6 text-white">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-white flex items-center gap-2 text-2xl">
              <Zap className="h-5 w-5" />
              Premium Plans
            </DialogTitle>
            <DialogDescription className="text-white/80 text-base">
              Choose the right plan for your communication needs
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <div className="border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-corporate-800">Basic Plan</h3>
                <div className="flex items-baseline justify-center my-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Unlimited Transformations</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">All Tone Options</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Saved History</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Basic Templates</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Email Support</p>
                  </div>
                </div>
              </div>
              
              <PaymentButton 
                priceId="price_1RQgpkB1VwDQf2qkZ6LpRTve" 
                buttonText="Get Basic Plan"
                className="w-full bg-corporate-800 hover:bg-corporate-900 font-medium"
              />
            </div>
            
            {/* Professional Plan */}
            <div className="border rounded-lg p-6 bg-corporate-50 border-corporate-200 hover:shadow-md transition-all relative">
              <div className="absolute top-0 right-0 bg-corporate-800 text-white text-xs font-bold px-3 py-1 transform translate-y-0 rounded-bl rounded-tr">
                POPULAR
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-corporate-800">Professional Plan</h3>
                <div className="flex items-baseline justify-center my-4">
                  <span className="text-3xl font-bold">$19.99</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Everything in Basic</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Advanced Tone Customization</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Custom Templates</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Multi-Language Support</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Headphones className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">Priority Support</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-corporate-500" />
                  <div>
                    <p className="font-medium">API Access (Limited)</p>
                  </div>
                </div>
              </div>
              
              <PaymentButton 
                priceId="price_1RQgq7B1VwDQf2qkhfn5Tsmu" 
                buttonText="Get Professional Plan"
                className="w-full bg-corporate-800 hover:bg-corporate-900 font-medium"
              />
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Free Demo includes 5 free transformations per day and basic professional tone.</p>
            <p className="mt-2">Upgrade now to unlock all premium features and unlimited transformations!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
