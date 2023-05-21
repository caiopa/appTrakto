import { Test, TestingModule } from '@nestjs/testing';
import * as sharp from 'sharp';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../app.module';
import { CreateImageDto } from '../image/dto/create-image.dto';
import { ImageController } from '../image/image.controller';
import { ImageModule } from '../image/image.module';
import { ImageService } from '../image/image.service';
import { Image } from '../image/schemas/image.schema';

describe('ImageController', () => {
  let controller: ImageController;
  let service: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ImageModule, AppModule],
      controllers: [ImageController],
      providers: [
        ImageService,
        { provide: getModelToken(Image.name), useValue: jest.fn() },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
    service = module.get<ImageService>(ImageService);
  });

  describe('create', () => {
    it('should save the image with thumbnail and return the file paths', () => {
      const image = 'https://jpeg.org/images/jpeg-home.jpg';
      const compress = 0.9;
      const expectedResult: Promise<{
        localpath: { original: string; thumb: string };
        metadata: sharp.Metadata;
      }> = Promise.resolve({
        localpath: {
          original: './src/assets/original_1684619715652.jpg',
          thumb: './src/assets/_thumb_1684619715652.jpg',
        },
        metadata: {
          format: 'jpeg',
          size: 30203,
          width: 800,
          height: 400,
          space: 'srgb',
          channels: 3,
          depth: 'uchar',
          density: 72,
          chromaSubsampling: '4:4:4',
          isProgressive: false,
          resolutionUnit: 'inch',
          hasProfile: false,
          hasAlpha: false,
        },
      });

      jest
        .spyOn(service, 'saveImageWithThumbnail')
        .mockResolvedValue(expectedResult);

      const createImageDto: CreateImageDto = { image, compress };

      expect(controller.create(createImageDto)).toEqual(expectedResult);
      expect(service.saveImageWithThumbnail).toHaveBeenCalledWith(
        image,
        compress,
      );
    });

    it('should handle errors and log them', () => {
      const image = 'https://jpeg.org/images/jpeg-home.jpg';
      const compress = 0.9;
      const error = new Error('Some error message');

      jest.spyOn(service, 'saveImageWithThumbnail').mockImplementation(() => {
        throw error;
      });

      const createImageDto: CreateImageDto = { image, compress };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(controller.create(createImageDto)).toBeUndefined();
      expect(service.saveImageWithThumbnail).toHaveBeenCalledWith(
        image,
        compress,
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
