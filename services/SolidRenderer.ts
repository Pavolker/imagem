import * as THREE from 'three';

const colors = {
    tetra: 0xc0392b, // Vermelho
    octa: 0x1abc9c,  // Ciano
    cube: 0xf1c40f,  // Amarelo/Dourado
    ico: 0x2980b9,   // Azul
    dodeca: 0x7f8c8d // Cinza
};

const edgeThickness = 0.08;

// Função Fábrica de Malhas Estruturais (Mesma lógica do solidos_clean.html)
function createStructuralMesh(geometryBase: THREE.BufferGeometry, color: number, scale = 1) {
    const material = new THREE.MeshPhongMaterial({ color: color, shininess: 30 });
    const structureGroup = new THREE.Group();

    const edgesGeo = new THREE.EdgesGeometry(geometryBase);
    const edgePositions = edgesGeo.attributes.position;

    for (let i = 0; i < edgePositions.count; i += 2) {
        const start = new THREE.Vector3().fromBufferAttribute(edgePositions, i);
        const end = new THREE.Vector3().fromBufferAttribute(edgePositions, i + 1);
        const direction = new THREE.Vector3().subVectors(end, start);
        const edgeGeometry = new THREE.CylinderGeometry(edgeThickness * scale, edgeThickness * scale, direction.length(), 8);
        const edgeMesh = new THREE.Mesh(edgeGeometry, material);
        edgeMesh.position.copy(start).add(direction.multiplyScalar(0.5));
        edgeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        structureGroup.add(edgeMesh);
    }
    
    const uniqueVertices = new Set<string>();
    const posAttribute = geometryBase.getAttribute('position');
    for (let i = 0; i < posAttribute.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(posAttribute, i);
        const key = `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
        if (!uniqueVertices.has(key)) {
            uniqueVertices.add(key);
            const sphereGeo = new THREE.SphereGeometry(edgeThickness * scale * 1.2, 16, 16);
            const sphereMesh = new THREE.Mesh(sphereGeo, material);
            sphereMesh.position.copy(v);
            structureGroup.add(sphereMesh);
        }
    }

    structureGroup.scale.set(scale, scale, scale);
    return structureGroup;
}

const getGeometryAndColor = (type: string) => {
    switch(type) {
        case 'tetra': return { geo: new THREE.TetrahedronGeometry(1.5), color: colors.tetra };
        case 'octa':  return { geo: new THREE.OctahedronGeometry(1.4), color: colors.octa };
        case 'cube':  return { geo: new THREE.BoxGeometry(2, 2, 2), color: colors.cube };
        case 'ico':   return { geo: new THREE.IcosahedronGeometry(1.3), color: colors.ico };
        case 'dodeca':return { geo: new THREE.DodecahedronGeometry(1.3), color: colors.dodeca };
        default: return { geo: new THREE.BoxGeometry(1,1,1), color: 0x000000 };
    }
}

export const renderSolidToUrl = async (
    solidType: 'tetra' | 'octa' | 'cube' | 'ico' | 'dodeca', 
    dualType: 'tetra' | 'octa' | 'cube' | 'ico' | 'dodeca' | null = null,
    resolution: number = 512
): Promise<string> => {
    
    // Setup Scene
    const scene = new THREE.Scene();
    // No background color set = transparent thanks to renderer alpha:true

    const width = resolution;
    const height = resolution;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3, 3, 5);
    camera.lookAt(0,0,0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Create Main Solid
    const mainData = getGeometryAndColor(solidType);
    const mainSolid = createStructuralMesh(mainData.geo, mainData.color, 1);
    
    // Random rotation for variety
    mainSolid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    
    scene.add(mainSolid);

    // Create Dual if requested
    if (dualType) {
        const dualData = getGeometryAndColor(dualType);
        const dualSolid = createStructuralMesh(dualData.geo, dualData.color, 0.55);
        
        // Align rotations if standard pair, else random
        // For simplicity in random generation, we'll parent the dual to the main solid or give it same rotation
        dualSolid.rotation.copy(mainSolid.rotation);
        
        // Specific adjustments for known pairs to look good
        if (solidType === 'cube' && dualType === 'octa') dualSolid.rotation.x += Math.PI/4; // Adjust logic as needed
        // For purely random combos, aligned rotation usually looks best or interesting
        
        scene.add(dualSolid);
    }

    // Render
    renderer.render(scene, camera);
    
    const dataUrl = renderer.domElement.toDataURL('image/png');
    
    // Cleanup
    renderer.dispose();
    mainData.geo.dispose();
    
    return dataUrl;
};
