export class CreateImageDto {
  readonly image: string;
  readonly compress: number;
}

export class CreateThubImageDto {
  readonly image?: string;
  readonly compress: number;
  readonly timestamps: number;
  readonly caminhoUrl: string;
}
