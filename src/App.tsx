// import { Routes, Route } from "react-router-dom";
// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import LoadingScreen from "../src/components/animations/LandingPage"
// import IntroPage from "../src/pages/IntroPage"
// import BirthdayScreen from "../src/pages/BirthdayScreen"
// import PolaroidGallery from "../src/pages/Polaroidgallery"
// import VerticalTimeline from "../src/pages/VerticalTimeline"
// import BirthdayCake from "../src/pages/BirthdayCake"
// import ThirtyRoses from "../src/pages/ThirtyRoses"
// import RomanticLetter from "../src/pages/RomanticLetter"
// import FinalPage from "../src/pages/FinalPage"

// import AppRouter from "./AppRouter";

// const CLOUD_NAME:any = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// // const CLOUDINARY_UPLOAD_PRESET:any = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
// const cat_img_public_id:string = import.meta.env.VITE_CAT_IMG_PUBLIC_ID;
// const babloo_img_public_id:string = import.meta.env.VITE_BABLOO_IMG_PUBLIC_ID;
// function App() {
//   const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
//   const navigate = useNavigate();
//   return (
//     <Routes>
//       <Route path="/" element={<LoadingScreen />} />
//       <Route  path="/intro" element={<IntroPage />} />
//       <Route path="birthday" element={<BirthdayScreen name="veevha" />} />
//       <Route path="/gallery" element={<PolaroidGallery
//         cloudName={CLOUD_NAME}
//         images={[
//           { id: '1', publicId: `${cat_img_public_id}`, caption: 'The bridge, golden hour' },
//           { id: '2', publicId: `${babloo_img_public_id}`, caption: 'Coffee, 8am, still half asleep' },
//         ]}
//         onContinue={()=> navigate('/timeline')}
//         onNavigateTimeline={() => navigate('/timeline')}
//       />} />

//       <Route path="/timeline" element={<VerticalTimeline
//         milestones={[
//           { id: '1', date: 'Mar 2023', photoUrl: `${cat_img_public_id}`, title: 'First trip', description: 'Theone that started it all.' },
//           { id: '2', date: 'Aug 2023', photoUrl: `${babloo_img_public_id}`, title: 'Moved in together',description: 'Boxes everywhere, no regrets.' },
//         ]}
//         onContinue={() => navigate('/birthdaycake')}
//       />} />

//       <Route path="/birthdaycake" element={<BirthdayCake
//         candleCount={6}
//         wishText="May this year be soft, wild, and entirely yours."
//         musicRef={backgroundAudioRef}
//         onBlowCandles={() => console.log('candles blown')}
//         onNavigateRoses={() => navigate('/roses')}
//       />} />

//       <Route path="/roses" element={<ThirtyRoses />} />

//       <Route path="/romantic" element={<RomanticLetter />} />
      
//       <Route path="/final" element={<FinalPage />} />

//       <Route path="*" element={<div className="text-white text-center text-red-900 flex justify-center mt-50">Baby Yaha kuchh hai.😂😂😂</div>} />
//     </Routes>
//   );
// }

// export default App;

import AppRouter from "./AppRouter";

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;