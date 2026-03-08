const fs = require('fs');

// Task 1: Optimize Contact Page Meta
const contactFile = 'app/[lang]/contacto/page.tsx';
let contactContent = fs.readFileSync(contactFile, 'utf8');
if (!contactContent.includes('export async function generateMetadata')) {
    const meta = `import type { Metadata } from 'next';\n\nexport async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' 
      ? 'Contacto | Expertos en Bienes Raíces en Panamá' 
      : 'Contact Panama Real Estate Experts | Premium Condos',
    description: lang === 'es'
      ? 'Contáctenos hoy para encontrar las mejores propiedades y condominios de lujo en Panamá. Expertos en bienes raíces a su servicio.'
      : 'Contact us today to find the best luxury properties and condos in Panama. Real estate experts at your service.'
  };
}\n\n`;
    contactContent = contactContent.replace(/(export default function Contacto)/, meta + '$1');
    fs.writeFileSync(contactFile, contactContent);
    console.log('✅ Task 1 (Contacto Meta) applied.');
}

// Task 3: Sitemap
const sitemapContent = `import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.panamarealestatesale.com';
  return [
    { url: \`\${baseUrl}/en\`, lastModified: new Date() },
    { url: \`\${baseUrl}/es\`, lastModified: new Date() },
    { url: \`\${baseUrl}/en/contacto\`, lastModified: new Date() },
    { url: \`\${baseUrl}/es/contacto\`, lastModified: new Date() },
    { url: \`\${baseUrl}/en/tours\`, lastModified: new Date() },
    { url: \`\${baseUrl}/es/tours\`, lastModified: new Date() },
  ];
}
`;
fs.writeFileSync('app/sitemap.ts', sitemapContent);
console.log('✅ Task 3 (Sitemap) applied.');

// Task 4: Robots
const robotsContent = `import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.panamarealestatesale.com/sitemap.xml',
  };
}
`;
fs.writeFileSync('app/robots.ts', robotsContent);
console.log('✅ Task 4 (Robots) applied.');

// Task 5: Tours Page Optimization
const toursFile = 'app/[lang]/tours/page.tsx';
let toursContent = fs.readFileSync(toursFile, 'utf8');
if (!toursContent.includes('VIP Panama Relocation Tours')) {
    toursContent = toursContent.replace(
        '<h1>Relocation Tours</h1>',
        '<h1>VIP Panama Relocation Tours</h1>'
    );
    toursContent = toursContent.replace(
        /<p>Welcome to our tour page<\/p>/g,
        '<p>Experience the ultimate Panama relocation tours. Secure private access to prime real estate with premium ROI potential.</p>'
    );
    // Generic fallback if tags aren't matched exactly
    toursContent = toursContent.replace(
        /return \(\s*<main>/,
        "return (\n    <main>\n      <div itemScope itemType=\"https://schema.org/Service\">\n        <meta itemProp=\"name\" content=\"Panama Relocation Tours\" />\n        <meta itemProp=\"provider\" content=\"Panama Real Estate Sale\" />\n      </div>"
    );
    fs.writeFileSync(toursFile, toursContent);
    console.log('✅ Task 5 (Tours Optimization) applied.');
}
