import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Base URL for your API
  const apiUrl = 'https://betai-7d1a010ddc04.herokuapp.com/history'; // Backend endpoint for history data

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <Text style={styles.text}>📌 Outcome: {item.outcome}</Text>
      <Text style={styles.date}>📅 Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Success Rate Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>93% Success Rate</Text>
        <Text style={styles.bannerSubtext}>Join thousands of winning bettors!</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>2000+</Text>
          <Text style={styles.statLabel}>Predictions Made</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Happy Users</Text>
        </View>
      </View>

      {/* Your existing history/matches display */}
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

      {/* Premium Teaser */}
      <View style={styles.teaserContainer}>
        <Text style={styles.teaserText}>Want to see our full prediction history?</Text>
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={handleUpgradePress}
        >
          <Text style={styles.upgradeButtonText}>Unlock Premium Access</Text>
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
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  teaserContainer: {
    padding: 16,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    alignItems: 'center',
  },
  teaserText: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
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
  date: { fontSize: 14, fontStyle: 'italic', color: '#155724', marginTop: 4 },
  noHistoryText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default HistoryScreen;
