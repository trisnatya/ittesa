"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const employees_module_1 = require("./employees/employees.module");
const requests_module_1 = require("./requests/requests.module");
const request_types_module_1 = require("./request-types/request-types.module");
const templates_module_1 = require("./templates/templates.module");
const email_templates_module_1 = require("./email-templates/email-templates.module");
const faqs_module_1 = require("./faqs/faqs.module");
const questions_module_1 = require("./questions/questions.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const user_logs_module_1 = require("./user-logs/user-logs.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'ittesa',
                autoLoadEntities: true,
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            employees_module_1.EmployeesModule,
            requests_module_1.RequestsModule,
            request_types_module_1.RequestTypesModule,
            templates_module_1.TemplatesModule,
            email_templates_module_1.EmailTemplatesModule,
            faqs_module_1.FaqsModule,
            questions_module_1.QuestionsModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            user_logs_module_1.UserLogsModule,
            dashboard_module_1.DashboardModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map