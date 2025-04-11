import { SitemapStream, streamToPromise } from 'sitemap';
import fs from 'fs';

const hostname = 'https://sacredmind.in/';

const urls = [
  { url: 'https://sacredmind.in/', changefreq: 'daily', priority: 1 },
  { url: 'https://sacredmind.in/about-us', changefreq: 'monthly', priority: 0.8 },
  { url: 'https://sacredmind.in/services', changefreq: 'monthly', priority: 0.8 },
  { url: 'https://sacredmind.in/contact', changefreq: 'monthly', priority: 0.8 },
  { url: 'https://sacredmind.in/careers', changefreq: 'monthly', priority: 0.7 },
  { url: 'https://sacredmind.in/privacy-policy', changefreq: 'yearly', priority: 0.6 },
  { url: 'https://sacredmind.in/terms-and-conditions', changefreq: 'yearly', priority: 0.6 },
  { url: 'https://sacredmind.in/sales-and-refunds', changefreq: 'yearly', priority: 0.6 },
  { url: 'https://sacredmind.in/pricing-policy', changefreq: 'yearly', priority: 0.6 },
  { url: 'https://sacredmind.in/purchases', changefreq: 'monthly', priority: 0.7 },
  { url: 'https://sacredmind.in/all-reviews', changefreq: 'monthly', priority: 0.7 },
  { url: 'https://sacredmind.in/teach-with-us', changefreq: 'monthly', priority: 0.7 },

  { url: 'https://sacredmind.in/category/development', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/category/business', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/category/marketing', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/category/e-commerce', changefreq: 'weekly', priority: 0.7 },

  { url: 'https://sacredmind.in/category/dropshipping', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/category/website-development', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/category/management', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/category/digital-marketing', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/category/social-media-marketing', changefreq: 'weekly', priority: 0.7 },

  { url: 'https://sacredmind.in/course/python-development-course', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/course/hr-payroll-course', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/course/digital-marketing-course', changefreq: 'weekly', priority: 0.7 },
  { url: 'https://sacredmind.in/course/social-media-marketing', changefreq: 'monthly', priority: 0.6 },
  { url: 'https://sacredmind.in/course/best-dropshipping-course', changefreq: 'monthly', priority: 0.6 }
  
];

const sitemapStream = new SitemapStream({ hostname });

urls.forEach(url => sitemapStream.write(url));
sitemapStream.end();

streamToPromise(sitemapStream).then(sitemap => {
  fs.writeFileSync('./public/sitemap.xml', sitemap.toString());
});
