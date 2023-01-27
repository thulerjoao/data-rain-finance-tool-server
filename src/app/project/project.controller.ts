import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddClientToProjectResponse } from './protocols/add-client-to-project.response';
import { CreateProjectResponse } from './protocols/create-project.response';
import { FindAllProjectsResponse } from './protocols/find-all-projects.response';
import { AddClientToProjectDto } from './service/dto/add-client-to-project.dto';
import { CreateProjectDto } from './service/dto/create-project.dto';
import { ProjectService } from './service/project.service';

@Controller('project')
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({
    summary: 'Create project',
  })
  async createUser(
    @Body() dto: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    return await this.projectService.createProject(dto);
  }

  @Post('add-client')
  @ApiOperation({
    summary: 'Add client to project',
  })
  async addClientToProject(
    @Body() dto: AddClientToProjectDto,
  ): Promise<AddClientToProjectResponse> {
    return await this.projectService.addClientToProject(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all projects',
  })
  async findAllProjects(): Promise<FindAllProjectsResponse[]> {
    return await this.projectService.findAllProjects();
  }
}
