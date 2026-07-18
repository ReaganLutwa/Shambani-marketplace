export interface District {
  name: string;
  region?: string;
}

export interface CountryData {
  code: string;
  name: string;
  currency: string;
  regions: {
    name: string;
    districts: string[];
  }[];
}

export const countriesData: Record<string, CountryData> = {
  UG: {
    code: 'UG',
    name: 'Uganda',
    currency: 'UGX',
    regions: [
      {
        name: 'Central',
        districts: [
          'Kampala', 'Wakiso', 'Mukono', 'Mpigi', 'Masaka', 'Luwero', 'Mityana',
          'Mubende', 'Nakasongola', 'Kayunga', 'Buikwe', 'Bukomansimbi', 'Butambala',
          'Buvuma', 'Gomba', 'Kalangala', 'Kalungu', 'Kassanda', 'Kiboga', 'Kyankwanzi',
          'Lwengo', 'Lyantonde', 'Nakaseke', 'Rakai', 'Sembabule',
        ],
      },
      {
        name: 'Eastern',
        districts: [
          'Jinja', 'Iganga', 'Mayuge', 'Bugiri', 'Busia', 'Tororo', 'Mbale', 'Sironko',
          'Manafwa', 'Bududa', 'Budaka', 'Bukedea', 'Bulambuli', 'Butebo', 'Buyende',
          'Kaliro', 'Kamuli', 'Kapchorwa', 'Katakwi', 'Kibuku', 'Kumi', 'Kween',
          'Luuka', 'Namayingo', 'Namisindwa', 'Namutumba', 'Ngora', 'Pallisa', 'Serere',
          'Soroti', 'Kaberamaido', 'Amuria', 'Bukwo', 'Pader', 'Agago', 'Alebtong',
          'Amudat', 'Abim', 'Kaabong', 'Karenga', 'Kitgum', 'Kotido', 'Lamwo',
          'Maracha', 'Moroto', 'Moyo', 'Nakapiripirit', 'Napak', 'Nebbi', 'Otube',
          'Oyam', 'Zombo', 'Dokolo', 'Lira', 'Apac', 'Kole', 'Otuke',
        ],
      },
      {
        name: 'Western',
        districts: [
          'Mbarara', 'Bushenyi', 'Isingiro', 'Kiruhura', 'Ibanda', 'Ntungamo', 'Rukungiri',
          'Kanungu', 'Kabale', 'Kisoro', 'Buhweju', 'Buliisa', 'Bundibugyo', 'Bunyangabu',
          'Hoima', 'Kagadi', 'Kakumiro', 'Kamwenge', 'Kapchorwa', 'Kasese', 'Kibaale',
          'Kikuube', 'Kyenjojo', 'Masindi', 'Mitooma', 'Ntoroko', 'Rubanda', 'Rubirizi',
          'Rukiga', 'Sheema',
        ],
      },
      {
        name: 'Northern',
        districts: [
          'Gulu', 'Kitgum', 'Lira', 'Apac', 'Arua', 'Nebbi', 'Moyo', 'Yumbe',
          'Adjumani', 'Pader', 'Amuru', 'Nwoya', 'Omoro', 'Lamwo', 'Agago',
          'Alebtong', 'Amolatar', 'Dokolo', 'Kole', 'Otuke', 'Oyam', 'Maracha',
          'Koboko', 'Zombo', 'Pakwach', 'Madi-Okollo', 'Terego',
        ],
      },
    ],
  },
  KE: {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    regions: [
      {
        name: 'Nairobi',
        districts: ['Nairobi City'],
      },
      {
        name: 'Central',
        districts: ['Kiambu', 'Kirinyaga', 'Murang\'a', 'Nyandarua', 'Nyeri'],
      },
      {
        name: 'Coast',
        districts: ['Kilifi', 'Kwale', 'Lamu', 'Mombasa', 'Taita-Taveta', 'Tana River'],
      },
      {
        name: 'Eastern',
        districts: ['Embu', 'Isiolo', 'Kitui', 'Machakos', 'Makueni', 'Marsabit', 'Meru', 'Tharaka-Nithi'],
      },
      {
        name: 'Nyanza',
        districts: ['Homa Bay', 'Kisii', 'Kisumu', 'Migori', 'Nyamira', 'Siaya'],
      },
      {
        name: 'Rift Valley',
        districts: ['Baringo', 'Bomet', 'Bungoma', 'Elgeyo-Marakwet', 'Kajiado', 'Kericho', 'Laikipia', 'Nakuru', 'Nandi', 'Narok', 'Samburu', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'West Pokot'],
      },
      {
        name: 'Western',
        districts: ['Bungoma', 'Busia', 'Kakamega', 'Vihiga'],
      },
      {
        name: 'North Eastern',
        districts: ['Garissa', 'Mandera', 'Wajir'],
      },
    ],
  },
  TZ: {
    code: 'TZ',
    name: 'Tanzania',
    currency: 'TZS',
    regions: [
      { name: 'Arusha', districts: ['Arusha City', 'Arusha District', 'Karatu', 'Longido', 'Meru', 'Monduli', 'Ngorongoro'] },
      { name: 'Dar es Salaam', districts: ['Ilala', 'Kigamboni', 'Kinondoni', 'Temeke', 'Ubungo'] },
      { name: 'Dodoma', districts: ['Bahi', 'Chamwino', 'Chemba', 'Dodoma Municipal', 'Kondoa', 'Kongwa', 'Mpwapwa'] },
      { name: 'Geita', districts: ['Bukombe', 'Chato', 'Geita', 'Mbogwe', 'Nyang\'hwale'] },
      { name: 'Iringa', districts: ['Iringa District', 'Iringa Municipal', 'Kilolo', 'Mafinga', 'Mufindi'] },
      { name: 'Kagera', districts: ['Biharamulo', 'Bukoba District', 'Bukoba Municipal', 'Karagwe', 'Kyerwa', 'Missenyi', 'Muleba', 'Ngara'] },
      { name: 'Katavi', districts: ['Mlele', 'Mpanda District', 'Mpanda Town'] },
      { name: 'Kigoma', districts: ['Buhigwe', 'Kakonko', 'Kasulu District', 'Kasulu Town', 'Kibondo', 'Kigoma District', 'Kigoma-Ujiji Municipal', 'Uvinza'] },
      { name: 'Kilimanjaro', districts: ['Hai', 'Moshi District', 'Moshi Municipal', 'Mwanga', 'Rombo', 'Same', 'Siha'] },
      { name: 'Lindi', districts: ['Kilwa', 'Lindi District', 'Lindi Municipal', 'Liwale', 'Nachingwea', 'Ruangwa'] },
      { name: 'Manyara', districts: ['Babati District', 'Babati Town', 'Hanang', 'Kiteto', 'Mbulu District', 'Mbulu Town', 'Simanjiro'] },
      { name: 'Mara', districts: ['Bunda', 'Butiama', 'Musoma District', 'Musoma Municipal', 'Rorya', 'Serengeti', 'Tarime'] },
      { name: 'Mbeya', districts: ['Busokelo', 'Chunya', 'Kyela', 'Mbarali', 'Mbeya City', 'Mbeya District', 'Rungwe'] },
      { name: 'Mjini Magharibi', districts: ['Magharibi A', 'Magharibi B', 'Mjini'] },
      { name: 'Morogoro', districts: ['Gairo', 'Kilombero', 'Kilosa', 'Morogoro District', 'Morogoro Municipal', 'Mvomero', 'Ulanga', 'Malinyi'] },
      { name: 'Mtwara', districts: ['Masasi District', 'Masasi Town', 'Mtwara District', 'Mtwara Municipal', 'Nanyumbu', 'Newala', 'Tandahimba'] },
      { name: 'Mwanza', districts: ['Ilemela', 'Kwimba', 'Magu', 'Misungwi', 'Nyamagana', 'Sengerema', 'Ukerewe'] },
      { name: 'Nairobi', districts: ['Njombe District', 'Njombe Town', 'Makete', 'Wanging\'ombe', 'Ludewa'] },
      { name: 'Pemba North', districts: ['Micheweni', 'Wete'] },
      { name: 'Pemba South', districts: ['Chake Chake', 'Mkoani'] },
      { name: 'Pwani', districts: ['Bagamoyo', 'Kibaha District', 'Kibaha Town', 'Kisarawe', 'Mafia', 'Mkuranga', 'Rufiji'] },
      { name: 'Rukwa', districts: ['Kalambo', 'Nkasi', 'Sumbawanga District', 'Sumbawanga Municipal'] },
      { name: 'Ruvuma', districts: ['Mbinga', 'Namtumbo', 'Nyasa', 'Songea District', 'Songea Municipal', 'Tunduru'] },
      { name: 'Shinyanga', districts: ['Kahama District', 'Kahama Town', 'Kishapu', 'Msalala', 'Shinyanga District', 'Shinyanga Municipal'] },
      { name: 'Simiyu', districts: ['Bariadi District', 'Bariadi Town', 'Busega', 'Itilima', 'Maswa', 'Meatu'] },
      { name: 'Singida', districts: ['Ikungi', 'Iramba', 'Manyoni', 'Mkalama', 'Singida District', 'Singida Municipal'] },
      { name: 'Songwe', districts: ['Ileje', 'Mbozi', 'Momba', 'Songwe'] },
      { name: 'Tabora', districts: ['Igunga', 'Kaliua', 'Nzega', 'Sikonge', 'Tabora Municipal', 'Urambo', 'Uyui'] },
      { name: 'Tanga', districts: ['Handeni District', 'Handeni Town', 'Kilindi', 'Korogwe District', 'Korogwe Town', 'Lushoto', 'Mkinga', 'Muheza', 'Pangani', 'Tanga City'] },
    ],
  },
  RW: {
    code: 'RW',
    name: 'Rwanda',
    currency: 'RWF',
    regions: [
      {
        name: 'Kigali',
        districts: ['Gasabo', 'Kicukiro', 'Nyarugenge'],
      },
      {
        name: 'Northern',
        districts: ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
      },
      {
        name: 'Southern',
        districts: ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
      },
      {
        name: 'Eastern',
        districts: ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
      },
      {
        name: 'Western',
        districts: ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rutsiro', 'Rusizi'],
      },
    ],
  },
};

// Flatten all districts for a given country
export function getDistrictsForCountry(countryCode: string): string[] {
  const country = countriesData[countryCode];
  if (!country) return [];
  return country.regions.flatMap((r) => r.districts);
}

// Get all regions for a country
export function getRegionsForCountry(countryCode: string): string[] {
  const country = countriesData[countryCode];
  if (!country) return [];
  return country.regions.map((r) => r.name);
}

// Get districts for a specific region
export function getDistrictsForRegion(countryCode: string, regionName: string): string[] {
  const country = countriesData[countryCode];
  if (!country) return [];
  const region = country.regions.find((r) => r.name === regionName);
  return region?.districts || [];
}

export const supportedCountries = [
  { code: 'UG', name: 'Uganda' },
  { code: 'KE', name: 'Kenya' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'RW', name: 'Rwanda' },
];
