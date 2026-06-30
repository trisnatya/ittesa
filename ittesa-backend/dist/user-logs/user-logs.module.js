"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_log_entity_1 = require("./user-log.entity");
const user_logs_service_1 = require("./user-logs.service");
const user_logs_controller_1 = require("./user-logs.controller");
let UserLogsModule = class UserLogsModule {
};
exports.UserLogsModule = UserLogsModule;
exports.UserLogsModule = UserLogsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_log_entity_1.UserLog])],
        controllers: [user_logs_controller_1.UserLogsController],
        providers: [user_logs_service_1.UserLogsService],
        exports: [user_logs_service_1.UserLogsService],
    })
], UserLogsModule);
//# sourceMappingURL=user-logs.module.js.map