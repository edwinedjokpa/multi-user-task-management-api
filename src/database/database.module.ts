/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow('DB_HOST'),
          port: parseInt(configService.getOrThrow('DB_PORT'), 10),
          username: configService.getOrThrow('DB_USER'),
          password: configService.getOrThrow('DB_PASSWORD'),
          database: configService.getOrThrow('DB_DATABASE'),
          ssl: configService.get('DB_SSL'),
          autoLoadEntities: true,
          synchronize: true,
          migrations: ['src/migration/**/*.ts'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
