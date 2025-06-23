import { getAnalytics, logEvent } from 'firebase/analytics';

let analytics = null;

// Initialize analytics safely
export function initAnalytics(app) {
  console.log('Initializing analytics...');
  console.log('App object:', app);
  console.log('Window available:', typeof window !== 'undefined');
  console.log('App available:', !!app);
  
  if (typeof window !== 'undefined' && app) {
    try {
      analytics = getAnalytics(app);
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.log('Analytics initialization failed:', error);
    }
  } else {
    console.log('Analytics not initialized - window or app not available');
    console.log('Window check:', typeof window !== 'undefined');
    console.log('App check:', !!app);
  }
}

// Safe event logging
export function trackEvent(eventName, parameters = {}) {
  console.log('Tracking event:', eventName, parameters);
  console.log('Analytics available:', !!analytics);
  if (analytics) {
    try {
      logEvent(analytics, eventName, parameters);
      console.log('Event tracked successfully');
    } catch (error) {
      console.log('Analytics event failed:', error);
    }
  } else {
    console.log('Analytics not available for tracking');
  }
}

// Track page view
export function trackPageView(pageTitle) {
  console.log('Tracking page view:', pageTitle);
  trackEvent('page_view', {
    page_title: pageTitle,
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
} 