const webConfig = {
  email: "jim@jimmodel.com",
  phone: "+6681-556-5126",
  facebook: "https://www.facebook.com/jimmodeling",
  instagram: "https://www.instagram.com/jim_model",
  googleMapsIframeSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.12549087213!2d100.60761057597112!3d13.771304986622644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e0676d70aa9%3A0xe68f3525a96aaa64!2sJ.I.M.!5e0!3m2!1sth!2sth!4v1730186388224!5m2!1sth!2sth",
  address:
    "1201/5 Town in town soi 2, Phlabphla, Wang Thonglang, Bangkok Thailand, 10310",
  companyName: "J.I.M.",
  fullCompanyName: "J.I.M Modeling Agency",
  heroTitle: "Unleash Your Full Potential With Us",
  heroSubTitle: "Where Talents Meets Opportunities",
  defaultSEO: {
    title: "J.I.M. Modeling Agency | Thailand's Premier Modeling Agency",
    description:
      "Discover your talents with J.I.M. Modeling Agency, Thailand's top agency with over 40 years of expertise in fashion, TV, and media. Elevate your career with trusted leaders in talent representation.",
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
