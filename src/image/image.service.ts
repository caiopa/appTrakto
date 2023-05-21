import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { promisify } from 'util';
import { copiarImagemReduzida } from '../utils/copyImgAndResize';
import { validCompress } from '../utils/validCompress';
import { Image, ImageDocument } from './schemas/image.schema';

const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async saveImageWithThumbnail(image: string, compress: number) {
    const timestamps = new Date().getTime();
    const newLocalImg = `./src/assets/original_${timestamps}.jpg`;
    validCompress(compress);
    try {
      const response = await axios.get(image, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      const imageMetadata = await sharp(buffer).metadata();

      let resizedWidth = imageMetadata.width;
      let resizedHeight = imageMetadata.height;

      if (resizedWidth > 720) {
        resizedWidth = 720;
      }

      if (resizedHeight > 720) {
        resizedHeight = 720;
      }

      const resizedBuffer = await sharp(buffer)
        .resize(resizedWidth, resizedHeight)
        .toBuffer();

      await writeFileAsync(newLocalImg, resizedBuffer);

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
              message: 'URL inválida ou inexistente',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
