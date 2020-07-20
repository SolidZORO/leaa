import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getConnection, getManager, getRepository } from 'typeorm';
import readlineSync from 'readline-sync';

import { AppModule } from '@leaa/api/src/app.module';
import { SeedService } from '@leaa/api/src/modules/v1/seed/seed.service';
import { LoggerService } from '@leaa/api/src/modules/v1/logger/logger.service';

(async function seed() {
  // ⚠️ before Start, Force Exit All
  const forceExit = () => {
    process.exit();
    process.exit(0);
    process.exit(1);
    process.kill(process.pid);
    process.abort();
  };

  if (readlineSync.keyInYN('Do you want to Seeding?')) {
    // 'Y'
    console.log('Seeding now...');
  } else {
    // 'N'
    forceExit();
  }

  // CLI Tips
  if (
    process.argv.includes('--rebuild-auth') ||
    process.argv.includes('--nuke') ||
    process.argv.includes('--test') ||
    process.argv.includes('--fill-action')
  ) {
    const logger = new Logger('Seed-Log');
    logger.log('Seed Launcher...', ' 🔰 ');
  } else {
    await console.log(
      '\n\nPLEASE INPUT: \n' +
        '`yarn seed --nuke` or \n' +
        '`yarn seed --rebuild-auth` \n' +
        '`yarn seed --test` \n' +
        '`yarn seed --fill-action` \n' +
        '\n\n',
    );
    await forceExit();
  }

  // Create App
  const app: NestExpressApplication = await NestFactory.create(AppModule, { logger: new LoggerService() });
  const seedService: SeedService = await app.get(SeedService);

  // Common Fn
  const insertAllAboutAuth = async () => {
    await seedService.insertPermissions();
    await seedService.insertRoles();
    await seedService.insertUsers();

    console.log('\n\n\n\n ----------- \n\n\n\n');

    await seedService.insertRolesToUser();
    await seedService.insertPermissionsToRole();

    console.log('\n\n\n\n ----------- \n\n\n\n');

    await seedService.insertSuperUserToUser();
  };

  //
  //
  //
  //
  // ⚠️ NUKKKKKKKKKKKKKKKKKKKKE ALL DATABASE! 注意！谨慎操作！
  if (process.argv.includes('--nuke')) {
    console.log('\n\n\n\n✴️✴️✴️✴️✴️✴️✴️✴️✴️✴️ NUKE NUKE NUKE NUKE ALL DB TABLE\n\n\n\n');

    await getConnection().synchronize(true);

    try {
      await seedService.insertSetting();

      await insertAllAboutAuth();

      await seedService.insertCategory();
      await seedService.insertArticle();
      await seedService.insertAttachment();

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
  }

  //
  //
  //
  //
  // Fill Action (for Test)
  if (process.argv.includes('--fill-action')) {
    console.log('\n\n\n\n FILL ACTION\n\n\n\n');

    const queryRunner = getConnection().createQueryRunner();

    await getManager().query('SET FOREIGN_KEY_CHECKS = 0;');

    // clear
    await getRepository('Action').clear();

    if (await queryRunner.getTable('actions')) {
      await getRepository('actions').clear();
    }

    await getManager().query('SET FOREIGN_KEY_CHECKS = 1;');

    await seedService.fillAction();

    await console.log('\n\n\n\n---- FILL ACTION DONE ----');
    await forceExit();
    return;
  }

  //
  //
  //
  //
  // Rebuild Auth
  if (process.argv.includes('--rebuild-auth')) {
    console.log('\n\n\n\n REBUILD AUTH\n\n\n\n');

    const queryRunner = getConnection().createQueryRunner();

    await getManager().query('SET FOREIGN_KEY_CHECKS = 0;');

    // clear
    await getRepository('Permission').clear();
    await getRepository('Role').clear();
    await getRepository('User').clear();

    if (await queryRunner.getTable('roles_permissions_permissions')) {
      await getRepository('roles_permissions_permissions').clear();
    }

    if (await queryRunner.getTable('users_roles_roles')) {
      await getRepository('users_roles_roles').clear();
    }

    await getManager().query('SET FOREIGN_KEY_CHECKS = 1;');

    // re-build
    await insertAllAboutAuth();

    await console.log('\n\n\n\n---- REBUILD AUTH DONE ----');
    await forceExit();
    return;
  }

  //
  //
  //
  //
  // for Test
  if (process.argv.includes('--test')) {
    // clear
    // await getRepository('Category').clear();
    await seedService.insertCategory();
  }
})();
