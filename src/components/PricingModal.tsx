
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Zap, Clock, Globe } from 'lucide-react';

type PricingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PricingModal = ({ isOpen, onClose }: PricingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="corporify-gradient p-6 text-white">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-white flex items-center gap-2 text-2xl">
              <Zap className="h-5 w-5" />
              Premium Features
            </DialogTitle>
            <DialogDescription className="text-white/80 text-base">
              Coming Soon! Join our waitlist to be notified when premium is available.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Advanced Tone Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to additional tones and customization options for more precise communications.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Multi-Language Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Transform your messages into multiple professional languages beyond English.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Custom Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and save your own templates for frequently used message types.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Enhanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed insights on your communication patterns and improvements.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help when you need it with priority customer support.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Bulk Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Transform multiple messages at once for efficient communication overhauls.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              
              <Button 
                className="w-full bg-corporate-800 hover:bg-corporate-900 font-medium"
                disabled
              >
                <Clock className="mr-2 h-4 w-4" /> Coming Soon
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Join our waitlist to be notified when premium features become available.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
