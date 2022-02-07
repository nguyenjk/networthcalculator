import { HttpService, Injectable, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Asset } from './model/asset';
import { NetWorthDto } from './model/networth.dto';
import { NetWorth } from './model/networth.model';

@Injectable()
export class AppService {
  private currentCurrency: string = 'USD';
  constructor(
    private readonly httpService: HttpService
    ) {}

  async calculateNetWorth(networthDto: NetWorthDto) {
    // get currency 
    const networth: NetWorth = new NetWorth(networthDto);

    const reducer = (preVal, curVal) => preVal + curVal;
    if (this.currentCurrency !== networthDto.selectedCurrency) {
      const exchangeRate = await this.getExchangeRateByCurrency(networthDto.selectedCurrency);
      networth.cashAssets = networth.cashAssets.map(item => this.getExchangeValue(item, exchangeRate));
      networth.longTermAssets = networth.longTermAssets.map(item => this.getExchangeValue(item, exchangeRate));
      networth.shortTermLiabilities = networth.shortTermLiabilities.map(item => this.getExchangeValue(item, exchangeRate));
      networth.longTermDebt = networth.longTermDebt.map(item => this.getExchangeValue(item, exchangeRate));
      this.currentCurrency = networthDto.selectedCurrency;
    }

    networth.currentCurrencySymbol = this.getSymbolFromCurrency(networthDto.selectedCurrency);  
    const assetData = networth.cashAssets.map(item => item.cost);
    const longTermAssetData = networth.longTermAssets.map(item => item.cost);
    const shortTermLiabilitiesData = networth.shortTermLiabilities.map(item => item.cost);
    const longTermLiabilitiesData = networth.longTermDebt.map(item => item.cost);
    
    networth.totalAssets = Math.round((assetData.reduce(reducer) + longTermAssetData.reduce(reducer) + Number.EPSILON) * 100) / 100 ; 
    networth.totalLiabilities =  Math.round((shortTermLiabilitiesData.reduce(reducer) + longTermLiabilitiesData.reduce(reducer) + Number.EPSILON) * 100) / 100 ;
    networth.totalNetworth = networth.totalAssets - networth.totalLiabilities;

    return networth;
  }

  async getExchangeRateByCurrency(selectedCurrency: string) {
    // const currency = await this.httpService.get(`https://api.getgeoapi.com/v2/currency/convert?` +
    // `api_key=${process.env.CURRENCY_API_KEY}&from=${this.currentCurrency}&to=${selectedCurrency}&format=json`)
    const currency = await this.httpService.get(process.env.CURRENCY_API+this.currentCurrency)
      .toPromise();
    const rate  = currency.data.conversion_rates[selectedCurrency];
    return rate;
  }

  getExchangeValue(item: Asset, rate: number) {
    const newCost = item.cost * rate;
    item.cost = Math.round((newCost + Number.EPSILON) * 100) / 100 ;

    return item;
  }

  getSymbolFromCurrency(currency: string) {
    return Number().toLocaleString(undefined, {style:"currency", currency:currency}).slice(0,1)
  }
}
