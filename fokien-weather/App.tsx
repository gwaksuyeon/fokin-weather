import React from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import axios from 'axios';

import Loading from './Loading';
import Weather from './Weather';

const API_KEY = "96547a856d415e293a03c598085afc48";

export default class extends React.Component {

  state = {
    isLoading: true,
    temp: 0,
    condition: '',
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const { 
        coords: { latitude, longitude } 
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you. so sad")
    }
  }

  getWeather = async (latitude: number, longitude: number) => {
    const { data: {
      main: {temp},
      weather
    } } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    this.setState({
      isLoading: false,
      temp,
      condition: weather[0].main
    })
  }

  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? <Loading/> : <Weather temp={Math.round(temp)} condition={condition}/>;
  }
}
