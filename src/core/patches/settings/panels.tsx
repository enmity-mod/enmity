import { FormArrow, FormDivider, FormRow, FormSection } from '@components';
import { connectComponent } from '@api/settings';
import { Locale, NavigationNative, Scenes, React } from '@metro/common';
import { findInReactTree } from '@utilities';
import { getByName } from '@metro';
import { create } from '@patcher';

import Enmity from "@screens/Enmity";
import Page from "@screens/partials/DataPage";
import HeaderRight from '@screens/partials/HeaderRight';
import ThemeIcon from '@screens/partials/ThemeIcon';
import PluginIcon from '@screens/partials/PluginIcon';
import { build } from '@api/native';

const Patcher = create('enmity-settings-panels');

export default function (): void {
	patchScreens();
	patchSettings();
}

function patchScreens() {
	Patcher.after(Scenes, 'default', (_, __, res) => {
		return {
			...res,
			Enmity: {
				key: 'Enmity',
				title: 'Enmity',
				render: connectComponent(Enmity, 'enmity')
			},
			EnmityPlugins: {
				key: 'EnmityPlugins',
				title: 'Plugins',
				render: () => <Page type={"plugin"} />,
				headerRight: () => <HeaderRight type={"plugin"} />
			},
			EnmityThemes: {
				key: 'EnmityThemes',
				title: 'Themes',
				render: () => <Page type={"theme"} />,
				headerRight: () => <HeaderRight type={"theme"} />
			},
			EnmityCustomPage: {
				key: 'EnmityCustomPage',
				title: 'Page',
				render: ({ pageName, pagePanel }: { pageName: string, pagePanel: React.ComponentType; }) => {
					const navigation = NavigationNative.useNavigation();
					const Component = pagePanel;

					React.useEffect(() => {
						if (pageName) {
							navigation.setOptions({ title: pageName });
						}
					}, []);

					return <Component />;
				}
			}
		};
	});
}

function patchSettings() {
	const Settings = getByName('UserSettingsOverviewWrapper', { default: false });

	const unpatch = Patcher.after(Settings, 'default', (_, __, ret) => {
		const Overview = findInReactTree(ret, m => m.type?.name === 'UserSettingsOverview');

		Patcher.after(Overview.type.prototype, 'render', ({ props: { navigation } }, __, res) => {
			const { children } = build >= "42188"
				? findInReactTree(res, r => r.children[1].type === FormSection)
				: res.props;

			const searchable = [Locale.Messages.BILLING_SETTINGS, Locale.Messages.PREMIUM_SETTINGS];
			const index = children.findIndex(c => searchable.includes(c.props.title));

			children.splice(index === -1 ? 4 : index, 0, <>
				<FormSection key='Enmity' title='Enmity'>
					<FormRow
						label='General'
						leading={<FormRow.Icon source={{ uri: 'https://enmity-mod.github.io/assets/icon-64.png' }} />}
						trailing={<FormArrow />}
						onPress={() => void navigation.push('Enmity', { navigation })}
					/>
					<FormDivider />
					<FormRow
						label='Plugins'
						leading={<PluginIcon width={24} height={24} />}
						trailing={<FormArrow />}
						onPress={() => void navigation.push('EnmityPlugins', { navigation })}
					/>
					<FormDivider />
					<FormRow
						label='Themes'
						leading={<ThemeIcon width={24} height={24} />}
						trailing={<FormArrow />}
						onPress={() => void navigation.push('EnmityThemes', { navigation })}
					/>
				</FormSection>
			</>);

			// Remove "Upload Debug Logs" button
			const supporter = children.find(c => c.props.title === Locale.Messages.SUPPORT);
			const entries = supporter?.props.children;

			if (entries) {
				supporter.props.children = entries.filter(e => e?.type?.name !== 'UploadLogsButton');
			}
		});

		unpatch();
	});
}
