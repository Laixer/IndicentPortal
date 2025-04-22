/**
 * Environment damage characteristics enum
 */
export enum EnvironmentDamageCharacteristics {
  /** Subsidence */
  Subsidence = 'subsidence',

  /** Sagging sewer connections */
  SaggingSewerConnection = 'sagging_sewer_connection',

  /** Sagging cables and pipes */
  SaggingCablesPipes = 'sagging_cables_pipes',

  /** Flooding */
  Flooding = 'flooding',

  /** Foundation damage nearby */
  FoundationDamageNearby = 'foundation_damage_nearby',

  /** Elevation */
  Elevation = 'elevation',

  /** Increasing traffic */
  IncreasingTraffic = 'increasing_traffic',

  /** Construction nearby */
  ConstructionNearby = 'construction_nearby',

  /** Vegetation nearby */
  VegetationNearby = 'vegetation_nearby',

  /** Sewage leakage */
  SewageLeakage = 'sewage_leakage',

  /** Low ground water */
  LowGroundWater = 'low_ground_water'
}

/**
 * Foundation damage cause enum
 */
export enum FoundationDamageCause {
  /** Drainage */
  Drainage = 'drainage',

  /** Construction flaw */
  ConstructionFlaw = 'construction_flaw',

  /** Drystand */
  Drystand = 'drystand',

  /** Overcharge */
  Overcharge = 'overcharge',

  /** Overcharge and negative cling */
  OverchargeNegativeCling = 'overcharge_negative_cling',

  /** Negative cling */
  NegativeCling = 'negative_cling',

  /** Bio infection */
  BioInfection = 'bio_infection',

  /** Fungus infection */
  FungusInfection = 'fungus_infection',

  /** Bio and fungus infection */
  BioFungusInfection = 'bio_fungus_infection',

  /** Foundation flaw */
  FoundationFlaw = 'foundation_flaw',

  /** Construction heave */
  ConstructionHeave = 'construction_heave',

  /** Subsidence */
  Subsidence = 'subsidence',

  /** Vegetation */
  Vegetation = 'vegetation',

  /** Gas */
  Gas = 'gas',

  /** Vibrations */
  Vibrations = 'vibrations',

  /** Foundation was partially recovered */
  PartialFoundationRecovery = 'partial_foundation_recovery',

  /** Damage due to Japanese knotweed */
  JapanseKnotweed = 'japanse_knotweed',

  /** Groundwater level reduction */
  GroundwaterLevelReduction = 'groundwater_level_reduction'
}

/**
 * Foundation damage characteristics enum
 */
export enum FoundationDamageCharacteristics {
  /** Jamming door window */
  JammingDoorWindow = 'jamming_door_window',

  /** Crack */
  Crack = 'crack',

  /** Skewed */
  Skewed = 'skewed',

  /** Crawlspace flooding */
  CrawlspaceFlooding = 'crawlspace_flooding',

  /** Threshold above subsurface */
  ThresholdAboveSubsurface = 'threshold_above_subsurface',

  /** Threshold below subsurface */
  ThresholdBelowSubsurface = 'threshold_below_subsurface',

  /** Crooked floor wall */
  CrookedFloorWall = 'crooked_floor_wall'
}

/**
 * Foundation type enum
 */
export enum FoundationType {
  /** Wood */
  Wood = 'wood',

  /** Wood foundation according to Amsterdam */
  WoodAmsterdam = 'wood_amsterdam',

  /** Wood foundation according to Rotterdam */
  WoodRotterdam = 'wood_rotterdam',

  /** Concrete */
  Concrete = 'concrete',

  /** No pile */
  NoPile = 'no_pile',

  /** No pile and no masonry */
  NoPileMasonry = 'no_pile_masonry',

  /** No pile strips */
  NoPileStrips = 'no_pile_strips',

  /** No pile and no bearing floor */
  NoPileBearingFloor = 'no_pile_bearing_floor',

  /** No pile and no concrete floor */
  NoPileConcreteFloor = 'no_pile_concrete_floor',

  /** No pile and no slit */
  NoPileSlit = 'no_pile_slit',

  /** Wood charger */
  WoodCharger = 'wood_charger',

  /** Weighted pile */
  WeightedPile = 'weighted_pile',

  /** Combined */
  Combined = 'combined',

  /** Steel pile */
  SteelPile = 'steel_pile',

  /** Other */
  Other = 'other',

  /** Wood foundation according to Amsterdam or Rotterdam */
  WoodRotterdamAmsterdam = 'wood_rotterdam_amsterdam',

  /** Wood foundation according to Rotterdam with an arch */
  WoodRotterdamArch = 'wood_rotterdam_arch',

  /** Wood foundation according to Amsterdam with an arch */
  WoodAmsterdamArch = 'wood_amsterdam_arch'
}
