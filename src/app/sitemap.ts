
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://allnoop.com';

  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
    '/hashtag-generator',
    '/image-editor',
    '/chat',
    '/pdf-tools',
    '/calculators',
    '/games',
    '/study',
    '/tools/downloader',
    '/tools/keyword-analyzer',
    '/tools/password-generator',
    '/tools/qrcode',
    '/tools/text-formatter',
  ];

  const calculatorPages = [
    '/calculators/bmi',
    '/calculators/bmr',
    '/calculators/body-fat-percentage',
    '/calculators/calorie',
    '/calculators/ideal-weight',
    '/calculators/lean-body-mass',
    '/calculators/waist-to-hip-ratio',
    '/calculators/financial/currency-converter',
    '/calculators/financial/discount',
    '/calculators/financial/emi',
    '/calculators/financial/interest',
    '/calculators/health/diabetes-risk',
    '/calculators/health/egfr',
    '/calculators/health/heart-rate',
    '/calculators/health/life-expectancy',
    '/calculators/health/sleep',
    '/calculators/math/age',
    '/calculators/math/basic',
    '/calculators/math/cube-root',
    '/calculators/math/date',
    '/calculators/math/geometry',
    '/calculators/math/gpa',
    '/calculators/math/mean-median-mode',
    '/calculators/math/percentage',
    '/calculators/math/permutation-combination',
    '/calculators/math/probability',
    '/calculators/math/pythagorean',
    '/calculators/math/square-root',
    '/calculators/math/trigonometry',
    '/calculators/math/unit-converter',
    '/calculators/chemistry/dilution',
    '/calculators/chemistry/molarity',
    '/calculators/chemistry/molecular-weight',
    '/calculators/chemistry/normality',
    '/calculators/chemistry/ph-poh',
    '/calculators/nutrition/calorie-burn',
    '/calculators/nutrition/carbohydrate-intake',
    '/calculators/nutrition/macros',
    '/calculators/nutrition/protein-intake',
    '/calculators/nutrition/water-intake',
    '/calculators/other/alcohol-unit',
    '/calculators/other/smoking-cost',
    '/calculators/other/tip',
    '/calculators/physics/force-work-energy-power',
    '/calculators/physics/gravitational-force',
    '/calculators/physics/projectile-motion',
    '/calculators/physics/speed-distance-time',
    '/calculators/pregnancy/due-date',
    '/calculators/pregnancy/fertility',
    '/calculators/pregnancy/menstrual-cycle',
    '/calculators/pregnancy/ovulation',
  ];

  const pdfToolPages = [
    '/pdf-tools/viewer',
    '/pdf-tools/edit',
    '/pdf-tools/merge',
    '/pdf-tools/split',
    '/pdf-tools/compress',
    '/pdf-tools/convert-to-pdf',
    '/pdf-tools/convert-from-pdf',
    '/pdf-tools/extract-pages',
    '/pdf-tools/rotate',
    '/pdf-tools/edit-metadata',
    '/pdf-tools/compare',
    '/pdf-tools/extract-images',
    '/pdf-tools/add-watermark',
    '/pdf-tools/add-page-numbers',
    '/pdf-tools/add-background',
    '/pdf-tools/rearrange-pages',
    '/pdf-tools/delete-pages',
    '/pdf-tools/protect',
    '/pdf-tools/unlock',
  ];
  
  const gamePages = [
    '/games/rock-paper-scissors',
    '/games/tic-tac-toe',
    '/games/guess-the-number',
    '/games/sudoku',
    '/games/snake',
    '/games/quiz',
    '/games/space-invaders',
    '/games/memory',
    '/games/pong',
    '/games/green-flag-red-flag',
    '/games/desi-nickname-generator',
    '/games/bollywood-personality-quiz',
    '/games/main-character-quiz',
    '/games/meme-personality-quiz',
    '/games/toxic-partner-quiz',
    '/games/luck-predictor',
    '/games/truth-or-dare',
  ];

  const funToolPages = [
      '/fun-tools/fake-message-generator',
      '/fun-tools/meme-generator',
      '/fun-tools/random-joke-quote-generator',
      '/fun-tools/typing-speed-test',
  ];
  
   const studyPages = [
      '/study/markdown-previewer',
      '/study/quiz-creator',
  ];

  const allPages = [
      ...staticPages, 
      ...calculatorPages, 
      ...pdfToolPages,
      ...gamePages,
      ...funToolPages,
      ...studyPages
    ];

  return allPages.map((route) => {
    // Assign higher priority to main pages
    const isMainPage = staticPages.includes(route) || ['/calculators', '/pdf-tools', '/games'].includes(route);
    
    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: isMainPage ? 'weekly' : 'monthly',
      priority: isMainPage ? 0.8 : 0.6,
    };
  });
}
