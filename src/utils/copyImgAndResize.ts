import * as sharp from 'sharp';
import { CreateThubImageDto } from 'src/image/dto/create-image.dto';

import * as fs from 'fs';

export async function copiarImagemReduzida({
  compress,
  timestamps,
  caminhoUrl,
}: CreateThubImageDto) {
  const newLocalImg = `./src/assets/_thumb_${timestamps}.jpg`;

  const buffer = fs.readFileSync(caminhoUrl as string);
  const imageMetadata = await sharp(buffer).metadata();
  const resizedBuffer = await sharp(buffer)
    .resize(imageMetadata.width! * compress, imageMetadata.height! * compress)
    .toBuffer();
  fs.writeFileSync(newLocalImg, resizedBuffer);
  console.log('Imagem redimensionada e salva com sucesso!');

  return newLocalImg;
}
