// TODO: Merge all of these activities into the Gear Item and resolve TS errors
export type ActivityTypes = {
  airplane: boolean;
  backcountryThreeSeason: boolean;
  backcountryWinter: boolean;
  basicHut: boolean;
  biking: boolean;
  bivy: boolean;
  boat: boolean;
  bouldering: boolean;
  bus: boolean;
  car: boolean;
  carCamp: boolean;
  carCamping: boolean;
  dayTrip: boolean;
  hiking: boolean;
  hostel: boolean;
  hotel: boolean;
  iceClimbing: boolean;
  motorcycle: boolean;
  multidayTrip: boolean;
  paddling: boolean;
  resortSkiing: boolean;
  servicedHut: boolean;
  skiTouring: boolean;
  snowboarding: boolean;
  snowshoeing: boolean;
  sportClimbing: boolean;
  tent: boolean;
  tradClimbing: boolean;
  train: boolean;
};

export type GearItem = {
  id: string;
  name: string;
  category: string;
  lastEditedBy?: string;
  essential: boolean;
  [key: string]: boolean | string | undefined;
};
