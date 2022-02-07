import { IsNotEmpty, IsNumber } from "class-validator";

export class Asset {
    @IsNotEmpty()
    category: string;
    monthly?: number;
    @IsNumber()
    cost: number;
}