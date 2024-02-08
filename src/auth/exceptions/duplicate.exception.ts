import { BadRequestException, HttpStatus } from '@nestjs/common';

export class DuplicateException extends BadRequestException {
  constructor(field: string) {
    super({
      message: 'Some fields in form is duplicated!',
      status: HttpStatus.BAD_REQUEST,
      description: 'Following fields are duplicated: ' + field,
    });
  }
}
