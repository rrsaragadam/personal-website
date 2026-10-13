// Four soft blobs in the livery colours, drifting slowly under a film grain.
// Pure CSS, so it costs almost nothing and still moves with reduced 3D.
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="bg-canvas pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="blob bg-g4 -top-[20vh] -left-[10vw] h-[80vh] w-[70vw]" />
      <div className="blob bg-g1 top-[10vh] right-[-15vw] h-[75vh] w-[60vw] opacity-90" />
      <div className="blob bg-g2 bottom-[-25vh] left-[15vw] h-[70vh] w-[55vw] opacity-80" />
      <div className="blob bg-g3 top-[35vh] left-[-10vw] h-[45vh] w-[40vw] opacity-90" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
