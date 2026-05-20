

import React, { useEffect, useState } from "react";

const LayerList = ({ canvas, tools}) => {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [bill, setBill] = useState([]);
  const [showLayers, setShowLayers] = useState(true);
  const [showBill, setShowBill] = useState(true);

  // Function to get product info from data source
  const getProductInfo = (src) => {
    if (!src) return { name: 'Unknown', price: 0 };
    
    // Extract the relevant part of the path
    const pathParts = src.split('/');
    const searchPath = `/${pathParts.slice(-2).join('/')}`;
    
    // Search through all tools to find matching image
    for (const category of tools) {
      for (const item of category.items) {
        if (item.image === searchPath) {
          return {
            name: item.name,
            price: item.price === 'Not Aplicable' ? 0 : Number(item.price),
            category: category.section
          };
        }
      }
    }
    return { name: 'Furniture', price: 0, category: 'Other' };
  };

  const addIdToObject = (object) => {
    if (!object.id) {
      object.id = `${object.type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
  };

  const updateLayers = () => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });

    const visibleLayers = objects
      .filter((obj) => obj.type !== "background" && obj.id)
      .map((obj) => {
        const productInfo = getProductInfo(obj._element?.src);
        return {
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type || 'object',
          src: obj._element?.src || null,
          name: productInfo.name,
          price: productInfo.price,
          category: productInfo.category,
          object: obj
        };
      });

    setLayers([...visibleLayers].reverse());
    setBill(visibleLayers.filter(item => item.price > 0));
  };

  const handleObjectSelected = (e) => {
    const selectedObject = e.selected?.[0];
    setSelectedLayer(selectedObject?.id || null);
  };

  const selectLayerInCanvas = (layerId) => {
    const obj = canvas.getObjects().find((o) => o.id === layerId);
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  };

  const deleteSelectedLayer = () => {
    const obj = canvas.getObjects().find((o) => o.id === selectedLayer);
    if (obj) {
      canvas.remove(obj);
      setSelectedLayer(null);
      canvas.renderAll();
      updateLayers();
    }
  };

  const moveSelectedLayer = (direction) => {
    if (!selectedLayer || !canvas) return;
  
    const objects = canvas.getObjects();
    const index = objects.findIndex((obj) => obj.id === selectedLayer);
    if (index === -1) return;
  
    if (direction === "up" && index < objects.length - 1) {
      [objects[index], objects[index + 1]] = [objects[index + 1], objects[index]];
    } else if (direction === "down" && index > 0) {
      [objects[index], objects[index - 1]] = [objects[index - 1], objects[index]];
    }
  
    canvas._objects = [];
    objects.forEach((obj) => canvas.add(obj));
  
    const selectedObject = objects.find((o) => o.id === selectedLayer);
    if (selectedObject) {
      canvas.setActiveObject(selectedObject);
    }
  
    canvas.renderAll();
    updateLayers();
  };

  useEffect(() => {
    if (!canvas) return;

    const events = [
      "object:added",
      "object:removed",
      "object:modified",
      "selection:created",
      "selection:updated"
    ];

    events.forEach(event => {
      canvas.on(event, updateLayers);
    });

    canvas.on("selection:created", handleObjectSelected);
    canvas.on("selection:updated", handleObjectSelected);
    canvas.on("selection:cleared", () => setSelectedLayer(null));

    updateLayers();

    return () => {
      events.forEach(event => {
        canvas.off(event, updateLayers);
      });
      canvas.off("selection:created", handleObjectSelected);
      canvas.off("selection:updated", handleObjectSelected);
      canvas.off("selection:cleared", () => setSelectedLayer(null));
    };
  }, [canvas]);

  const totalPrice = bill.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="layerList" style={{ 
      width: 250, 
      padding: 10,
      backgroundColor: '#f8f8f8',
      borderLeft: '1px solid #e0e0e0',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Design Panel</h3>
      </div>

      {/* Layers Section */}
      <div style={{ marginBottom: 20, borderBottom: '1px solid #e0e0e0', paddingBottom: 10 }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: 5
          }}
          onClick={() => setShowLayers(!showLayers)}
        >
          <h4 style={{ margin: 0 }}>Layers {showLayers ? '▼' : '▶'}</h4>
        </div>
        
        {showLayers && (
          <>
            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
              <button 
                onClick={() => moveSelectedLayer("up")}
                style={{ flex: 1, padding: '5px 0' }}
                disabled={!selectedLayer}
              >
                Move Up
              </button>
              <button 
                onClick={() => moveSelectedLayer("down")}
                style={{ flex: 1, padding: '5px 0' }}
                disabled={!selectedLayer}
              >
                Move Down
              </button>
            </div>
            
            <button
              onClick={deleteSelectedLayer}
              style={{ 
                width: '100%',
                backgroundColor: "#ff4d4f", 
                color: "white",
                marginBottom: 10
              }}
              disabled={!selectedLayer}
            >
              Delete Selected
            </button>

            <ul style={{ 
              padding: 0, 
              listStyle: "none", 
              maxHeight: 200, 
              overflowY: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: 4
            }}>
              {layers.map((layer) => (
                <li
                  key={layer.id}
                  onClick={() => selectLayerInCanvas(layer.id)}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    borderBottom: "1px solid #f0f0f0",
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: layer.id === selectedLayer ? "#e6f7ff" : "transparent",
                    ':hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '500' }}>{layer.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>{layer.category}</span>
                  </div>
                  {layer.price > 0 && <span>${layer.price}</span>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Bill Section */}
      <div>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: 5
          }}
          onClick={() => setShowBill(!showBill)}
        >
          <h4 style={{ margin: 0 }}>Bill Summary {showBill ? '▼' : '▶'}</h4>
        </div>
        
        {showBill && (
          <div style={{ fontSize: 14 }}>
            <ul style={{ 
              padding: 0,
              listStyle: "none",
              marginBottom: 10,
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {bill.map((item) => (
                <li 
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{item.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>{item.category}</span>
                  </div>
                  <span>${item.price}</span>
                </li>
              ))}
            </ul>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderTop: '1px solid #e0e0e0',
              fontWeight: 'bold',
              fontSize: 15
            }}>
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayerList;