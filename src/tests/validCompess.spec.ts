import { HttpException } from '@nestjs/common';
import { validCompress } from '../utils/validCompress';

test('validCompress lança uma exceção HttpException quando compress for menor ou igual a 0.1', () => {
  // Arrange
  const invalidCompress = 0;

  // Act & Assert
  expect(() => validCompress(invalidCompress)).toThrow(HttpException);
  expect(() => validCompress(0.9)).toBeTruthy();
});
