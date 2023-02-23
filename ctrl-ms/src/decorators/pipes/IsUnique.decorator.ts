import { registerDecorator, ValidationOptions } from 'class-validator';
import { CustomEmailvalidation } from 'src/validators/email-validator.pipe';

export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: CustomEmailvalidation,
      });
    };
}