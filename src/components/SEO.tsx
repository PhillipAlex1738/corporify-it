
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
  schema?: object; // Added schema property for additional structured data
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
  structuredData,
  schema
}: SEOProps) => {
  const baseUrl = 'https://corporifyit.io';
  const fullUrl = `${baseUrl}${path}`;
  const finalTwitterImage = twitterImage || ogImage;

  // Default structured data for the website
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Corporify It",
    "applicationCategory": "BusinessApplication",
    "description": "Transform casual messages into polished professional language instantly. Enhance your workplace communication with our AI-powered rewriting tool.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Web browser",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "120"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || fullUrl} />
      
      {/* Language */}
      <meta property="og:locale" content="en_US" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Corporify It" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalTwitterImage} />
      
      {/* Search Engine Instructions */}
      {noIndex 
        ? <meta name="robots" content="noindex, nofollow" /> 
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }
      
      {/* Structured Data for rich results */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Additional schema.org data if provided */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Security Headers - Updated to allow Supabase connections */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; connect-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    </Helmet>
  );
};

export default SEO;
