const MI_TO_KM = 1.60934;
const GAL_TO_L = 3.78541;
const LBS_TO_KG = 0.453592;

export function milesToKm(miles: number): number {
  return miles * MI_TO_KM;
}

export function kmToMiles(km: number): number {
  return km / MI_TO_KM;
}

export function fahrenheitToCelsius(f: number): number {
  return (f - 32) * (5 / 9);
}

export function celsiusToFahrenheit(c: number): number {
  return c * (9 / 5) + 32;
}

export function gallonsToLiters(gallons: number): number {
  return gallons * GAL_TO_L;
}

export function litersToGallons(liters: number): number {
  return liters / GAL_TO_L;
}

export function lbsToKg(lbs: number): number {
  return lbs * LBS_TO_KG;
}

export function kgToLbs(kg: number): number {
  return kg / LBS_TO_KG;
}

export function kwhPer100MiToWhPerKm(kwhPer100Mi: number): number {
  return (kwhPer100Mi * 1000) / (100 * MI_TO_KM);
}

export function whPerKmToKwhPer100Mi(whPerKm: number): number {
  return (whPerKm * 100 * MI_TO_KM) / 1000;
}
