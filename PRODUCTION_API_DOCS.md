# Production/Seedlings API Documentation

## Backend Setup Complete ✅

### Database Migration
- **Table**: `productions`
- **Migration File**: `2026_09_17_043130_create_productions_table.php`
- **Status**: Migrated successfully

### Database Schema
```sql
- id (Primary Key)
- batch_id (Unique, String)
- seedling_type (String)
- scientific_name (Nullable String)
- classification (Enum: 'Crafted', 'Seedling')
- date_sown (Date)
- expected_ready (Date)
- quantity_sown (Integer)
- current_quantity (Integer)
- survivability (Decimal: 5,2)
- stage (Enum: 'Germination', 'Seedling', 'Hardening', 'Ready')
- location (String)
- assigned_staff (Nullable String)
- image_url (Nullable String)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Model
- **File**: `app/Models/Production.php`
- **Features**:
  - Mass assignment protection with $fillable
  - Date casting for date fields
  - Automatic timestamps

### Controller
- **File**: `app/Http/Controllers/Api/ProductionController.php`
- **Endpoints**:

#### 1. Get All Productions
```
GET /api/productions
Response: { success: true, data: [...], message: string }
```

#### 2. Get Single Production
```
GET /api/productions/{id}
Response: { success: true, data: {...}, message: string }
```

#### 3. Create Production
```
POST /api/productions
Content-Type: multipart/form-data

Fields:
- batch_id* (required, unique)
- seedling_type* (required)
- scientific_name (optional)
- classification* (required: 'Crafted' or 'Seedling')
- date_sown* (required, format: YYYY-MM-DD)
- expected_ready* (required, format: YYYY-MM-DD)
- quantity_sown* (required, integer >= 1)
- current_quantity* (required, integer >= 0)
- survivability (optional, decimal 0-100)
- stage* (required: 'Germination', 'Seedling', 'Hardening', 'Ready')
- location* (required)
- assigned_staff (optional)
- image (optional, image file: jpeg, png, jpg, gif, max 2MB)

Response: { success: true, data: {...}, message: string }
```

#### 4. Update Production
```
PUT /api/productions/{id}
Content-Type: multipart/form-data

Fields: Same as Create (all optional)
Response: { success: true, data: {...}, message: string }
```

#### 5. Delete Production
```
DELETE /api/productions/{id}
Response: { success: true, message: string }
```

### Image Storage
- **Directory**: `public/uploads/seedlings/`
- **Access URL**: `http://localhost:8000/uploads/seedlings/{filename}`
- **Features**:
  - Automatic image upload handling
  - Old image deletion on update
  - Image deletion on production deletion

### Routes
- **File**: `routes/api.php`
- **Base URL**: `http://localhost:8000/api`
- **Resource Route**: `Route::apiResource('productions', ProductionController::class);`

---

## Frontend Setup Complete ✅

### Service Layer
- **File**: `src/services/productionService.js`
- **Features**:
  - FormData handling for file uploads
  - Automatic multipart/form-data headers
  - Error handling
  - Laravel PUT method workaround (_method field)

### Components Updated

#### 1. AddSeedlings Component
- **File**: `src/pages/production/layout/AddSeedlings.jsx`
- **Features**:
  - Form state management
  - Image upload with preview
  - Image removal
  - Form validation
  - API integration
  - Loading states
  - Error handling
  - Dialog control
  - Auto-refresh after success

#### 2. ProductionTable Component
- **File**: `src/pages/production/layout/ProductionTable.jsx`
- **Features**:
  - API data fetching with useEffect
  - Loading state
  - Image display with fallback
  - Dynamic data rendering
  - Date formatting
  - Search and filter (works with API data)
  - Pagination

### Image Display
- Shows uploaded image from backend
- Fallback to "Photo" placeholder if no image
- Image URL: `http://localhost:8000/{image_url}`
- Handles image load errors gracefully

---

## Testing the Integration

### 1. Start Backend Server
```bash
cd c:\xampp\htdocs\SeedMIS-Server\backend
php artisan serve
```

### 2. Start Frontend
```bash
cd c:\Users\User\Desktop\seedMIS
npm run dev
```

### 3. Test Adding Production
1. Navigate to Production page
2. Click "Add Seedlings"
3. Fill in the form (optional: upload image)
4. Click "Add Seedling"
5. Check if production appears in the table
6. Verify image displays if uploaded

### 4. Verify Database
```bash
cd c:\xampp\htdocs\SeedMIS-Server\backend
php artisan tinker
```
```php
\App\Models\Production::all();
```

---

## Environment Variables

### Backend (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

---

## File Structure

### Backend
```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   │   └── ProductionController.php
│   └── Models/
│       └── Production.php
├── database/migrations/
│   └── 2026_09_17_043130_create_productions_table.php
├── public/uploads/seedlings/
└── routes/
    └── api.php
```

### Frontend
```
src/
├── services/
│   └── productionService.js
└── pages/production/layout/
    ├── AddSeedlings.jsx
    └── ProductionTable.jsx
```

---

## Notes

1. **Image Upload**: Optional field, works with or without images
2. **Validation**: Backend validates all required fields
3. **Error Handling**: Both frontend and backend have error handling
4. **Date Format**: Backend expects YYYY-MM-DD, frontend formats dates automatically
5. **Survivability**: Calculated automatically in table from quantity_sown/current_quantity
6. **Stage Values**: Must match exactly (case-sensitive)
7. **Classification Values**: Must match exactly (case-sensitive)

---

## Troubleshooting

### Issue: Images not uploading
- Check `public/uploads/seedlings/` directory exists
- Check directory permissions (writable)
- Check file size (max 2MB)
- Check file type (jpeg, png, jpg, gif only)

### Issue: CORS errors
- Add CORS headers in Laravel backend
- Check API URL in frontend .env

### Issue: 404 on API calls
- Verify backend server is running
- Check API_URL in frontend .env
- Clear Laravel cache: `php artisan cache:clear`

### Issue: Validation errors
- Check field names match exactly
- Check required fields are filled
- Check date format (YYYY-MM-DD)
- Check enum values match (case-sensitive)

---

## Future Enhancements

- [ ] Add edit functionality
- [ ] Add delete confirmation dialog
- [ ] Add view details modal
- [ ] Add update stage functionality
- [ ] Add toast notifications (replace alerts)
- [ ] Add image preview in view details
- [ ] Add bulk operations
- [ ] Add export to CSV/PDF
- [ ] Add advanced filtering
- [ ] Add sorting
- [ ] Add pagination controls
- [ ] Add real-time updates (WebSockets)
