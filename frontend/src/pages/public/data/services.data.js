// src/pages/public/data/services.data.js

export const SERVICES_CONTENT = {
  fr: {
    breadcrumbHome: 'Accueil',
    heroLabel: 'Nos services',
    heroTitle: 'Des solutions adaptées à vos besoins',
    heroSub: "SOGECOP Sarl intervient dans quatre domaines d'expertise complémentaires pour répondre aux besoins des entreprises, institutions et particuliers au Burkina Faso et partout dans le monde.",
    ctaTitle: 'Un projet ? Parlons-en.',
    // ctaSub: 'Contactez-nous pour un devis personnalisé ou une consultation gratuite.',
    ctaBtn: 'Nous contacter',
    galTitle: 'Nos réalisations',
    galSub: 'Quelques exemples de projets réalisés pour nos clients.',
    galPhotoLabel: 'Photo',
    galVideoLabel: 'Vidéo',
    domaines: [
      {
        id: 'imprimerie',
        // label: 'Domaine 01',
        title: 'Production et Imprimerie Numérique',
        img: '/services/imprimerie.png',
        intro: "Faite bonne impression dès le premier regard ! Grâce à notre expertise et à des équipements de pointe, nous donnons vie à vos supports de communication avec une qualité exceptionnelle et des finitions soignées.",
        categories: [
          { name: 'Impression numérique & Offset',      items: ['Cartes de visite, en-têtes de lettre, enveloppes', 'Brochures, catalogues, livrets reliés', 'Affiches format A0, A1, A2, A3,A4, A5, etc', 'Flyers, dépliants 2 ou 3 volets'] },
          { name: 'Grands formats & signalétique',       items: ['Bâches publicitaires et banderoles', 'Kakémonos et roll-ups', 'Panneaux rigides (dibond, PVC expansé)', 'Habillage vitrine et véhicule', 'Enseignes signalétiques et totems lumineux', 'Drapeaux personnalisés'] },
          { name: 'Objets personnalisés & packaging',    items: ['T-shirts, casquettes, stylos sérigraphiés', 'Boîtes, pochettes, étiquettes personnalisées', 'Trophées, plaques gravées', 'Goodies entreprise et institutionnel'] },
        ],
      },
      {
        id: 'informatique',
        // label: 'Domaine 02',
        title: 'Fournitures de consommables & Matériels informatiques',
        img: '/services/informatique.png',
        intro: "Distributeur de fournitures et équipements informatiques, nous proposons des produits de marques reconnues pour équiper vos bureaux, salles informatiques et réseaux d'entreprise.",
        categories: [
          { name: 'Consommables & fournitures',    items: ['Papiers, ramettes toutes grammatures', 'Toners et cartouches (OEM & compatibles)', "Rubans, étiquettes, supports d'impression", 'Fournitures de bureau générales'] },
          { name: 'Équipements informatiques',     items: ['Ordinateurs de bureau et portables', 'Imprimantes, copieurs, scanners', 'Écrans, claviers, périphériques', 'Vidéoprojecteurs et matériel de présentation'] },
          { name: 'Réseaux & sécurité',            items: ["Switches, routeurs, points d'accès Wi-Fi", 'Câblage réseau cuivre et fibre optique', 'Onduleurs et protections électriques', 'Caméras de surveillance IP'] },
        ],
      },
      {
        id: 'negoce',
        // label: 'Domaine 03',
        title: 'Négoce International',
        img: '/services/negoce.png',
        intro: "Grâce à notre réseau de fournisseurs en Afrique, Europe et Asie, nous importons et distribuons une large gamme de produits pour les marchés publics, le BTP et l'industrie.",
        categories: [
          { name: 'Matériaux de construction & BTP',              items: ['Ciment, fer à béton, tôles, acier', 'Carrelages, revêtements de sol et mur', 'Peintures, enduits, produits de finition', 'Matériels et outillages de chantier'] },
          { name: 'Produits alimentaires & matières premières',    items: ['Denrées alimentaires en vrac et conditionnées', 'Matières premières agricoles', 'Intrant, fertilisant, sémence, et équipement agricole', 'Approvisionnement pour marchés publics'] },
          { name: 'fournitures industrielles spécialisées', items: ['Mobilier et équipement bureautique', 'Consultations spécialisées pluridisciplinaires', "Fournitures pour appels d'offres", 'Équipements de protection individuelle (EPI)'] },
        ],
      },
      {
        id: 'amenagement',
        // label: 'Domaine 04',
        title: 'Aménagement intérieur & extérieur',
        img: '/services/amenagement.png',
        intro: "Nous concevons et réalisons des espaces fonctionnels et esthétiques pour les entreprises, institutions et particuliers — de la conception à la livraison clé en main.",
        categories: [
          { name: 'Aménagement intérieur',    items: ['Faux plafonds (staff, PVC, dalles acoustiques)', 'Revêtements de sol (parquet, vinyle, moquette)', 'Cloisons amovibles et bureaux aménagés', 'Menuiserie bois et aluminium sur mesure'] },
          { name: 'Aménagement extérieur',    items: ['Terrasses, allées et dallages extérieurs', 'Clôtures, portails, grilles de sécurité', 'Espaces verts et aménagements paysagers', 'Enseignes lumineuses et signalétique extérieure'] },
          { name: 'Espaces institutionnels',  items: ['Salles de réunion et open spaces', "Accueils et halls d'entrée", 'Amphithéâtres et salles de formation', 'Espaces de restauration collective'] },
        ],
      },
    ],
  },

  en: {
    breadcrumbHome: 'Home',
    heroLabel: 'Our services',
    heroTitle: 'Solutions tailored to your needs',
    heroSub: 'SOGECOP Sarl operates in four complementary areas of expertise to meet the needs of businesses, institutions and individuals in Burkina Faso and around the world.',
    ctaTitle: "Have a project? Let's talk.",
    // ctaSub: 'Contact us for a personalized quote or a free consultation.',
    ctaBtn: 'Contact us',
    galTitle: 'Our work',
    galSub: 'A selection of projects completed for our clients.',
    galPhotoLabel: 'Photo',
    galVideoLabel: 'Video',
    domaines: [
      {
        id: 'Digital Production and Printing',
        // label: 'Domain 01',
        title: 'Digital Production and Printing',
        img: '/services/imprimerie.png',
        intro: 'Make a great first impression! Thanks to our expertise and state-of-the-art equipment, we bring your communication materials to life with exceptional quality and meticulous finishing.',
        categories: [
          { name: 'Digital & Offset printing',   items: ['Business cards, letterheads, envelopes', 'Brochures, catalogues, bound booklets', 'Posters from A4, A3, etc', 'Flyers, 2 or 3-fold leaflets'] },
          { name: 'Large format & signage',       items: ['Advertising banners and vinyl banners', 'Roll-ups and display stands', 'Rigid panels (dibond, expanded PVC)', 'Window and vehicle wrapping'] },
          { name: 'Custom objects & packaging',   items: ['Screen-printed T-shirts, caps, pens', 'Custom boxes, pouches, labels', 'Trophies and engraved plaques', 'Corporate and institutional goodies'] },
        ],
      },
      {
        id: 'it',
        // label: 'Domain 02',
        title: 'Computer Consumables & Equipment',
        img: '/services/informatique.png',
        intro: 'As a distributor of IT supplies and equipment, we offer products from recognized brands to equip your offices, computer rooms and corporate networks.',
        categories: [
          { name: 'Consumables & supplies', items: ['Paper, reams in all weights', 'Toners and cartridges (OEM & compatible)', 'Ribbons, labels, print media', 'General office supplies'] },
          { name: 'IT equipment',           items: ['Desktops and laptops', 'Printers, copiers, scanners', 'Screens, keyboards, peripherals', 'Projectors and presentation equipment'] },
          { name: 'Networks & security',    items: ['Switches, routers, Wi-Fi access points', 'Copper and fiber optic cabling', 'UPS and power protection', 'IP surveillance cameras'] },
        ],
      },
      {
        id: 'trading',
        // label: 'Domain 03',
        title: 'International Trading',
        img: '/services/negoce.png',
        intro: 'Thanks to our supplier network across Africa, Europe and Asia, we import and distribute a wide range of products for public procurement, construction and industry.',
        categories: [
          { name: 'Construction & BTP materials',        items: ['Cement, rebar, sheet metal, steel', 'Floor and wall tiles and coverings', 'Paints, coatings, finishing products', 'Construction tools and equipment'] },
          { name: 'Food products & raw materials',       items: ['Bulk and packaged foodstuffs', 'Agricultural raw materials', 'Products for collective catering', 'Supply for public tenders'] },
          { name: 'Industrial & institutional supplies', items: ['Office and school furniture', 'Medical and paramedical equipment', 'Supplies for tenders and bids', 'Personal protective equipment (PPE)'] },
        ],
      },
      {
        id: 'design',
        // label: 'Domain 04',
        title: 'Interior & Exterior Design',
        img: '/services/amenagement.png',
        intro: 'We design and build functional, aesthetic spaces for businesses, institutions and individuals — from concept to turnkey delivery.',
        categories: [
          { name: 'Interior design',       items: ['False ceilings (plaster, PVC, acoustic tiles)', 'Floor coverings (parquet, vinyl, carpet)', 'Movable partitions and fitted offices', 'Custom wood and aluminum joinery'] },
          { name: 'Exterior design',       items: ['Terraces, pathways and outdoor paving', 'Fences, gates, security grilles', 'Green spaces and landscaping', 'Illuminated signs and outdoor signage'] },
          { name: 'Institutional spaces',  items: ['Meeting rooms and open spaces', 'Reception areas and entrance halls', 'Lecture theatres and training rooms', 'Collective dining spaces'] },
        ],
      },
    ],
  },
};

// Remplacer src: null par le chemin réel quand les médias sont disponibles
// Images : src: '/images/realisations/nom.jpg'
// Vidéos : src: '/videos/realisations/nom.mp4'
export const GALERIE_ITEMS = [
  { type: 'image', src: null, captionFr: 'Impression bâche grand format',      captionEn: 'Large format banner printing' },
  { type: 'video', src: '/videos/sogecop_vid.mp4', captionFr: 'Aménagement',        captionEn: 'Fit-out' },
  { type: 'image', src: null, captionFr: 'Installation réseau entreprise',      captionEn: 'Corporate network installation' },
  { type: 'image', src: null, captionFr: 'Aménagement salle de réunion',        captionEn: 'Meeting room fit-out' },
  { type: 'video', src: '/videos/sogecop_vid2.mp4', captionFr: 'Aménagement bureau',         captionEn: 'Desk fit-out ' },
  { type: 'image', src: null, captionFr: 'Livraison fournitures marché public', captionEn: 'Public tender supply delivery' },
];

export const DOMAIN_ICONS_KEYS  = ['print', 'pc', 'globe', 'home'];
export const DOMAIN_COLORS = ['var(--green-dark)', 'var(--brown)', 'var(--green-dark)', 'var(--brown)'];