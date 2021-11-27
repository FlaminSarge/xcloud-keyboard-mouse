import { PartialTheme, ITheme, createTheme } from '@fluentui/react';

export const xboxColor = '#38a11b';

// https://github.com/microsoft/fluentui/wiki/How-to-apply-theme-to-Fluent-UI-React-components
// https://fluentuipr.z22.web.core.windows.net/heads/master/theming-designer/index.html
export const fluentXboxTheme: ITheme = createTheme({
  palette: {
    themePrimary: '#218f35',
    themeLighterAlt: '#f3fbf4',
    themeLighter: '#d0edd5',
    themeLight: '#aaddb4',
    themeTertiary: '#65bc75',
    themeSecondary: '#329c46',
    themeDarkAlt: '#1e8130',
    themeDark: '#196d28',
    themeDarker: '#12501e',
    neutralLighterAlt: '#ecebe9',
    neutralLighter: '#e8e7e6',
    neutralLight: '#dedddc',
    neutralQuaternaryAlt: '#cfcecd',
    neutralQuaternary: '#c6c5c4',
    neutralTertiaryAlt: '#bebdbc',
    neutralTertiary: '#bab8b7',
    neutralSecondary: '#a3a2a0',
    neutralPrimaryAlt: '#8d8b8a',
    neutralPrimary: '#323130',
    neutralDark: '#605e5d',
    black: '#494847',
    white: '#f3f2f1',
  },
});

export const fluentXboxHeaderTheme: PartialTheme = {
  palette: {
    themePrimary: '#00260e',
    themeLighterAlt: '#000502',
    themeLighter: '#000903',
    themeLight: '#000d05',
    themeTertiary: '#001106',
    themeSecondary: '#001508',
    themeDarkAlt: '#001a09',
    themeDark: '#001e0b',
    themeDarker: '#00220c',
    neutralLighterAlt: '#208b34',
    neutralLighter: '#1f8933',
    neutralLight: '#1e8331',
    neutralQuaternaryAlt: '#1c7a2d',
    neutralQuaternary: '#1b752b',
    neutralTertiaryAlt: '#1a702a',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#218f35',
  },
  semanticColors: {
    menuBackground: fluentXboxTheme.semanticColors.menuBackground,
    menuDivider: fluentXboxTheme.semanticColors.menuDivider,
    menuItemText: fluentXboxTheme.semanticColors.menuItemText,
    menuItemTextHovered: fluentXboxTheme.semanticColors.menuItemTextHovered,
    menuItemBackgroundHovered: fluentXboxTheme.semanticColors.menuItemBackgroundHovered,
    menuItemBackgroundPressed: fluentXboxTheme.semanticColors.menuItemBackgroundPressed,
    menuIcon: fluentXboxTheme.semanticColors.menuIcon,
    menuHeader: fluentXboxTheme.semanticColors.menuHeader,
  },
};
