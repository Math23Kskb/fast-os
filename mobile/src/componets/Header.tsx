import { Menu, LogOut } from 'lucide-react';
import { View, Image, StyleSheet } from 'react-native';

export function Header() {
  return (
    <View style={styles.container}>
      <Menu style={styles.menu} />
      <Image
        source={require('../../assets/images/logo.png')}
        resizeMode="contain"
        style={styles.img}
      />
      <LogOut style={styles.logOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: '38%',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    width: '100%',
  },
  menu: {
    margin: 'auto',
  },
  logOut: {
    margin: 'auto',
  },
});
