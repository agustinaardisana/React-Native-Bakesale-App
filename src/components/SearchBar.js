import React from 'react';
import {debounce} from 'lodash';

import {TextInput, StyleSheet} from 'react-native';

class SearchBar extends React.Component {
  state = {
    searchTerm: this.props.initialSearchTerm,
  };

  searchDeals = (searchTerm) => {
    this.props.searchDeals(searchTerm);
    this.inputElement.blur()
  }

  debouncedSearchDeals = debounce(this.searchDeals, 300);

  handleChange = searchTerm => {
    this.setState({searchTerm}, () => {
      this.debouncedSearchDeals(this.state.searchTerm)
    });
  };

  render() {
    return (
      <TextInput
        ref={inputElement => {
          this.inputElement = inputElement;
        }}
        value={this.state.searchTerm}
        style={styles.input}
        placeholder="Search all deals"
        onChangeText={this.handleChange}
      />
    )
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});

export default SearchBar