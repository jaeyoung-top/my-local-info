/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://songpa-info.com',
  generateRobotsTxt: true,
  outDir: 'out',
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Yeti', allow: '/' },      // 네이버봇
      { userAgent: 'Baiduspider', allow: '/' },
    ],
  },
};
