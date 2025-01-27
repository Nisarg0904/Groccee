import * as React from "react";
import { useState } from "react";
import { Animation, CoreTypes } from "@nativescript/core";
import { styles } from "./BottomNav.styles";

export function BottomNav({ navigation }) {
  const [activeTab, setActiveTab] = useState("ViewGroceries");

  const animatePress = (view) => {
    return new Animation([{
      target: view,
      scale: { x: 0.9, y: 0.9 },
      duration: 100,
      curve: CoreTypes.AnimationCurve.easeInOut
    }, {
      target: view,
      scale: { x: 1, y: 1 },
      duration: 100,
      curve: CoreTypes.AnimationCurve.easeInOut
    }]).play();
  };

  const handleNavigation = (route, view) => {
    setActiveTab(route);
    animatePress(view).then(() => {
      navigation.navigate(route);
    });
  };

  const getNavItemStyle = (tabName) => ({
    ...styles.navItem,
    ...(activeTab === tabName && styles.activeNavItem)
  });

  return (
    <gridLayout rows="*" columns="*, *, *, *, *" style={styles.container}>
      <flexboxLayout 
        col={0} 
        style={getNavItemStyle("ViewGroceries")} 
        onTap={(args) => handleNavigation("ViewGroceries", args.object)}
      >
        <label text="&#xf015;" className="fas" style={styles.icon} />
        <label text="Groceries" style={styles.label} />
      </flexboxLayout>
      
      <flexboxLayout 
        col={1} 
        style={getNavItemStyle("Inventory")}
        onTap={(args) => handleNavigation("Inventory", args.object)}
      >
        <label text="&#xf466;" className="fas" style={styles.icon} />
        <label text="Inventory" style={styles.label} />
      </flexboxLayout>
      
      <flexboxLayout 
        col={2} 
        style={styles.centerButton}
        onTap={(args) => handleNavigation("AddGrocery", args.object)}
      >
        <label text="&#xf067;" className="fas" style={styles.plusIcon} />
      </flexboxLayout>
      
      <flexboxLayout 
        col={3} 
        style={getNavItemStyle("ShoppingList")}
        onTap={(args) => handleNavigation("ShoppingList", args.object)}
      >
        <label text="&#xf07a;" className="fas" style={styles.icon} />
        <label text="Shopping" style={styles.label} />
      </flexboxLayout>
      
      <flexboxLayout 
        col={4} 
        style={getNavItemStyle("ProfileSetup")}
        onTap={(args) => handleNavigation("ProfileSetup", args.object)}
      >
        <label text="&#xf007;" className="fas" style={styles.icon} />
        <label text="Profile" style={styles.label} />
      </flexboxLayout>
    </gridLayout>
  );
}