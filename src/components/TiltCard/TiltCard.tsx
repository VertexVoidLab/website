import { useRef, useMemo, useState, type ReactNode, type ElementType } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";

export interface TiltCardGeometry {
    shape: THREE.Shape;
    extrudeSettings: {
        steps: number;
        depth: number;
        bevelEnabled: boolean;
        bevelSegments: number;
        bevelSize: number;
        bevelOffset: number;
        bevelThickness: number;
    };
    depth: number;
    width: number;
    height: number;
}

export interface SkinProps extends TiltCardGeometry {
    hovered: boolean;
    children?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow arbitrary props for specific skins
}

export interface TiltCardProps {
    /** The Skin component to render (e.g. GlassSkin) */
    Skin: ElementType<SkinProps>;
    /** Content to display inside the card */
    children?: ReactNode;
    /** Width of the card in 3D units. Default: 2 */
    width?: number;
    /** Height of the card in 3D units. Default: 3.172 */
    height?: number;
    /** Corner radius of the card. Default: 0.2 */
    radius?: number;
    /** Thickness of the card. Default: 0.025 */
    depth?: number;
    /** Position [x, y, z] in the scene */
    position?: [number, number, number];
    /** Optional click handler */
    onClick?: (event: ThreeEvent<MouseEvent>) => void;
    /** Any other props will be passed to the Skin */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const TiltCard = ({
    Skin,
    children,
    width = 2,
    height = 3.172,
    radius = 0.2,
    depth = 0.025,
    onClick,
    ...props
}: TiltCardProps) => {
    const cardRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState(false);

    useCursor(hovered);

    useFrame((state) => {
        if (!cardRef.current) return;

        const mouseX = (state.pointer.x * state.viewport.width) / 2;
        const mouseY = (state.pointer.y * state.viewport.height) / 2;

        const cardX = cardRef.current.position.x;
        const cardY = cardRef.current.position.y;

        const diffX = mouseX - cardX;
        const diffY = mouseY - cardY;

        const targetRotateY = Math.atan(diffX / 8);
        const targetRotateX = Math.atan(-diffY / 8);

        cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, targetRotateX, 0.15);
        cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, targetRotateY, 0.15);
    });

    const shape = useMemo(() => {
        const s = new THREE.Shape();
        const x = -width / 2;
        const y = -height / 2;

        s.moveTo(x, y + radius);
        s.lineTo(x, y + height - radius);
        s.quadraticCurveTo(x, y + height, x + radius, y + height);
        s.lineTo(x + width - radius, y + height);
        s.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        s.lineTo(x + width, y + radius);
        s.quadraticCurveTo(x + width, y, x + width - radius, y);
        s.lineTo(x + radius, y);
        s.quadraticCurveTo(x, y, x, y + radius);

        return s;
    }, [width, height, radius]);

    const extrudeSettings = useMemo(
        () => ({
            steps: 1,
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 20,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelThickness: 0.02,
        }),
        [depth]
    );

    // Extract position from props to apply to the group, pass rest to Skin
    const { position, ...skinProps } = props;

    return (
        <group ref={cardRef} position={position}>
            {/* Invisible Hit Box */}
            <mesh
                position={[0, 0, depth / 2]}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHover(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHover(false);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.(e);
                }}
            >
                <boxGeometry args={[width, height, depth + 0.2]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {/* Render the Skin */}
            <Skin
                shape={shape}
                extrudeSettings={extrudeSettings}
                depth={depth}
                width={width}
                height={height}
                hovered={hovered}
                {...skinProps} // Pass through extra props like glowColor
            >
                {children}
            </Skin>
        </group>
    );
};
