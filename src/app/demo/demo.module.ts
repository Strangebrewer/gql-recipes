import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { RecipeModule } from '../recipe/recipe.module';
import { DemoService } from './demo.service';

@Module({
  imports: [SharedModule, RecipeModule],
  providers: [DemoService],
  exports: [DemoService],
})
export class DemoModule {}
