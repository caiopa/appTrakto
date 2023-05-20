import { Controller, Post, Body, Next } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/save')
  create(@Body() { image, compress }: CreateImageDto) {
    try {
      return this.imageService.saveImageWithThumbnail(image, compress);
    } catch (error) {
      console.error(error);
      Next();
    }
  }
}
