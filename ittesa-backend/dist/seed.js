"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    const adminExists = await dataSource.query(`SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1`);
    if (adminExists.length === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminRole = await dataSource.query(`SELECT id FROM roles WHERE name = 'admin' LIMIT 1`);
        await dataSource.query(`INSERT INTO users (id, email, password, "fullName", "roleId", "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'admin@example.com', $1, 'Administrator', $2, true, NOW(), NOW())`, [hashedPassword, adminRole[0]?.id]);
        console.log('Default admin user created: admin@example.com / password123');
    }
    const requestTypeCount = await dataSource.query(`SELECT COUNT(*) FROM request_types`);
    if (parseInt(requestTypeCount[0].count) === 0) {
        await dataSource.query(`
      INSERT INTO request_types (id, name, description, "isActive", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), 'DPLK', 'Dana Pensiun Lembaga Keuangan', true, NOW(), NOW()),
        (gen_random_uuid(), 'Housing', 'Kebutuhan Perumahan', true, NOW(), NOW()),
        (gen_random_uuid(), 'Administration Later', 'Administrasi Tunda', true, NOW(), NOW()),
        (gen_random_uuid(), 'HC Communication', 'Komunikasi HC', true, NOW(), NOW())
    `);
        console.log('Default request types created');
    }
    const faqCount = await dataSource.query(`SELECT COUNT(*) FROM faqs`);
    if (parseInt(faqCount[0].count) === 0) {
        await dataSource.query(`
      INSERT INTO faqs (id, question, answer, category, "order", "isActive", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), 'Apa itu ITESSA?', 'ITESSA adalah IT Employee Self Service Application, portal self-service untuk karyawan IT.', 'General', 1, true, NOW(), NOW()),
        (gen_random_uuid(), 'Bagaimana cara membuat request baru?', 'Anda dapat membuat request baru melalui menu View Request, pilih jenis request, dan isi formulir yang tersedia.', 'Requests', 1, true, NOW(), NOW()),
        (gen_random_uuid(), 'Apa itu DPLK?', 'DPLK adalah Dana Pensiun Lembaga Keuangan, program pensiun yang dikelola oleh lembaga keuangan.', 'DPLK', 1, true, NOW(), NOW())
    `);
        console.log('Default FAQs created');
    }
    console.log('Seeding completed!');
    await app.close();
}
seed().catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map