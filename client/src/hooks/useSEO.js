import { useEffect } from 'react';

/**
 * A custom hook to dynamically update document title and meta description tags.
 * Supports updating standard description meta tags and Open Graph (Facebook/LinkedIn) titles/descriptions.
 * 
 * @param {Object} metadata SEO metadata to set
 * @param {string} metadata.title Page title
 * @param {string} metadata.description Page meta description
 */
export const useSEO = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      
      // Update/Create Open Graph Title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', title);
    }
    
    if (description) {
      // Update/Create Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Update/Create Open Graph Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', description);
    }
  }, [title, description]);
};
