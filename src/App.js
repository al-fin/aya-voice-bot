import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  ToastAndroid,
  Animated,
} from 'react-native';
import TopImg from '../assets/images/top.svg';
import Avatar from '../assets/images/avatar.png';
import Icon from 'react-native-vector-icons/Entypo';
import Voice from 'react-native-voice';
import TTS from 'react-native-tts';
import Axios from 'axios';

const {width} = Dimensions.get('screen');
// put your sim simi key here
const key = '';

const App = () => {
  const [animatedValue, setAnimationValue] = useState(new Animated.Value(0))
  const [recognized, setRecognized] = useState(false);
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [response, setResponse] = useState('');

  useEffect(() => {
    TTS.setDefaultLanguage('id-ID');
    const ok = Voice.isAvailable();
    if (ok) {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechRecognized = onSpeechRecognized;
      Voice.onSpeechResults = onSpeechResults;
    } else {
      alert('Your device not supported !')
    }
  }, []);


  const onSpeechStart = (e) => {
    setStarted(true);
  };

  const onSpeechRecognized = (e) => {
    setRecognized(true);
  };

  const onSpeechResults = (e) => {
    // setResults(e.value);
    // TTS.speak(e.value[0]);
    // setResponse(e.value[0]);
    // setIsLoading(false);
    Axios.post('https://wsapi.simsimi.com/190410/talk', {
        'utext': e.value[0],
        'lang': 'id',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
      },
    }).then(res => {
        TTS.speak(res.data.atext);
        setResponse(res.data.atext);
        setIsLoading(false);
    }).catch(err => {
        throw new Error(err);
    });
  };

  const resetState = () => {
    setRecognized(false);
    setStarted(false);
    setResults([]);
  };

  const _startRecognition = async (e) => {
    triggerAnimation()
    setIsLoading(true)
    resetState();
    try {
      await Voice.start('id-ID');
      ToastAndroid.showWithGravity('Silahkan bicara !', ToastAndroid.SHORT, ToastAndroid.CENTER,);
    } catch (e) {
      throw new Error(e);
    }
  };

  const triggerAnimation = () => {
    Animated.timing(animatedValue, {
      duration: 500,
      toValue: 1,
    }).start(() => {
      animatedValue.setValue(0);
    });
  };

  const animatedSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [75, 125],
  });

  const animatedOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  return (
    <>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0.3)" barStyle="light-content" />
      <View style={styles.container}>
        <TopImg width={width} height={300}/>
        <View style={[styles.centered, styles.headerWrapper]}>
          <View style={[styles.centered, styles.header]}>
              <View style={styles.txtHeaderWrapper}>
                <Text style={styles.txtHeader}>AYA</Text>
                <Text style={styles.txtHeader}>VOICE BOT</Text>
              </View>
              <View style={styles.avatarWrapper}>
                <Image source={Avatar} style={styles.avatar} />
              </View>
          </View>
        </View>
        <View style={[styles.centered, styles.txtResultWrapper]}>
          {isLoading ? <Text style={[styles.txtResult, {color: '#AAA'}]}>...</Text>
                     : <Text style={[styles.txtResult]}>{response}</Text> }
        </View>
        <View style={styles.btnWrapper}>
            <Animated.View style={[styles.btnOuter, {
              width: animatedSize,
              height: animatedSize,
              borderRadius: animatedSize,
              opacity: animatedOpacity,
            }]} />
          <TouchableWithoutFeedback onPress={_startRecognition}>
              <View style={styles.btn}>
                <Icon name="mic" size={40} color="#FFF" />
              </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    position: 'relative',
  },
  header: {
    top: -265,
    position: 'absolute',
  },
  txtHeaderWrapper: {
    marginBottom: 15,
  },
  txtHeader: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  avatarWrapper: {
    width: 165,
    height: 165,
    borderRadius: 165,
    position: 'relative',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150,
    position: 'absolute',
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: 100,
  },
  btnOuter: {
    position: 'absolute',
    backgroundColor: 'rgba(64, 140, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    position: 'absolute',
    backgroundColor: 'rgba(64, 140, 255, 1)',
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
  },
  txtResultWrapper: {
    bottom: 0,
  },
  txtResult: {
    fontSize: 40,
    textAlign: 'center',
    color: 'rgba(64, 140, 255, 1)',
    bottom: 175,
  },
});

export default App;
