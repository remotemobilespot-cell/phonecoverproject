// IP Whitelist Middleware for Admin Routes
export const adminIPWhitelist = (req, res, next) => {
  const allowedIPs = [
    '127.0.0.1',
    '::1',
    'localhost',
    // Add your specific IPs here
    // '192.168.1.100', // Your office IP
    // '203.0.113.10',  // Your home IP
  ];

  const clientIP = req.ip || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.headers['x-forwarded-for']?.split(',')[0];

  console.log('Admin access attempt from IP:', clientIP);

  if (!allowedIPs.includes(clientIP)) {
    console.log('Admin access denied for IP:', clientIP);
    return res.status(403).json({ error: 'Access denied from this location' });
  }

  next();
};

// Time-based access control
export const adminTimeRestriction = (req, res, next) => {
  const now = new Date();
  const hour = now.getHours();
  
  // Only allow admin access during business hours (9 AM - 6 PM)
  if (hour < 9 || hour > 18) {
    return res.status(403).json({ 
      error: 'Admin access is only available during business hours (9 AM - 6 PM)' 
    });
  }
  
  next();
};