import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Returns a greeting message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a greeting message',
    schema: {
      example: {
        message: 'Hello, World!',
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Server is up and running.',
    schema: {
      example: {
        status: 'ok',
      },
    },
  })
  async getHealth(): Promise<{ status: string }> {
    return this.appService.check();
  }
}
