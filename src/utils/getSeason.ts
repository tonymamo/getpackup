import tzlookup from 'tz-lookup';
import spacetime from 'spacetime';

type GetSeasonReturnType = 'spring' | 'summer' | 'autumn' | 'winter';

const getSeason = (lat: number, lng: number, date: string) => {
  const timezone = tzlookup(lat, lng);
  const s = spacetime(date, timezone);
  return s.season() as GetSeasonReturnType;
};

export default getSeason;
