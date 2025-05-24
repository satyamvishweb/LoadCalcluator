import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import '../Scss/styles.scss';

const BoxItem = ({ position, size, color }) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const ContainerBox = ({ size }) => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={size} />
    <meshStandardMaterial color="lightgrey" transparent opacity={0.3} wireframe />
  </mesh>
);

class BinPacker {
  constructor(containerSize, maxWeight) {
    this.containerSize = containerSize;
    this.maxWeight = maxWeight;
    this.usedSpace = [];
    this.totalWeight = 0;
  }

  canPlaceItem(item, position) {
    const [x, y, z, l, w, h] = [...position, item.l, item.w, item.h];
    
    // Check container bounds
    if (x + l > this.containerSize[0] || 
        y + h > this.containerSize[1] || 
        z + w > this.containerSize[2]) {
      return false;
    }
    
    // Check weight limit
    if (this.totalWeight + item.weight > this.maxWeight) {
      return false;
    }
    
    // Check collisions with other items
    for (const space of this.usedSpace) {
      if (x < space.x + space.l && x + l > space.x &&
          y < space.y + space.h && y + h > space.y &&
          z < space.z + space.w && z + w > space.z) {
        return false;
      }
    }
    
    return true;
  }

  findPositionForItem(item) {
    // Try different orientations
    const orientations = [
      { l: item.l, w: item.w, h: item.h },
      { l: item.w, w: item.l, h: item.h },
      { l: item.h, w: item.w, h: item.l }
    ];

    for (const orientation of orientations) {
      item.l = orientation.l;
      item.w = orientation.w;
      item.h = orientation.h;

      // Try bottom-left-back corner strategy
      for (let y = 0; y <= this.containerSize[1] - item.h; y += 0.1) {
        for (let z = 0; z <= this.containerSize[2] - item.w; z += 0.1) {
          for (let x = 0; x <= this.containerSize[0] - item.l; x += 0.1) {
            if (this.canPlaceItem(item, [x, y, z])) {
              return { x, y, z, l: item.l, w: item.w, h: item.h };
            }
          }
        }
      }
    }
    
    return null;
  }

  addItem(item) {
    const position = this.findPositionForItem(item);
    if (position) {
      this.usedSpace.push(position);
      this.totalWeight += item.weight;
      return {
        position: [
          position.x + position.l / 2 - this.containerSize[0] / 2,
          position.y + position.h / 2 - this.containerSize[1] / 2,
          position.z + position.w / 2 - this.containerSize[2] / 2,
        ],
        size: [position.l, position.h, position.w],
        color: item.fragile ? 'red' : item.stackable ? 'green' : 'blue'
      };
    }
    return null;
  }
}

const calculatePackedItems = (items, containerSize, maxWeight) => {
  const packer = new BinPacker(containerSize, maxWeight);
  const packedItems = [];

  // Sort items by volume (largest first) for better packing
  const sortedItems = [...items].sort((a, b) => 
    (b.length * b.width * b.height) - (a.length * a.width * a.height)
  );

  for (const item of sortedItems) {
    const l = parseFloat(item.length) / 100;
    const w = parseFloat(item.width) / 100;
    const h = parseFloat(item.height) / 100;
    const weight = parseFloat(item.weight) || 0;
    const qty = parseInt(item.quantity);

    for (let i = 0; i < qty; i++) {
      const packedItem = packer.addItem({
        l, w, h, weight,
        stackable: item.stackable,
        fragile: item.fragile
      });
      
      if (packedItem) {
        packedItems.push({
          key: `${item.id}-${i}`,
          ...packedItem
        });
      }
    }
  }

  return packedItems;
};

const ThreeDViewer = ({ items, container }) => {
  const containerDimensions = {
    '20ft': [5.9, 2.35, 2.39],
    '40ft': [12.03, 2.35, 2.39],
    '40HC': [12.03, 2.35, 2.69],
  };

  const maxWeights = {
    '20ft': 28000,
    '40ft': 30000,
    '40HC': 30000,
  };

  const size = containerDimensions[container] || containerDimensions['20ft'];
  const maxWeight = maxWeights[container] || maxWeights['20ft'];

  const packedItems = calculatePackedItems(items, size, maxWeight);

  return (
    <div className="three-d-viewer">
      <h2>3D Load Visualization</h2>
      <div className="viewer-container">
        <Canvas camera={{ position: [size[0]*1.5, size[1]*1.5, size[2]*1.5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
          <ContainerBox size={size} />
          {packedItems.map((props) => (
            <BoxItem key={props.key} {...props} />
          ))}
        </Canvas>
      </div>
      <div className="legend">
        <div><span className="color-box fragile"></span> Fragile</div>
        <div><span className="color-box stackable"></span> Stackable</div>
        <div><span className="color-box normal"></span> Normal</div>
      </div>
    </div>
  );
};

export default ThreeDViewer;