/**
 * setup.js — runs before each test suite.
 * Mocks native modules that cannot run in a Node.js / Jest environment.
 */

// ─── BackHandler (required by React Navigation) ──────────────────────────────
const mockBackHandler = {
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  exitApp: jest.fn(),
};
jest.mock('react-native/Libraries/Utilities/BackHandler', () => mockBackHandler);

// ─── Firebase ────────────────────────────────────────────────────────────────
jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: {
    apps: [],
    initializeApp: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = () => ({
    currentUser: null,
    onAuthStateChanged: jest.fn(),
    signInWithPhoneNumber: jest.fn(),
    signOut: jest.fn(),
  });
  mockAuth.PhoneAuthProvider = { credential: jest.fn() };
  return { __esModule: true, default: mockAuth };
});

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(),
    onMessage: jest.fn(),
    requestPermission: jest.fn(),
  }),
}));

jest.mock('@react-native-firebase/app-check', () => ({
  __esModule: true,
  default: () => ({
    activate: jest.fn(),
    getToken: jest.fn(),
  }),
}));

// ─── Geolocation ─────────────────────────────────────────────────────────────
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
  requestAuthorization: jest.fn(),
}));

// ─── AsyncStorage ────────────────────────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ─── Vector Icons ────────────────────────────────────────────────────────────
const createIconMock = () => {
  const MockIcon = () => null; // functional component stub
  MockIcon.loadFont = jest.fn(() => Promise.resolve());
  MockIcon.hasIcon = jest.fn(() => true);
  MockIcon.getRawGlyphMap = jest.fn(() => ({}));
  MockIcon.getImageSource = jest.fn(() => Promise.resolve(null));
  return MockIcon;
};

jest.mock('react-native-vector-icons/MaterialIcons', () => createIconMock());
jest.mock('react-native-vector-icons/Ionicons', () => createIconMock());
jest.mock('react-native-vector-icons/FontAwesome', () => createIconMock());
jest.mock('react-native-vector-icons/FontAwesome5', () => createIconMock());
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => createIconMock());
jest.mock('react-native-vector-icons/Feather', () => createIconMock());
jest.mock('react-native-vector-icons/AntDesign', () => createIconMock());
jest.mock('react-native-vector-icons/Entypo', () => createIconMock());
jest.mock('react-native-vector-icons/EvilIcons', () => createIconMock());
jest.mock('react-native-vector-icons/SimpleLineIcons', () => createIconMock());

// ─── Reanimated ──────────────────────────────────────────────────────────────
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// ─── Gesture Handler ─────────────────────────────────────────────────────────
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    GestureHandlerRootView: View,
    gestureHandlerRootHOC: jest.fn(x => x),
    Directions: {},
  };
});

// ─── Safe Area Context ───────────────────────────────────────────────────────
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const View = require('react-native/Libraries/Components/View/View');
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  };
});

// ─── React Navigation ────────────────────────────────────────────────────────
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useIsFocused: () => true,
  };
});

// ─── WebView ─────────────────────────────────────────────────────────────────
jest.mock('react-native-webview', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    __esModule: true,
    default: View,
    WebView: View,
  };
});

// ─── Restart ─────────────────────────────────────────────────────────────────
jest.mock('react-native-restart', () => ({
  Restart: jest.fn(),
}));

// ─── React Native Screens ────────────────────────────────────────────────────
// Must be enabled before any navigation renders; missing mock causes
// "Cannot read properties of undefined (reading 'Consumer')" in StackView
jest.mock('react-native-screens', () => {
  const RealScreens = jest.requireActual('react-native-screens');
  RealScreens.enableScreens(false);
  return RealScreens;
});

// ─── React Navigation Stack ──────────────────────────────────────────────────
// Shallow-mock the stack navigator so the full native screen stack isn't
// rendered during the unit test (avoids StackView.Consumer crash).
jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
      Screen: () => null,
    }),
    TransitionPresets: {},
    CardStyleInterpolators: {},
    HeaderStyleInterpolators: {},
  };
});

// ─── React Navigation Bottom Tabs ────────────────────────────────────────────
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
      Screen: () => null,
    }),
  };
});

// ─── React Navigation Drawer ─────────────────────────────────────────────────
jest.mock('@react-navigation/drawer', () => {
  const React = require('react');
  return {
    createDrawerNavigator: () => ({
      Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
      Screen: () => null,
    }),
  };
});

