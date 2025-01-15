export enum EnvironmentDamageCharacteristics {
  /// <summary>
  ///     Subsidence.
  /// </summary>
  Subsidence = 'subsidence',

  /// <summary>
  ///     Sagging sewer connections.
  /// </summary>
  SaggingSewerConnection = 'sagging_sewer_connection',

  /// <summary>
  ///     Sagging cables and pipes.
  /// </summary>
  SaggingCablesPipes = 'sagging_cables_pipes',

  /// <summary>
  ///     Flooding.
  /// </summary>
  Flooding = 'flooding',

  /// <summary>
  ///     Foundation damage nearby.
  /// </summary>
  FoundationDamageNearby = 'foundation_damage_nearby',

  /// <summary>
  ///     Elevation.
  /// </summary>
  Elevation = 'elevation',

  /// <summary>
  ///     Increasing traffic.
  /// </summary>
  IncreasingTraffic = 'increasing_traffic',

  /// <summary>
  ///     Construction nearby.
  /// </summary>
  ConstructionNearby = 'construction_nearby',

  /// <summary>
  ///     Vegetation nearby.
  /// </summary>
  VegetationNearby = 'vegetation_nearby',

  /// <summary>
  ///     Sewage leakage.
  /// </summary>
  SewageLeakage = 'sewage_leakage',

  /// <summary>
  ///     Low ground water.
  /// </summary>
  LowGroundWater = 'low_ground_water'
}

export enum FoundationDamageCause {
  /// <summary>
  ///     Drainage.
  /// </summary>
  Drainage = 'drainage',

  /// <summary>
  ///     Construction flaw.
  /// </summary>
  ConstructionFlaw = 'construction_flaw',

  /// <summary>
  ///     Drystand.
  /// </summary>
  Drystand = 'drystand',

  /// <summary>
  ///     Overcharge.
  /// </summary>
  Overcharge = 'overcharge',

  /// <summary>
  ///     Overcharge and negative cling.
  /// </summary>
  OverchargeNegativeCling = 'overcharge_negative_cling',

  /// <summary>
  ///     Negative cling.
  /// </summary>
  NegativeCling = 'negative_cling',

  /// <summary>
  ///     Bio infection.
  /// </summary>
  BioInfection = 'bio_infection',

  /// <summary>
  ///     Fungus infection.
  /// </summary>
  FungusInfection = 'fungus_infection',

  /// <summary>
  ///     Bio and fungus infection.
  /// </summary>
  BioFungusInfection = 'bio_fungus_infection',

  /// <summary>
  ///     Foundation flaw.
  /// </summary>
  FoundationFlaw = 'foundation_flaw',

  /// <summary>
  ///     Construction heave.
  /// </summary>
  ConstructionHeave = 'construction_heave',

  /// <summary>
  ///     Subsidence.
  /// </summary>
  Subsidence = 'subsidence',

  /// <summary>
  ///     Vegetation.
  /// </summary>
  Vegetation = 'vegetation',

  /// <summary>
  ///     Gas.
  /// </summary>
  Gas = 'gas',

  /// <summary>
  ///     Vibrations.
  /// </summary>
  Vibrations = 'vibrations',

  /// <summary>
  ///     Foundation was partially recovered.
  /// </summary>
  PartialFoundationRecovery = 'partial_foundation_recovery',

  /// <summary>
  ///     Damage due to Japanese knotweed.
  /// </summary>
  JapanseKnotweed = 'japanse_knotweed',

  /// <summary>
  ///     Groundwater level reduction.
  /// </summary>
  GroundwaterLevelReduction = 'groundwater_level_reduction'
}

export enum FoundationDamageCharacteristics {
  /// <summary>
  ///     Jamming door window.
  /// </summary>
  JammingDoorWindow = 'jamming_door_window',

  /// <summary>
  ///     Crack.
  /// </summary>
  Crack = 'crack',

  /// <summary>
  ///     Skewed.
  /// </summary>
  Skewed = 'skewed',

  /// <summary>
  ///     Crawlspace flooding.
  /// </summary>
  CrawlspaceFlooding = 'crawlspace_flooding',

  /// <summary>
  ///     Threshold above subsurface.
  /// </summary>
  ThresholdAboveSubsurface = 'threshold_above_subsurface',

  /// <summary>
  ///     Threshold below subsurface.
  /// </summary>
  ThresholdBelowSubsurface = 'threshold_below_subsurface',

  /// <summary>
  ///     Crooked floor wall.
  /// </summary>
  CrookedFloorWall = 'crooked_floor_wall'
}

export enum FoundationType {
  /// <summary>
  ///     Wood.
  /// </summary>
  Wood = 'wood',

  /// <summary>
  ///     Wood foundation according to Amsterdam.
  /// </summary>
  WoodAmsterdam = 'wood_amsterdam',

  /// <summary>
  ///     Wood foundation according to Rotterdam.
  /// </summary>
  WoodRotterdam = 'wood_rotterdam',

  /// <summary>
  ///     Concrete.
  /// </summary>
  Concrete = 'concrete',

  /// <summary>
  ///     No pile.
  /// </summary>
  NoPile = 'no_pile',

  /// <summary>
  ///     No pile and no masonry.
  /// </summary>
  NoPileMasonry = 'no_pile_masonry',

  /// <summary>
  ///     No pile strips.
  /// </summary>
  NoPileStrips = 'no_pile_strips',

  /// <summary>
  ///     No pile and no bearing floor.
  /// </summary>
  NoPileBearingFloor = 'no_pile_bearing_floor',

  /// <summary>
  ///     No pile and no concrete floor.
  /// </summary>
  NoPileConcreteFloor = 'no_pile_concrete_floor',

  /// <summary>
  ///     No pile and no slit.
  /// </summary>
  NoPileSlit = 'no_pile_slit',

  /// <summary>
  ///     Wood charger.
  /// </summary>
  WoodCharger = 'wood_charger',

  /// <summary>
  ///     Weighted pile.
  /// </summary>
  WeightedPile = 'weighted_pile',

  /// <summary>
  ///     Combined.
  /// </summary>
  Combined = 'combined',

  /// <summary>
  ///     Steel pile.
  /// </summary>
  SteelPile = 'steel_pile',

  /// <summary>
  ///     Other.
  /// </summary>
  Other = 'other',

  /// <summary>
  ///     Wood foundation according to Amsterdam or Rotterdam.
  /// </summary>
  WoodRotterdamAmsterdam = 'wood_rotterdam_amsterdam',

  /// <summary>
  ///     Wood foundation according to Rotterdam with an arch.
  /// </summary>
  WoodRotterdamArch = 'wood_rotterdam_arch',

  /// <summary>
  ///     Wood foundation according to Amsterdam with an arch.
  /// </summary>
  WoodAmsterdamArch = 'wood_amsterdam_arch'
}
