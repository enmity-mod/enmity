import { FormSection, ScrollView, FormRow, FormSwitch, Text, FormInput, KeyboardAvoidingView } from '@components';
import { Linking, StyleSheet, ColorMap, Clipboard, Toasts } from '@metro/common';
import { listThemes } from '@managers/themes';
import ThemeIcon from './partials/PluginIcon';
import PluginIcon from './partials/ThemeIcon';
import { getVersion } from '@api/native';
import * as Assets from '@api/assets';
import React from 'react';

const ThemeColorMap = ColorMap.ThemeColorMap;

export function HeaderRight() {
  return null;
}

export function Page({ settings }) {
  const styles = StyleSheet.createThemedStyleSheet({
    debugText: {
      color: ThemeColorMap.TEXT_MUTED
    }
  });

  const Icons = {
    Twitter: Assets.getIDByName('img_account_sync_twitter_white'),
    GitHub: Assets.getIDByName('img_account_sync_github_white'),
    Addon: Assets.getIDByName('img_nitro_increase_guild_limit'),
    Checkmark: Assets.getIDByName('Check'),
    Discord: Assets.getIDByName('Discord')
  };

  const Plugins = [...window.plugins.enabled, ...window.plugins.disabled];
  const Themes = listThemes().map(t => t.name);

  return <ScrollView>
    <KeyboardAvoidingView
      enabled={true}
      behavior='position'
      style={styles.container}
      keyboardVerticalOffset={100}
      contentContainerStyle={{ backfaceVisibility: 'hidden' }}
    >
      <FormSection title='Links'>
        <FormRow
          label='GitHub'
          leading={<FormRow.Icon source={Icons.GitHub} />}
          trailing={FormRow.Arrow}
          onPress={() => Linking.openURL('https://github.com/enmity-mod')}
        />
        <FormRow
          label='Twitter'
          leading={<FormRow.Icon source={Icons.Twitter} />}
          trailing={FormRow.Arrow}
          onPress={() => Linking.openURL('https://twitter.com/EnmityApp')}
        />
      </FormSection>
      <FormSection title='Debug'>
        <FormRow
          label='Discord Version'
          leading={<FormRow.Icon source={Icons.Discord} />}
          trailing={() => <Text style={styles.debugText}>{getVersion()}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(getVersion());
          }}
        />
        <FormRow
          label='Enmity Version'
          leading={<FormRow.Icon source={{ uri: 'https://files.enmity.app/icon-64.png' }} />}
          trailing={() => <Text style={styles.debugText}>{window.enmity.version}</Text>}
          onPress={() => Linking.openURL(`https://github.com/enmity-mod/enmity/commit/${window.enmity.version}`)}
        />
        <FormRow
          label='Installed Plugins'
          leading={<ThemeIcon width={24} height={24} />}
          trailing={() => <Text style={styles.debugText}>{Plugins.length}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(`**Plugins**: ${Plugins.join(', ')}`);
          }}
        />
        <FormRow
          label='Installed Themes'
          leading={<PluginIcon width={24} height={24} />}
          trailing={() => <Text style={styles.debugText}>{Themes.length}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(`**Themes**: ${Themes.join(', ')}`);
          }}
        />
        <FormRow
          label='Automatically connect to debug websocket'
          trailing={<FormSwitch
            value={settings.getBoolean('autoConnectWS', false)}
            onValueChange={() => settings.toggle('autoConnectWS', false)}
          />}
        />
        {settings.getBoolean('autoConnectWS', false) && <FormInput
          value={settings.get('debugWSAddress', '192.168.0.1:9090')}
          onChange={v => settings.set('debugWSAddress', v)}
          title='DEBUG IP'
        />}
      </FormSection>
    </KeyboardAvoidingView>
  </ScrollView>;
};