export enum EnvironmentDamageCharacteristics {
  /// <summary>
  ///     Subsidence.
  /// </summary>
  Subsidence = 0,

  /// <summary>
  ///     Sagging cewer connections.
  /// </summary>
  SaggingSewerConnection = 1,

  /// <summary>
  ///     Sagging cables and pipes.
  /// </summary>
  SaggingCablesPipes = 2,

  /// <summary>
  ///     Flooding.
  /// </summary>
  Flooding = 3,

  /// <summary>
  ///     Foundation damage nearby.
  /// </summary>
  FoundationDamageNearby = 4,

  /// <summary>
  ///     Elevation.
  /// </summary>
  Elevation = 5,

  /// <summary>
  ///     Increasing traffic.
  /// </summary>
  IncreasingTraffic = 6,

  /// <summary>
  ///     Construction nearby.
  /// </summary>
  ConstructionNearby = 7,

  /// <summary>
  ///     Vegetation nearby.
  /// </summary>
  VegetationNearby = 8,

  /// <summary>
  ///     Sewage leakage.
  /// </summary>
  SewageLeakage = 9,

  /// <summary>
  ///     Low ground water.
  /// </summary>
  LowGroundWater = 10
}

export enum FoundationDamageCause {
  /// <summary>
  ///     Drainage.
  /// </summary>
  Drainage = 0,

  /// <summary>
  ///     Construction flaw.
  /// </summary>
  ConstructionFlaw = 1,

  /// <summary>
  ///     Drystand.
  /// </summary>
  Drystand = 2,

  /// <summary>
  ///     Overcharge.
  /// </summary>
  Overcharge = 3,

  /// <summary>
  ///     Overcharge and negative cling.
  /// </summary>
  OverchargeNegativeCling = 4,

  /// <summary>
  ///     Negative cling.
  /// </summary>
  NegativeCling = 5,

  /// <summary>
  ///     Bio infection.
  /// </summary>
  BioInfection = 6,

  /// <summary>
  ///     Fungus infection.
  /// </summary>
  FungusInfection = 8,

  /// <summary>
  ///     Bio and fungus infection.
  /// </summary>
  BioFungusInfection = 9,

  /// <summary>
  ///     Foundation flaw.
  /// </summary>
  FoundationFlaw = 10,

  /// <summary>
  ///     Construnction heave.
  /// </summary>
  ConstructionHeave = 11,

  /// <summary>
  ///     Subsidence.
  /// </summary>
  Subsidence = 12,

  /// <summary>
  ///     Vegetation.
  /// </summary>
  Vegetation = 13,

  /// <summary>
  ///     Gas.
  /// </summary>
  Gas = 14,

  /// <summary>
  ///     Vibrations.
  /// </summary>
  Vibrations = 15,

  /// <summary>
  ///     Foundation was partially recovered.
  /// </summary>
  PartialFoundationRecovery = 16,

  /// <summary>
  ///     Damage due japanese knotweed.
  /// </summary>
  JapanseKnotweed = 17,

  /// <summary>
  ///     Groundwater level reduction.
  /// </summary>
  GroundwaterLevelReduction = 18
}

export enum FoundationDamageCharacteristics {
  /// <summary>
  ///     Jamming door window.
  /// </summary>
  JammingDoorWindow = 0,

  /// <summary>
  ///     Crack.
  /// </summary>
  Crack = 1,

  /// <summary>
  ///     Skewed.
  /// </summary>
  Skewed = 2,

  /// <summary>
  ///     Crawlspace flooding.
  /// </summary>
  CrawlspaceFlooding = 3,

  /// <summary>
  ///     Threshold above subsurface.
  /// </summary>
  ThresholdAboveSubsurface = 4,

  /// <summary>
  ///     Threshold below subsurface.
  /// </summary>
  ThresholdBelowSubsurface = 5,

  /// <summary>
  ///     Crooked floor wall.
  /// </summary>
  CrookedFloorWall = 6
}

export enum FoundationType {
  /// <summary>
  ///     Wood.
  /// </summary>
  Wood = 0,

  /// <summary>
  ///     Wood foundation accoring to Amsterdam.
  /// </summary>
  WoodAmsterdam = 1,

  /// <summary>
  ///     Wood foundation accoring to Rotterdam.
  /// </summary>
  WoodRotterdam = 2,

  /// <summary>
  ///     Concrete.
  /// </summary>
  Concrete = 3,

  /// <summary>
  ///     No pile.
  /// </summary>
  NoPile = 4,

  /// <summary>
  ///     No pile and no masonry.
  /// </summary>
  NoPileMasonry = 5,

  /// <summary>
  ///     No pile strips.
  /// </summary>
  NoPileStrips = 6,

  /// <summary>
  ///     No pile and no bearing floor.
  /// </summary>
  NoPileBearingFloor = 7,

  /// <summary>
  ///     No pile and no concrete floor.
  /// </summary>
  NoPileConcreteFloor = 8,

  /// <summary>
  ///     No pile and no slit.
  /// </summary>
  NoPileSlit = 9,

  /// <summary>
  ///     Wood charger.
  /// </summary>
  WoodCharger = 10,

  /// <summary>
  ///     Weighted pile.
  /// </summary>
  WeightedPile = 11,

  /// <summary>
  ///     Combined.
  /// </summary>
  Combined = 12,

  /// <summary>
  ///     Steel pile.
  /// </summary>
  SteelPile = 13,

  /// <summary>
  ///     Other.
  /// </summary>
  Other = 14,

  /// <summary>
  ///     Wood foundation accoring to Amsterdam or Rotterdam.
  /// </summary>
  WoodRotterdamAmsterdam = 15,

  /// <summary>
  ///     Wood foundation accoring to Rotterdam with an arch.
  /// </summary>
  WoodRotterdamArch = 16,

  /// <summary>
  ///     Wood foundation accoring to Amsterdam with an arch.
  /// </summary>
  WoodAmsterdamArch = 17
}
