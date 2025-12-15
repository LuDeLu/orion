"use client"

export function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Vertical lines */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        style={{
          backgroundSize: "100px 100%",
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(224, 100, 47, 0.05) 99px, rgba(224, 100, 47, 0.05) 100px)",
        }}
      />

      {/* Horizontal lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: "100% 100px",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(224, 100, 47, 0.05) 99px, rgba(224, 100, 47, 0.05) 100px)",
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />
    </div>
  )
}
