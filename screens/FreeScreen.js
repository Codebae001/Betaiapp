import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const FreeScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Base URL for your API
  const apiUrl = 'https://betai-7d1a010ddc04.herokuapp.com/free'; // Backend endpoint for history data

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add navigation handler
  const handleUpgradePress = () => {
    navigation.navigate('Premium');
  };

  // Render each item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>⚽ Match: {item.teamA} vs {item.teamB}</Text>
      <Text style={styles.text}>🏆 League: {item.league}</Text>
      <Text style={styles.text}>📊 Odds: {item.odds}</Text>
      <Text style={styles.text}>🔮 Pick: {item.pick}</Text>
      <Text style={styles.text}>📅 Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.welcomeText}>Welcome to BetAI</Text>
        <Text style={styles.bannerSubtext}>Start with these free predictions!</Text>
      </View>

      {/* Pro Tip Box */}
      <View style={styles.tipContainer}>
        <Text style={styles.tipTitle}>🔥 Pro Tip</Text>
        <Text style={styles.tipText}>
          Unlock 10x more predictions and premium features with our subscription plans!
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : history.length === 0 ? (
        <Text style={styles.noHistoryText}>📜 No match history available. Stay tuned for updates!</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      {/* Teaser Footer with navigation */}
      <View style={styles.teaserFooter}>
        <Text style={styles.teaserText}>Want more winning predictions?</Text>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={handleUpgradePress}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  banner: {
    backgroundColor: '#2E7D32',
    padding: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  tipContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  teaserFooter: {
    padding: 16,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    alignItems: 'center',
  },
  teaserText: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 8,
  },
  upgradeButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  noHistoryText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default FreeScreen;