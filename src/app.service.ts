import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async check(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}
