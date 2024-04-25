import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const translateX = useSharedValue(width / 2 - 50);

  useEffect(() => {
    const initialEnemies = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * (width - 60),
      y: 50 * i,
    }));
    setEnemies(initialEnemies);

    const bulletFiringInterval = setInterval(() => {
      setBullets(bullets => bullets.map(bullet => ({
        ...bullet,
        y: bullet.y - 30
      })).concat({
        x: translateX.value + 40,
        y: height - 150,
      }));
    }, 800 / 2);

    const moveEnemiesInterval = setInterval(() => {
      setEnemies(enemies => enemies.map((enemy) => ({
        ...enemy,
        y: enemy.y + 10,
      })));
    }, 1000 / 10); // 60 FPS
  
    return () => {
      clearInterval(moveEnemiesInterval);
      clearInterval(bulletFiringInterval);
    };
  }, []);

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX + (width / 2 - 50);
    },
  });

  const spaceshipStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {enemies.map((enemy) => (
          <Image
            key={enemy.id}
            source={require('./assets/Enemy.png')}
            style={[styles.enemy, { left: enemy.x, top: enemy.y }]}
          />
        ))}
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.spaceship, spaceshipStyle]}>
            <Image source={require('./assets/SpaceShip.png')} style={styles.image} />
          </Animated.View>
        </PanGestureHandler>
        {bullets.map((bullet, index) => (
          <Animated.View
            key={index}
            style={[styles.bullet, {
              left: bullet.x,
              top: bullet.y
            }]}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', 
  },
  spaceship: {
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  bullet: {
    position: 'absolute',
    width: 10,
    height: 20,
    backgroundColor: 'red',
    zIndex: 1,
  },
  enemy: {
    position: 'absolute',
    width: 50,
    height: 50,
  }
});

export default App;
