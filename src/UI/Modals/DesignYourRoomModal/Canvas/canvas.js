'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, FabricImage, Rect } from 'fabric';
import LayerList from './layerlist';


const CanvasApp = ({ data }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Wall');
  const [paintedWallColor, setPaintedWallColor] = useState('#fff');
  const [isSectionalSelected, setIsSectionals] = useState(false);
  const [reclining, setReclining] = useState(false)
  const [isRecliningNonSectional, setRecliningNonSectional] = useState(false)
  const [tools, setTools] = useState([])
  const sofaRef = useRef(null);
  let lastSofaSrc = null;
  const baseURL = "https://roomapi.myfurnituremecca.com";

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    const loadInitialImages = async () => {
      if (canvasRef.current) {
        const initCanvas = new Canvas(canvasRef.current, {
          width: 1000,
          height: 600,
          backgroundColor: '#fff',
        });

        const wallSrc = `${baseURL}/uploads/Products/1751613914188_249_02.jpg`;
        const floorSrc = `${baseURL}/uploads/Products/1751530574642_171_01.jpg`;
        const sofaSrc = data.png_image; // update with correct path

        // Add wall
        await addImageToCanvas(wallSrc, {
          left: 0,
          top: 0,
          targetWidthRatio: 1,
          targetHeightRatio: 0.55,
          selectable: false,
          evented: false,
        }, initCanvas);

        // Add floor
        await addImageToCanvas(floorSrc, {
          left: 0,
          top: initCanvas.getHeight() * 0.55,
          targetWidthRatio: 1,
          targetHeightRatio: 0.45,
          selectable: false,
          evented: false,
        }, initCanvas);

        // Add sofa last (so it stays on top)
        if (data.cat == 'Sectional') {
          const sofa = await addImageToCanvas(sofaSrc, {
            left: initCanvas.getWidth() * 0.18,
            top: initCanvas.getHeight() * 0.37,
            targetWidthRatio: 0.69,
            targetHeightRatio: 0.47,
          }, initCanvas)

          if (sofa) {
            setIsSectionals(true)
            initCanvas.remove(sofa);
            initCanvas.add(sofa); // bring to top
            sofaRef.current = sofa;
          }
        }
        else if (data.cat == 'Recliner-Sectional') {
          const sofa = await addImageToCanvas(sofaSrc, {
            left: initCanvas.getWidth() * 0.12,
            top: initCanvas.getHeight() * 0.37,
            targetWidthRatio: 0.77,
            targetHeightRatio: 0.40,
          }, initCanvas)

          if (sofa) {
            setReclining(true)
            initCanvas.remove(sofa);
            initCanvas.add(sofa); // bring to top
            sofaRef.current = sofa;
          }
        }
        else if (data.cat == 'Recliner') {
          const sofa = await addImageToCanvas(sofaSrc, {
            left: initCanvas.getWidth() * 0.10,
            top: initCanvas.getHeight() * 0.31,
            targetWidthRatio: 0.77,
            targetHeightRatio: 0.47,
          }, initCanvas)

          if (sofa) {
            setRecliningNonSectional(true)
            setReclining(false)
            setIsSectionals(false)
            initCanvas.remove(sofa);
            initCanvas.add(sofa); // bring to top
            sofaRef.current = sofa;
          }
        }
        else {
          const sofa = await addImageToCanvas(sofaSrc, {
            left: initCanvas.getWidth() * 0.10,
            top: initCanvas.getHeight() * 0.22,
            targetWidthRatio: 0.77,
            targetHeightRatio: 0.62,
          }, initCanvas)

          if (sofa) {
            initCanvas.remove(sofa);
            initCanvas.add(sofa); // bring to top
            sofaRef.current = sofa;
          }
        }


        initCanvas.renderAll();
        setCanvas(initCanvas);
      }
    };

    loadInitialImages();
  }, []);

  const getProducts = () => {
    fetch(`${baseURL}/api/v1/mega/get`)
      .then((res) => res.json())
      .then((data) => {
        // Inject onClick for specific sections
        const updatedTools = data.map(section => {
          if (section.section === "Wall") {
            return {
              ...section,
              items: section.items.map(item => ({
                ...item,
                onClick: 'addWall', // or any function name
              }))
            };
          }
          if (section.section === "Floor") {
            return {
              ...section,
              items: section.items.map(item => ({
                ...item,
                onClick: 'addFloor', // or any function name
              }))
            };
          }
          if (section.section === "Wall Art") {
            return {
              ...section,
              items: section.items.map(item => ({
                ...item,
                onClick: 'addwallfram', // or any function name
              }))
            };
          }
          if (section.section === "Coffee & End Tables") {
            return {
              ...section,
              items: section.items.map(item => ({
                ...item,
                onClick: 'addCenterTableImage', // or any function name
              }))
            };
          }

          if (section.section === "Rugs") {
            return {
              ...section,
              items: section.items.map(item => ({
                ...item,
                onClick: 'addRugImage',
              }))
            };
          }
          if (section.section === "Lamps & Lighting") {
            return {
              ...section,
              items: section.items.map(item => ({
                ...item,
                onClick: 'addLampImage',
              }))
            };
          }

          return section; // default: no change
        });

        setTools(updatedTools);
      })
      .catch((error) => console.error("API error:", error));
  };


  const addImageToCanvas = async (src, config = {}, canvasOverride = null) => {
    
    const activeCanvas = canvasOverride || canvas;
    if (!activeCanvas) return null;

    try {
      const fullSrc = src.startsWith('http')
        ? src
        : `https://roomapi.myfurnituremecca.com${src}`;

      const img = await FabricImage.fromURL(fullSrc);
      // const img = await FabricImage.fromURL(src);
      const canvasWidth = activeCanvas.getWidth();
      const canvasHeight = activeCanvas.getHeight();

      const targetWidth = config.targetWidthRatio
        ? canvasWidth * config.targetWidthRatio
        : config.targetWidth ?? img.width;

      const targetHeight = config.targetHeightRatio
        ? canvasHeight * config.targetHeightRatio
        : config.targetHeight ?? img.height;

      const scaleX = targetWidth / img.width;
      const scaleY = targetHeight / img.height;

      img.set({
        left: config.left ?? (canvasWidth - targetWidth) / 2,
        top: config.top ?? (canvasHeight - targetHeight) / 2,
        scaleX,
        scaleY,
        selectable: config.selectable ?? true,
        evented: config.evented ?? true,
      });

      activeCanvas.add(img);
      activeCanvas.renderAll();
      return img; // ✅ Make sure this is returned
    } catch (error) {
      console.error(`Failed to load image: ${src}`, error);
      return null;
    }
  };



  let paintedWallRef = null;

  const handlers = {

    addPaintedWall: () => {
      if (!canvas) return;

      const wall = new Rect({
        left: 0,
        top: 0,
        width: 1000,
        height: 370,
        fill: paintedWallColor,
        selectable: false,
        evented: false,
        objectCaching: false,
      });

      paintedWallRef = wall;
      canvas.add(wall);
      // canvas.sendToBack(wall);
      canvas.renderAll();
    },
    addWall: (src) => addImageToCanvas(src, {

      left: 0,
      top: 0,
      targetWidthRatio: 1,          // 100% width
      targetHeightRatio: 0.55,      // 62% of height
      selectable: false,
      evented: false,
    }),

    addFloor: (src) => {
      addImageToCanvas(src, {
        left: 0,
        top: canvas?.getHeight() * 0.55, // dynamic top
        targetWidthRatio: 1,
        targetHeightRatio: 0.45,
        selectable: false,
        evented: false,
      })
    },

    addSofaImage: (src) => {
      setRecliningNonSectional(true);
      setReclining(false)
      setIsSectionals(false)
      addImageToCanvas(src, {
        left: canvas?.getWidth() * 0.10,
        top: canvas?.getHeight() * 0.31,
        targetWidthRatio: 0.77,
        targetHeightRatio: 0.47,
      })
    },
    addSectionalImage: (src) => {
      setIsSectionals(true);
      addImageToCanvas(src, {
        left: canvas?.getWidth() * 0.18,
        top: canvas?.getHeight() * 0.37,
        targetWidthRatio: 0.69,
        targetHeightRatio: 0.47,
      })
    },


    addReclinerSofaImage: (src) => {
      setIsSectionals(false);
      setReclining(true);
      addImageToCanvas(src, {
        left: canvas?.getWidth() * 0.12,
        top: canvas?.getHeight() * 0.37,
        targetWidthRatio: 0.77,
        targetHeightRatio: 0.40,
      })
    },
    addloveSeatImage: (src) => addImageToCanvas(src, {
      left: canvas?.getWidth() * 0.10,
      top: canvas?.getHeight() * 0.22,
      targetWidthRatio: 0.77,
      targetHeightRatio: 0.62,
    }),
    addwallfram: (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      addImageToCanvas(src, {
        left: canvasWidth * 0.39,       // 39% from left
        top: canvasHeight * 0.04,        // 4% from top
        targetWidthRatio: 0.23,         // 23% of canvas width
        targetHeightRatio: 0.23,        // 23% of canvas height
      });
    },
    addCenterTableImage: (src) => {

      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      let style;

      if (isSectionalSelected) {
        style = {
          left: canvasWidth * 0.20,           // Adjusted for sectional layout
          top: canvasHeight * 0.52,
          targetWidthRatio: 0.40,
          targetHeightRatio: 0.4,
        };
      }
      else if (reclining) {
        style = {
          left: canvasWidth * 0.33,           // Adjusted for sectional layout
          top: canvasHeight * 0.57,
          targetWidthRatio: 0.35,
          targetHeightRatio: 0.35,
        };
      }
      else if (isRecliningNonSectional) {
        style = {
          left: canvasWidth * 0.35,           // Default center table placement
          top: canvasHeight * 0.55,
          targetWidthRatio: 0.35,
          targetHeightRatio: 0.32,
        };
      }
      else {
        style = {
          left: canvasWidth * 0.35,           // Default center table placement
          top: canvasHeight * 0.52,
          targetWidthRatio: 0.35,
          targetHeightRatio: 0.40,
        };
      }

      addImageToCanvas(src, style);
    },
    addHadaskyCoffeetable: (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      addImageToCanvas(src, {
        left: canvasWidth * 0.22,           // 380 / 1000 = 38%
        top: canvasHeight * 0.46,         // 350 / 600 ≈ 58.33%
        targetWidthRatio: 0.55,             // 250 / 1000 = 25%
        targetHeightRatio: 0.35,            // 150 / 600 = 25%
      });
    },

    addFLEMINGCOFFEETABLE: (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      addImageToCanvas(src, {
        left: canvasWidth * 0.28,           // 380 / 1000 = 38%
        top: canvasHeight * 0.43,         // 350 / 600 ≈ 58.33%
        targetWidthRatio: 0.42,             // 250 / 1000 = 25%
        targetHeightRatio: 0.43,            // 150 / 600 = 25%
      });
    },

    addRugImage: async (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      let style = {
        left: canvasWidth * 0.03,
        top: canvasHeight * 0.65,
        targetWidthRatio: 0.93,
        targetHeightRatio: 0.32,
      };

      if (reclining) {
        style.top = canvasHeight * 0.70;
      }
      // 1. First move sofa to temp variable
      const sofa = sofaRef.current;

      // 2. Remove sofa from canvas temporarily
      if (sofa && canvas) {
        canvas.remove(sofa);
      }

      // 3. Add rug (will now be below sofa)
      await addImageToCanvas(src, style);

      // 4. Re-add sofa (will automatically be on top)
      if (sofa && canvas) {
        canvas.add(sofa);

        // 5. Forcefully move to front (double protection)
        sofa.moveTo(Infinity); // This is the most reliable in Fabric 6+
        canvas.requestRenderAll();
      }

      // add rug first
      addImageToCanvas(src, style).then(() => {
        // re-add sofa (ensure previous source is reused or passed again)
        if (lastSofaSrc) {
          handlers.addSofaImage(lastSofaSrc);
        }
      });
    },
    addLampImage: (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;


      let style;

      if (isSectionalSelected) {
        style = {
          left: canvasWidth * 0.07,
          top: canvasHeight * 0.20,
          targetWidthRatio: 0.12,
          targetHeightRatio: 0.29,
        };
      }
      else if (isRecliningNonSectional) {
        style = {
          left: canvasWidth * 0.85,
          top: canvasHeight * 0.33,
          targetWidthRatio: 0.10,
          targetHeightRatio: 0.25,
        };
      }
      else if (reclining) {
        style = {
          left: canvasWidth * 0.87,
          top: canvasHeight * 0.33,
          targetWidthRatio: 0.10,
          targetHeightRatio: 0.25,
        };
      }
      else {
        style = {
          left: canvasWidth * 0.87,
          top: canvasHeight * 0.28,
          targetWidthRatio: 0.10,
          targetHeightRatio: 0.25,
        };
      }

      addImageToCanvas(src, style);
    },

    // addSmailLampImage: (src) => {
    //   const canvasWidth  = canvas?.getWidth()  ?? 1000;  // fallback to defaults
    //   const canvasHeight = canvas?.getHeight() ?? 600;

    //   addImageToCanvas(src, {
    //     left: canvasWidth  * 0.71,    // 100 px of 1000 px  ➜ 10 % from the left
    //     top:  canvasHeight * 0.35,  // 350 px of 600 px ➜ ~58 % from the top
    //     targetWidthRatio:  0.30,      // 100 / 1000 = 10 % of canvas width
    //     targetHeightRatio: 0.27,      // 150 / 600  = 25 % of canvas height
    //   });
    // },

    addSmailLampImage: (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      let style;

      if (isSectionalSelected) {
        style = {
          left: canvasWidth * 0.01,
          top: canvasHeight * 0.21,
          targetWidthRatio: 0.32,
          targetHeightRatio: 0.30,
        };
      }
      else if (reclining) {
        style = {
          left: canvasWidth * 0.76,
          top: canvasHeight * 0.33,
          targetWidthRatio: 0.32,
          targetHeightRatio: 0.28,
        };
      }
      else if (isRecliningNonSectional) {
        style = {
          left: canvasWidth * 0.74,
          top: canvasHeight * 0.31,
          targetWidthRatio: 0.32,
          targetHeightRatio: 0.30,
        };
      }
      else {
        style = {
          left: canvasWidth * 0.78,
          top: canvasHeight * 0.27,
          targetWidthRatio: 0.32,
          targetHeightRatio: 0.32,
        };
      }

      addImageToCanvas(src, style);
    },

    addFloorLampImage: (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      let style;

      if (isSectionalSelected) {
        style = {
          left: canvasWidth * 0.82,
          top: canvasHeight * 0.09,
          targetWidthRatio: 0.18,
          targetHeightRatio: 0.65,
        };
      } else {
        style = {
          left: canvasWidth * -0.01,
          top: canvasHeight * 0.18,
          targetWidthRatio: 0.15,
          targetHeightRatio: 0.60,
        };
      }

      addImageToCanvas(src, style);
    },

    addEndTableImage: (src) => {
      const canvasWidth = canvas?.getWidth() ?? 1000;
      const canvasHeight = canvas?.getHeight() ?? 600;

      let style;

      if (isSectionalSelected) {
        style = {
          left: canvasWidth * 0.02,
          top: canvasHeight * 0.41,
          targetWidthRatio: 0.2,
          targetHeightRatio: 0.3,
        };
      }
      else if (reclining) {
        style = {
          left: canvasWidth * 0.83,
          top: canvasHeight * 0.53,
          targetWidthRatio: 0.17,
          targetHeightRatio: 0.32,
        };

      }
      else if (isRecliningNonSectional) {
        style = {
          left: canvasWidth * 0.80,
          top: canvasHeight * 0.53,
          targetWidthRatio: 0.19,
          targetHeightRatio: 0.35,
        };
      }
      else {
        style = {
          left: canvasWidth * 0.82,
          top: canvasHeight * 0.47,
          targetWidthRatio: 0.22,
          targetHeightRatio: 0.36,
        };
      }

      addImageToCanvas(src, style);
    }

  };

  return (
    <div className="editor-container" style={{ display: 'flex', height: '100vh' }}>
      {/* Toolbar */}
      <div style={{
        width: '250px',
        padding: '12px',
        backgroundColor: '#f8f8f8',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto'
      }}>
        {/* Category selector */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '8px 0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {tools?.map((toolSection) => (
            <button
              key={toolSection.section}
              onClick={() => setActiveCategory(toolSection.section)}
              style={{
                flexShrink: 0,
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: activeCategory === toolSection.section ? '#2c3e50' : '#e0e0e0',
                color: activeCategory === toolSection.section ? 'white' : '#333',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {toolSection.section}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
          <h4 style={{
            fontSize: '0.9rem',
            marginBottom: '10px',
            color: '#555',
            fontWeight: '600'
          }}>
            {activeCategory}
          </h4>
          <div style={{
            display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
            gap: '5px',
          }}>
            {tools
              ?.find(section => section.section === activeCategory)
              ?.items.map((item) => (
                <div key={item.name} style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'scale(1.05)'
                  }
                }}>
                  <button
                    // onClick={() => handlers[item.onClick]?.(item.image)}
                    onClick={() => {
                      if (item.name === 'Painted Wall') {
                        document.getElementById('wallColorPickerHidden').click();
                      } else {
                        handlers[item.onClick]?.(item.price === 'Not Applicable'  ? item.image : item.png_image);
                      }
                    }}

                    // style={{
                    //   background: 'none',
                    //   border: 'none',
                    //   padding: 0,
                    //   cursor: 'pointer'
                    // }}
                    style={{
                      width: '150px',
                      height: '150px',
                      backgroundColor: item.name === 'Painted Wall' ? paintedWallColor : 'transparent',
                      borderRadius: '4px',
                      border: '1px solid #000',
                      cursor: 'pointer'
                    }}
                  >
                    {item.name === 'Painted Wall' ? null
                      :
                      <img
                        // src={item.image}
                        src={item.png_image ? `${baseURL}${item.png_image}` : `${baseURL}${item.image}`}
                        alt={item.name}
                        style={{
                          width: '150px',
                          height: item.price === 'Not Aplicable' ? '150px' : '100px',
                          objectFit: item?.type && item.type == 'lamp' ? 'contain' : 'fill',
                          borderRadius: '4px',
                          // border: '1px solid #eee'
                        }}
                      />
                    }

                  </button>
                  <div style={{
                    fontSize: '0.7rem',
                    marginTop: '4px',
                    color: '#666',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width:'150px',
                    display:'flex',
                    alignSelf:'center',
                    marginLeft:'40px'
                  }}>
                    {item.name}
                  </div>
                  {item.price === 'Not Aplicable' ? null :
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#2c3e50',
                      fontWeight: '600'
                    }}>
                      ${item.price}
                    </div>
                  }

                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          style={{
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      </div>
      <input
        type="color"
        id="wallColorPickerHidden"
        value={paintedWallColor}
        style={{ display: 'none' }}
        onChange={(e) => {
          const newColor = e.target.value;
          setPaintedWallColor(newColor);
          handlers.addPaintedWall(); // after picking color, add wall with that color
        }}
      />


      {/* Layer list */}
      <LayerList canvas={canvas} tools={tools}/>
    </div>
  );
};

export default CanvasApp;

