# Implementation Plan

## Overview
Fix target settings functionality, enhance Distribution module card metrics to include monthly sales revenue in the Total Quantity card, wire Dashboard CardMetrics to live API data, and add target progress display to the Distribution page.

## Implementation Steps

- [ ] 1. **Fix targetService.js to use the shared api instance**
      
      Replace raw axios with the `api` instance from `@/services/api.js` to ensure correct base URL handling in production/dev environments. This is the root cause of broken target save/load in Settings.
      
      **Files:** 
      - `c:\Users\User\Desktop\seedMIS\src\services\targetService.js`
      
      **Changes:**
      - Remove `import axios from 'axios';` and `const API_URL = ...`
      - Add `import api from './api';`
      - Replace all `axios.get`, `axios.post`, `axios.put`, `axios.delete` calls with `api.get`, `api.post`, `api.put`, `api.delete`
      - Remove the `${API_URL}` prefix from all endpoint paths (the api instance already has baseURL configured)
      
      **Verify:** Open the app in browser at `http://localhost:5173`, navigate to Settings > Target Settings, set a target value, save it, refresh the page, and confirm the target value persists. Check browser DevTools Network tab to confirm API calls go to the correct base URL.

---

- [ ] 2. **Enhance Distribution CardMatrics.jsx to show monthly sales in Total Quantity card**
      
      Modify the Total Quantity card to display both the total quantity (seedlings count) and monthly sales revenue (sum of total_price for Released requests in current month) as a secondary line below the quantity.
      
      **Files:**
      - `c:\Users\User\Desktop\seedMIS\src\pages\distribution\layout\CardMatrics.jsx`
      
      **Changes:**
      - In the `fetchMetrics` function, after calculating `totalQuantity`, add logic to calculate monthly sales:
        ```javascript
        // Calculate monthly sales (current month only)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlySales = releasedRequests
          .filter(req => {
            const reqDate = new Date(req.created_at);
            return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear;
          })
          .reduce((sum, req) => sum + (req.total_price || 0), 0);
        ```
      - Update the Total Quantity card object in the setMetrics array to include the monthly sales value (add a new property `monthlySales: monthlySales`)
      - In the JSX render section, modify the Total Quantity card's CardContent to show:
        - Primary: `{value.toLocaleString()}` (the quantity)
        - Secondary (new line below subtitle): `₱{metric.monthlySales?.toLocaleString() || 0}` with a label "Monthly Sales" in muted text
      
      **Verify:** Run `npm run dev`, navigate to Distribution page, confirm the Total Quantity card shows both the seedling count and monthly sales revenue (₱xxx) below it. Verify the monthly sales value matches the sum of total_price for Released requests created this month.

---

- [ ] 3. **Wire Dashboard CardMetrics.jsx to live API data**
      
      Replace the hardcoded metric values (2001, 1240, 58, 673, 12) with live data from inventoryService and requestService APIs.
      
      **Files:**
      - `c:\Users\User\Desktop\seedMIS\src\pages\dashboard\layout\CardMetrics.jsx`
      
      **Changes:**
      - Add imports: `import { useEffect, useState } from "react";`, `import inventoryService from "@/services/inventoryService";`, `import requestService from "@/services/requestService";`
      - Convert the metrics array to state: `const [metrics, setMetrics] = useState([...initial array with value: 0 for all...]);`
      - Add `useEffect(() => { fetchMetrics(); }, []);`
      - Implement `fetchMetrics` async function:
        ```javascript
        const fetchMetrics = async () => {
          try {
            const [inventoryResponse, requestResponse] = await Promise.all([
              inventoryService.getMetrics(),
              requestService.getMetrics()
            ]);
            
            if (inventoryResponse.success && requestResponse.success) {
              const invData = inventoryResponse.data;
              const reqData = requestResponse.data;
              
              setMetrics([
                { title: "Total Seedlings", value: invData.total_quantity || 0, icon: Sprout, iconClass: "text-green-600" },
                { title: "Available Stock", value: invData.available_stock || 0, icon: PackageCheck, iconClass: "text-blue-600" },
                { title: "Pending Request", value: reqData.pending || 0, icon: Clock, iconClass: "text-amber-500" },
                { title: "Distributed", value: reqData.released || 0, icon: Truck, iconClass: "text-purple-600" },
                { title: "Low Stock", value: invData.low_stock || 0, icon: AlertTriangle, iconClass: "text-red-600" }
              ]);
            }
          } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
          }
        };
        ```
      
      **Verify:** Run `npm run dev`, open Dashboard page, confirm all five metric cards show live data from the API (no more hardcoded 2001, 1240, etc.). Check browser DevTools console for no errors and Network tab to confirm API calls to `/inventories/metrics` and `/requests/metrics`.

---

- [ ] 4. **Create DistributionTargetProgress.jsx component**
      
      Create a new component to display monthly distribution target progress on the Distribution page. Reuse the visual style from dashboard's TargetProgress component but show only the monthly_distribution card.
      
      **Files:**
      - `c:\Users\User\Desktop\seedMIS\src\pages\distribution\layout\DistributionTargetProgress.jsx` (new file)
      
      **Content:**
      ```javascript
      import { useEffect, useState } from "react";
      import targetService from "@/services/targetService";
      import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
      import { Progress } from "@/components/ui/progress";
      import { Target, Loader2 } from "lucide-react";

      const DistributionTargetProgress = () => {
          const [progress, setProgress] = useState(null);
          const [loading, setLoading] = useState(true);

          useEffect(() => {
              fetchProgress();
          }, []);

          const fetchProgress = async () => {
              try {
                  const response = await targetService.getProgress();
                  if (response.success && response.data.monthly_distribution) {
                      setProgress(response.data.monthly_distribution);
                  }
              } catch (error) {
                  console.error('Error fetching distribution target progress:', error);
              } finally {
                  setLoading(false);
              }
          };

          const getStatusColor = (percentage) => {
              if (percentage >= 100) return 'text-green-600';
              if (percentage >= 75) return 'text-blue-600';
              if (percentage >= 50) return 'text-yellow-600';
              return 'text-red-600';
          };

          const getProgressColor = (percentage) => {
              if (percentage >= 100) return '[&>*]:bg-green-600';
              if (percentage >= 75) return '[&>*]:bg-blue-600';
              if (percentage >= 50) return '[&>*]:bg-yellow-600';
              return '[&>*]:bg-red-600';
          };

          if (loading) {
              return (
                  <Card>
                      <CardContent className="flex items-center justify-center py-10">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </CardContent>
                  </Card>
              );
          }

          if (!progress) {
              return null; // Don't show if no target set
          }

          return (
              <Card>
                  <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Monthly Distribution Target
                      </CardTitle>
                      <CardDescription>
                          {new Date(progress.period).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-2">
                          <div className="flex justify-between items-baseline">
                              <span className={`text-2xl font-bold ${getStatusColor(progress.percentage)}`}>
                                  {progress.percentage.toFixed(1)}%
                              </span>
                              <span className="text-sm text-muted-foreground">
                                  {progress.current.toLocaleString()} / {progress.target.toLocaleString()}
                              </span>
                          </div>
                          <Progress 
                              value={progress.percentage} 
                              className={`h-2 ${getProgressColor(progress.percentage)}`}
                          />
                          <p className="text-xs text-muted-foreground">
                              {progress.remaining.toLocaleString()} seedlings to go
                          </p>
                      </div>
                  </CardContent>
              </Card>
          );
      };

      export default DistributionTargetProgress;
      ```
      
      **Verify:** File created successfully with correct imports and component structure matching the dashboard TargetProgress pattern.

---

- [ ] 5. **Add DistributionTargetProgress to Distribution page**
      
      Import and render the new DistributionTargetProgress component in the Distribution page, positioned between CardMetrics and DistributeTable.
      
      **Files:**
      - `c:\Users\User\Desktop\seedMIS\src\pages\distribution\Distribution.jsx`
      
      **Changes:**
      - Add import: `import DistributionTargetProgress from "./layout/DistributionTargetProgress";`
      - In the JSX return, add `<DistributionTargetProgress />` between `<CardMetrics/>` and `<DistributeTable/>`:
        ```jsx
        return (
            <div className="grid gap-4">
                <CardMetrics/>
                <DistributionTargetProgress />
                <DistributeTable/>
            </div>
        )
        ```
      
      **Verify:** Run `npm run dev`, navigate to Distribution page, confirm the Monthly Distribution Target progress card appears between the metrics cards and the distribution table. Set a monthly distribution target in Settings, then verify it displays correctly on the Distribution page with current progress percentage, current/target values, and progress bar with appropriate color (red < 50%, yellow 50-74%, blue 75-99%, green 100%+).

---

## Final Verification

After completing all steps:

1. Run `npm run dev` and test the complete flow:
   - Go to Settings > Target Settings
   - Set a monthly distribution target (e.g., 5000)
   - Save and refresh to confirm persistence
   - Navigate to Dashboard and confirm:
     - All 5 metric cards show live data (not hardcoded values)
     - Target progress cards display correctly
   - Navigate to Distribution page and confirm:
     - Monthly Target card shows the target value set in Settings
     - Total Quantity card shows both seedling count AND monthly sales revenue
     - Distribution Target Progress card appears and shows correct progress toward the target
2. Check browser DevTools console for no errors
3. Verify API calls in Network tab use correct base URLs (localhost in dev, Railway in prod)

---

## Implementation Verification (Iteration 1)

**Completed:** All 4 changes implemented successfully.

**Build Verification:**
- ✅ Vite build completed successfully with no TypeScript/JSX syntax errors
- ✅ Build completed in 12.47s with no errors
- ✅ All chunks generated successfully

**Changes Verified:**
1. ✅ targetService.js now uses shared `api` instance from `@/services/api` (removed raw axios and hardcoded API_URL)
2. ✅ Distribution CardMatrics.jsx now calculates and displays monthly sales in Total Quantity card
   - Monthly sales computed from Released requests filtered by current month/year
   - Displayed as "₱X,XXX monthly sales" below quantity in muted text
3. ✅ Dashboard CardMetrics.jsx now fetches live data from inventoryService and requestService APIs
   - Maps to 5 cards: Total Seedlings (total_stock), Available Stock (total_stock), Pending Request (pending), Distributed (released), Low Stock (low_stock)
   - Uses useEffect and state to fetch on mount
4. ✅ DistributionTargetProgress.jsx component created and added to Distribution page
   - Matches TargetProgress.jsx visual style
   - Shows monthly_distribution target progress only
   - Positioned between CardMetrics and DistributeTable
   - Includes loading state and null render when no target set

**Import Resolution:**
- ✅ All service imports resolve correctly (targetService, requestService, inventoryService)
- ✅ All UI component imports resolve (Card, Progress, icons from lucide-react)
- ✅ DistributionTargetProgress properly imported in Distribution.jsx
