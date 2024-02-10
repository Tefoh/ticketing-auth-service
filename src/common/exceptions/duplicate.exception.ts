import { BadRequestException, HttpStatus } from '@nestjs/common';

export class DuplicateException extends BadRequestException {
  constructor(public readonly field: string) {
    super({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  }
}
