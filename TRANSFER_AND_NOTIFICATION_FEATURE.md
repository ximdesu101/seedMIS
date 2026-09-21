# Transfer to Inventory & Low Stock Notification Features

## 🎯 Features Implemented

### 1. **Smart Price Dialog on Transfer**
- When transferring a "Ready" batch from Production to Inventory, a dialog appears
- **For NEW seedlings (not in inventory):** Price input field is shown and required
- **For EXISTING seedlings:** No price input needed, quantity is simply added to existing stock

### 2. **Smart Inventory Management**
- If seedling type already exists in inventory: Only the quantity is updated (price unchanged)
- If seedling type is new: Creates new inventory entry with user-provided price
- Total quantity automatically accumulates when same seedling type is transferred multiple times

### 3. **Low Stock Email Notifications**
- Automatically sends email alerts to ALL admin accounts when:
  - `total_quantity <= min_stock_level`
  - `min_stock_level > 0` (prevents notification if min level not set)
- Email sent after:
  - Transferring production to inventory
  - Manually updating inventory quantity
- Email includes:
  - Seedling type and classification
  - Current stock vs minimum level
  - Location and price
  - Recommended actions

---

## 📋 How It Works

### **Transfer Flow:**

#### Scenario A: New Seedling (First Time Transfer)
```
Production: Mahogany - Ready Stage - 1000 pieces
         ↓ [Click Transfer to Inventory]
         ↓ 
   Dialog Opens:
   ┌─────────────────────────────────────┐
   │ Transfer to Inventory               │
   │                                     │
   │ Seedling: Mahogany (Tree)          │
   │ Quantity: 1000 pieces              │
   │ Price per Unit: [₱3.00] *Required  │
   │                                     │
   │ "This seedling doesn't exist yet"   │
   └─────────────────────────────────────┘
         ↓ [Transfer]
         ↓
Inventory:
- Mahogany: 1000 pieces @ ₱3.00
```

#### Scenario B: Existing Seedling (Second Transfer)
```
Inventory: Mahogany - 500 pieces @ ₱3.00
Production: Mahogany - Ready Stage - 800 pieces
         ↓ [Click Transfer to Inventory]
         ↓ 
   Dialog Opens:
   ┌─────────────────────────────────────┐
   │ Transfer to Inventory               │
   │                                     │
   │ Seedling: Mahogany (Tree)          │
   │ Quantity: 800 pieces               │
   │                                     │
   │ "This seedling already exists.      │
   │  Quantity will be added."          │
   └─────────────────────────────────────┘
         ↓ [Transfer]
         ↓
Inventory:
- Mahogany: 1300 pieces @ ₱3.00 (price unchanged)
  (500 + 800 = 1300)
```

### **Low Stock Notification Flow:**

```
Inventory: Mahogany
- Total Quantity: 50 pieces
- Min Stock Level: 100 pieces
         ↓
   50 <= 100 ? YES!
         ↓
   Email sent to ALL admins:
   ┌─────────────────────────────────────┐
   │ ⚠️ Low Stock Alert                  │
   │                                     │
   │ Mahogany inventory has fallen       │
   │ below minimum level.                │
   │                                     │
   │ Current: 50 pieces                  │
   │ Minimum: 100 pieces                 │
   │                                     │
   │ Recommended Actions:                │
   │ - Start new production batch        │
   │ - Check existing batches            │
   └─────────────────────────────────────┘
```

---

## 🔧 Technical Details

### **Frontend Changes:**

1. **TransferToInventory.jsx** (NEW)
   - Dialog component with conditional price input
   - `needsPriceInput` prop controls price field visibility
   - Sends `price_per_unit` only when needed

2. **ProductionTable.jsx**
   - Fetches inventory list on mount
   - Checks if seedling exists via `checkIfSeedlingExists()`
   - Passes `needsPriceInput` prop to TransferToInventory component

3. **productionService.js**
   - Updated `transferToInventory()` to accept optional `transferData` parameter

### **Backend Changes:**

1. **ProductionController.php**
   - `transferToInventory()`:
     - Accepts optional `price_per_unit` in request
     - Validates price only for new seedlings
     - Adds quantity to existing inventory or creates new entry
     - Calls `checkLowStockAndNotify()` after transfer
   - `checkLowStockAndNotify()`:
     - Checks if `total_quantity <= min_stock_level`
     - Fetches all admins and sends email to each
     - Errors logged but don't fail main operation

2. **InventoryController.php**
   - `update()`:
     - Calls `checkLowStockAndNotify()` after quantity update
   - `checkLowStockAndNotify()`:
     - Same logic as ProductionController

3. **LowStockAlert.php** (NEW - Mailable)
   - Email template wrapper
   - Subject: "⚠️ Low Stock Alert - {Seedling Type}"

4. **low-stock-alert.blade.php** (NEW - Email View)
   - Professional HTML email template
   - Displays inventory details
   - Shows current vs minimum stock
   - Provides recommended actions

---

## 📧 Email Configuration

Email is configured in `.env`:
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=reyesjerald638@gmail.com
MAIL_PASSWORD="jlmzdbeugmhszsjj"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="reyesjerald638@gmail.com"
MAIL_FROM_NAME="SeedMIS System"
```

---

## 🧪 Testing Instructions

### **Test 1: New Seedling Transfer (With Price)**
1. Go to Production page
2. Create a new batch (e.g., "Acacia")
3. Update stage to "Ready"
4. Click "Transfer to Inventory"
5. **Expected:** Dialog shows with price input field
6. Enter price (e.g., ₱5.00)
7. Click "Transfer to Inventory"
8. **Expected:** 
   - Batch removed from Production
   - New entry created in Inventory with provided price
   - Success message shown

### **Test 2: Existing Seedling Transfer (No Price)**
1. Transfer a batch of "Mahogany" to inventory (first time with price)
2. Create another "Mahogany" batch in Production
3. Update stage to "Ready"
4. Click "Transfer to Inventory"
5. **Expected:** Dialog shows WITHOUT price input field
6. Click "Transfer to Inventory"
7. **Expected:**
   - Quantity added to existing Mahogany inventory
   - Price remains unchanged
   - Total quantity = old quantity + new quantity

### **Test 3: Low Stock Email Notification**
1. Go to Inventory page
2. Update an inventory item:
   - Set Min Stock Level: 100
   - Set Total Quantity: 50 (below minimum)
3. Click "Update Inventory"
4. **Expected:**
   - Update successful
   - Check admin email inbox for low stock alert
   - Email contains inventory details and warnings

### **Test 4: Low Stock After Transfer**
1. Set inventory Min Stock Level to 500 for "Narra"
2. Inventory has 400 pieces (below minimum)
3. Transfer a Ready batch of "Narra" with 50 pieces from Production
4. **Expected:**
   - Transfer successful
   - New total: 450 pieces (still below 500)
   - Low stock email sent to admins

### **Test 5: No Email When Above Minimum**
1. Set inventory Min Stock Level to 100
2. Set Total Quantity to 200 (above minimum)
3. **Expected:** No email sent

---

## 🎨 UI/UX Flow

### **Production Table:**
```
┌─────────────────────────────────────────────────┐
│ Production Batches                              │
├─────────────────────────────────────────────────┤
│ Mahogany | Ready | 1000 pcs | [Actions ▼]      │
│                              └─ Transfer to Inv │
└─────────────────────────────────────────────────┘
```

### **Transfer Dialog (New):**
```
┌─────────────────────────────────────┐
│ Transfer to Inventory               │
├─────────────────────────────────────┤
│ Seedling Type: Mahogany (Tree)      │
│ Quantity to Transfer: 1,000 pieces  │
│                                     │
│ Price per Unit (₱) *                │
│ [3.00                          ] ₱  │
│                                     │
│ ℹ️ This seedling type doesn't exist │
│   in inventory yet. Set a price.   │
├─────────────────────────────────────┤
│ [Cancel] [Transfer to Inventory]    │
└─────────────────────────────────────┘
```

### **Transfer Dialog (Existing):**
```
┌─────────────────────────────────────┐
│ Transfer to Inventory               │
├─────────────────────────────────────┤
│ Seedling Type: Mahogany (Tree)      │
│ Quantity to Transfer: 800 pieces    │
│                                     │
│ ℹ️ This seedling already exists in  │
│   inventory. Quantity will be added.│
│   Price remains unchanged.          │
├─────────────────────────────────────┤
│ [Cancel] [Transfer to Inventory]    │
└─────────────────────────────────────┘
```

### **Low Stock Email:**
```
┌─────────────────────────────────────┐
│          ⚠️                          │
│      Low Stock Alert                │
├─────────────────────────────────────┤
│ Action Required: Seedling Low       │
│                                     │
│ Mahogany has reached minimum level  │
│                                     │
│ Inventory Details:                  │
│ • Seedling Type: Mahogany           │
│ • Classification: Tree              │
│ • Current Stock: 50 pieces          │
│ • Minimum Level: 100 pieces         │
│ • Location: Greenhouse A            │
│ • Price: ₱3.00                      │
│                                     │
│ Recommended Actions:                │
│ • Review current production batches │
│ • Start new production if needed    │
│ • Check batches close to Ready      │
└─────────────────────────────────────┘
```

---

## 🚀 Benefits

1. **Efficiency**: No need to manually enter price for every transfer of the same seedling
2. **Consistency**: Price remains consistent across multiple transfers
3. **Automation**: Quantities automatically accumulate
4. **Proactive**: Email alerts ensure admins never miss low stock situations
5. **Scalability**: All admins are notified, ensuring team awareness
6. **Safety**: Email errors don't break main operations

---

## 📝 Notes

- Price is immutable after first transfer (can only be changed via Inventory update form)
- Reserved quantity remains at 0 for now (future feature for client orders)
- Email notifications are asynchronous and won't delay transfer operation
- Low stock check only happens when `min_stock_level > 0`
- All admin accounts in the database receive notifications

---

## ✅ Implementation Status

- ✅ Price dialog component created
- ✅ Smart price input (conditional display)
- ✅ Backend transfer logic updated
- ✅ Quantity accumulation for existing seedlings
- ✅ Low stock detection implemented
- ✅ Email notification system integrated
- ✅ Professional email template designed
- ✅ Error handling and logging added

**Status:** Ready for production use! 🎉
