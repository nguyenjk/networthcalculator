import { IsArray, IsCurrency, IsNotEmpty } from "class-validator";
import { Asset } from "./asset";

export class NetWorthDto {
    
    selectedCurrency: string;
    
    @IsArray()
    cashAssets: Array<Asset>;
    
    @IsArray()
    longTermAssets: Array<Asset>;

    @IsArray()
    shortTermLiabilities: Array<Asset>;

    @IsArray()
    longTermDebt: Array<Asset>;

}