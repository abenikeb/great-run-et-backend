import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello There! this Is Great-run-et Working Service!';
  }
}
