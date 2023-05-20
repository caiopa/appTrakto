import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from './schemas/image.schema';
import { Model } from 'mongoose';
import axios from 'axios';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { copiarImagemReduzida } from '../utils/copyImgAndResize';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async saveImageWithThumbnail(image: string, compress: number) {
    const timestamps = new Date().getTime();
    const newLocalImg = `./src/assets/original_${timestamps}.jpg`;
    if (compress <= 0) {
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

    try {
      const response = await axios.get(image, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      let resizedWidth;
      let resizedHeight;

      const imageMetadata = await sharp(buffer).metadata();

      if (imageMetadata.width && imageMetadata.width > 720) {
        resizedWidth = 720;
      }

      if (imageMetadata.height && imageMetadata.height > 720) {
        resizedHeight = 720;
      }

      const resizedBuffer = await sharp(buffer)
        .resize(resizedWidth, resizedHeight)
        .toBuffer();

      fs.writeFileSync(newLocalImg, resizedBuffer);

      const resultadoResizeImg = await copiarImagemReduzida({
        image,
        compress,
        timestamps,
        caminhoUrl: newLocalImg,
      });

      return {
        localpath: {
          original: newLocalImg,
          thumb: resultadoResizeImg,
        },
        metadata: imageMetadata,
      };
    } catch (err) {
      throw new HttpException(
        {
          errors: [
            {
              code: 404,
              message: 'URL invalida ou inexistente',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
