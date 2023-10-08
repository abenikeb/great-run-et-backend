import { Injectable } from '@nestjs/common';
import axios from 'src/utility/axios-instance';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplyFabricTokenService {
  constructor(private readonly config: ConfigService) {}

  async applyFabricToken(): Promise<any> {
    try {
      const { data: response } = await axios({
        method: 'post',
        url: this.config.get('baseUrl') + '/payment/v1/token',
        headers: {
          'Content-Type': 'application/json',
          'X-APP-Key': this.config.get('fabricAppId'),
        },
        data: {
          appSecret: this.config.get('appSecret'),
        },
      });
      return response;
    } catch (ex) {
      throw new Error(ex);
    }
  }
}
