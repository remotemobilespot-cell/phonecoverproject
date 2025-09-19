import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  structuredData?: object;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  category?: string;
  readTime?: string;
}

export const SEOHead: React.FC<SEOProps> = ({
  title = "PrintPhoneCover Blog - Custom Phone Case Inspiration & Tips",
  description = "Discover the latest trends, tips, and inspiration for custom phone cases. Learn about design techniques, protection benefits, and innovative printing technology.",
  keywords = "custom phone cases, phone case design, mobile accessories, personalized cases, phone protection",
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "/images/og-blog-default.jpg",
  ogType = "article",
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterCard = "summary_large_image",
  structuredData,
  author,
  publishedDate,
  modifiedDate,
  category,
  readTime
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://printphonecover.com';
  
  // Generate structured data for blog posts
  const articleStructuredData = structuredData || (author && publishedDate ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": `${siteUrl}${ogImage}`,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "PrintPhoneCover",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
        "width": 200,
        "height": 60
      }
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical || window.location.href
    },
    "articleSection": category,
    "timeRequired": readTime,
    "inLanguage": "en-US"
  } : null);

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PrintPhoneCover",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-PRINT-PC",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/printphonecover",
      "https://instagram.com/printphonecover",
      "https://twitter.com/printphonecover"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en-US" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Author and Publication Info */}
      {author && <meta name="author" content={author} />}
      {publishedDate && <meta name="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta name="article:modified_time" content={modifiedDate} />}
      {category && <meta name="article:section" content={category} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical || window.location.href} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="PrintPhoneCover Blog" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@printphonecover" />
      <meta name="twitter:creator" content="@printphonecover" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={(twitterImage || ogImage).startsWith('http') 
        ? (twitterImage || ogImage) 
        : `${siteUrl}${twitterImage || ogImage}`} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="application-name" content="PrintPhoneCover Blog" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {articleStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(articleStructuredData)}
        </script>
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>

      {/* Additional Links */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* RSS Feed */}
      <link rel="alternate" type="application/rss+xml" title="PrintPhoneCover Blog RSS Feed" href={`${siteUrl}/api/blog/rss`} />
    </Helmet>
  );
};

// Blog-specific SEO component
export const BlogSEO: React.FC<{ post?: any }> = ({ post }) => {
  if (!post) {
    return (
      <SEOHead
        title="PrintPhoneCover Blog - Custom Phone Case Design Inspiration"
        description="Explore creative ideas, professional tips, and the latest trends in custom phone case design. Learn about our innovative printing technology and protection benefits."
        keywords="custom phone cases, design blog, phone case ideas, mobile accessories, personalization, printing technology"
      />
    );
  }

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://printphonecover.com';
  
  return (
    <SEOHead
      title={post.seo?.title || post.title}
      description={post.seo?.description || post.excerpt}
      keywords={post.seo?.keywords}
      canonical={post.seo?.canonical}
      ogTitle={post.seo?.ogTitle}
      ogDescription={post.seo?.ogDescription}
      ogImage={post.seo?.ogImage}
      ogType={post.seo?.ogType}
      twitterTitle={post.seo?.twitterTitle}
      twitterDescription={post.seo?.twitterDescription}
      twitterImage={post.seo?.twitterImage}
      twitterCard={post.seo?.twitterCard}
      structuredData={post.seo?.structuredData}
      author={post.author}
      publishedDate={post.created_at}
      modifiedDate={post.updated_at}
      category={post.category}
      readTime={post.read_time}
    />
  );
};

// Generate meta description from content
export const generateMetaDescription = (content: string, maxLength: number = 155): string => {
  if (!content) return '';
  
  // Remove HTML tags and markdown
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*_`]/g, '')
    .replace(/\n\s*\n/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

// Generate structured data for FAQ sections
export const generateFAQStructuredData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate structured data for How-To articles
export const generateHowToStructuredData = (
  title: string, 
  description: string, 
  steps: Array<{title: string, description: string, image?: string}>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.description,
      ...(step.image && { "image": step.image })
    }))
  };
};

export default SEOHead;