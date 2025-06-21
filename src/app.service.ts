import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHealthMessage(): Promise<string> {
    return 'Gifty API is running 🚀';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
