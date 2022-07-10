import { getByProps } from '@metro';
import { Constants } from '@metro/common';
import { create } from '@patcher';

const Patcher = create('no-track');

export default function () {

  // Invalidate /science link in case patching fails
  Constants.TRACK = "/404";

  const [
    Metadata,
    Analytics,
    Properties
  ] = getByProps(
    ['trackWithMetadata'],
    ['AnalyticsActionHandlers'],
    ['encodeProperties', 'track'],
    { bulk: true }
  );

  try {
    patchMetadata(Metadata);
  } catch (e) {
    console.error('Failed to patch metadata', e.message);
  }

  try {
    patchAnalytics(Analytics);
  } catch (e) {
    console.error('Failed to patch analytics', e.message);
  }

  try {
    patchProperties(Properties);
  } catch (e) {
    console.error('Failed to patch properties', e.message);
  }

  return Patcher.unpatchAll;
};

function patchMetadata(metadata: any): void {
  Patcher.instead(metadata, 'trackWithMetadata', () => { });
  Patcher.instead(metadata, 'trackWithGroupMetadata', () => { });
  Patcher.instead(metadata, 'trackWithGroupMetadata', () => { });
}

function patchAnalytics(analytics: any): void {
  Patcher.instead(analytics.AnalyticsActionHandlers, 'handleTrack', () => { });
}

function patchProperties(properties: any): void {
  Patcher.instead(properties, 'track', () => { });
}