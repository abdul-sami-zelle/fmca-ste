import React, { useEffect, useState, useMemo } from "react";

const LayerList = ({ canvas, tools, onCheckout, selectedSofa }) => {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [bill, setBill] = useState([]);
  const [showLayers, setShowLayers] = useState(true);
  const [showBill, setShowBill] = useState(true);

  // Format price for consistent display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Safely convert price to number
  const safePrice = (price) => {
    if (price === 'Not Applicable' || price === 'N/A' || !price) return 0;
    const num = Number(price);
    return isNaN(num) ? 0 : num;
  };

  // Get product information with robust matching
  const getProductInfo = (src) => {
    if (!src) return defaultProductInfo();
    
    const normalizedSrc = normalizeFilename(extractFilename(src));
    
    for (const category of tools) {
      for (const item of category.items) {
        const matchedInfo = checkItemMatch(item, normalizedSrc, category.section);
        if (matchedInfo) return matchedInfo;
      }
    }
    
    return fallbackProductInfo(normalizedSrc);
  };

  // Helper functions
  const defaultProductInfo = () => ({
    name: 'Unknown',
    price: 0,
    category: 'Other',
    isSofa: false,
    originalItem: null
  });

  const normalizeFilename = (filename) => {
    return filename
      .toLowerCase()
      .normalize('NFD') // Normalize special characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s.-]/g, '') // Remove special chars except spaces, dots, hyphens
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
  };

  const extractFilename = (path) => {
    return path
      .replace(/^.*[\\\/]/, '') // Remove path
      .replace(/%20/g, ' ')     // Convert URL-encoded spaces
      .replace(/%2D/g, '-')     // Convert URL-encoded hyphens
      .split('?')[0];           // Remove query parameters
  };

  const checkItemMatch = (item, searchFilename, category) => {
    const imageFields = [
      item.image,
      item.png_image,
      ...(item.images || [])
    ].filter(Boolean);

    for (const img of imageFields) {
      const itemFilename = normalizeFilename(extractFilename(img));
      
      // More flexible matching
      if (itemFilename === searchFilename || 
          itemFilename.includes(searchFilename) || 
          searchFilename.includes(itemFilename)) {
        const regularPrice = safePrice(item.regular_price);
        const salePrice = safePrice(item.sale_price);
        
        return {
          name: item.name || 'Unnamed Item',
          price: item.sale_price ? salePrice : regularPrice,
          category: category || 'Uncategorized',
          isSofa: category.toLowerCase().includes('sofa'),
          originalItem: item
        };
      }
    }
    return null;
  };

  const fallbackProductInfo = (filename) => {
    const name = filename.split('.')[0]
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    return {
      name: name || 'Furniture',
      price: 0,
      category: 'Other',
      isSofa: false,
      originalItem: null
    };
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
          isSofa: productInfo.isSofa,
          originalItem: productInfo.originalItem,
          object: obj
        };
      });

    setLayers([...visibleLayers].reverse());
    setBill(visibleLayers.filter(item => item.price > 0 && !item.isSofa));
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
  }, [canvas, tools]);

  // Calculate total price including sofa if selected
  const totalPrice = useMemo(() => {
    const itemsTotal = bill.reduce((acc, item) => acc + item.price, 0);
    const sofaPrice = selectedSofa ? safePrice(selectedSofa.sale_price) : 0;
    return itemsTotal + sofaPrice;
  }, [bill, selectedSofa]);

  const formattedTotal = formatPrice(totalPrice);

  // Checkout handler
  const handleCheckout = () => {
    const allSelectedItems = [
      ...bill.map(item => item.originalItem),
      ...(selectedSofa ? [selectedSofa] : [])
    ].filter(item => item !== null);
    
    if (onCheckout) {
      onCheckout(allSelectedItems);
    }
  };

  return (
    <div className="layerList" style={{ 
      width: 250, 
      padding: 10,
      backgroundColor: '#fff',
      borderLeft: '1px solid #e0e0e0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>Design Panel</h3>
      </div> */}

      {/* Layers Section */}
      {/* <div style={{ marginBottom: 20, borderBottom: '1px solid #e0e0e0', paddingBottom: 10 }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: 5,
            padding: '5px 10px',
            backgroundColor: '#f0f0f0',
            borderRadius: 4
          }}
          onClick={() => setShowLayers(!showLayers)}
        >
          <h4 style={{ margin: 0 }}>Canvas</h4>
          <span style={{ fontSize: '1.2em' }}>{showLayers ? '−' : '+'}</span>
        </div>
        
        {showLayers && (
          <>
            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
              <button 
                onClick={() => moveSelectedLayer("up")}
                style={{ 
                  flex: 1, 
                  padding: '5px 0',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: selectedLayer ? 'pointer' : 'not-allowed',
                  opacity: selectedLayer ? 1 : 0.6
                }}
                disabled={!selectedLayer}
              >
                Move Up
              </button>
              <button 
                onClick={() => moveSelectedLayer("down")}
                style={{ 
                  flex: 1, 
                  padding: '5px 0',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: selectedLayer ? 'pointer' : 'not-allowed',
                  opacity: selectedLayer ? 1 : 0.6
                }}
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
                marginBottom: 10,
                padding: '5px 0',
                border: 'none',
                borderRadius: 4,
                cursor: selectedLayer ? 'pointer' : 'not-allowed',
                opacity: selectedLayer ? 1 : 0.6
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
                  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '70%' }}>
                    <span style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {layer.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>
                      {layer.category}
                    </span>
                  </div>
                  {layer.price > 0 && (
                    <span style={{ fontWeight: '500' }}>
                      {formatPrice(layer.price)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div> */}

      {/* Bill Section */}
      <div>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: 5,
            marginTop:60,
            padding: '5px 10px',
            backgroundColor: '#f0f0f0',
            borderRadius: 4
          }}
          onClick={() => setShowBill(!showBill)}
        >
          <h4 style={{ margin: 0 }}>Summary  ({bill.length + (selectedSofa ? 1 : 0)})</h4>
          <span style={{ fontSize: '1.2em' }}>{showBill ? '−' : '+'}</span>
        </div>
        
        {showBill && (
          <div style={{ fontSize: 14 }}>
            <ul style={{ 
              padding: 0,
              listStyle: "none",
              marginBottom: 10,
              maxHeight: 500,
              overflowY: 'auto'
            }}>
              {selectedSofa && (
                <li 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor:'#f8f8f8',
                    borderWidth:'0'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '70%' }}>
                    <span>{selectedSofa.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>Sofa</span>
                  </div>
                  <span style={{ fontWeight: '500' }}>{formatPrice(selectedSofa.sale_price)}</span>
                </li>
              )}
              
              {bill.map((item) => (
                <li 
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px',
                    borderBottom: '1px solid #f0f0f0',
                    // backgroundColor:'red' 
                    backgroundColor:'#f8f8f8',
                    borderWidth:'0'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '70%'}}>
                    <span>{item.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>{item.category}</span>
                  </div>
                  <span style={{ fontWeight: '500' }}>{formatPrice(item.price)}</span>
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
              <span>{formattedTotal}</span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <div style={{ 
        marginTop: 'auto', 
        paddingTop: 15,
        borderTop: '1px solid #e0e0e0'
      }}>
        <button
          onClick={handleCheckout}
          style={{
            width: '100%',
            padding: '12px 0',
            backgroundColor: '#FF8415',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            ':hover': {
              backgroundColor: '#FF8415'
            }
          }}
          disabled={bill.length === 0 && !selectedSofa}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default LayerList;