import * as fs from 'fs';
import * as sharp from 'sharp';
import { copiarImagemReduzida } from '../src/utils/copyImgAndResize';

// Mock das funções e métodos utilizados
jest.mock('fs');
jest.mock('sharp');

describe('Teste da função copiarImagemReduzida', () => {
  const compress = 0.5;
  const timestamps = 20210521;
  const caminhoUrl = './src/assets/original_20210521.jpg';

  const mockMetadata = {
    width: 100,
    height: 100,
  };

  const mockResizedBuffer = Buffer.from('resizedBuffer');

  beforeEach(() => {
    // Mock das implementações das funções e métodos
    (fs.readFileSync as jest.Mock).mockReturnValue('buffer');
    (sharp as unknown as jest.Mock).mockReturnValue({
      metadata: jest.fn().mockResolvedValue(mockMetadata),
      resize: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(mockResizedBuffer),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('deve redimensionar e salvar a imagem corretamente', async () => {
    const result = await copiarImagemReduzida({
      compress,
      timestamps,
      caminhoUrl,
    });

    expect(sharp).toHaveBeenCalledWith('buffer');
    expect(sharp().metadata).toHaveBeenCalled();
    expect(sharp().toBuffer).toHaveBeenCalled();
    expect(result).toEqual('./src/assets/_thumb_20210521.jpg');
  });
});
