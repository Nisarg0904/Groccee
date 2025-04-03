import React, { useState } from 'react';
import { View } from 'react-native';
import CreateShoppingListPage from './CreateShoppingListPage';

const CreateShoppingListScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    navigation.goBack();
  };

  const handleSuccess = (newList) => {
    setVisible(false);
    navigation.navigate('AddShoppingListItems', {
      shopping_list_id: newList.shopping_list_id
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CreateShoppingListPage
        visible={visible}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </View>
  );
};

export default CreateShoppingListScreen; 