import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateVacanciesType, GetVacanciesType, IVacancy, UpdateVacancyType } from 'bizdo';
import { AuthGuard } from 'src/guards/authorization.guard';
import { VacancyService } from './vacancy.service';

@UseGuards(AuthGuard)
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post('create')
  async create(@Body() data: CreateVacanciesType): Promise<IVacancy[]> {
    return await this.vacancyService.create(data);
  }

  @Post('get')
  async get(@Body() data: GetVacanciesType): Promise<IVacancy[]> {
    return await this.vacancyService.get(data);
  }

  @Post('update')
  async update(@Body() data: UpdateVacancyType): Promise<boolean> {
    return await this.vacancyService.update(data);
  }

  @Post('delete')
  async delete(@Body() {id}: {id:number}): Promise<boolean> {
    return await this.vacancyService.delete(id);
  }
}