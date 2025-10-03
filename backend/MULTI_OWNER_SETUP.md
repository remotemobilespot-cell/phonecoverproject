# Multi-Owner Notification System Setup

## Overview
The enhanced notification system supports multiple business owners who can receive order notifications for specific stores or all stores. This is perfect for franchise operations, multi-location businesses, or partnerships.

## Environment Variables Configuration

### Basic Configuration
Set up owners using numbered environment variables:

```bash
# Owner 1 - Receives notifications for all stores (default)
OWNER_1_NAME="John Smith"
OWNER_1_EMAIL="john@printphonecase.com"
OWNER_1_PHONE="+1234567890"
OWNER_1_STORES="all"  # Optional: "all" or leave empty for all stores

# Owner 2 - Receives notifications for specific stores
OWNER_2_NAME="Sarah Johnson" 
OWNER_2_EMAIL="sarah@printphonecase.com"
OWNER_2_PHONE="+1987654321"
OWNER_2_STORES="1,3,5"  # Store IDs 1, 3, and 5 only

# Owner 3 - Email only notifications
OWNER_3_NAME="Mike Chen"
OWNER_3_EMAIL="mike@printphonecase.com"
# No OWNER_3_PHONE means email notifications only
OWNER_3_STORES="2,4"  # Store IDs 2 and 4 only
```

### Advanced Configuration Examples

#### Franchise Setup
```bash
# Corporate Owner - All stores
OWNER_1_NAME="Corporate HQ"
OWNER_1_EMAIL="orders@corporateHQ.com"
OWNER_1_PHONE="+1555000001"
OWNER_1_STORES="all"

# Regional Manager - East Coast stores
OWNER_2_NAME="East Coast Manager"
OWNER_2_EMAIL="east@franchise.com" 
OWNER_2_PHONE="+1555000002"
OWNER_2_STORES="1,2,3,4,5"

# Regional Manager - West Coast stores
OWNER_3_NAME="West Coast Manager"
OWNER_3_EMAIL="west@franchise.com"
OWNER_3_PHONE="+1555000003"
OWNER_3_STORES="6,7,8,9,10"
```

#### Partnership Setup
```bash
# Partner A - Technology stores
OWNER_1_NAME="Tech Partner"
OWNER_1_EMAIL="tech@partnership.com"
OWNER_1_PHONE="+1555111001"
OWNER_1_STORES="1,3,5,7"  # Tech-focused locations

# Partner B - Fashion stores  
OWNER_2_NAME="Fashion Partner"
OWNER_2_EMAIL="fashion@partnership.com"
OWNER_2_PHONE="+1555111002"
OWNER_2_STORES="2,4,6,8"  # Fashion-focused locations
```

## How It Works

### 1. Owner Discovery
The system automatically discovers owners by scanning environment variables:
- Looks for `OWNER_X_EMAIL` patterns (X = 1, 2, 3, etc.)
- Creates owner objects with name, email, phone, and store assignments

### 2. Store Filtering
For each order, the system:
- Identifies the order's store location ID
- Finds owners who should receive notifications for that store
- `OWNER_X_STORES="all"` or empty = receives all store notifications
- `OWNER_X_STORES="1,2,3"` = receives notifications for stores 1, 2, and 3 only

### 3. Notification Delivery
Each relevant owner receives:
- **Personalized Email**: Beautiful HTML email with owner's name and store context
- **SMS Alert** (if phone provided): Concise SMS with order details
- **Parallel Processing**: All notifications sent simultaneously for speed

## Setting Up on Render.com

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add the owner environment variables:

```
OWNER_1_NAME=John Smith
OWNER_1_EMAIL=john@yourcompany.com
OWNER_1_PHONE=+1234567890
OWNER_1_STORES=all

OWNER_2_NAME=Store Manager
OWNER_2_EMAIL=manager@yourcompany.com  
OWNER_2_PHONE=+1987654321
OWNER_2_STORES=1,2,3
```

5. Click "Save Changes" - this will trigger a redeploy

## Testing the System

### Test Notification System
Use the test endpoint to verify configuration:

```bash
curl -X POST https://your-backend.onrender.com/api/orders/test-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "PC-20241215-0001",
    "contact_name": "Test Customer",
    "contact_email": "test@customer.com",
    "phone_model": "iPhone 15 Pro",
    "amount": "29.99",
    "store_location_id": 1
  }'
```

### Check Logs
Monitor your Render logs to see:
- Owner discovery results
- Store filtering logic
- Notification success/failure status

## Troubleshooting

### Common Issues

1. **No notifications sent**
   - Check that `OWNER_X_EMAIL` variables are set
   - Verify `SENDGRID_API_KEY` is configured
   - Check logs for environment variable detection

2. **SMS not working**
   - Ensure phone numbers include country code (+1 for US)
   - Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` are set
   - Check Twilio console for delivery status

3. **Wrong owners receiving notifications**
   - Verify `OWNER_X_STORES` configuration
   - Check that store IDs match your database
   - Review filtering logic in logs

### Debug Mode
The system includes comprehensive logging:
- Owner discovery process
- Store filtering decisions  
- Notification delivery results
- Environment variable validation

## Scaling Considerations

- **Performance**: Notifications are sent in parallel for speed
- **Reliability**: Individual notification failures don't block others
- **Flexibility**: Easy to add/remove owners by updating environment variables
- **Cost Optimization**: SMS only sent to owners with phone numbers configured

## Security Notes

- Never commit environment variables to git
- Use strong, unique passwords for email services
- Regularly rotate API keys
- Monitor notification logs for suspicious activity
- Consider rate limiting for high-volume scenarios

---

**Need help?** Check the system logs or test with the `/test-notifications` endpoint to debug configuration issues.