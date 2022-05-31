import { Components } from '@metro/common';

const { PixelRatio } = Components.General;

export default function normalizeSize(size: number): number {
  return PixelRatio.getPixelSizeForLayoutSize(size);
};