import type { SkinProps } from "./TiltCard";

export interface SimpleSkinProps extends SkinProps {
    color?: string;
    opacity?: number;
}

export const SimpleSkin = ({
    shape,
    extrudeSettings,
    depth,
    hovered,
    children,
    color = "#444",
    hoverColor = "#333",
}: SimpleSkinProps) => {
    return (
        <>
            {/* Simple Plastic Body */}
            <mesh>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial
                    color={hovered && hoverColor ? hoverColor : color}
                    roughness={0.3}
                    metalness={0.2}
                />
            </mesh>

            {/* Content Container */}
            <group position={[0, 0, depth / 2 + 0.1]}>{children}</group>
        </>
    );
};
