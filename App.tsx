import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { View, StatusBar } from 'react-native';
import store from './src/redux/store';
import Router from './src/routing/Router';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { RADIUS } from './src/theme/tokens';
import { useTheme } from './src/utils/useTheme';
import Toast from './src/components/Toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const buildTheme = (T: any) => createTheme({
  lightColors: {
    primary: T.primary,
    background: T.background,
    secondary: T.textSecondary,
  },
  darkColors: {
    primary: T.primary,
    background: T.background,
    secondary: T.textSecondary,
  },
  mode: 'light',
  components: {
    Text: {
      style: {
        fontFamily: 'Cairo, sans-serif',
        color: T.text,
      },
    },
    ListItemTitle: {
      style: {
        fontFamily: 'Cairo, sans-serif',
        fontWeight: '600',
        fontSize: 16,
        color: T.text,
      },
    },
    ListItemSubtitle: {
      style: {
        fontFamily: 'Cairo, sans-serif',
        color: T.textSecondary,
        fontSize: 13,
      },
    },
    ListItem: {
      containerStyle: {
        backgroundColor: T.card,
      },
    },
    ListItemContent: {
      style: {
        backgroundColor: 'transparent',
      },
    },
    Button: {
      buttonStyle: {
        backgroundColor: T.primary,
        paddingVertical: 16,
        borderRadius: RADIUS.lg,
        shadowColor: T.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
      },
      titleStyle: {
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.3,
        fontFamily: 'Cairo, sans-serif',
        color: '#FFFFFF',
      },
    },
    Input: {
      inputStyle: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Cairo, sans-serif',
        color: T.text,
      },
      inputContainerStyle: {
        borderWidth: 1,
        borderColor: T.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: T.card,
      },
      containerStyle: {
        paddingHorizontal: 0,
      },
      labelStyle: {
        fontFamily: 'Cairo, sans-serif',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 6,
        color: T.textSecondary,
      },
      errorStyle: {
        fontFamily: 'Cairo, sans-serif',
      },
    },
    SearchBar: {
      containerStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 0,
      },
      inputContainerStyle: {
        backgroundColor: T.card,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: T.border,
      },
      inputStyle: {
        fontFamily: 'Cairo, sans-serif',
        fontSize: 15,
        color: T.text,
      },
    },
    Divider: {
      style: {
        backgroundColor: T.border,
        height: 1,
      },
    },
    Card: {
      containerStyle: {
        borderRadius: RADIUS.xl,
        backgroundColor: T.card,
        borderWidth: 1,
        borderColor: T.border,
      },
    },
    Header: {
      headerStyle: {
        // rn-web header accepts view styles at runtime
        backgroundColor: T.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: '800',
        fontFamily: 'Cairo, sans-serif',
        fontSize: 18,
        color: '#FFFFFF',
      },
    } as any,
    CheckBox: {
      textStyle: {
        fontFamily: 'Cairo, sans-serif',
        color: T.text,
      },
    },
    Dialog: {
      overlayStyle: {
        backgroundColor: T.card,
        borderRadius: RADIUS.xl,
        borderWidth: 1,
        borderColor: T.border,
      },
    },
  },
});

const DirectionWrapper = ({ children }: any) => {
  const T = useTheme();
  const isRTL = useSelector((state: any) => state.app.isRTL);
  return (
    <View
      // @ts-ignore - dir is a react-native-web only prop, required for RTL mirroring
      dir={isRTL ? 'rtl' : 'ltr'} // rn-web web-only prop for RTL mirroring
      style={{ flex: 1, position: 'relative', backgroundColor: T.background } as any}
    >
      <StatusBar barStyle={T.statusBar as any} backgroundColor={T.background} />
      {children}
      <Toast />
    </View>
  );
};

const ThemedRoot = () => {
  const T = useTheme();
  const theme = React.useMemo(() => buildTheme(T), [T]);
  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: T.background }}>
        <DirectionWrapper>
          <Router />
        </DirectionWrapper>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemedRoot />
    </Provider>
  );
};

export default App;
