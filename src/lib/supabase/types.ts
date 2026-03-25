export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  slug: string;
  epa_range_mi: number;
  epa_range_km: number;
  battery_kwh: number;
  efficiency_kwh_per_100mi: number;
  efficiency_wh_per_km: number;
  charge_time_240v_hrs: number | null;
  charge_time_dc_fast_mins: number | null;
  dc_fast_max_kw: number | null;
  connector_type: string | null;
  vehicle_class: string | null;
  drivetrain: string | null;
  curb_weight_lbs: number | null;
  cargo_volume_cu_ft: number | null;
  seating_capacity: number | null;
  msrp_usd: number | null;
  image_url: string | null;
  blur_data_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>;
export type VehicleUpdate = Partial<VehicleInsert>;

export interface RangeReport {
  id: string;
  vehicle_id: string;
  user_id: string;
  reported_range_mi: number;
  temperature_f: number | null;
  speed_mph: number | null;
  terrain: string | null;
  hvac_usage: string | null;
  battery_health_pct: number | null;
  notes: string | null;
  verified: boolean;
  created_at: string;
}

export type RangeReportInsert = Omit<RangeReport, 'id' | 'created_at' | 'verified'>;
export type RangeReportUpdate = Partial<RangeReportInsert>;

export interface ElectricityRate {
  id: string;
  country_code: string;
  state_or_region: string;
  rate_per_kwh: number;
  currency: string;
  source: string | null;
  last_updated: string;
}

export type ElectricityRateInsert = Omit<ElectricityRate, 'id'>;
export type ElectricityRateUpdate = Partial<ElectricityRateInsert>;

export interface GasPrice {
  id: string;
  country_code: string;
  state_or_region: string;
  price_per_gallon: number | null;
  price_per_liter: number | null;
  fuel_type: string;
  currency: string;
  last_updated: string;
}

export type GasPriceInsert = Omit<GasPrice, 'id'>;
export type GasPriceUpdate = Partial<GasPriceInsert>;

export interface GarageEntry {
  id: string;
  user_id: string;
  vehicle_id: string;
  nickname: string | null;
  purchase_date: string | null;
  current_battery_health: number | null;
  odometer_mi: number | null;
  created_at: string;
}

export type GarageEntryInsert = Omit<GarageEntry, 'id' | 'created_at'>;
export type GarageEntryUpdate = Partial<GarageEntryInsert>;

export interface SavedRoute {
  id: string;
  user_id: string;
  vehicle_id: string;
  name: string | null;
  origin_lat: number;
  origin_lng: number;
  origin_name: string | null;
  destination_lat: number;
  destination_lng: number;
  destination_name: string | null;
  distance_mi: number;
  charging_stops: number;
  route_data: Record<string, unknown> | null;
  created_at: string;
}

export type SavedRouteInsert = Omit<SavedRoute, 'id' | 'created_at'>;
export type SavedRouteUpdate = Partial<SavedRouteInsert>;

export interface VehicleComparison {
  id: string;
  vehicle_a_id: string;
  vehicle_b_id: string;
  slug: string;
  generated_content: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type VehicleComparisonInsert = Omit<VehicleComparison, 'id' | 'created_at' | 'updated_at'>;
export type VehicleComparisonUpdate = Partial<VehicleComparisonInsert>;

// ─── New tables from migrations 009–011 ──────────────────────────────────────

export interface TaxCredit {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  vehicle_type: string;
  credit_amount: number;
  is_full_credit: boolean;
  msrp_cap: number | null;
  assembly_location: string | null;
  battery_minerals_compliant: boolean | null;
  battery_components_compliant: boolean | null;
  notes: string | null;
  source_url: string | null;
  last_verified: string;
}

export interface StateIncentiveRow {
  id: string;
  state_code: string;
  state_name: string;
  slug: string;
  incentive_type: string;
  incentive_name: string;
  description: string;
  amount_or_value: string;
  amount_usd: number | null;
  eligibility_requirements: string | null;
  income_limit: string | null;
  msrp_cap: string | null;
  vehicle_types_eligible: string[] | null;
  application_url: string | null;
  expiration_date: string | null;
  funding_status: 'active' | 'expired' | 'waitlisted' | 'pending';
  source_url: string | null;
  last_verified: string;
}

export interface ChargerProductRow {
  id: string;
  brand: string;
  model: string;
  charger_level: number;
  max_amps: number;
  max_kw: number;
  connector_type: string;
  hardwired_or_plug: string;
  plug_type: string | null;
  wifi_enabled: boolean;
  cable_length_ft: number | null;
  indoor_outdoor: string;
  energy_star_certified: boolean;
  nacs_compatible: boolean;
  price_usd: number;
  amazon_asin: string | null;
  affiliate_url: string | null;
  image_url: string | null;
  rating_stars: number | null;
  review_count: number | null;
  is_recommended: boolean;
  recommended_for: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  slug: string | null;
}

export interface InstallationCostRow {
  id: string;
  state: string;
  state_code: string;
  region: string;
  avg_labor_rate_per_hour: number;
  avg_hours_simple_install: number;
  avg_hours_new_circuit: number;
  avg_hours_panel_upgrade: number;
  avg_permit_cost: number;
  avg_wire_cost_per_foot: number;
  avg_breaker_cost: number;
  requires_permit: boolean;
  notes: string | null;
}

export interface UtilityRebateRow {
  id: string;
  utility_name: string;
  utility_slug: string;
  state: string;
  service_area_description: string | null;
  rebate_type: string;
  rebate_name: string;
  description: string;
  amount: number | null;
  amount_text: string;
  eligibility: string | null;
  eligible_charger_levels: string[] | null;
  max_rebate_per_customer: number | null;
  application_url: string | null;
  program_status: string;
  start_date: string | null;
  end_date: string | null;
  requirements: string | null;
  source_url: string | null;
  last_verified: string;
}

// Database type for Supabase client typing
export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: Vehicle;
        Insert: VehicleInsert;
        Update: VehicleUpdate;
        Relationships: [];
      };
      range_reports: {
        Row: RangeReport;
        Insert: RangeReportInsert;
        Update: RangeReportUpdate;
        Relationships: [];
      };
      electricity_rates: {
        Row: ElectricityRate;
        Insert: ElectricityRateInsert;
        Update: ElectricityRateUpdate;
        Relationships: [];
      };
      gas_prices: {
        Row: GasPrice;
        Insert: GasPriceInsert;
        Update: GasPriceUpdate;
        Relationships: [];
      };
      user_garage: {
        Row: GarageEntry;
        Insert: GarageEntryInsert;
        Update: GarageEntryUpdate;
        Relationships: [];
      };
      saved_routes: {
        Row: SavedRoute;
        Insert: SavedRouteInsert;
        Update: SavedRouteUpdate;
        Relationships: [];
      };
      vehicle_comparisons: {
        Row: VehicleComparison;
        Insert: VehicleComparisonInsert;
        Update: VehicleComparisonUpdate;
        Relationships: [];
      };
      tax_credits: {
        Row: TaxCredit;
        Insert: Omit<TaxCredit, 'id'>;
        Update: Partial<Omit<TaxCredit, 'id'>>;
        Relationships: [];
      };
      state_incentives: {
        Row: StateIncentiveRow;
        Insert: Omit<StateIncentiveRow, 'id'>;
        Update: Partial<Omit<StateIncentiveRow, 'id'>>;
        Relationships: [];
      };
      charger_products: {
        Row: ChargerProductRow;
        Insert: Omit<ChargerProductRow, 'id'>;
        Update: Partial<Omit<ChargerProductRow, 'id'>>;
        Relationships: [];
      };
      installation_costs: {
        Row: InstallationCostRow;
        Insert: Omit<InstallationCostRow, 'id'>;
        Update: Partial<Omit<InstallationCostRow, 'id'>>;
        Relationships: [];
      };
      utility_rebates: {
        Row: UtilityRebateRow;
        Insert: Omit<UtilityRebateRow, 'id'>;
        Update: Partial<Omit<UtilityRebateRow, 'id'>>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
