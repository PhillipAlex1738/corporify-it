
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  path: string;
  keywords?: string;
  author?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterImage?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SEO = ({ 
  title, 
  description, 
  canonicalUrl, 
  path,
  keywords = "corporate writing, professional emails, business communication, AI writing assistant",
  author = "Corporify It",
  ogType = "website",
  ogImage = "https://corporifyit.io/og-image.png",
  twitterCard = "summary_large_image",
  twitterImage,
  noIndex = false,
  structuredData
}: SEOProps) => {
  const baseUrl = 'https://corporifyit.io';
  const fullUrl = `${baseUrl}${path}`;
  const finalTwitterImage = twitterImage || ogImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalTwitterImage} />
      
      {/* Search Engine Instructions */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Structured Data for rich results */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
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
