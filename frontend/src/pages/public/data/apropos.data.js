// src/pages/public/data/apropos.data.js

export const APROPOS_CONTENT = {
  fr: {
    breadcrumbHome: 'Accueil',
    pageLabel: 'À propos de nous',

    hero: {
      label: 'Notre histoire',
      title: 'Une entreprise burkinabè au service de l\'excellence',
      sub: "SOGECOP Sarl est née d'une vision simple : offrir aux entreprises, institutions et particuliers des solutions de qualité, fiables et adaptées à leurs réalités.",
    },

    histoire: {
      label: 'Qui sommes-nous',
      title: 'Notre histoire & notre mission',
      body: [
        "SOGECOP Sarl est une société burkinabè spécialisée dans la prestation de services multi-domaines. Implantée à Ouagadougou, dans le quartier de Ouaga 2000, elle intervient dans l'imprimerie générale, les fournitures et matériels informatiques, le négoce international ainsi que l'aménagement intérieur et extérieur.",
        "Notre mission est de fournir à nos clients des solutions complètes, personnalisées et de haute qualité, en mobilisant un réseau de partenaires locaux et internationaux soigneusement sélectionnés. Nous nous engageons à respecter les délais, à maîtriser les coûts et à garantir la satisfaction à chaque étape.",
      ],
      // chiffres: [
      //   { num: '4',    lbl: "Domaines d'expertise" },
      //   { num: '50+',  lbl: '50 entreprises accompagnées'},
      //   { num: '100%', lbl: 'Engagement qualité'   },
      //   { num: 'BF',   lbl: 'Engagé RSE' },
      // ],

       images: [
        { src: '/images/logo.png', alt: 'Siège social SOGECOP — Ouaga 2000' },
        { src: 'services/amenagement.png', alt: 'L\'équipe SOGECOP' },
        // { src: 'partners/CNSF.png', alt: 'L\'équipe SOGECOP' },
      ],
    },

    valeurs: {
      label: 'Ce qui nous guide',
      title: 'Nos valeurs',
      seeMore: 'Voir plus',
      seeLess: 'Voir moins',
      items: [
        { title: 'Excellence',    body: "Chez SOGECOP SARL, nous plaçons l’excellence au cœur de chacune de nos réalisations. Qu’il s’agisse de Négoce International, de Production et Impression numérique, de réalisations d’aménagements ou de projets, nous nous engageons à fournir des solutions de haute qualité répondant aux exigences de nos clients. Notre objectif est de dépasser les attentes grâce à notre professionnalisme, notre savoir-faire et notre souci constant du détail." },
        { title: 'Intégrité',     body: "Nous bâtissons chacune de nos relations sur la confiance, la transparence et le respect de nos engagements. L’intégrité guide chacune de nos décisions et constitue le fondement de notre réputation auprès de nos partenaires, fournisseurs et clients. Nous privilégions une collaboration honnête, éthique et durable." },
        { title: 'Satisfaction Client',     body: "La satisfaction de nos clients est notre priorité absolue. Nous mettons tout en œuvre pour comprendre leurs besoins, les accompagner avec professionnalisme et leur offrir un service personnalisé, réactif et de qualité. Chaque projet est traité avec le même niveau d’attention afin de construire des relations de confiance durables et de contribuer pleinement à la réussite de leurs activités." },
        { title: 'Innovation',    body: "Dans un environnement en constante évolution, SOGECOP SARL développe des solutions innovantes afin d’offrir à ses clients des produits et services modernes, performants et adaptés à leurs besoins. Nous investissons continuellement dans les nouvelles technologies, les méthodes de travail et la créativité afin de proposer des prestations toujours plus efficaces et compétitives." },
      ],
    },

   partenaires: {
      label: 'Ils nous font confiance',
      title: 'Nos clients',
      body: "Chez SOGECOP SARL, la confiance de nos clients est notre plus grande réussite. Nous accompagnons des entreprises, des institutions publiques, des ONG, des collectivités, ainsi que des particuliers, en leur proposant des solutions fiables, innovantes et adaptées à leurs besoins. Grâce à notre expertise multidisciplinaire et à notre réseau de partenaires nationaux et internationaux, nous répondons avec efficacité aux exigences de chaque projet, en garantissant qualité, professionnalisme et respect des délais. Chaque collaboration est fondée sur des valeurs essentielles : l’écoute, la transparence, la rigueur et la satisfaction client. C’est cette approche qui nous permet de bâtir des relations durables avec ceux qui nous accordent leur confiance.",
      items: [
        { src: '/partners/logo_anders.png', alt: 'ANDERS' },
        { src: '/partners/logo_dream_studio.png', alt: 'Dream Studio' },
        // { src: '/partners/logo_EETTIL.png', alt: 'EETTIL' },
        { src: '/partners/logo_SF2I.png', alt: 'SF2I' },
        { src: '/partners/S_H_C_G_Niger.jpeg', alt: 'S H C G Niger' },
        { src: '/partners/chancellerie.png', alt: 'Grande Chancellerie' },
        { src: '/partners/CNSF.jpeg', alt: 'CNSF' },
        // { src: '/partners/BBI.png', alt: 'BBI' },
        { src: '/partners/sonagess.png', alt: 'SONAGESS' },
        // { src: '/partners/riadel.png', alt: 'RIADEL' },
        { src: '/partners/BATICOM.jpeg', alt: 'BATICOM ENGINEERING' },
        { src: '/partners/KBTP.jpeg', alt: 'KBTP' },
        // { src: '/partners/shalom.jpeg', alt: 'Shalom Events Planner' },
        { src: '/partners/NMG.jpeg', alt: 'NEW MODELS GENERATION' },
        { src: '/partners/GS.jpeg', alt: 'Global Technologie & Solutions SAS' },
      ],
    },

    reseau: {
      label: 'Réseau international',
      title: 'Un réseau  mondial de fournisseurs',
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
      associations: [
        { src: '/associations/ass_be_leader.png', alt: 'Association Be Leader' },
        { src: '/associations/logo_boost_faso.jpeg', alt: 'Association Boost Faso' },
        // { src: null, alt: 'Association Beog-yinga' },
        // { src: null, alt: 'Association 4' },
        // { src: null, alt: 'Association 5' },
        // { src: null, alt: 'Association 6' },
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
      // chiffres: [
      //   { num: '4',    lbl: 'Areas of expertise'  },
      //   { num: '50+',  lbl: 'Orders completed'    },
      //   { num: '100%', lbl: 'Quality commitment'  },
      //   { num: 'BF',   lbl: 'Burkinabè company'   },
      // ],

      images: [
        { src: null, alt: 'Siège social SOGECOP — Ouaga 2000' },
        { src: null, alt: 'L\'équipe SOGECOP' },
      ],
    },

    valeurs: {
      label: 'What drives us',
      title: 'Our values',
      seeMore: 'Read more',
      seeLess: '',
      items: [
        { title: 'Excellency',   body: 'At SOGECOP SARL, we place excellence at the heart of everything we do. Whether it\'s international trade, digital production and printing, interior design, or project development, we are committed to providing high-quality solutions that meet our clients requirements. Our goal is to exceed expectations through our professionalism, expertise, and unwavering attention to detail.' },
        { title: 'Integrity',  body: 'We build each of our relationships on trust, transparency, and respect for our commitments. Integrity guides every decision we make and forms the foundation of our reputation with our partners, suppliers, and clients. We prioritize honest, ethical, and sustainable collaboration.' },
        { title: 'Customer Satisfaction',    body: 'Our customers satisfaction is our top priority. We strive to understand their needs, support them professionally, and offer personalized, responsive, and high-quality service. Every project receives the same level of attention to build lasting relationships of trust and contribute fully to the success of their businesses.' },
        { title: 'Innovation',   body: 'We consIn a constantly evolving environment, SOGECOP SARL develops innovative solutions to offer its clients modern, high-performing products and services tailored to their needs. We continuously invest in new technologies, working methods, and creativity to provide increasingly efficient and competitive services.tantly seek new solutions to better meet the evolving needs of our clients.' },
      ],
    },

    partenaires: {
      label: 'They trust us',
      title: 'Our customers',
      body: 'SOGECOP Sarl works with a Sogecop SARL collaborates with a network of local and international partners to provide services that meet its clients requirements with professionalism and rigor. of local and institutional partners to ensure the best quality of service.',
      items: [
        { src: '/partners/logo_anders.png', alt: 'ANDERS' },
        { src: '/partners/logo_dream_studio.png', alt: 'Dream Studio' },
        // { src: '/partners/logo_EETTIL.png', alt: 'EETTIL' },
        { src: '/partners/logo_SF2I.png', alt: 'SF2I' },
        { src: '/partners/S_H_C_G_Niger.jpeg', alt: 'S H C G Niger' },
        { src: '/partners/chancellerie.png', alt: 'Grande Chancellerie' },
        { src: '/partners/CNSF.png', alt: 'CNSF' },
        // { src: '/partners/BBI.png', alt: 'BBI' },
        { src: '/partners/sonagess.png', alt: 'SONAGESS' },
        // { src: '/partners/riadel.png', alt: 'RIADEL' },
        { src: '/partners/BATICOM.jpeg', alt: 'BATICOM ENGINEERING' },
        { src: '/partners/KBTP.jpeg', alt: 'KBTP' },
        // { src: '/partners/shalom.jpeg', alt: 'Shalom Events Planner' },
        { src: '/partners/NMG.jpeg', alt: 'NEW MODELS GENERATION' },
        { src: '/partners/GS.jpeg', alt: 'Global Technologie & Solutions SAS' },
      ],
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
          // pays: ['France', 'Germany', 'Italy', 'Spain'],
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
      associations: [
        { src: '/associations/ass_be_leader.png', alt: 'Association Be Leader' },
        { src: '/associations/logo_boost_faso.jpeg', alt: 'Association Boost Faso' },
        { src: null, alt: 'Association Beog-yinga' },
      ],
    },

    cta: {
      title: "Let's work together",
      sub: 'A project or a question? Our team is available to support you.',
      btn: 'Contact us',
    },
  },
};