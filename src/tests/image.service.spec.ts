import * as sharp from 'sharp';
import { ImageService } from '../image/image.service';
import { Image } from '../image/schemas/image.schema';
import { getModelToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ImageController } from '../image/image.controller';
import { ImageModule } from '../image/image.module';
import axios from 'axios';
import * as fs from 'fs';
import { promisify } from 'util';

jest.mock('sharp');
jest.mock('axios');
const writeFileAsync = promisify(fs.writeFile);

describe('ImageService', () => {
  let imageService: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ImageModule, AppModule],
      controllers: [ImageController],
      providers: [
        ImageService,
        { provide: getModelToken(Image.name), useValue: jest.fn() },
      ],
    }).compile();

    imageService = module.get<ImageService>(ImageService);

    (sharp as any).mockImplementation(() => {
      return {
        resize: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue('mockResizedBuffer'),
        metadata: jest.fn().mockResolvedValue({
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
        }),
      };
    });
  });

  it('deve salvar a imagem com o thumbnail e retornar os caminhos dos arquivos', async () => {
    const mockImage = 'https://jpeg.org/images/jpeg-home.jpg';
    const mockCompress = 0.9;
    const mockResultadoResizeImg = expect.stringMatching(
      /\.\/src\/assets\/_thumb_\d+\.jpg/,
    );

    jest.spyOn(axios, 'get').mockResolvedValue({
      data: Buffer.from('mockImageData'),
    });

    jest
      .spyOn(imageService, 'saveImageWithThumbnail')
      .mockImplementation(async () => {
        return {
          localpath: {
            original: expect.stringMatching(
              /\.\/src\/assets\/original_\d+\.jpg/,
            ),
            thumb: mockResultadoResizeImg,
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
        };
      });

    const result = await imageService.saveImageWithThumbnail(
      mockImage,
      mockCompress,
    );

    expect(result).toEqual({
      localpath: {
        original: expect.stringMatching(/\.\/src\/assets\/original_\d+\.jpg/),
        thumb: mockResultadoResizeImg,
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
  });
});
