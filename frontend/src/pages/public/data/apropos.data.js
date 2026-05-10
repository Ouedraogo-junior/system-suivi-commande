// src/pages/public/data/apropos.data.js

export const APROPOS_CONTENT = {
  fr: {
    breadcrumbHome: 'Accueil',
    pageLabel: 'À propos de nous',

    hero: {
      label: 'Notre histoire',
      title: 'Une entreprise burkinabè au service de l\'excellence',
      sub: "SOGECOP Sarl est née d'une vision simple : offrir aux entreprises, institutions et particuliers du Burkina Faso des solutions de qualité, fiables et adaptées à leurs réalités.",
    },

    histoire: {
      label: 'Qui sommes-nous',
      title: 'Notre histoire & notre mission',
      body: [
        "SOGECOP Sarl est une société burkinabè spécialisée dans la prestation de services multi-domaines. Implantée à Ouagadougou, dans le quartier de Ouaga 2000, elle intervient dans l'imprimerie générale, les fournitures et matériels informatiques, le négoce international ainsi que l'aménagement intérieur et extérieur.",
        "Notre mission est de fournir à nos clients des solutions complètes, personnalisées et de haute qualité, en mobilisant un réseau de partenaires locaux et internationaux soigneusement sélectionnés. Nous nous engageons à respecter les délais, à maîtriser les coûts et à garantir la satisfaction à chaque étape.",
      ],
      chiffres: [
        { num: '4',    lbl: "Domaines d'expertise" },
        { num: '50+',  lbl: 'Commandes réalisées'  },
        { num: '100%', lbl: 'Engagement qualité'   },
        { num: 'BF',   lbl: 'Entreprise burkinabè' },
      ],
    },

    valeurs: {
      label: 'Ce qui nous guide',
      title: 'Nos valeurs',
      items: [
        { title: 'Excellence',    body: "Nous visons la qualité maximale dans chaque prestation, quel que soit le volume ou la nature de la commande." },
        { title: 'Fiabilité',     body: "Nos clients peuvent compter sur nous : respect des engagements, des délais et des budgets convenus." },
        { title: 'Proximité',     body: "Entreprise burkinabè, nous comprenons les réalités locales et construisons des relations de confiance durables." },
        { title: 'Innovation',    body: "Nous cherchons constamment de nouvelles solutions pour mieux répondre aux besoins évolutifs de nos clients." },
      ],
    },

    partenaires: {
      label: 'Ils nous font confiance',
      title: 'Nos partenaires',
      body: "SOGECOP Sarl collabore avec un réseau de partenaires locaux et institutionnels pour garantir la meilleure qualité de service.",
      items: ['Partenaire 1', 'Partenaire 2', 'Partenaire 3', 'Partenaire 4', 'Partenaire 5', 'Partenaire 6'],
    },

    reseau: {
      label: 'Réseau international',
      title: 'Un réseau de fournisseurs mondial',
      body: "Notre réseau de partenaires commerciaux s'étend à travers trois continents, nous permettant de sourcer les meilleurs produits aux meilleurs prix pour nos clients burkinabè.",
      regions: [
        {
          region: 'Afrique',
          flag: '🌍',
          desc: 'Partenaires locaux et sous-régionaux pour une logistique fluide et des délais maîtrisés.',
          pays: ['Burkina Faso', 'Côte d\'Ivoire', 'Sénégal', 'Ghana', 'Togo'],
        },
        {
          region: 'Europe',
          flag: '🌍',
          desc: 'Fournisseurs certifiés pour équipements, matériaux et produits de qualité supérieure.',
          pays: ['France', 'Allemagne', 'Italie', 'Espagne'],
        },
        {
          region: 'Asie',
          flag: '🌏',
          desc: 'Sources directes pour fournitures informatiques, industrielles et produits manufacturés.',
          pays: ['Chine', 'Émirats Arabes Unis', 'Inde'],
        },
      ],
    },

    engagement: {
      label: 'Engagement social',
      title: 'Aux côtés des associations',
      body: "Au-delà de son activité commerciale, SOGECOP Sarl s'engage activement dans le soutien aux associations à but non lucratif. Nous leur fournissons matériel, fournitures et services à des conditions préférentielles pour les aider à accomplir leurs missions d'utilité publique.",
      items: [
        { num: '01', title: 'Matériel & fournitures',  desc: 'Fournitures de bureau et matériel informatique à tarifs préférentiels.' },
        { num: '02', title: 'Impression & com',        desc: 'Documents, affiches et supports de communication pour leurs actions.' },
        { num: '03', title: 'Partenariat durable',     desc: 'Accompagnement sur le long terme des associations reconnues d\'utilité publique.' },
      ],
    },

    cta: {
      title: 'Travaillons ensemble',
      sub: 'Un projet, une question ? Notre équipe est disponible pour vous accompagner.',
      btn: 'Nous contacter',
    },
  },

  en: {
    breadcrumbHome: 'Home',
    pageLabel: 'About us',

    hero: {
      label: 'Our story',
      title: 'A Burkinabè company committed to excellence',
      sub: 'SOGECOP Sarl was born from a simple vision: to offer businesses, institutions and individuals in Burkina Faso quality, reliable solutions adapted to their realities.',
    },

    histoire: {
      label: 'Who we are',
      title: 'Our history & mission',
      body: [
        'SOGECOP Sarl is a Burkinabè company specializing in multi-domain services. Based in Ouagadougou, in the Ouaga 2000 district, it operates in general printing, IT supplies and equipment, international trading, and interior & exterior design.',
        'Our mission is to provide clients with comprehensive, personalized, high-quality solutions by mobilizing a carefully selected network of local and international partners. We are committed to meeting deadlines, controlling costs, and ensuring satisfaction at every step.',
      ],
      chiffres: [
        { num: '4',    lbl: 'Areas of expertise'  },
        { num: '50+',  lbl: 'Orders completed'    },
        { num: '100%', lbl: 'Quality commitment'  },
        { num: 'BF',   lbl: 'Burkinabè company'   },
      ],
    },

    valeurs: {
      label: 'What drives us',
      title: 'Our values',
      items: [
        { title: 'Excellence',   body: 'We aim for the highest quality in every service, regardless of the volume or nature of the order.' },
        { title: 'Reliability',  body: 'Our clients can count on us: we honor our commitments, deadlines and agreed budgets.' },
        { title: 'Closeness',    body: 'As a Burkinabè company, we understand local realities and build lasting trust-based relationships.' },
        { title: 'Innovation',   body: 'We constantly seek new solutions to better meet the evolving needs of our clients.' },
      ],
    },

    partenaires: {
      label: 'They trust us',
      title: 'Our partners',
      body: 'SOGECOP Sarl works with a network of local and institutional partners to ensure the best quality of service.',
      items: ['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4', 'Partner 5', 'Partner 6'],
    },

    reseau: {
      label: 'International network',
      title: 'A worldwide supplier network',
      body: 'Our commercial partner network spans three continents, allowing us to source the best products at the best prices for our Burkinabè clients.',
      regions: [
        {
          region: 'Africa',
          flag: '🌍',
          desc: 'Local and sub-regional partners for smooth logistics and controlled lead times.',
          pays: ['Burkina Faso', 'Ivory Coast', 'Senegal', 'Ghana', 'Togo'],
        },
        {
          region: 'Europe',
          flag: '🌍',
          desc: 'Certified suppliers for high-quality equipment, materials and products.',
          pays: ['France', 'Germany', 'Italy', 'Spain'],
        },
        {
          region: 'Asia',
          flag: '🌏',
          desc: 'Direct sources for IT supplies, industrial goods and manufactured products.',
          pays: ['China', 'UAE', 'India'],
        },
      ],
    },

    engagement: {
      label: 'Social commitment',
      title: 'Supporting non-profits',
      body: 'Beyond its commercial activity, SOGECOP Sarl is actively committed to supporting non-profit associations. We provide them with equipment, supplies and services at preferential rates to help them fulfill their public interest missions.',
      items: [
        { num: '01', title: 'Equipment & supplies', desc: 'Office supplies and IT equipment at preferential rates.' },
        { num: '02', title: 'Printing & comms',     desc: 'Documents, posters and communication materials for their actions.' },
        { num: '03', title: 'Lasting partnership',  desc: 'Long-term support for associations recognized as serving the public interest.' },
      ],
    },

    cta: {
      title: "Let's work together",
      sub: 'A project or a question? Our team is available to support you.',
      btn: 'Contact us',
    },
  },
};