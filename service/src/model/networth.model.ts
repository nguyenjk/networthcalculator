import { Asset } from "./asset";
import { NetWorthDto } from "./networth.dto";

export class NetWorth {
    currentCurrencySymbol: string;
    totalAssets: number;
    totalLiabilities: number;
    totalNetworth: number;
    cashAssets: Array<Asset>;
    longTermAssets: Array<Asset>;
    shortTermLiabilities: Array<Asset>;
    longTermDebt: Array<Asset>;

    constructor(networthDto: NetWorthDto) {
        this.cashAssets = networthDto.cashAssets;
        this.longTermAssets = networthDto.longTermAssets;
        this.shortTermLiabilities = networthDto.shortTermLiabilities;
        this.longTermDebt = networthDto.longTermDebt;
    }
}