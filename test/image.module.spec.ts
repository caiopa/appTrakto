import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageController } from '../src/image/image.controller';
import { ImageModule } from '../src/image/image.module';
import { ImageService } from '../src/image/image.service';
import { ImageSchema } from '../src/image/schemas/image.schema';
import { Image } from '../src/image/schemas/image.schema';

describe('ImageModule', () => {
  let imageModule;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/trakto'),
        MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
        ImageModule,
      ],
      controllers: [ImageController],
      providers: [ImageService],
    }).compile();

    imageModule = moduleRef.get<ImageModule>(ImageModule);
  });

  it('deve ser definido', () => {
    expect(imageModule).toBeDefined();
  });
});
