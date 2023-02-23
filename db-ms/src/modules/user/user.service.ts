import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Password } from 'src/models/password.model';
import { ClientProxy } from '@nestjs/microservices';
import { Role } from 'src/models/role.model';
import { Organization } from 'src/models/organization.model';
import sequelize from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Password) private passwordRepository: typeof Password,
    @Inject('NATS') private client: ClientProxy
  ) {}

  async getUser(searchAttributes: {uid?: string, email?: string}) {
    const user: User = await this.userRepository.findOne({
      where: searchAttributes,
      include: [
        {
          model: Password,
          required: true,
          attributes: { include: [
            'hash', 
            'salt'
          ] },
          as: 'password'
        },
      ],
      attributes: {
        include: ['uid',
        'first_name',
        'last_name',
        'middle_name',
        'email',
        'phone',
        [sequelize.literal(
          `COALESCE((
            SELECT
              array_agg(
                json_build_object(
                    'id', o.id,
                    'name', o.name,
                    'roles', (
                        SELECT 
                            json_agg(
                                json_build_object(
                                    'id', r.id,
                                    'name', r.name
                                )
                            )
                        FROM 
                            roles r
                        WHERE 
                            r.organization_id = o.id
                    )
                )
            )
        FROM 
            vacancies v
            JOIN roles r ON r.id = v.role_id
            JOIN organizations o ON o.id = r.organization_id
        WHERE 
            v.user_uid = "User"."uid"
    ), ARRAY[]::JSON[])`), 'organizations']
      ]
    },
      group: ['User.uid', 'password.hash', 'password.salt', 'password.user_uid']
    });
    return user;
  }
}
