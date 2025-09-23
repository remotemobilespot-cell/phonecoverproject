import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Admin credentials (in production, store these securely in database)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '$2b$10$8K5QhJz8JRy5qPmY8pGkCeB6HvqGH1tKKq2fD4L2J2mEQ1mI3xOei'; // "admin123" hashed
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// Middleware to verify admin JWT token
export const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Admin login attempt for username:', username);

    // Validate credentials
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: ADMIN_USERNAME,
        role: 'admin',
        loginTime: new Date().toISOString()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        username: ADMIN_USERNAME,
        role: 'admin',
        loginTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Verify token endpoint
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

// Get dashboard statistics
router.get('/dashboard-stats', verifyAdminToken, async (req, res) => {
  try {
    // Get order statistics
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders
      .filter(o => o.payment_status === 'completed')
      .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

    // Get recent orders (last 10)
    const recentOrders = orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    // Orders by fulfillment method
    const fulfillmentStats = {
      pickup: orders.filter(o => o.fulfillment_method === 'pickup').length,
      delivery: orders.filter(o => o.fulfillment_method === 'delivery').length
    };

    // Orders by case type
    const caseTypeStats = {
      regular: orders.filter(o => o.case_type === 'regular' || !o.case_type).length,
      magsafe: orders.filter(o => o.case_type === 'magsafe').length
    };

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue.toFixed(2),
        fulfillmentStats,
        caseTypeStats,
        recentOrders
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard stats' 
    });
  }
});

// Get all orders with pagination and filtering
router.get('/orders', verifyAdminToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      fulfillment_method, 
      payment_status,
      search 
    } = req.query;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status) query = query.eq('status', status);
    if (fulfillment_method) query = query.eq('fulfillment_method', fulfillment_method);
    if (payment_status) query = query.eq('payment_status', payment_status);
    
    // Search functionality
    if (search) {
      query = query.or(`contact_name.ilike.%${search}%,contact_email.ilike.%${search}%,phone_model.ilike.%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query
      .range(from, to)
      .order('created_at', { ascending: false });

    const { data: orders, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// Get single order
router.get('/orders/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order' 
    });
  }
});

// Update order status
router.put('/orders/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update order' 
    });
  }
});

// Delete order
router.delete('/orders/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete order' 
    });
  }
});

// Get system information
router.get('/system', verifyAdminToken, async (req, res) => {
  try {
    // Get database info
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    const systemInfo = {
      server: {
        uptime: process.uptime(),
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY),
        stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
        sendgridConfigured: !!process.env.SENDGRID_API_KEY
      },
      database: {
        connected: !error,
        tables: tables?.map(t => t.table_name) || []
      }
    };

    res.json({
      success: true,
      systemInfo
    });

  } catch (error) {
    console.error('System info error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch system info' 
    });
  }
});

// Clear all orders (DANGER!)
router.delete('/orders/clear-all', verifyAdminToken, async (req, res) => {
  try {
    const { confirm } = req.body;

    if (confirm !== 'DELETE_ALL_ORDERS') {
      return res.status(400).json({ 
        success: false, 
        error: 'Confirmation string required' 
      });
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .neq('id', 0); // Delete all orders

    if (error) throw error;

    res.json({
      success: true,
      message: 'All orders cleared successfully'
    });

  } catch (error) {
    console.error('Clear orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to clear orders' 
    });
  }
});

// Export orders to CSV
router.get('/orders/export', verifyAdminToken, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert to CSV
    const csvHeaders = [
      'ID', 'Customer Name', 'Email', 'Phone', 'Phone Model', 
      'Case Type', 'Amount', 'Status', 'Payment Status', 
      'Fulfillment Method', 'Created At'
    ];

    const csvRows = orders.map(order => [
      order.id,
      order.contact_name || '',
      order.contact_email || '',
      order.contact_phone || '',
      order.phone_model || '',
      order.case_type || 'regular',
      order.amount || '0',
      order.status || '',
      order.payment_status || '',
      order.fulfillment_method || '',
      order.created_at || ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders-export.csv"');
    res.send(csvContent);

  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to export orders' 
    });
  }
});

export default router;