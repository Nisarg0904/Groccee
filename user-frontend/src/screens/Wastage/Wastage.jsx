import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Color palette
const colors = {
  black: '#000000',
  turkeyRed: '#A91101',
  ghostWhite: '#F8F8FF',
  deepForestGreen: '#014421',
  deepNavyBlue: '#002147',
  charcoalGrey: '#36454F'
};

const WasteManagementScreen = () => {
  const [startX, setStartX] = useState(null);
  const [currentView, setCurrentView] = useState('month'); // 'week', 'month', 'year'
  const [touchStartTime, setTouchStartTime] = useState(null);

  const data = [
    { name: 'Category 1', value: 30 },
    { name: 'Category 2', value: 25 },
    { name: 'Category 3', value: 15 },
    { name: 'Category 4', value: 30 }
  ];

  const CHART_COLORS = [
    colors.deepNavyBlue,
    colors.deepForestGreen,
    colors.turkeyRed,
    colors.charcoalGrey
  ];

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setTouchStartTime(new Date().getTime());
  };

  const handleTouchEnd = (e) => {
    if (!startX) return;

    const endX = e.changedTouches[0].clientX;
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;
    
    // Only trigger if the swipe was fast enough (less than 300ms)
    if (touchDuration < 300) {
      const diffX = startX - endX;
      const views = ['week', 'month', 'year'];
      const currentIndex = views.indexOf(currentView);

      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0 && currentIndex < views.length - 1) {
          // Swipe left -> next view
          setCurrentView(views[currentIndex + 1]);
        } else if (diffX < 0 && currentIndex > 0) {
          // Swipe right -> previous view
          setCurrentView(views[currentIndex - 1]);
        }
      }
    }
    
    setStartX(null);
    setTouchStartTime(null);
  };

  const getTimeframeData = () => {
    switch (currentView) {
      case 'week':
        return { title: 'This Week', value: '0.1 kg' };
      case 'month':
        return { title: 'This Month', value: '0.4 kg' };
      case 'year':
        return { title: 'This Year', value: '27 kg' };
      default:
        return { title: 'This Month', value: '0.4 kg' };
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#F8F8FF] p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full">
        <h2 className="text-2xl font-bold text-[#36454F] mb-4 px-2">
          Category based waste
        </h2>

        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {data.map((entry, index) => (
              <div 
                key={entry.name} 
                className="flex items-center min-h-12 px-2 active:bg-gray-100 rounded-lg transition-colors"
              >
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: CHART_COLORS[index] }}
                ></div>
                <span className="text-base text-[#36454F]">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-[#A91101] text-white p-6 rounded-lg">
          <div className="space-y-6">
            <div>
              <h3 className="text-base opacity-90">Total Waste Category</h3>
              <p className="text-4xl font-bold mt-1">6</p>
            </div>
            
            {/* Time period selector with gestures */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <ChevronLeft 
                  className={`w-6 h-6 ${currentView === 'week' ? 'opacity-30' : 'opacity-90'}`}
                />
                <h3 className="text-base opacity-90">Total Waste out {getTimeframeData().title}</h3>
                <ChevronRight 
                  className={`w-6 h-6 ${currentView === 'year' ? 'opacity-30' : 'opacity-90'}`}
                />
              </div>
              <p className="text-4xl font-bold mt-1">{getTimeframeData().value}</p>
            </div>

            <div>
              <h3 className="text-base opacity-90">Total Waste out this year</h3>
              <p className="text-4xl font-bold mt-1">27 kg</p>
            </div>
          </div>

          <div className="flex items-end space-x-3 mt-8 h-20">
            <div className="w-1/4 bg-[#002147] h-full rounded-t"></div>
            <div className="w-1/4 bg-[#A91101] h-3/4 rounded-t"></div>
            <div className="w-1/4 bg-[#36454F] h-1/2 rounded-t"></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WasteManagementScreen;