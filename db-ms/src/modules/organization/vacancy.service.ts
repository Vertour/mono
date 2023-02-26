import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateVacanciesType, GetVacanciesType, UpdateVacancyType } from 'bizdo';
import { Vacancy } from 'src/models/vacancy.model';
import { Op } from 'sequelize';
import { User } from 'src/models/user.model';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy) private vacancyRepository: typeof Vacancy,
  ) {}

  async createVacancies({ roleId, vacancies }: CreateVacanciesType){
    return await this.vacancyRepository.bulkCreate(vacancies.map((vac)=>({roleId, ...vac})));
  }

  async updateVacancy({ id, ...vacancy }: UpdateVacancyType){
    return (await this.vacancyRepository.update(vacancy, {where: {id}}))?true:false;
  }

  async deleteVacancy(id: number){
    return await this.vacancyRepository.destroy({where: {id}})
  }

  async getVacancies({ roleId, search, ...searchParams }: GetVacanciesType){
    return await this.vacancyRepository.findAll({
      where: search?{
        roleId,
        name: {[Op.iLike]:`%${search}%`}
      }:{ roleId },
      include: [{
        model: User,
        attributes: ['first_name', 'middle_name', 'last_name', 'email']
      }],
      attributes: [
        'id', 
        'role_id', 
        'name',
        'email',
        'phone'
      ],
      subQuery: false,
      ...searchParams
    });
  }

  
}