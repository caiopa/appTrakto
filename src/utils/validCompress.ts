import { HttpException, HttpStatus } from '@nestjs/common';

export function validCompress(compress) {
  if (compress <= 0.1) {
    throw new HttpException(
      {
        errors: [
          {
            code: 400,
            message: 'Compress não pode ser menor que 0.1',
          },
        ],
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
