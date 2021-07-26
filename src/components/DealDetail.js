import React from 'react';

import {View, Text, Image, Button, StyleSheet, TouchableOpacity, PanResponder, Animated, Dimensions, Linking, ScrollView} from 'react-native';

import {priceDisplay} from '../util';
import ajax from '../ajax';

class DealDetail extends React.Component {
  imageXPos = new Animated.Value(0);
  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width;
      if (Math.abs(gs.dx) > this.width * 0.4) {
        const direction = Math.sign(gs.dx);
        //-1 for left, 1 for right
        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          duration: 250, 
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        Animated.spring(this.imageXPos, {
          toValue: 0,
        }).start();
      }
    },
  });

  handleSwipe = (indexDirection) => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
      return;
    }
    this.setState((prevState) => ({
      imageIndex: prevState.imageIndex + indexDirection,
    }), () => {
      //next image animation
      this.imageXPos.setValue(indexDirection * this.width);
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
    });
  }

  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };

  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    this.setState({
      deal: fullDeal,
    });
  }

  openDealUrl = () => {
    Linking.openURL(this.state.deal.url)
  }

  render() {
    const {deal} = this.state;

    return (
      <>
        <ScrollView style={styles.deal}>
          <TouchableOpacity onPress={this.props.onBack}>
            <Text style={styles.backLink}>Back</Text>
          </TouchableOpacity>
          <Animated.Image
            {...this.imagePanResponder.panHandlers}
            source={{uri: deal.media[this.state.imageIndex]}}
            style={[{left: this.imageXPos}, styles.image]}
          />
          <View style={styles.detail}>
            <Text style={styles.title}>{deal.title}</Text>
            <View style={styles.footer}>
              <View style={styles.info}>
                <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                <Text style={styles.cause}>{deal.cause.name}</Text>
              </View>
              {deal.user && (
                <View>
                  <Image
                    source={{uri: deal.user.avatar}}
                    style={styles.avatar}
                  />
                  <Text>{deal.user.name}</Text>
                </View>
              )}
            </View>
            <View style={styles.description}>
              <Text>{deal.description}</Text>
            </View>
            <Button title="Buy this deal!" onPress={this.openDealUrl} />
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  deal: {
    marginTop: 20,
    marginBottom: 20,
  },
  backLink: {
    marginBottom: 5,
    marginLeft: 10,
    color: '#22f',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  cause: {
    marginVertical: 10,
  },
  info: {
    alignItems: 'center',
  },
  user: {
    alignItems: 'center',
  },
  price: {
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  description: {
    margin: 10,
    padding: 10,
  },
});

export default DealDetail;
