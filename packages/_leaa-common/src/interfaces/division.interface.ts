export type IDivisionSource = { code: string; name: string; provinceCode: string; cityCode: string };
export type IDivisionDist = { value: string; children: IDivisionDist[]; name?: string };
