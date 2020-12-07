export interface ICountry {
	name: string;
	population: number;
	region: Region;
	capital: string;
	flag: string;
	alpha3Code: string;
}

export interface ICountryDetail {
	name: string;
	population: number;
	region: Region;
	capital: string;
	flag: string;
	alpha3Code: string;
	languages: ILanguage[];
	currencies: ICurrency[];
	topLevelDomain: string[];
	subregion: string;
	nativeName: string;
	borders: string[];
	bordersSt: string[];
}

export interface ICurrency {
	code: null | string;
	name: null | string;
	symbol: null | string;
}

export interface ILanguage {
	iso639_1: null | string;
	iso639_2: string;
	name: string;
	nativeName: string;
}

export enum Region {
	All = "All",
	Africa = "Africa",
	Americas = "Americas",
	Asia = "Asia",
	Europe = "Europe",
	Oceania = "Oceania",
	Polar = "Polar"
}
