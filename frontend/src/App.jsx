/*
Latest Update: 10/12/25
Description: routing for the flashcard app.
*/
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import DeckPage from "./pages/DeckPage.jsx";
import AllCoursesView from "./pages/AllCoursesView.jsx";

function App() {
	return(
		<BrowserRouter> {/* Set up routing context */}
			<Routes> {/* Define application routes */}
				<Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirect root to /dashboard */}
				<Route path="/dashboard" element={<Dashboard />} >	
					<Route index element={<AllCoursesView />} /> {/* Default view for /dashboard */}
					<Route path="course/:courseId" element={<CoursePage />} /> {/* Course page */}
					<Route path="course/:courseId/deck/:deckId" element={<DeckPage />} /> {/* Deck page */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;