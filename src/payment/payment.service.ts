import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApplyFabricTokenService } from './applyFabricToeknService.service';
import { HttpService } from '@nestjs/axios';
import { Tools } from '../utils/tools';
import { ConfigService } from '../config/config.js';
// import { createSub } from './createSub';
// import { HttpsAgent } from 'https';
// import { Request } from 'request';

@Injectable()
export class PaymentService {
  constructor(
    private readonly applyFabricToken: ApplyFabricTokenService,
    private readonly tools: Tools,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async createOrder(reqBody: any): Promise<any | null> {
    let title = reqBody.title;
    let amount = reqBody.amount;
    let info = reqBody.data;
    let merch_order_id = this.createMerchantOrderId();
    try {
      // await createSub(info, merch_order_id);
      let applyFabricTokenResult =
        await this.applyFabricToken.applyFabricToken();
      let fabricToken = applyFabricTokenResult.token;
      console.log({
        fabricToken,
      });
      let createOrderResult = await this.requestCreateOrder(
        fabricToken,
        title,
        amount,
        merch_order_id,
      );
      console.log({ createOrderResult });

      let prepayId = createOrderResult.biz_content.prepay_id;
      let rawRequest = this.createRawRequest(prepayId);
      console.log({ rawRequest });
      return rawRequest;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async requestCreateOrder(
    fabricToken: string,
    title: string,
    amount: number,
    merch_order_id: string,
  ): Promise<any> {
    const reqObject = this.createRequestObject(title, amount, merch_order_id);
    console.log(reqObject);

    const url = `${this.configService.baseUrl}/payment/v1/merchant/preOrder`;
    const headers = {
      'Content-Type': 'application/json',
      'X-APP-Key': this.configService.fabricAppId,
      Authorization: fabricToken,
    };

    try {
      const response = await this.httpService
        .post(url, reqObject, { headers })
        .toPromise();

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  createRequestObject(
    title: string,
    amount: number,
    merch_order_id: string,
  ): any {
    const req: any = {
      timestamp: this.tools.createTimeStamp(),
      nonce_str: this.tools.createNonceStr(),
      method: 'payment.preorder',
      version: '1.0',
    };

    const biz = {
      notify_url: 'https://telegebeya2.ethiotelecom.et/serviceapi/v1/notify',
      trade_type: 'InApp',
      appid: this.configService.merchantAppId,
      merch_code: this.configService.merchantCode,
      merch_order_id: merch_order_id,
      title: title,
      total_amount: amount,
      trans_currency: 'ETB',
      timeout_express: '120m',
      payee_identifier: this.configService.merchantCode,
      payee_identifier_type: '04',
      payee_type: '5000',
    };

    req.biz_content = biz;
    req.sign = this.tools.signRequestObject(req);
    req.sign_type = 'SHA256WithRSA';

    console.log({ req });
    return req;
  }

  createMerchantOrderId(): string {
    return new Date().getTime() + '';
  }

  createRawRequest(prepayId: string): string {
    const map = {
      appid: this.configService.merchantAppId,
      merch_code: this.configService.merchantCode,
      nonce_str: this.tools.createNonceStr(),
      prepay_id: prepayId,
      timestamp: this.tools.createTimeStamp(),
    };

    const sign = this.tools.signRequestObject(map);
    const rawRequest = Object.entries(map)
      .map(([key, value]) => `${key}=${value}`)
      .concat(['sign=' + sign, 'sign_type=SHA256WithRSA'])
      .join('&');

    console.log('rawRequest = ', rawRequest);
    return rawRequest;
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
