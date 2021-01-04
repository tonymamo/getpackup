export const gearListTripType = [
  { name: 'dayTrip', label: 'Day Trip' },
  { name: 'multidayTrip', label: 'Multi-Day Trip' },
];

export const gearListActivities = [
  { name: 'hiking', label: 'Hiking', icon: 'fa/FaHiking' },
  { name: 'biking', label: 'Biking', icon: 'fa/FaBicycle' },
  { name: 'paddling', label: 'Paddling', icon: 'fa/FaWater' },
  { name: 'bouldering', label: 'Bouldering', icon: 'fa/FaRegHandRock' },
  { name: 'sportClimbing', label: 'Sport Climbing', icon: 'fa/FaMountain' },
  { name: 'tradClimbing', label: 'Trad Climbing', icon: 'fa/FaMountain' },
  { name: 'iceClimbing', label: 'Ice Climbing', icon: 'fa/FaIcicles' },
  { name: 'skiTouring', label: 'Ski Touring', icon: 'fa/FaSkiing' },
  { name: 'resortSkiing', label: 'Resort Skiing', icon: 'fa/FaSkiing' },
  { name: 'snowboarding', label: 'Snowboarding', icon: 'fa/FaSnowboarding' },
  { name: 'snowshoeing', label: 'Snowshoeing', icon: 'fa/FaSnowflake' },
];

export const gearListAccommodations = [
  { name: 'hotel', label: 'Hotel', icon: 'fa/FaHotel' },
  { name: 'hostel', label: 'Hostel', icon: 'fa/FaBed' },
  { name: 'servicedHut', label: 'Serviced Hut', icon: 'fa/FaWarehouse' },
  { name: 'basicHut', label: 'Basic Hut', icon: 'fa/FaHome' },
  { name: 'carCamp', label: 'Car Camp/RV', icon: 'fa/FaCaravan' },
  { name: 'tent', label: 'Tent', icon: 'fa/FaCampground' },
  { name: 'bivy', label: 'Bivy', icon: 'fa/FaBed' },
];

export const gearListCampKitchen = [
  { name: 'backcountryThreeSeason', label: 'Backcountry 3-Season' },
  { name: 'backcountryWinter', label: 'Backcountry Winter' },
  { name: 'carCamping', label: 'Car Camping' },
];

export const gearListTransportation = [
  { name: 'airplane', label: 'Airplane', icon: 'fa/FaPlane' },
  { name: 'car', label: 'Car', icon: 'fa/FaCar' },
  { name: 'bus', label: 'Bus', icon: 'fa/FaBusAlt' },
  { name: 'boat', label: 'Boat', icon: 'fa/FaShip' },
  { name: 'train', label: 'Train', icon: 'fa/FaTrain' },
  { name: 'motorcycle', label: 'Motorcycle', icon: 'fa/FaMotorcycle' },
];

export const gearListKeys = [
  ...gearListTripType,
  ...gearListActivities,
  ...gearListAccommodations,
  ...gearListCampKitchen,
  ...gearListTransportation,
].map((item) => item.name);
