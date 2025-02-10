import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/WelcomePageStyles';


const BottomNav = ({ navigation, route }) => {
  const currentRoute = route?.name;

  const isActive = (routeName) => {
    if (routeName === 'MainMenu' && currentRoute === 'MainMenu') return true;
    if (routeName === 'ShoppingLists' && currentRoute === 'ShoppingLists') return true;
    if (routeName === 'ViewGroceries' && currentRoute === 'ViewGroceries') return true;
    if (routeName === 'Wastage' && currentRoute === 'Wastage') return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.navItem} onPress={() => navigation.navigate('MainMenu')}>
        <Ionicons 
          name={isActive('MainMenu') ? "home" : "home-outline"} 
          size={24} 
          color={isActive('MainMenu') ? "#FF4141" : "#fff"} 
        />
        <Text style={[styles.label, isActive('MainMenu') && styles.activeLabel]}>Home</Text>
      </Pressable>
      
      <Pressable style={styles.navItem} onPress={() => navigation.navigate('ShoppingLists', { status: 'unbought' })}>
        <Ionicons 
          name={isActive('ShoppingLists') ? "cart" : "cart-outline"} 
          size={24} 
          color={isActive('ShoppingLists') ? "#FF4141" : "#fff"} 
        />
        <Text style={[styles.label, isActive('ShoppingLists') && styles.activeLabel]}>Shopping</Text>
      </Pressable>
      
      <Pressable 
        style={styles.centerButton}
        onPress={() => navigation.navigate('AddGrocery')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
      
      <Pressable style={styles.navItem} onPress={() => navigation.navigate('ViewGroceries')}>
        <Ionicons 
          name={isActive('ViewGroceries') ? "cube" : "cube-outline"} 
          size={24} 
          color={isActive('ViewGroceries') ? "#FF4141" : "#fff"} 
        />
        <Text style={[styles.label, isActive('ViewGroceries') && styles.activeLabel]}>Inventory</Text>
      </Pressable>
      
      <Pressable style={styles.navItem} onPress={() => navigation.navigate('Wastage')}>
        <Ionicons 
          name={isActive('Wastage') ? "bar-chart" : "bar-chart-outline"} 
          size={24} 
          color={isActive('Wastage') ? "#FF4141" : "#fff"} 
        />
        <Text style={[styles.label, isActive('Wastage') && styles.activeLabel]}>Reports</Text>
      </Pressable>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 65,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 8,
  },
  centerButton: {
    backgroundColor: '#FF4141',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  activeLabel: {
    color: '#FF4141',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
};

export default BottomNav;
