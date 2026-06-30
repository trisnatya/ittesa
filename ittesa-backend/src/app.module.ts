import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { RequestsModule } from './requests/requests.module';
import { RequestTypesModule } from './request-types/request-types.module';
import { TemplatesModule } from './templates/templates.module';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { FaqsModule } from './faqs/faqs.module';
import { QuestionsModule } from './questions/questions.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { UserLogsModule } from './user-logs/user-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'ittesa',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    EmployeesModule,
    RequestsModule,
    RequestTypesModule,
    TemplatesModule,
    EmailTemplatesModule,
    FaqsModule,
    QuestionsModule,
    UsersModule,
    RolesModule,
    UserLogsModule,
    DashboardModule,
  ],
})
export class AppModule {}