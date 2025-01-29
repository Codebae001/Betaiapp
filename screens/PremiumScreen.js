import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

const PremiumScreen = () => {
  const [premiums, setPremiums] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL for your API
  const apiUrl = 'https://betai-7d1a010ddc04.herokuapp.com/premiums'; // Backend endpoint for premium data

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setPremiums(response.data);
      } catch (error) {
        console.error('Error fetching premium data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render each item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>⚽ Match: {item.teamA} vs {item.teamB}</Text>
      <Text style={styles.text}>🏆 League: {item.league}</Text>
      <Text style={styles.text}>🌀 Odds: {item.odds}</Text>
      <Text style={styles.text}>👉 Pick: {item.pick}</Text>
      <Text style={styles.text}>📅 Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : premiums.length === 0 ? (
        <Text style={styles.noGamesText}>📜 No premium games available. Stay tuned!</Text>
      ) : (
        <FlatList
          data={premiums}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f8ff' },
  card: {
    backgroundColor: '#d4edda',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#155724' },
  text: { fontSize: 14, color: '#155724' },
  noGamesText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default PremiumScreen;
