// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { getEcsDowntime } from './awsCloudWatch';

function App() {
  const [widgets, setWidgets] = useState([]);

  const addWidget = () => {
    setWidgets([...widgets, { id: widgets.length, size: 'small' }]);
  };

  const updateWidgetSize = (id, newSize) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, size: newSize } : widget
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard</h1>
      </header>
      <div className="dashboard">
        <button className="add-widget-btn" onClick={addWidget}>
          Add New Widget
        </button>
        <div className="widgets-container">
          {widgets.map((widget) => (
            <Widget
              key={widget.id}
              size={widget.size}
              onSizeChange={(newSize) => updateWidgetSize(widget.id, newSize)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Widget({ size, onSizeChange }) {
  const [downtimeData, setDowntimeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEcsDowntime('your-cluster-name', 'your-service-name');
      setDowntimeData(data);
    };
    
    fetchData();
  }, []);

  const renderWidgetContent = () => {
    if (!downtimeData) {
      return <p>Loading ECS downtime data...</p>;
    }

    const downtimeMessage = `Average CPU Utilization: ${downtimeData.Datapoints.length > 0 ? downtimeData.Datapoints[0].Average : 'N/A'}`;

    switch (size) {
      case 'small':
        return (
          <div>
            <p>{downtimeMessage}</p>
          </div>
        );
      case 'medium':
        return (
          <div>
            <p>{downtimeMessage}</p>
            <p>More detailed ECS downtime info here.</p>
          </div>
        );
      case 'large':
        return (
          <div>
            <p>{downtimeMessage}</p>
            <p>More detailed ECS downtime info here.</p>
            <p>Additional graphs and insights can go here in the large view.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`widget widget-${size}`}>
      <h2>Customizable Widget</h2>
      {renderWidgetContent()}
      <div>
        <button onClick={() => onSizeChange('small')}>300x300</button>
        <button onClick={() => onSizeChange('medium')}>610x300</button>
        <button onClick={() => onSizeChange('large')}>610x610</button>
      </div>
    </div>
  );
}

export default App;
