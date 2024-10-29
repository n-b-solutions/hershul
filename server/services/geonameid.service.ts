let geonameid: string | null = null;

const GeonameidService = {
  saveGeonameid: (id: string): void => {
    geonameid = id;
  },

  getGeonameid: (): string | null => {
    return geonameid;
  },
};

export default GeonameidService;