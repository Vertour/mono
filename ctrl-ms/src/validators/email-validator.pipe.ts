import { HttpException, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { AccountService } from 'src/modules/account/account.service';
import { Errors } from 'bizdo';

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class CustomEmailvalidation implements ValidatorConstraintInterface {
  constructor(private readonly accountService: AccountService) {}

  defaultMessage(){
    return 'Email already exist or incorrect.'
  }

  async validate(value: string): Promise<boolean> {

    if(typeof value!=='string')
    throw new HttpException('Email must be type of string!', 400);

    if(await this.accountService.isEmailExist(value))
    throw new HttpException(Errors.HttpErrors.EMAIL_EXIST.toString(), 400);

    return true;
  }
}