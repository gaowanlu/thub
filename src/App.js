import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./index.css";
import SuspensePage from "./pages/SuspensePage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

const GamePage = React.lazy(() => import("./pages/GamePage"));

function App() {
    return (
        <React.Fragment>
            <Suspense fallback={<SuspensePage />}>
                <Routes>
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route index path="*" element={<HomePage />} />
                </Routes>
            </Suspense>
        </React.Fragment>
    );
}

export default App;