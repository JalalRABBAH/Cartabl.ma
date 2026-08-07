export type City = {
  name: string;
  nameAr: string;
  fee: number;
  deliveryDays: [number, number];
};

export const CITIES: City[] = [
  { name: "Casablanca", nameAr: "الدار البيضاء", fee: 25, deliveryDays: [1, 2] },
  { name: "Rabat", nameAr: "الرباط", fee: 30, deliveryDays: [1, 2] },
  { name: "Marrakech", nameAr: "مراكش", fee: 40, deliveryDays: [2, 3] },
  { name: "Fès", nameAr: "فاس", fee: 40, deliveryDays: [2, 3] },
  { name: "Tanger", nameAr: "طنجة", fee: 45, deliveryDays: [2, 4] },
  { name: "Agadir", nameAr: "أكادير", fee: 50, deliveryDays: [2, 4] },
];

export const FREE_SHIPPING_THRESHOLD = 500;

export function shippingFeeFor(cityName: string): number {
  return CITIES.find((c) => c.name === cityName)?.fee ?? 50;
}

export function deliveryDaysFor(cityName: string): [number, number] {
  return CITIES.find((c) => c.name === cityName)?.deliveryDays ?? [2, 4];
}
