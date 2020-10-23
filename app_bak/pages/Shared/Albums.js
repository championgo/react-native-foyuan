/* eslint-disable import/no-commonjs */

import * as React from 'react';
import {
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

const COVERS = [
  require('../../assets/album-art-1.jpg'),
  require('../../assets/album-art-2.jpg'),
  require('../../assets/album-art-3.jpg'),
  require('../../assets/album-art-4.jpg'),
  require('../../assets/album-art-5.jpg'),
  require('../../assets/album-art-6.jpg'),
  require('../../assets/album-art-7.jpg'),
  require('../../assets/album-art-8.jpg'),
];

class Albums extends React.PureComponent {
  static propTypes = {
    foo: PropTypes.string,
  };

  componentDidMount() {
    const { foo, dispatch } = this.props;

    // dispatch({
    //   type: "HomeModel/getHomeMeauList",
    //   payload: {},
    //   callback: res => {
    //     console.log(res);


    //   }
    // });

    console.log(1, foo, this.props);
  }

  render() {
    const { foo } = this.props;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}>
        <View>
          <Text>{foo}</Text>
        </View>
        {COVERS.map((source, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Image key={i} source={source} style={styles.cover} />
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#343C46',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cover: {
    width: '50%',
    height: Dimensions.get('window').width / 2,
  },
});

export default Albums;
