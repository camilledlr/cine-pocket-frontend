// components/Common/SkeletonText.jsx
const SkeletonText = ({ width = "100%", height = "1rem", radius = "4px" }) => (
  <div
    style={{
      backgroundColor: "#e0e0e0",
      borderRadius: radius,
      width,
      height,
      animation: "pulse 1.5s infinite ease-in-out",
    }}
  />
);

export default SkeletonText;
