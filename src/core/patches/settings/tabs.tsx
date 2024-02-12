import { connectComponent } from '@api/settings';
import { Locale, NavigationNative, React } from '@metro/common';
import { getByProps } from '@metro';
import { create } from '@patcher';

import Enmity from "@screens/Enmity";
import Page from "@screens/partials/DataPage";
import HeaderRight from '@screens/partials/HeaderRight';
import { getIDByName } from '@api/assets';

const Patcher = create('enmity-settings-tabs');

export default function (): void {
	patchConstants();
	patchSections();
	patchSearch();
}

const routes = {
	General: 'Enmity',
	Plugins: 'EnmityPlugins',
	Themes: 'EnmityThemes',
	Custom: 'EnmityCustomPage'
} as const;

function PageWithHeaderRight({ type }) {
	const navigation = NavigationNative.useNavigation();

	const unsubscribe = navigation.addListener('focus', () => {
		unsubscribe();
		navigation.setOptions({ headerRight: () => <HeaderRight type={type} /> });
	});

	return <Page type={type} />;
}

const screens = {
	General: connectComponent(Enmity, 'enmity'),
	Plugins: () => <PageWithHeaderRight type={"plugin"} />,
	Themes: () => <PageWithHeaderRight type={"theme"} />,
	Custom: ({ pageName, pagePanel: Component }: { pageName: string, pagePanel: React.ComponentType; }) => {
		const navigation = NavigationNative.useNavigation();

		const unsubscribe = navigation.addListener('focus', () => {
			unsubscribe();
			navigation.setOptions({ title: pageName });
		});

		return <Component />;
	}
};

const titles = {
	General: 'Enmity',
	Plugins: 'Plugins',
	Themes: 'Themes',
	Custom: 'Page'
};

const icons = {
	General: { uri: 'https://files.enmity.app/icon-64.png' },
	Plugins: getIDByName('ic_activity_24px'),
	Themes: getIDByName('ic_paint_brush'),
	Custom: null
};

const Constants = getByProps('SETTING_RENDERER_CONFIG');

function patchConstants() {
	Constants.SETTING_RENDERER_CONFIG = { ...Constants.SETTING_RENDERER_CONFIG };

	Object.assign(
		Constants.SETTING_RENDERER_CONFIG,
		Object.keys(routes).map(key => ({
			[routes[key]]: {
				type: 'route',
				title: titles[key],
				icon: icons[key],
				parent: null,
				screen: {
					route: routes[key],
					getComponent: () => React.memo(({ route }: any) => {
						const Screen = screens[key];
						return <Screen {...route?.params ?? {}} />;
					})
				}
			}
		})).reduce((acc, obj) => ({ ...acc, ...obj }), {})
	);
}

function patchSections() {
	const Settings = getByProps('SearchableSettingsList');

	Patcher.before(Settings.SearchableSettingsList, 'type', (_, [{ sections }]) => {
		const index = sections?.findIndex(section => section.settings.find(setting => setting === 'ACCOUNT'));

		if (!sections.find(section => section.label === 'Enmity')) {
			sections.splice(index === -1 ? 1 : index + 1, 0, {
				label: 'Enmity',
				settings: Object.values(routes).filter(key => key !== 'EnmityCustomPage')
			});
		}

		const support = sections.find(section => section.label === Locale.Messages.SUPPORT);
		support && (support.settings = support.settings.filter(setting => setting !== 'UPLOAD_DEBUG_LOGS'));
	});
};

function patchSearch() {
	const [
		SearchQuery,
		SearchResults,
		Getters
	] = getByProps(
		['getSettingSearchQuery'],
		['useSettingSearchResults'],
		['getSettingListSearchResultItems'],
		{ bulk: true }
	);

	Patcher.after(SearchResults, 'useSettingSearchResults', (_, __, res) => {
		res = res.filter(result => !Object.values(routes).includes(result));

		Object.keys(routes).filter(key => key !== 'Custom').forEach(key => {
			const queryContainsKeyword = ['Enmity', titles[key]].some(keyword =>
				keyword.toLowerCase().includes(SearchQuery.getSettingSearchQuery().toLowerCase()));

			if (queryContainsKeyword && !res.find(result => result === routes[key])) res.unshift(routes[key]);
		});

		return res;
	});

	Patcher.after(Getters, 'getSettingListSearchResultItems', (_, [settings], res) => {
		res = res.filter(item => !Object.values(routes).includes(item.setting));

		Object.keys(routes).filter(x => x !== 'Custom').reverse().forEach(key => {
			if (settings.includes(routes[key])) {
				res.unshift({
					type: 'setting_search_result',
					searchResultData: Constants.SETTING_RENDERER_CONFIG[routes[key]],
					setting: routes[key],
					title: titles[key],
					breadcrumbs: ['Enmity'],
					icon: icons[key]
				});

				res.forEach((value, index: number, parent) => {
					value.index = index;
					value.total = parent.length;
				});
			};
		});

		return res;
	});
}