const webConfig = {
  email: "jim@jimmodel.com",
  phone: "+6681-556-5126",
  facebook: "https://www.facebook.com/jimmodeling",
  instagram: "https://www.instagram.com/jim_model",
  address:
    "201/5 Town in town soi 2, Phlabphla, Wang Thonglang, Bangkok Thailand, 10310",
  companyName: "J.I.M.",
  fullCompanyName: "J.I.M Modeling Agency",
  heroTitle: "Unleash Your Full Potential With Us",
  heroSubTitle: "Where Talents Meets Opportunities",
  defaultSEO: {
    title: "J.I.M. Modeling Agency | Thailand's Premier Modeling Agency",
    description: `Discover where your talents meet top opportunities at J.I.M. Modeling Agency, \ 
			Thailand's premier modeling agency with over 40 years of industry expertise in fashion, \  
			TV, and media. Elevate your career with the trusted leaders in talent representation.`,
    applicationName: "jimmodel.com",
    keywords: [
      "modeling",
      "agency",
      "thailand",
      "model",
      "jimmodel",
    ] as string[],
    openGraph: {
      type: "website",
      title: "Jimmodel",
      description:
        "J.I.M. Modeling Agency is Thailand's leading modeling agency with more than 40 years of experience in the industry.",
      siteName: "jimmodel.com",
      images: [`/og-image.jpg`] as string[],
    },
  },
} as const;

export default webConfig;
