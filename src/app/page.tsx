import Navbar from '@/component/Header';
import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden">
  {/* <Spline
    className="w-full h-full object-cover"
    scene="https://prod.spline.design/mu5rbI5FfoKPPcHP/scene.splinecode"
  /> */}
  <Navbar/>
  <Spline
    className="w-full h-full mt-10 object-cover"
    scene="https://prod.spline.design/IBM7EQFVxRq61JP4/scene.splinecode"
  />
</main>
  
  );
}
