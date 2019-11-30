import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getConnection } from 'typeorm';

import { AppModule } from '@leaa/api/src/app.module';
import { SeedService } from '@leaa/api/src/modules/seed/seed.service';

(async function seed() {
  const logger = new Logger('Seed-Log');
  logger.log('Seed Launcher...', ' 🔰 ');

  const app: NestExpressApplication = await NestFactory.create(AppModule);

  if (process.argv.includes('--nuke')) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n✴️✴️✴️✴️✴️✴️✴️✴️✴️✴️ NUKE NUKE NUKE NUKE\n\n\n\n');

    await getConnection().synchronize(true);
  }

  const forceExit = () => {
    process.exit();
    process.exit(0);
    process.exit(1);
    process.kill(process.pid);
    process.abort();
  };

  try {
    const seedService: SeedService = await app.get(SeedService);

    await seedService.insertSetting();
    await seedService.insertPermissions();
    await seedService.insertRoles();
    await seedService.insertUsers();
    await seedService.insertUserAddRole();
    await seedService.insertRoleAddPermissions();
    await seedService.insertCategory();
    await seedService.insertArticle();
    await seedService.insertAx();
    await seedService.insertAttachment();
    await seedService.insertCoupon();
    await seedService.insertPromo();

    if (process.argv.includes('--debug')) {
      await seedService.insertRandomUsers();
    }

    await console.log('\n\n\n\n---- ALL SEED INSERTED ----');
    // await process.exit(1);
    await forceExit();
  } catch (e) {
    await console.log('\n\n\n\n---- SEED INSERT FAILD ----', e);
    await forceExit();
  }

  await console.log('\n\n\n\n---- SEED FINAL ----');
  await forceExit();
})();
