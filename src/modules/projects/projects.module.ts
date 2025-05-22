import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { ProjectController } from './controller/projects.controller';
import { ProjectService } from './service/projects.service';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, UserEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
