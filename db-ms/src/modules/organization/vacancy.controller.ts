import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateVacanciesType, GetVacanciesType, UpdateVacancyType } from 'bizdo';
import { ExceptionFilterMs } from 'src/filters/exception.filter';
import { Vacancy } from 'src/models/vacancy.model';
import { VacancyService } from './vacancy.service';

@UseFilters(new ExceptionFilterMs())
@Controller()
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @MessagePattern('create-vacancies')
  async createvacancies(data: CreateVacanciesType): Promise<Vacancy[]> {
    return await this.vacancyService.createVacancies(data);
  }

  @MessagePattern('get-vacancies')
  async getVacancies(data: GetVacanciesType): Promise<Vacancy[]> {
    return await this.vacancyService.getVacancies(data);
  }

  @MessagePattern('update-vacancy')
  async updateVacancy(data: UpdateVacancyType): Promise<boolean> {
    return await this.vacancyService.updateVacancy(data);
  }

  @MessagePattern('delete-vacancy')
  async deletevacancy(id: number): Promise<number> {
    return await this.vacancyService.deleteVacancy(id);
  }
}
