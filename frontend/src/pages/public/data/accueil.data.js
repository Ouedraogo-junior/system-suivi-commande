// src/pages/public/data/accueil.data.js

export const ACCUEIL_CONTENT = {
  fr: {
    //heroBadge: 'Burkina Faso · Ouaga 2000',
    heroTitle: ['Votre partenaire', 'de confiance pour des', 'solutions complètes'],
    heroSpan: 'solutions complètes',
    heroSub: "Production et Imprimerie Numérique, fournitures de consommables & matériels informatiques, négoce international et aménagement intérieur & extérieur, SOGECOP Sarl met son expertise à votre service.",
    heroBtnPrimary: 'Nos services',
    heroBtnOutline: 'Contactez-nous',
    stats: [
      { num: '4',    lbl: "Domaines d'expertise" },
      { num: '100%', lbl: 'Engagement qualité'   },
      { num: '50+',  lbl: '50 entreprises accompagnées'},
      { num: 'BF',   lbl: 'Engagé RSE'  },
    ],
    heroDomainesTitle: 'Nos domaines',
    domaines: [
      'Production et Imprimerie Numérique',
      'Fournitures de consommables & Matériels informatiques',
      'Négoce International',
      'Aménagement intérieur & extérieur',
    ],

    aboutLabel: 'À propos de nous',
    aboutTitle: "Plus qu'un service, un engagement",
    aboutBody: "SOGECOP Sarl est une entreprise burkinabè spécialisée dans la prestation de services. Grâce à notre expertise et à un réseau de partenaires de confiance, nous offrons des solutions adaptées aux besoins des entreprises, institutions et particuliers.",
    aboutLink: 'En savoir plus →',
    partenairesLabel: 'Nos partenaires',
    partenaires: [
      { src: '/partners/Shalom_event.PNG', alt: 'Shalom Events Planner' },
      { src: '/partners/riadel.png', alt: 'RIADEL' },
      { src: '/partners/FasoDev.PNG', alt: 'FasoDev' },
      { src: '/partners/logo_EETTIL.png', alt: 'EETTIL' },
      { src: '/partners/MAHSN.jpeg', alt: 'Ministère de l’action Humanitaire et et de la Solidarité Nationale' },
      { src: '/partners/UBA.png', alt: 'UBA' },
      { src: '/partners/BBI.png', alt: 'BBI' },
      // { src: '/partners/logo_dream_studio.png', alt: 'Dream Studio' },
      // { src: '/partners/logo_SF2I.png', alt: 'SF2I' },
      // { src: '/partners/S_H_C_G_Niger.jpeg', alt: 'S H C G Niger' },
      // { src: '/partners/chancellerie.png', alt: 'Grande Chancellerie' },
      // { src: '/partners/CNSF.jpeg', alt: 'CNSF' },
      // { src: '/partners/sonagess.png', alt: 'SONAGESS' },      
      // { src: '/partners/BATICOM.jpeg', alt: 'BATICOM ENGINEERING' },
      // { src: '/partners/KBTP.jpeg', alt: 'KBTP' },
      // { src: '/partners/NMG.jpeg', alt: 'NEW MODELS GENERATION' },
      // { src: '/partners/GS.jpeg', alt: 'Global Technologie & Solutions SAS' },
      
    ],

    servicesLabel: 'Nos services',
    servicesTitle: 'Des solutions adaptées à vos besoins',
    servicesLink: 'Voir tous nos services →',
    servicesRight: {
      carouselTitle: 'Nos réalisations',
      slides: [
        { id: 1, src: null, label: 'Imprimerie' },
        { id: 2, src: null, label: 'Informatique' },
        { id: 3, src: null, label: 'Négoce' },
        { id: 4, src: null, label: 'Aménagement' },
      ],
    },
    services: [
      {
        title: 'Production et Imprimerie Numérique',
        img: null, // '/images/services/impression.jpg' quand disponible
        items: ['Impression numérique et Offset', 'Affiches, dépliants, catalogues', 'Bâches, kakémonos, grands formats', 'Objets personnalisés & packaging'],
      },
      {
        title: 'Fournitures de consommables & Matériels informatiques',
        img: null,
        items: ['Papiers, toners, cartouches', 'Ordinateurs, imprimantes, copieurs', 'Réseaux & sécurité', 'Onduleurs et équipements réseaux'],
      },
      {
        title: 'Négoce International',
        img: null,
        items: ['Matériaux de construction & BTP', 'Produits alimentaires & matières premières', 'Fournitures pour marchés publics', 'Fournitures industrielles'],
      },
      {
        title: 'Aménagement intérieur & extérieur',
        img: null,
        items: ["Aménagement d'espaces privés", 'Revêtements intérieurs', 'Revêtements extérieurs', 'Espaces institutionnels'],
      },
    ],

    assocLabel: 'Engagement social',
    assocTitle: 'Aux côtés des associations',
    assocBody: "SOGECOP Sarl accompagne des associations à but non lucratif en leur fournissant matériel, fournitures et services à des conditions préférentielles pour soutenir leurs missions d'utilité publique.",
    assocLink: 'Notre engagement →',
    assocItems: [
      { src: '/associations/ass_be_leader.png', alt: 'Association Be Leader' },
      { src: '/associations/logo_boost_faso.jpeg', alt: 'Association Boost Faso' },
      // { src: null, alt: 'Association Beog-yinga' },
      // { src: null, alt: 'Association 4' },
      // { src: null, alt: 'Association 5' },
      // { src: null, alt: 'Association 6' },
    ],

    fournLabel: 'Réseau international',
    fournTitle: 'Un réseau  mondial de fournisseurs',
    fournBody: "Notre réseau de partenaires s'étend à travers l'Afrique, l'Europe et l'Asie, nous permettant de sourcer les meilleurs produits aux meilleurs prix pour nos clients.",
    fournRegions: [
      { region: 'Afrique', desc: 'Partenaires locaux et sous-régionaux pour une logistique fluide.' },
      { region: 'Europe',  desc: 'Fournisseurs certifiés pour équipements et matériaux de qualité.' },
      { region: 'Asie',    desc: 'Sources directes pour fournitures informatiques et industrielles.' },
    ],
  },

  en: {
    // heroBadge: 'Burkina Faso · Ouaga 2000',
    heroTitle: ['Your trusted partner', 'for comprehensive', 'solutions'],
    heroSpan: 'solutions',
    heroSub: 'Printing, IT supplies, international trading and space design — SOGECOP Sarl puts its expertise at your service.',
    heroBtnPrimary: 'Our services',
    heroBtnOutline: 'Contact us',
    stats: [
      { num: '4',    lbl: 'Areas of expertise' },
      { num: '100%', lbl: 'Quality commitment'  },
      { num: '50+',  lbl: 'companies supported'  },
      { num: 'BF',   lbl: 'Engaged RSE'   },
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
       { src: '/partners/Shalom_event.PNG', alt: 'Shalom Events Planner' },
       { src: '/partners/riadel.png', alt: 'RIADEL' },
       { src: '/partners/FasoDev.PNG', alt: 'FasoDev' },
       { src: '/partners/logo_EETTIL.png', alt: 'EETTIL' },
       { src: '/partners/MAHSN.jpeg', alt: 'Ministère de l’action Humanitaire et et de la Solidarité Nationale' },
       { src: '/partners/UBA.png', alt: 'UBA' },
       { src: '/partners/BBI.png', alt: 'BBI' },
    ],

    servicesLabel: 'Our services',
    servicesTitle: 'Solutions tailored to your needs',
    servicesLink: 'View all services →',
    servicesRight: {
      carouselTitle: 'Our work',
      slides: [
        { id: 1, src: null, label: 'Imprimerie' },
        { id: 2, src: null, label: 'Informatique' },
        { id: 3, src: null, label: 'Négoce' },
        { id: 4, src: null, label: 'Aménagement' },
      ],
    },
    services: [
      {
        title: 'General Printing',
        img: null, // '/images/services/impression.jpg' quand disponible
        items: ['Digital & Offset printing', 'Posters, flyers, catalogues', 'Banners, roll-ups, large format', 'Custom objects & packaging'],
      },
      {
        title: 'IT Supplies & Equipment',
        img: null,
        items: ['Paper, toners, ink cartridges', 'Computers, printers, copiers', 'Networks & security', 'UPS & network equipment'],
      },
      {
        title: 'International Trading',
        img: null,
        items: ['Construction & BTP materials', 'Food products & raw materials', 'Public tender supplies', 'Industrial supplies'],
      },
      {
        title: 'Interior & Exterior Design',
        img: null,
        items: ['Private & public spaces', 'Interior finishes', 'Exterior finishes', 'Institutional spaces'],
      },
    ],

    assocLabel: 'Social commitment',
    assocTitle: 'Supporting non-profits',
    assocBody: 'SOGECOP Sarl supports non-profit associations by providing equipment, supplies and services at preferential rates to help them fulfill their public interest missions.',
    assocLink: 'Our commitment →',
    assocItems: [
      { src: '/associations/ass_be_leader.png', alt: 'Association Be Leader' },
      { src: '/associations/logo_boost_faso.jpeg', alt: 'Association Boost Faso' },
      { src: null, alt: 'Association Beog-yinga' },
      // { src: null, alt: 'Association 4' },
      // { src: null, alt: 'Association 5' },
      // { src: null, alt: 'Association 6' },
    ],

    fournLabel: 'International network',
    fournTitle: 'A worldwide supplier network',
    fournBody: 'Our partner network spans Africa, Europe and Asia, allowing us to source the best products at the best prices for our clients.',
    fournRegions: [
      { region: 'Africa', desc: 'Local and sub-regional partners for smooth logistics.' },
      { region: 'Europe', desc: 'Certified suppliers for quality equipment and materials.' },
      { region: 'Asia',   desc: 'Direct sources for IT and industrial supplies.' },
    ],
  },
};