// src/pages/public/data/accueil.data.js

export const ACCUEIL_CONTENT = {
  fr: {
    heroBadge: 'Burkina Faso · Ouaga 2000',
    heroTitle: ['Votre partenaire', 'de confiance pour des', 'solutions complètes'],
    heroSpan: 'solutions complètes',
    heroSub: "Imprimerie, fournitures informatiques, négoce international et aménagement d'espaces — SOGECOP Sarl met son expertise à votre service.",
    heroBtnPrimary: 'Nos services',
    heroBtnOutline: 'Contactez-nous',
    stats: [
      { num: '4',    lbl: "Domaines d'expertise" },
      { num: '100%', lbl: 'Engagement qualité'   },
      { num: '50+',  lbl: 'Services rendus'       },
      { num: 'BF',   lbl: 'Entreprise burkinabè'  },
    ],
    heroDomainesTitle: 'Nos domaines',
    domaines: [
      'Imprimerie Générale',
      'Fournitures & Matériel informatique',
      'Négoce International',
      'Aménagement intérieur & extérieur',
    ],

    aboutLabel: 'À propos de nous',
    aboutTitle: "Plus qu'un service, un engagement",
    aboutBody: "SOGECOP Sarl est une entreprise burkinabè spécialisée dans la prestation de services. Grâce à notre expertise et à un réseau de partenaires de confiance, nous offrons des solutions adaptées aux besoins des entreprises, institutions et particuliers.",
    aboutLink: 'En savoir plus →',
    partenairesLabel: 'Nos partenaires',
    // Remplacer les chaînes par { src: '...', alt: '...' } quand les logos sont disponibles
    partenaires: [
      { src: null, alt: 'Partenaire 1' },
      { src: null, alt: 'Partenaire 2' },
      { src: null, alt: 'Partenaire 3' },
      { src: null, alt: 'Partenaire 4' },
      { src: null, alt: 'Partenaire 5' },
      { src: null, alt: 'Partenaire 6' },
    ],

    servicesLabel: 'Nos services',
    servicesTitle: 'Des solutions adaptées à vos besoins',
    servicesLink: 'Voir tous nos services →',
    servicesRight: {
      carouselTitle: 'Nos réalisations',
    },
    services: [
      {
        title: 'Imprimerie Générale',
        items: ['Impression numérique et Offset', 'Affiches, dépliants, catalogues', 'Bâches, kakémonos, grands formats', 'Objets personnalisés & packaging'],
      },
      {
        title: 'Fournitures & Matériel informatique',
        items: ['Papiers, toners, cartouches', 'Ordinateurs, imprimantes, copieurs', 'Réseaux & sécurité', 'Onduleurs et équipements réseau'],
      },
      {
        title: 'Négoce International',
        items: ['Matériaux de construction & BTP', 'Produits alimentaires & matières', 'Fournitures pour marchés publics', 'Fournitures industrielles'],
      },
      {
        title: 'Aménagement intérieur & extérieur',
        items: ["Aménagement d'espaces privés", 'Revêtements intérieurs', 'Revêtements extérieurs', 'Espaces institutionnels'],
      },
    ],

    assocLabel: 'Engagement social',
    assocTitle: 'Aux côtés des associations',
    assocBody: "SOGECOP Sarl accompagne des associations à but non lucratif en leur fournissant matériel, fournitures et services à des conditions préférentielles pour soutenir leurs missions d'utilité publique.",
    assocLink: 'Notre engagement →',
    assocItems: [
      { num: '01', label: 'Matériel fourni', sub: 'Fournitures de bureau et matériel informatique' },
      { num: '02', label: 'Impression',      sub: 'Documents, affiches et supports de communication' },
      { num: '03', label: 'Partenariat',     sub: 'Tarifs préférentiels pour associations reconnues' },
    ],

    fournLabel: 'Réseau international',
    fournTitle: 'Un réseau de fournisseurs mondial',
    fournBody: "Notre réseau de partenaires s'étend à travers l'Afrique, l'Europe et l'Asie, nous permettant de sourcer les meilleurs produits aux meilleurs prix pour nos clients burkinabè.",
    fournRegions: [
      { region: 'Afrique', desc: 'Partenaires locaux et sous-régionaux pour une logistique fluide.' },
      { region: 'Europe',  desc: 'Fournisseurs certifiés pour équipements et matériaux de qualité.' },
      { region: 'Asie',    desc: 'Sources directes pour fournitures informatiques et industrielles.' },
    ],
  },

  en: {
    heroBadge: 'Burkina Faso · Ouaga 2000',
    heroTitle: ['Your trusted partner', 'for comprehensive', 'solutions'],
    heroSpan: 'solutions',
    heroSub: 'Printing, IT supplies, international trading and space design — SOGECOP Sarl puts its expertise at your service.',
    heroBtnPrimary: 'Our services',
    heroBtnOutline: 'Contact us',
    stats: [
      { num: '4',    lbl: 'Areas of expertise' },
      { num: '100%', lbl: 'Quality commitment'  },
      { num: '50+',  lbl: 'Services delivered'  },
      { num: 'BF',   lbl: 'Burkinabè company'   },
    ],
    heroDomainesTitle: 'Our fields',
    domaines: [
      'General Printing',
      'IT Supplies & Equipment',
      'International Trading',
      'Interior & Exterior Design',
    ],

    aboutLabel: 'About us',
    aboutTitle: 'More than a service, a commitment',
    aboutBody: 'SOGECOP Sarl is a Burkinabè company specializing in service provision. Through our expertise and trusted partner network, we deliver solutions tailored to businesses, institutions and individuals.',
    aboutLink: 'Learn more →',
    partenairesLabel: 'Our partners',
    partenaires: [
      { src: null, alt: 'Partner 1' },
      { src: null, alt: 'Partner 2' },
      { src: null, alt: 'Partner 3' },
      { src: null, alt: 'Partner 4' },
      { src: null, alt: 'Partner 5' },
      { src: null, alt: 'Partner 6' },
    ],

    servicesLabel: 'Our services',
    servicesTitle: 'Solutions tailored to your needs',
    servicesLink: 'View all services →',
    servicesRight: {
      carouselTitle: 'Our work',
    },
    services: [
      {
        title: 'General Printing',
        items: ['Digital & Offset printing', 'Posters, flyers, catalogues', 'Banners, roll-ups, large format', 'Custom objects & packaging'],
      },
      {
        title: 'IT Supplies & Equipment',
        items: ['Paper, toners, ink cartridges', 'Computers, printers, copiers', 'Networks & security', 'UPS & network equipment'],
      },
      {
        title: 'International Trading',
        items: ['Construction & BTP materials', 'Food products & raw materials', 'Public tender supplies', 'Industrial supplies'],
      },
      {
        title: 'Interior & Exterior Design',
        items: ['Private & public spaces', 'Interior finishes', 'Exterior finishes', 'Institutional spaces'],
      },
    ],

    assocLabel: 'Social commitment',
    assocTitle: 'Supporting non-profits',
    assocBody: 'SOGECOP Sarl supports non-profit associations by providing equipment, supplies and services at preferential rates to help them fulfill their public interest missions.',
    assocLink: 'Our commitment →',
    assocItems: [
      { num: '01', label: 'Equipment provided', sub: 'Office supplies and IT equipment' },
      { num: '02', label: 'Printing',           sub: 'Documents, posters and communication materials' },
      { num: '03', label: 'Partnership',        sub: 'Preferential rates for recognized associations' },
    ],

    fournLabel: 'International network',
    fournTitle: 'A worldwide supplier network',
    fournBody: 'Our partner network spans Africa, Europe and Asia, allowing us to source the best products at the best prices for our Burkinabè clients.',
    fournRegions: [
      { region: 'Africa', desc: 'Local and sub-regional partners for smooth logistics.' },
      { region: 'Europe', desc: 'Certified suppliers for quality equipment and materials.' },
      { region: 'Asia',   desc: 'Direct sources for IT and industrial supplies.' },
    ],
  },
};