import { ViewStyle, StyleSheet, useColorScheme, StatusBar } from 'react-native';
import { FC, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomSafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({ children, style }) => {
  const colorScheme = useColorScheme(); 

  const isDarkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? 'black' : 'white' },
          style,
        ]}
        
      >
        {children}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomSafeAreaView;
