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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
