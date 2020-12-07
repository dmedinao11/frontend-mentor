import { ICountry, Region, ICountryDetail } from "../models/countries.interfaces";

const API_MAIN_ROUTE = "https://restcountries.eu/rest/v2";
const API_ROUTES = {
	all: API_MAIN_ROUTE + "/all",
	byRegion: API_MAIN_ROUTE + "/region",
	byName: API_MAIN_ROUTE + "/name",
	byCode: API_MAIN_ROUTE + "/alpha",
	fields: "?fields=name;population;region;capital;flag;alpha3Code"
};

export class CountriesService {
	static getAll(): Promise<ICountry[]> {
		return fetch(API_ROUTES.all + API_ROUTES.fields)
			.then((resp: Response) => resp.json())
			.then((resp: ICountry[]) => resp);
	}

	static getByRegion(region: Region): Promise<ICountry[]> {
		return fetch(`${API_ROUTES.byRegion}/${region}${API_ROUTES.fields}`)
			.then((resp: Response) => resp.json())
			.then((resp: ICountry[]) => resp);
	}

	static async searchByName(term: string): Promise<any> {
		let data: ICountry[];
		try {
			data = await fetch(`${API_ROUTES.byName}/${term}${API_ROUTES.fields}`)
				.then((resp: Response) => resp.json())
				.then((resp: ICountry[]) => resp)
				.catch(() => []);
		} catch (error) {
			console.log(error);
			data = [];
		}

		return data;
	}

	static async getByCode(code: string) {
		let data: ICountryDetail | null;
		try {
			data = await fetch(
				`${API_ROUTES.byCode}/${code}${API_ROUTES.fields};languages;currencies;topLevelDomain;subregion;nativeName;borders`
			)
				.then((resp: Response) => resp.json())
				.then(async (resp: ICountryDetail) => {
					const bordersPromises: Promise<any>[] = [];
					resp.borders.forEach((borderCode) =>
						bordersPromises.push(CountriesService.getNameByCode(borderCode))
					);
					resp.bordersSt = await Promise.all(bordersPromises);
					return resp;
				});
		} catch (error) {
			console.log(error);
			data = null;
		}

		return data;
	}

	static async getNameByCode(code: string): Promise<string> {
		return fetch(`${API_ROUTES.byCode}/${code}${API_ROUTES.fields}`)
			.then((resp: Response) => resp.json())
			.then((resp: ICountry) => resp.name);
	}
}
