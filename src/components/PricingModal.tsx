
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Zap, Clock } from 'lucide-react';

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
                  <h3 className="font-medium">Unlimited Corporifications</h3>
                  <p className="text-sm text-muted-foreground">
                    No daily limits. Transform as many messages as you need.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Message History</h3>
                  <p className="text-sm text-muted-foreground">
                    Save and access all your previously corporified messages.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-corporate-500" />
                <div>
                  <h3 className="font-medium">Advanced Formatting</h3>
                  <p className="text-sm text-muted-foreground">
                    Additional formatting options for more polished results.
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
