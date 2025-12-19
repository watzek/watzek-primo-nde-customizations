// nos-options.config.ts
export interface NosOption {
  urlBase: string;
  query_mappings: {
    title: string;
    author: string;
    callnumber: string;
    location: string;
  }[];
  locationCodes: string[];
}

export interface NosOptions {
  [mainLocation: string]: NosOption[];
}

export const NOS_OPTIONS: NosOptions = {
  'Watzek Library': [
    {
      urlBase: 'https://docs.google.com/forms/d/e/1FAIpQLSdBvdqmK0z1mHhg-ATiCHT94JVBuwdaaHzpyZJcK3XBGEP-IA/viewform?usp=pp_url',
      query_mappings: [{
        title: 'entry.956660822',
        author: 'entry.1791543904',
        callnumber: 'entry.865809076',
        location: 'entry.431935401'
      }],
      locationCodes: ['wmain', 'wvid', 'wref', 'wdis', 'wgovd', 'wgovav', 'wjuv', 'weasy', 'wnew', 'wos', 'wbalc', 'wluo']
    }
  ],
  'Boley Law Library': [
    {
      urlBase: 'https://docs.google.com/forms/d/e/1FAIpQLSeevMvoTWs7JOw7BHvz1dXsRlAYpp9gi4qDByLU4NTrmvs2hQ/viewform?usp=pp_url',
      query_mappings: [{
        title: 'entry.956660822',
        author: 'entry.1791543904',
        callnumber: 'entry.865809076',
        location: 'entry.431935401'
      }],
      locationCodes: ['lsta', 'lfed', 'lhist', 'lcv', 'lenv', 'lmain', 'lstu']
    }
  ]
};
