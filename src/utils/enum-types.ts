import { pgEnum } from 'drizzle-orm/pg-core';

export enum Transmission {
	MANUAL = 'manual',
	AUTOMATIC = 'automatic',
	AMT = 'amt',
	DCT = 'dct',
	CVT = 'cvt',
}

export enum Color {
	BLACK = 'black',
	BLUE = 'blue',
	BROWN = 'brown',
	GOLD = 'gold',
	GREEN = 'green',
	GREY = 'grey',
	ORANGE = 'orange',
	PINK = 'pink',
	PURPLE = 'purple',
	RED = 'red',
	SILVER = 'silver',
	WHITE = 'white',
	YELLOW = 'yellow',
}

export enum FuelType {
	PETROL = 'petrol',
	DIESEL = 'diesel',
	ELECTRIC = 'electric',
	HYBRID = 'hybrid',
	CNG = 'cng',
}

export enum BodyType {
	SEDAN = 'sedan',
	HATCHBACK = 'hatchback',
	SUV = 'suv',
	COUPE = 'coupe',
	MPV = 'mpv',
	CONVERTIBLE = 'convertible',
	CROSSOVER = 'crossover',
	MUV = 'muv',
}

export enum DistanceUnit {
	KM = 'km',
	MILES = 'miles',
}

export enum CurrencyCode {
	INR = 'INR',
	EUR = 'EUR',
	USD = 'USD',
}

export enum Status {
	LIVE = 'live',
	DRAFT = 'draft',
	SOLD = 'sold',
}

export enum CustomerStatus {
	SUBSCRIBER = 'subscriber',
	INTERESTED = 'interested',
	CONTACTED = 'contacted',
	PURCHASED = 'purchased',
	COLD = 'cold',
}

export function enumToPgEnum<T extends Record<string, any>>(myEnum: T): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const customerStatusEnum = pgEnum('customer_status', enumToPgEnum(CustomerStatus));
export const transmissionEnum = pgEnum('transmission', enumToPgEnum(Transmission));
export const colorEnum = pgEnum('color', enumToPgEnum(Color));
export const fuelTypeEnum = pgEnum('fuel_type', enumToPgEnum(FuelType));
export const bodyTypeEnum = pgEnum('body_type', enumToPgEnum(BodyType));
export const distanceUnitEnum = pgEnum('distance_unit', enumToPgEnum(DistanceUnit));
export const currencyCodeEnum = pgEnum('currency', enumToPgEnum(CurrencyCode));
export const statusEnum = pgEnum('status', enumToPgEnum(Status));
