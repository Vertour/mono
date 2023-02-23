import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Password } from 'src/models/password.model';
import { ClientProxy } from '@nestjs/microservices';
import { Organization } from 'src/models/organization.model';
import { Role } from 'src/models/role.model';
import { Vacancy } from 'src/models/vacancy.model';
import { Permission } from 'src/models/permission-constants.model';
import sequelize from 'sequelize';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Organization) private organizationRepository: typeof Organization,
    @Inject('NATS') private client: ClientProxy
  ) {}

  async getAccountDataForRedis(uid: string) {
    const organizations: Organization[] = await this.organizationRepository.findAll({
      include: [
        {
          model: Role,
          required: true,
          attributes: [],
          include: [
            {
              model: Vacancy,
              where: { userUid: uid },
              attributes: []
            },
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] },
              attributes: []
            }
          ]
        }
      ],
      attributes: [
        'id',
        'name',
        [
          sequelize.literal(
            `array_agg(json_build_object('role_name', "roles->permissions"."name", 'role_id', "roles->permissions"."id"))`
          ),
          'permissions'
        ]
      ],
      group: ['Organization.id', 'Organization.name']
    });

    return { tokens: [], organizations };
  }

  async isEmailExist(email: string){
    return (await this.userRepository.findOne({ where: {email} }))?true:false;

  }
}
