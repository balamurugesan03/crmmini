const themeConfig = {
    token: {
        // Primary colors - Professional blue palette
        colorPrimary: '#2563eb',
        colorInfo: '#3b82f6',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',

        // Background colors
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f8fafc',

        // Border and shadows
        borderRadius: 8,
        borderRadiusLG: 12,
        borderRadiusSM: 6,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

        // Typography
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: 14,
        fontSizeHeading1: 38,
        fontSizeHeading2: 30,
        fontSizeHeading3: 24,
        fontSizeHeading4: 20,
        fontSizeHeading5: 16,

        // Spacing
        padding: 16,
        paddingLG: 24,
        paddingSM: 12,
        paddingXS: 8,
        margin: 16,
        marginLG: 24,
        marginSM: 12,
        marginXS: 8,

        // Line heights
        lineHeight: 1.5714285714285714,
        lineHeightHeading1: 1.2105263157894737,
        lineHeightHeading2: 1.2666666666666666,
        lineHeightHeading3: 1.3333333333333333,
        lineHeightHeading4: 1.4,
        lineHeightHeading5: 1.5,

        // Control heights
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
    },
    components: {
        Button: {
            algorithm: true,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingContentHorizontal: 20,
            fontWeight: 500,
        },
        Card: {
            paddingLG: 24,
            borderRadiusLG: 12,
            boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
        Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
            rowHoverBg: '#f1f5f9',
            borderColor: '#e2e8f0',
            headerBorderRadius: 8,
        },
        Input: {
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingInline: 12,
        },
        Select: {
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
        },
        Menu: {
            itemBorderRadius: 8,
            itemMarginInline: 8,
            itemPaddingInline: 16,
            iconSize: 18,
        },
        Modal: {
            borderRadiusLG: 16,
            paddingContentHorizontalLG: 24,
        },
        Form: {
            itemMarginBottom: 20,
            verticalLabelPadding: '0 0 8px',
        },
        Tag: {
            borderRadiusSM: 6,
        },
        Layout: {
            siderBg: '#0f172a',
            headerBg: '#ffffff',
            bodyBg: '#f8fafc',
        },
    },
};

export default themeConfig;
