import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows, Text } from "@react-three/drei";
import { Suspense } from "react";
import { SimpleSkin } from "./TiltCard/SimpleSkin";
import { TiltCard } from "./TiltCard/TiltCard";

export default function DemoScene() {
	return (
		<Canvas camera={{ position: [0, 0, 10], fov: 35 }} dpr={[1, 2]}>
			<Suspense fallback={null}>
				<Environment preset="city" environmentIntensity={1.5} />

				<spotLight
					position={[10, 10, 10]}
					angle={0.15}
					penumbra={1}
					intensity={1}
					castShadow
				/>

				<Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
					<TiltCard
						Skin={SimpleSkin}
						width={2.8}
						height={3.8}
						rotationIntensity={1.5}
						hoverColor="#6c1b89"
						color="#5d2191"
					>
						{/* Top Left Label */}
						<Text
							fontSize={0.13}
							color="white"
							fillOpacity={0.6}
							anchorX="left"
							anchorY="top"
							position={[-1.2, 1.7, 0.01]}
						>
							React Three Fiber
						</Text>

						{/* Center Title */}
						<Text
							fontSize={0.4}
							fontWeight={600}
							color="white"
							fillOpacity={0.7}
							anchorX="center"
							anchorY="middle"
							position={[0, 0, 0.01]}
						>
							TILT CARD
						</Text>

						{/* Bottom Label */}
						<Text
							fontSize={0.1}
							color="white"
							fillOpacity={0.6}
							anchorX="center"
							anchorY="bottom"
							position={[0, -1.7, 0.01]}
						>
							Physics-based interaction
						</Text>
					</TiltCard>
				</Float>

				<ContactShadows
					position={[0, -2.5, 0]}
					opacity={0.4}
					scale={10}
					blur={2.5}
					far={4}
					color="#601ca6"
				/>
			</Suspense>
		</Canvas>
	);
}
