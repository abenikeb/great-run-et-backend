import { Injectable } from '@nestjs/common';
import { CreateAuthLoginDto } from './dto/create-auth-login.dto';
import { UpdateAuthLoginDto } from './dto/update-auth-login.dto';
import axios from 'src/utility/axios-instance';
import { ConfigService } from '@nestjs/config';
import { ApplyFabricTokenService } from '../payment/applyFabricToeknService.service';
import { signRequestObject, createTimeStamp, createNonceStr } from '../utility';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly config: ConfigService,
    private readonly applyFabricToken: ApplyFabricTokenService,
  ) {}
  async create(reqBody: any, res) {
    try {
      let appToken = reqBody.authToken;
      let applyFabricTokenResult =
        await this.applyFabricToken.applyFabricToken();
      let fabricToken = await applyFabricTokenResult.token;

      let userData = await this.requestAuthToken(fabricToken, appToken);
      console.log({ userData });
      res.status(200).send(userData);
      return userData;
    } catch (error) {
      res.status(500).send(error);
      return;
    }
  }

  async requestAuthToken(fabricToken: string, appToken: string): Promise<any> {
    const reqObject = this.createRequestObject(appToken);
    const url = `${this.config.get('baseUrl')}/payment/v1/auth/authToken`;
    const headers = {
      'Content-Type': 'application/json',
      'X-APP-Key': this.config.get('fabricAppId'),
      Authorization: fabricToken,
    };

    try {
      const { data: response } = await axios({
        method: 'post',
        url,
        headers,
        data: reqObject,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  createRequestObject(appToken: string): any {
    const req: any = {
      timestamp: createTimeStamp(),
      nonce_str: createNonceStr(),
      method: 'payment.preorder',
      version: '1.0',
    };

    const biz = {
      access_token: appToken,
      trade_type: 'InApp',
      appid: this.config.get('merchantAppId'),
      resource_type: 'OpenId',
    };
    req.biz_content = biz;
    req.sign = signRequestObject(req);
    req.sign_type = 'SHA256WithRSA';
    console.log({ request: req });
    return req;
  }

  findAll() {
    return `This action returns all authLogin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authLogin`;
  }

  update(id: number, updateAuthLoginDto: UpdateAuthLoginDto) {
    return `This action updates a #${id} authLogin`;
  }

  remove(id: number) {
    return `This action removes a #${id} authLogin`;
  }
}
