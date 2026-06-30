import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const dataSource = app.get(DataSource);
  
  // Create default admin user if not exists
  const adminExists = await dataSource.query(
    `SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1`
  );
  
  if (adminExists.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Get admin role
    const adminRole = await dataSource.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
    );
    
    await dataSource.query(
      `INSERT INTO users (id, email, password, "fullName", "roleId", "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'admin@example.com', $1, 'Administrator', $2, true, NOW(), NOW())`,
      [hashedPassword, adminRole[0]?.id]
    );
    
    console.log('Default admin user created: admin@example.com / password123');
  }
  
  // Create default request types
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
  
  // Create default FAQs
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