
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Corporify It. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link to="/data-handling" className="text-muted-foreground hover:text-foreground transition-colors">
            Data Handling
          </Link>
          <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
            Customer Support
          </Link>
          <Link to="/feedback" className="text-muted-foreground hover:text-foreground transition-colors">
            Feedback
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
