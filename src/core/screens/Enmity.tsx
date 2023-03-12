import { FormSection, ScrollView, FormRow, FormSwitch, Text, FormInput, KeyboardAvoidingView, FormDivider } from '@components';
import { Linking, StyleSheet, ColorMap, Clipboard, Toasts, Dialog } from '@metro/common';
import { socket, connectWebsocket } from '@core/debug/websocket';
import { getPlugins } from '@managers/plugins';
import { listThemes } from '@managers/themes';
import ThemeIcon from './partials/PluginIcon';
import PluginIcon from './partials/ThemeIcon';
import { reload, version } from '@api/native';
import * as Assets from '@api/assets';
import { getByProps } from '@metro';
import React from 'react';

const ThemeColorMap = ColorMap.ThemeColorMap;

const Invites = getByProps('acceptInviteAndTransitionToInviteChannel');

export function Page({ settings }) {
  const styles = StyleSheet.createThemedStyleSheet({
    debugText: {
      color: ThemeColorMap.TEXT_MUTED
    },
    container: {
      marginBottom: 50
    }
  });

  const Icons = {
    Twitter: Assets.getIDByName('img_account_sync_twitter_white'),
    GitHub: Assets.getIDByName('img_account_sync_github_white'),
    Addon: Assets.getIDByName('img_nitro_increase_guild_limit'),
    Checkmark: Assets.getIDByName('Check'),
    Discord: Assets.getIDByName('Discord'),
    Refresh: Assets.getIDByName('ic_sync_24px'),
    Hammer: Assets.getIDByName('ic_hammer_and_chisel_24px'),
    Server: Assets.getIDByName('ic_server_security_24px')
  };

  const Runtime = HermesInternal.getRuntimeProperties();
  const Plugins = getPlugins().map(p => p.name);
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
          label='Discord Server'
          leading={<FormRow.Icon source={Icons.Discord} />}
          trailing={FormRow.Arrow}
          onPress={() => Invites.acceptInviteAndTransitionToInviteChannel({
            inviteKey: 'ZyJUgu5KDW',
            context: {location: 'Invite Button Embed'},
            callback: () => {}
          })}
        />
        <FormDivider />
        <FormRow
          label='GitHub'
          leading={<FormRow.Icon source={Icons.GitHub} />}
          trailing={FormRow.Arrow}
          onPress={() => Linking.openURL('https://github.com/enmity-mod')}
        />
        <FormDivider />
        <FormRow
          label='Twitter'
          leading={<FormRow.Icon source={Icons.Twitter} />}
          trailing={FormRow.Arrow}
          onPress={() => Linking.openURL('https://twitter.com/EnmityApp')}
        />
      </FormSection>
      <FormSection title='Debug'>
        <FormRow
          label='Installed Plugins'
          leading={<ThemeIcon width={24} height={24} />}
          trailing={() => <Text style={styles.debugText}>{Plugins.length}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(`**Plugins**: ${Plugins.join(', ')}`);
          }}
        />
        <FormDivider />
        <FormRow
          label='Installed Themes'
          leading={<PluginIcon width={24} height={24} />}
          trailing={() => <Text style={styles.debugText}>{Themes.length}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(`**Themes**: ${Themes.join(', ')}`);
          }}
        />
        <FormDivider />
        <FormRow
          label='Reload Discord'
          leading={<FormRow.Icon source={Icons.Refresh} />}
          onPress={() => {
            Dialog.show({
              title: 'Are You Sure?',
              body: 'Are you sure you want to reload the discord app? This might crash your app instead of reloading it.',
              confirmText: 'Yes',
              cancelText: 'No',
              onConfirm: reload,
            });
          }}
        />
        <FormDivider />
        <FormRow
          label='Automatically connect to debug websocket'
          trailing={<FormSwitch
            value={settings.getBoolean('autoConnectWS', false)}
            onValueChange={() => {
              settings.toggle('autoConnectWS', false);

              try {
                if (settings.get('autoConnectWS', false)) {
                  connectWebsocket();
                } else {
                  socket.close();
                }
              } catch {
                // Ignore if anything throws, the socket is most likely not present.
              }
            }}
          />}
        />
        {settings.getBoolean('autoConnectWS', false) && <>
          <FormDivider />
          <FormInput
            value={settings.get('debugWSAddress', '192.168.0.1:9090')}
            onChange={v => settings.set('debugWSAddress', v)}
            title='DEBUG IP'
          />
        </>}
      </FormSection>
      <FormSection title='Runtime Versions'>
        <FormRow
          label='Enmity Version'
          leading={<FormRow.Icon source={{ uri: 'https://files.enmity.app/icon-64.png' }} />}
          trailing={() => <Text style={styles.debugText}>{window.enmity.version}</Text>}
          onPress={() => Linking.openURL(`https://github.com/enmity-mod/enmity/commit/${window.enmity.version}`)}
        />
        <FormDivider />
        <FormRow
          label='Discord Version'
          leading={<FormRow.Icon source={Icons.Discord} />}
          trailing={() => <Text style={styles.debugText}>{version}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(version);
          }}
        />
        <FormDivider />
        <FormRow
          label='Bytecode Version'
          leading={<FormRow.Icon source={Icons.Hammer} />}
          trailing={() => <Text style={styles.debugText}>{Runtime['Bytecode Version']}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(String(Runtime['Bytecode Version']));
          }}
        />
        <FormDivider />
        <FormRow
          label='Hermes Version'
          leading={<FormRow.Icon source={Icons.Server} />}
          trailing={() => <Text style={styles.debugText}>{Runtime['OSS Release Version']}</Text>}
          onPress={() => {
            Toasts.open({ content: 'Copied to clipboard', source: Icons.Checkmark });
            Clipboard.setString(Runtime['OSS Release Version']);
          }}
        />
      </FormSection>
    </KeyboardAvoidingView>
  </ScrollView>;
};
