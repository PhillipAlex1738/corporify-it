
import { Mail, MessageSquare, Clock, CheckCircle } from "lucide-react";

const SupportInfo = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-3">
          <Mail className="h-5 w-5 text-corporate-600" />
          <h3 className="text-lg font-medium">Email Support</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          For direct support, email us at:
        </p>
        <a href="mailto:support@corporify.com" className="text-corporate-600 font-medium">
          support@corporify.com
        </a>
      </div>
      
      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-5 w-5 text-corporate-600" />
          <h3 className="text-lg font-medium">Response Time</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          We typically respond to all inquiries within 24 hours during business days.
          Premium users enjoy priority support with faster response times.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-3">
          <MessageSquare className="h-5 w-5 text-corporate-600" />
          <h3 className="text-lg font-medium">Frequently Asked</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-corporate-600 mt-0.5" />
            <span>How do I upgrade to Premium?</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-corporate-600 mt-0.5" />
            <span>What are the usage limits?</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-corporate-600 mt-0.5" />
            <span>How secure is my data?</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-corporate-600 mt-0.5" />
            <span>Can I use it for business?</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SupportInfo;
