import { milesToKm, fahrenheitToCelsius } from './conversions';

export function formatRange(miles: number, unit: 'mi' | 'km' = 'mi'): string {
  const value = unit === 'km' ? milesToKm(miles) : miles;
  return `${Math.round(value)} ${unit}`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(pct: number): string {
  return `${Math.round(pct)}%`;
}

export function formatNumber(n: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function formatTemperature(temp: number, unit: 'F' | 'C' = 'F'): string {
  const value = unit === 'C' ? fahrenheitToCelsius(temp) : temp;
  return `${Math.round(value)}°${unit}`;
}

export function formatSpeed(speed: number, unit: 'mph' | 'kph' = 'mph'): string {
  return `${Math.round(speed)} ${unit}`;
}

export function formatEnergy(kwh: number): string {
  return `${kwh.toFixed(1)} kWh`;
}
