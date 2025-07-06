/* ==================== MODULE: screens/dashboard-demo.js ==================== */
/* Dashboard screen demo controls and functionality */

const dashboardDemoControls = {
    showNormalDashboard() {
        const storeCount = document.getElementById('storeCount');
        if (!storeCount) return;
        
        storeCount.textContent = '5';
        document.getElementById('alertCount').textContent = '12';
        document.getElementById('productCount').textContent = '847';
        document.getElementById('alertMessage').textContent = '12 products are running low on stock - Click to view';
        
        const activityFeed = document.getElementById('activityFeed');
        if (activityFeed) {
            activityFeed.innerHTML = `
                <div class="activity-item">
                    <span>• Sale recorded: 3x T-Shirts at Oxford Street</span>
                    <span class="activity-time">(2 mins ago)</span>
                </div>
                <div class="activity-item">
                    <span>• Stock adjustment: +50 Jeans at Birmingham</span>
                    <span class="activity-time">(15 mins ago)</span>
                </div>
                <div class="activity-item">
                    <span>• Low stock alert: Dresses at Manchester</span>
                    <span class="activity-time">(1 hour ago)</span>
                </div>
                <div class="activity-item">
                    <span>• New user created: John Smith</span>
                    <span class="activity-time">(2 hours ago)</span>
                </div>
                <div class="activity-item">
                    <span>• Purchase recorded: 25x Shoes at London</span>
                    <span class="activity-time">(3 hours ago)</span>
                </div>
                <div class="activity-item">
                    <span>• Report generated: Weekly inventory</span>
                    <span class="activity-time">(Today, 9:30am)</span>
                </div>
            `;
        }
    },

    showHighAlerts() {
        const alertCount = document.getElementById('alertCount');
        if (!alertCount) return;
        
        alertCount.textContent = '47';
        document.getElementById('alertMessage').textContent = '47 products critically low on stock - Immediate attention required!';
        
        const alertBanner = document.getElementById('alertBanner');
        if (alertBanner) {
            alertBanner.style.background = '#f8d7da';
            alertBanner.style.borderColor = '#f5c6cb';
        }
    },

    showBusyActivity() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;
        
        activityFeed.innerHTML = `
            <div class="activity-item">
                <span>• Sale recorded: 5x Jackets at Bristol</span>
                <span class="activity-time">(30 seconds ago)</span>
            </div>
            <div class="activity-item">
                <span>• Stock delivery: +200 Items at Leeds</span>
                <span class="activity-time">(1 min ago)</span>
            </div>
            <div class="activity-item">
                <span>• Sale recorded: 3x T-Shirts at Oxford Street</span>
                <span class="activity-time">(2 mins ago)</span>
            </div>
            <div class="activity-item">
                <span>• Low stock alert: Shoes at Manchester</span>
                <span class="activity-time">(3 mins ago)</span>
            </div>
            <div class="activity-item">
                <span>• Sale recorded: 8x Dresses at Birmingham</span>
                <span class="activity-time">(4 mins ago)</span>
            </div>
            <div class="activity-item">
                <span>• Stock adjustment: +30 Shirts at Oxford</span>
                <span class="activity-time">(5 mins ago)</span>
            </div>
        `;
    },

    simulateNewActivity() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;
        
        const activities = [
            'Sale recorded: 2x Sweaters at Leeds',
            'Stock received: +75 Items at Bristol', 
            'Price update: Jackets reduced by 10%',
            'User logout: Mike Johnson',
            'Low stock alert: Accessories at Oxford',
            'Sale recorded: 6x Pants at Manchester'
        ];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const newItem = document.createElement('div');
        newItem.className = 'activity-item';
        newItem.innerHTML = `
            <span>• ${randomActivity}</span>
            <span class="activity-time">(just now)</span>
        `;
        newItem.style.background = '#e8f5e8';
        newItem.style.padding = '4px';
        newItem.style.borderRadius = '3px';
        
        activityFeed.insertBefore(newItem, activityFeed.firstChild);
        
        setTimeout(() => {
            newItem.style.background = 'transparent';
            newItem.style.padding = '0';
        }, 2000);
    }
};