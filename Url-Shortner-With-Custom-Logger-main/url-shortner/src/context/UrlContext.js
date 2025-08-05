"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { logger, LOG_CATEGORIES } from '../utils/logger';

const UrlContext = createContext();

export const useUrlContext = () => useContext(UrlContext);

export const UrlProvider = ({ children }) => {
  // Load shortened URLs from localStorage on initialization
  const [shortenedUrls, setShortenedUrls] = useState(() => {
    if (typeof window === 'undefined') return []; // Handle server-side rendering
    
    try {
      const storedUrls = localStorage.getItem('shortenedUrls');
      if (storedUrls) {
        // Parse stored URLs and convert date strings back to Date objects
        const parsedUrls = JSON.parse(storedUrls);
        logger.info('state', 'Loaded URLs from localStorage', { count: parsedUrls.length });
        return parsedUrls.map(url => ({
          ...url,
          expiryDate: new Date(url.expiryDate),
          createdAt: new Date(url.createdAt)
        }));
      }
    } catch (error) {
      logger.error('state', 'Error loading shortened URLs from localStorage', error);
      console.error('Error loading shortened URLs from localStorage', error);
    }
    return [];
  });

  // Function to generate a random shortcode
  const generateShortcode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortcode = '';
    for (let i = 0; i < 6; i++) {
      shortcode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    logger.debug('utils', 'Generated shortcode', { shortcode });
    return shortcode;
  };

  // Function to check if a shortcode is unique
  const isUniqueShortcode = (shortcode) => {
    const isUnique = !shortenedUrls.some(url => url.shortcode === shortcode);
    logger.debug('utils', 'Checked shortcode uniqueness', { shortcode, isUnique });
    return isUnique;
  };

  // Function to add a new shortened URL
  const addShortenedUrl = (originalUrl, validity = 30, customShortcode = null) => {
    // Validate inputs
    if (!originalUrl) {
      logger.warn('component', 'URL shortening failed - missing original URL');
      throw new Error('Original URL is required');
    }

    // Try to use custom shortcode if provided
    let shortcode = customShortcode;
    
    // If no custom shortcode or it's not unique, generate a new one
    if (!shortcode || !isUniqueShortcode(shortcode)) {
      if (shortcode && !isUniqueShortcode(shortcode)) {
        logger.warn('component', 'Custom shortcode already in use', { shortcode });
        throw new Error('The provided shortcode is already in use');
      }
      
      // Generate a unique shortcode
      do {
        shortcode = generateShortcode();
      } while (!isUniqueShortcode(shortcode));
    }

    // Create expiration date (current time + validity in minutes)
    const now = new Date();
    const expiryDate = new Date(now.getTime() + validity * 60000);

    // Create new shortened URL object
    const newUrl = {
      id: Date.now().toString(),
      originalUrl,
      shortcode,
      expiryDate: expiryDate.toISOString(), // Store as ISO string for better serialization
      createdAt: now.toISOString(),         // Store as ISO string for better serialization
      clicks: 0,
    };

    logger.info('component', 'Created shortened URL', { 
      shortcode,
      originalUrl,
      validity,
      expiryDate: expiryDate.toISOString()
    });

    // Add to state
    setShortenedUrls(prev => {
      const newUrls = [...prev, newUrl];
      
      // Immediately save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('shortenedUrls', JSON.stringify(newUrls));
        logger.debug('state', 'Saved URLs to localStorage', { count: newUrls.length });
      }
      
      return newUrls;
    });
    
    return {
      ...newUrl,
      expiryDate: expiryDate, // Return as Date object for immediate use
      createdAt: now          // Return as Date object for immediate use
    };
  };

  // Function to get URL by shortcode
  const getUrlByShortcode = (shortcode) => {
    // Check in current state first
    const url = shortenedUrls.find(url => url.shortcode === shortcode);
    
    if (url) {
      logger.debug('component', 'Found URL by shortcode in state', { shortcode });
    }
    
    // If the URL was not found in state but we have access to localStorage,
    // try to get it directly from localStorage as a fallback
    if (!url && typeof window !== 'undefined') {
      try {
        const storedUrls = localStorage.getItem('shortenedUrls');
        if (storedUrls) {
          const parsedUrls = JSON.parse(storedUrls);
          const storedUrl = parsedUrls.find(u => u.shortcode === shortcode);
          
          if (storedUrl) {
            logger.debug('component', 'Found URL by shortcode in localStorage', { shortcode });
            // Convert ISO strings to Date objects before returning
            return {
              ...storedUrl,
              expiryDate: new Date(storedUrl.expiryDate),
              createdAt: new Date(storedUrl.createdAt)
            };
          }
        }
      } catch (error) {
        logger.error('state', 'Error reading from localStorage', error);
        console.error('Error reading from localStorage', error);
      }
    }
    
    if (!url) {
      logger.warn('component', 'URL not found by shortcode', { shortcode });
    }
    
    return url;
  };

  // Function to increment click count for a URL
  const incrementClickCount = (shortcode) => {
    setShortenedUrls(prev => {
      const newUrls = prev.map(url =>
        url.shortcode === shortcode
          ? { ...url, clicks: url.clicks + 1 }
          : url
      );
      
      // Log click event
      const clickedUrl = newUrls.find(url => url.shortcode === shortcode);
      if (clickedUrl) {
        logger.info('component', 'URL click recorded', { 
          shortcode, 
          clicks: clickedUrl.clicks,
          originalUrl: clickedUrl.originalUrl
        });
      }
      
      // Update localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem('shortenedUrls', JSON.stringify(newUrls));
      }
      
      return newUrls;
    });
  };

  // Check if URL is expired
  const isUrlExpired = (url) => {
    if (!url) return true;
    const expired = new Date() > new Date(url.expiryDate);
    
    if (expired) {
      logger.debug('component', 'URL expiration check', { 
        shortcode: url.shortcode, 
        expired, 
        expiryDate: url.expiryDate 
      });
    }
    
    return expired;
  };
  
  // Filter out expired URLs from display (but keep them in storage for reference)
  const activeUrls = shortenedUrls.filter(url => !isUrlExpired(url));

  // Save to localStorage whenever shortenedUrls changes
  useEffect(() => {
    if (typeof window !== 'undefined' && shortenedUrls.length > 0) {
      localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
      logger.debug('state', 'Updated URLs in localStorage', { count: shortenedUrls.length });
    }
  }, [shortenedUrls]);

  return (
    <UrlContext.Provider value={{
      shortenedUrls,
      activeUrls,
      addShortenedUrl,
      getUrlByShortcode,
      incrementClickCount,
      isUrlExpired
    }}>
      {children}
    </UrlContext.Provider>
  );
};
