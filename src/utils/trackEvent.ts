// need to make sure window and window.analytics are available before firing off track(),
// so this utility saves us a few lines of code each time
const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (window && window.analytics) {
    return window.analytics.track(event, properties);
  }
  return null;
};

export default trackEvent;
