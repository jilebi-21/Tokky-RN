import { useState } from 'react'
import { Appearance, StyleSheet, useColorScheme } from 'react-native'

const dimens = {
	cornerRadius: 20,
}

const lightTheme = {
	...dimens,
	primary_color: '#669900',
	bg: '#ffffff',
	bg_variant: '#fafafa',
	bg_variant2: '#bababa',
	text_color_primary: '#000000',
	text_color_secondary: '#242424',
	text_color_hint: '#8c8c8c',
	divider_color: '',
	danger_color: 'red',
}

const darkTheme = {
	...dimens,
	primary_color: '#669900',
	bg: '#010101',
	bg_variant: '#191919',
	bg_variant2: '#333333',
	text_color_primary: '#ffffff',
	text_color_secondary: '#A6a6a6',
	text_color_hint: '#939393',
	divider_color: '#2a2a2c',
	danger_color: '#FC443A',
}

export default function useTheme() {
	const [currentTheme, setTheme] = useState(useColorScheme())
	Appearance.addChangeListener((obj) => {
		setTheme(obj.colorScheme)
	})

	const theme = currentTheme == 'light' ? lightTheme : darkTheme

	const styles = StyleSheet.create({
		safe_area_container: {
			flex: 1,
			backgroundColor: theme.bg,
		},
		container: {
			flex: 1,
			backgroundColor: theme.bg,
		},
		screenHeaderStyle: {
			backgroundColor: theme.bg,
		},
		screenHeaderTitleStyle: {
			color: theme.text_color_primary,
		},
		textPrimary: {
			color: theme.text_color_primary,
		},
		textSecondary: {
			color: theme.text_color_secondary,
		},
		bgSurface: {
			backgroundColor: theme.bg,
		},
		bgVariant: {
			backgroundColor: theme.bg_variant,
		},
		borderColor: {
			borderColor: theme.bg_variant2,
		},
	})

	return { theme, styles }
}
