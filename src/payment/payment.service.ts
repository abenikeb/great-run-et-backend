import { Injectable, HttpStatus } from '@nestjs/common';
import axios from 'src/utility/axios-instance';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import { ApplyFabricTokenService } from './applyFabricToeknService.service';
import { signRequestObject, createTimeStamp, createNonceStr } from '../utility';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly config: ConfigService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly applyFabricToken: ApplyFabricTokenService,
  ) {}
  async createOrder(reqBody: any, res): Promise<any | null> {
    let title = reqBody.title;
    let amount = reqBody.amount;
    let customerInfo = reqBody.data;
    let merch_order_id = this.createMerchantOrderId();

    try {
      let newCustomerInfo = { ...customerInfo, merch_order_id };
      const { success } = await this.subscriptionsService.create(
        newCustomerInfo,
        res,
      );
      if (!success) return null;

      let applyFabricTokenResult =
        await this.applyFabricToken.applyFabricToken();
      let fabricToken = await applyFabricTokenResult.token;

      let createOrderResult = await this.requestCreateOrder(
        fabricToken,
        title,
        amount,
        merch_order_id,
      );
      console.log({ orderResponse: createOrderResult });

      let prepayId = createOrderResult.biz_content.prepay_id;
      if (!prepayId || prepayId === 'undefined') {
        res.status(500).send('some thing went wrong');
        return;
      }
      let rawRequest = this.createRawRequest(prepayId);
      console.log({ rawRequest });
      res.status(200).send(rawRequest);
      return rawRequest;
    } catch (error) {
      res.status(500).send(error);
      return;
    }
  }

  async createCallBack(reqBody: any, res): Promise<any | null> {
    console.log({ message: 'Notify Response Hits HERE!' });

    try {
      const { success } = await this.subscriptionsService.update(
        reqBody.merch_order_id,
        reqBody.transId,
      );
      // await confirmSub(req.body.merch_order_id, req.body.transId);
      return res.status(HttpStatus.OK).send('OK');
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send('error');
    }
  }

  async requestCreateOrder(
    fabricToken: string,
    title: string,
    amount: number,
    merch_order_id: string,
  ): Promise<any> {
    const reqObject = this.createRequestObject(title, amount, merch_order_id);
    const url = `${this.config.get('baseUrl')}/payment/v1/merchant/preOrder`;
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

  createRequestObject(
    title: string,
    amount: number,
    merch_order_id: string,
  ): any {
    const req: any = {
      timestamp: createTimeStamp(),
      nonce_str: createNonceStr(),
      method: 'payment.preorder',
      version: '1.0',
    };

    const biz = {
      notify_url:
        'https://telegebeya2.ethiotelecom.et/serviceapi/payment/v1/notify',
      trade_type: 'InApp',
      appid: this.config.get('merchantAppId'),
      merch_code: this.config.get('merchantCode'),
      merch_order_id: merch_order_id,
      title: title,
      total_amount: amount,
      trans_currency: 'ETB',
      timeout_express: '120m',
      payee_identifier: this.config.get('merchantCode'),
      payee_identifier_type: '04',
      payee_type: '5000',
    };
    req.biz_content = biz;
    req.sign = signRequestObject(req);
    req.sign_type = 'SHA256WithRSA';
    console.log({ request: req });
    return req;
  }

  createMerchantOrderId(): string {
    return new Date().getTime() + '';
  }

  createRawRequest(prepayId: string): string {
    const map = {
      appid: this.config.get('merchantAppId'),
      merch_code: this.config.get('merchantCode'),
      nonce_str: createNonceStr(),
      prepay_id: prepayId,
      timestamp: createTimeStamp(),
    };

    const sign = signRequestObject(map);
    const rawRequest = Object.entries(map)
      .map(([key, value]) => `${key}=${value}`)
      .concat(['sign=' + sign, 'sign_type=SHA256WithRSA'])
      .join('&');
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

//  let { data: res } = await axios({
//    method: 'post',
//    url: this.config.get('url'),
//    headers: {
//      'Content-Type': 'application/json',
//    },
//    data: customerInfo,
//  });
//  console.log({
//    res,
//  });
//  return;
