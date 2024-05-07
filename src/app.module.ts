import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module';
import { AdviceModule } from './advice/advice.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './gateway/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UserModule,
    RecipeModule,
    AdviceModule,
    AuthModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
