import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

// import { LoggerService } from '@leaa/api/modules/logger/logger.service';
import { AppModule } from '@leaa/api/app.module';
import { SeedService } from './modules/seed/seed.service';

(async function seed() {
  const logger = new Logger('Seed-Log');
  logger.log('Seed Launcher...', ' 🔰 ');

  const app: NestExpressApplication = await NestFactory.create(AppModule);

  try {
    const seedService: SeedService = await app.get(SeedService);
    await seedService.insertPermissions();
    await seedService.insertRoles();
    await seedService.insertUsers();
    await seedService.insertRoleAddPermissions();
    await seedService.insertUserAddRole();
  } catch (e) {
    await process.exit(0);
  }

  await process.exit(0);
})();
