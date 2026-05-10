// src/pages/public/data/contact.data.js

export const CONTACT_CONTENT = {
  fr: {
    breadcrumbHome: 'Accueil',
    pageLabel: 'Contactez-nous',

    hero: {
      label: 'Nous contacter',
      title: 'Parlons de votre projet ensemble',
      sub: "Une question, un devis, un projet ? Notre équipe est disponible pour vous accompagner du lundi au samedi.",
    },

    infos: {
      label: 'Nos coordonnées',
      title: 'Retrouvez-nous',
      items: [
        {
          key: 'email',
          label: 'Email',
          val: 'sogecop.sarl.bf@gmail.com',
        },
        {
          key: 'phone',
          label: 'Téléphone',
          val: '+226 55 08 86 36',
        },
        {
          key: 'address',
          label: 'Adresse',
          val: 'Rue du 17 Octobre, Bd Muammar Kaddafi\nOuaga 2000, Burkina Faso',
        },
        {
          key: 'hours',
          label: 'Horaires',
          val: 'Lun – Ven : 07h30 – 17h30\nSamedi : 08h00 – 15h00',
        },
      ],
    },

    form: {
      title: 'Demande de renseignements',
      nom:     { label: 'Nom complet',      placeholder: 'Votre nom' },
      email:   { label: 'Email',            placeholder: 'votre@email.com' },
      service: { label: 'Service concerné', options: ['Imprimerie Générale', 'Fournitures informatiques', 'Négoce International', 'Aménagement'] },
      message: { label: 'Message',          placeholder: 'Décrivez brièvement votre besoin' },
      submit: 'Envoyer via WhatsApp',
      required: 'Veuillez remplir tous les champs.',
    },

    localisation: {
      label: 'Localisation',
      title: 'Où nous trouver',
      address: 'Rue du 17 Octobre, Bd Muammar Kaddafi, Ouaga 2000, Ouagadougou, Burkina Faso',
      mapsLink: 'https://maps.google.com/?q=Ouaga+2000+Ouagadougou+Burkina+Faso',
      mapsBtn: 'Ouvrir dans Google Maps',
    },
  },

  en: {
    breadcrumbHome: 'Home',
    pageLabel: 'Contact us',

    hero: {
      label: 'Get in touch',
      title: "Let's talk about your project",
      sub: "A question, a quote, a project? Our team is available to support you Monday through Saturday.",
    },

    infos: {
      label: 'Our details',
      title: 'Find us',
      items: [
        {
          key: 'email',
          label: 'Email',
          val: 'sogecop.sarl.bf@gmail.com',
        },
        {
          key: 'phone',
          label: 'Phone',
          val: '+226 55 08 86 36',
        },
        {
          key: 'address',
          label: 'Address',
          val: 'Rue du 17 Octobre, Bd Muammar Kaddafi\nOuaga 2000, Burkina Faso',
        },
        {
          key: 'hours',
          label: 'Hours',
          val: 'Mon – Fri: 7:30 AM – 5:30 PM\nSaturday: 8:00 AM – 3:00 PM',
        },
      ],
    },

    form: {
      title: 'Information request',
      nom:     { label: 'Full name',          placeholder: 'Your name' },
      email:   { label: 'Email',              placeholder: 'your@email.com' },
      service: { label: 'Service required',   options: ['General Printing', 'IT Supplies', 'International Trading', 'Interior & Exterior Design'] },
      message: { label: 'Message',            placeholder: 'Briefly describe your needs' },
      submit: 'Send via WhatsApp',
      required: 'Please fill in all fields.',
    },

    localisation: {
      label: 'Location',
      title: 'Where to find us',
      address: 'Rue du 17 Octobre, Bd Muammar Kaddafi, Ouaga 2000, Ouagadougou, Burkina Faso',
      mapsLink: 'https://maps.google.com/?q=Ouaga+2000+Ouagadougou+Burkina+Faso',
      mapsBtn: 'Open in Google Maps',
    },
  },
};