import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import Purchases from 'react-native-purchases';

const PremiumScreen = () => {
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [premiums, setPremiums] = useState([]);
  const [weeklyPrice, setWeeklyPrice] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');

  // Base URL for your API
  const apiUrl = 'https://betai-7d1a010ddc04.herokuapp.com/premiums'; // Backend endpoint for premium data

    // Fetch data from the backend
    useEffect(() => {
      const getData = async () => {
        try {
          const response = await axios.get(apiUrl);
          setPremiums(response.data);
        } catch (error) {
          console.error('Error fetching premium data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      getData();
    }, []);

  useEffect(() => {
    // Initialize Purchases
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: 'goog_aDVHfUnffXiWJOVWcXNpuInXMKl' });

    const fetchData = async () => {
      try {
        // Fetch premium data from Heroku API
        const response = await axios.get(apiUrl);
        setPremiums(response.data);

        // Verify Purchases SDK and its methods
        if (!Purchases || typeof Purchases.configure !== 'function') {
          throw new Error('Purchases SDK is not properly imported');
        }

        try {
          // Use getCustomerInfo instead of getCurrentPurchaserInfo
          const customerInfo = await Purchases.getCustomerInfo();
          if (!customerInfo) {
            console.warn('No customer info available');
          }

          const offerings = await Purchases.getOfferings();
          if (!offerings || !offerings.all || !offerings.all["betai"]) {
            console.warn('No offerings found for "betai"');
            return;
          }

          const defaultOffering = offerings.all["betai"];
          const weeklyPackage = defaultOffering.availablePackages?.find(
            (pkg) => pkg.packageType === Purchases.PACKAGE_TYPE.WEEKLY
          );
          const monthlyPackage = defaultOffering.availablePackages?.find(
            (pkg) => pkg.packageType === Purchases.PACKAGE_TYPE.MONTHLY
          );
          
          if (weeklyPackage?.product?.priceString) {
            setWeeklyPrice(weeklyPackage.product.priceString);
          }
          if (monthlyPackage?.product?.priceString) {
            setMonthlyPrice(monthlyPackage.product.priceString);
          }
        } catch (purchasesError) {
          console.error('Error with Purchases SDK:', purchasesError);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle subscription selection
  const handleSubscription = async (packageType) => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.all["betai"]) {
        const defaultOffering = offerings.all["betai"];
        const selectedPackage = defaultOffering.availablePackages.find(
          (pkg) => pkg.packageType === packageType
        );

        if (selectedPackage) {
          await Purchases.purchasePackage(selectedPackage);
          console.log(`Purchased ${packageType} subscription successfully!`);
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  // Render premium games and subscriptions
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>⚽ Match: {item.teamA} vs {item.teamB}</Text>
      <Text style={styles.text}>🏆 League: {item.league}</Text>
      <Text style={styles.text}>🌀 Odds: {item.odds}</Text>
      <Text style={styles.text}>👉 Pick: {item.pick}</Text>
      <Text style={styles.text}>📅 Date: {item.date}</Text>
    </View>
  );

  const SubscriptionDisclaimer = () => (
    <View style={styles.disclaimerContainer}>
      <Text style={styles.disclaimerText}>
        • Subscription will automatically renew unless canceled at least 24 hours before the end of the current period
      </Text>
      <Text style={styles.disclaimerText}>
        • Your account will be charged for renewal within 24 hours prior to the end of the current period
      </Text>
      <Text style={styles.disclaimerText}>
        • You can manage and cancel your subscriptions by going to your account settings on the App Store/Play Store
      </Text>
    </View>
  );

  const SubscriptionCard = ({ type, price, onPress }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.planType}>{type}</Text>
      <Text style={styles.price}>{price}</Text>
      
      <View style={styles.featuresContainer}>
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Unlimited Access to All Games</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Ad-Free Experience</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Premium Support</Text>
        </View>
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Exclusive Rewards</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>
          Start {type}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Choose Your Plan ✨</Text>
        <Text style={styles.subtitle}>Elevate Your Gaming Experience Today!</Text>
      </View>

      <View style={styles.cardsContainer}>
        <SubscriptionCard
          type="Weekly Plan"
          price={weeklyPrice}
          onPress={() => handleSubscription(Purchases.PACKAGE_TYPE.WEEKLY)}
        />
        
        <SubscriptionCard
          type="Monthly Plan"
          price={monthlyPrice}
          onPress={() => handleSubscription(Purchases.PACKAGE_TYPE.MONTHLY)}
        />
      </View>

      <SubscriptionDisclaimer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Light green background
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32', // Darker green for title
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#388E3C', // Medium green for subtitle
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  planType: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32', // Darker green
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#388E3C', // Medium green
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    color: '#4CAF50', // Light green for checkmarks
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  button: {
    backgroundColor: '#2E7D32', // Darker green for buttons
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerContainer: {
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(46, 125, 50, 0.1)', // Transparent green
    borderRadius: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#2E7D32', // Darker green for disclaimer
    marginBottom: 8,
    lineHeight: 16,
  },
});

export default PremiumScreen;