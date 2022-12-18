import { Body, Controller, Post } from '@nestjs/common';
import { AlternativeTeamService } from './service/alternative-team.service';
import { CreateAlternativeTeamDto } from './service/dto/create-alternative-team.dto';

@Controller('alternative-team')
export class AlternativeTeamController {
  constructor(
    private readonly alternativeTeamService: AlternativeTeamService,
  ) {}

  @Post()
  async createAlternativeTeam(
    @Body() dto: CreateAlternativeTeamDto,
  ): Promise<void> {
    return await this.alternativeTeamService.createAlternativeTeam(dto);
  }
}
