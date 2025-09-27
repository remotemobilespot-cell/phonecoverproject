import { Helmet } from 'react-helmet';

export function SEO({ title, description, keywords, canonical }) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
