import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '../config/config';

@Injectable()
export class ApplyFabricTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async applyFabricToken(): Promise<any> {
    const options = {
      method: 'POST',
      url: this.configService.baseUrl + '/payment/v1/token',
      headers: {
        'Content-Type': 'application/json',
        'X-APP-Key': this.configService.fabricAppId,
      },
      rejectUnauthorized: false, // add when working with https sites
      requestCert: false, // add when working with https sites
      agent: false, // add when working with https sites
      data: {
        appSecret: this.configService.appSecret,
      },
    };
    try {
      const { data: tokenData } = await this.httpService
        .request(options)
        .toPromise();
      console.log({ tokenData });
      return tokenData;
    } catch (ex) {
      throw new Error(ex);
    }
  }
}
