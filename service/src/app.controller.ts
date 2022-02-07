import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NetWorthDto } from './model/networth.dto';

@Controller('networth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async CalculateNetWorth(@Body() netWorthDto: NetWorthDto) {
    return await this.appService.calculateNetWorth(netWorthDto);
  }
}
