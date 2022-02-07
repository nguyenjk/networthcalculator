import { BadRequestException, HttpException, HttpModule, HttpService, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefaultNetWorthDto } from './mock.ts/originalNetWorth';

const reducer = (preVal, curVal) => preVal + curVal;
describe('AppController', () => {
  let appController: AppController;
  let httpService: HttpService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, 
        ConfigModule.forRoot({
        isGlobal: true,
    }),],
      controllers: [AppController],
      providers: [
        AppService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    httpService = app.get<HttpService>(HttpService);
  });

  describe('calculate networth', () => {
    it('should return the correct networth with calculated totalNetworth', async () => {
      const networth = await appController.CalculateNetWorth(DefaultNetWorthDto);
      const assetData = DefaultNetWorthDto.cashAssets.map(item => item.cost);
      const longTermAssetData = DefaultNetWorthDto.longTermAssets.map(item => item.cost);
      const shortTermLiabilitiesData = DefaultNetWorthDto.shortTermLiabilities.map(item => item.cost);
      const longTermLiabilitiesData = DefaultNetWorthDto.longTermDebt.map(item => item.cost);

      const totalAssets = assetData.reduce(reducer) + longTermAssetData.reduce(reducer);
      const totalLiabilities = shortTermLiabilitiesData.reduce(reducer) + longTermLiabilitiesData.reduce(reducer);
      expect(networth).toBeDefined();
      expect(networth.totalAssets).toBe(totalAssets);
      expect(networth.totalLiabilities).toBe(totalLiabilities);
      expect(networth.totalNetworth).toBe(totalAssets-totalLiabilities);
    });

    it('should return the different networth number when the new currency is selected', async () => {
      DefaultNetWorthDto.selectedCurrency = 'EUR';
      const assetData = DefaultNetWorthDto.cashAssets.map(item => item.cost);
      const longTermAssetData = DefaultNetWorthDto.longTermAssets.map(item => item.cost);
      const shortTermLiabilitiesData = DefaultNetWorthDto.shortTermLiabilities.map(item => item.cost);
      const longTermLiabilitiesData = DefaultNetWorthDto.longTermDebt.map(item => item.cost);

      const totalAssets = assetData.reduce(reducer) + longTermAssetData.reduce(reducer);
      const totalLiabilities = shortTermLiabilitiesData.reduce(reducer) + longTermLiabilitiesData.reduce(reducer);
      
      const networth = await appController.CalculateNetWorth(DefaultNetWorthDto);
      expect(networth).toBeDefined();
      expect(networth.totalAssets).not.toBe(totalAssets);
      expect(networth.totalLiabilities).not.toBe(totalLiabilities);
      expect(networth.totalNetworth).not.toBe(totalAssets-totalLiabilities);
    });

    it('should throw 500 when third party api is down', async () => {
      DefaultNetWorthDto.selectedCurrency = 'EUR';
      const spyHttpService = jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new BadRequestException('Invalid API Key');
      });
      try {
        const networth = await appController.CalculateNetWorth(DefaultNetWorthDto);
      }
      catch(err) {
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('Invalid API Key');
      }
    });
  });
});
