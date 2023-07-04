import globalTheme from './theme.json';

export default {
    token: {
        colorPrimary: '#0049ff',
        colorSuccess: '#00943e',
        colorWarning: '#eca20f',
        colorError: '#e34949',
        colorInfo: '#507aec',
        colorPrimaryHover: '#296DFF',
        colorText: '#323335',
        colorTextSecondary: '#64666B',
        colorTextTertiary: '#969AA0',
        colorTextQuaternary: '#BFC1C5',
        colorTextPlaceholder: '#969AA0',
        colorTextDisabled: '#BFC1C5',
        fontSizeHeading1: 40,
        fontSizeHeading2: 36,
        fontSizeHeading3: 32,
        fontSizeHeading4: 28,
        fontSizeHeading5: 24,
        borderRadiusSM: 4,
        borderRadiusLG: 12,
        borderRadiusXS: 2
    },
    components: {
        Button: {
            controlHeightSM: 20
        },
        Tabs: {
            lineWidth: 0,
            lineWidthBold: 4,
            margin: 24
        },
        Card: {
            padding: 10
        },
        Form: {
            ...globalTheme
        },
        Input: {
            ...globalTheme
        },
        InputNumber: {
            ...globalTheme
        },
        Select: {
            ...globalTheme,
            colorFillSecondary: '#fff',
            controlItemBgActive: '#fff'
        },
        Mentions: {
            ...globalTheme
        }
    }
};
