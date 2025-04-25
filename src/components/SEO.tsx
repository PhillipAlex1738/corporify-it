
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  path: string;
}

const SEO = ({ title, description, canonicalUrl, path }: SEOProps) => {
  const baseUrl = 'https://corporifyit.io';
  const fullUrl = `${baseUrl}${path}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || fullUrl} />
      
      {/* Security Headers - Updated to allow Supabase connections */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
};

export default SEO;
