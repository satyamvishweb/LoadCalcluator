import React, { useState, useEffect } from "react";
import ItemForm from "./components/ItemForm";
import LoadSummary from "./components/LoadSummary";
import ThreeDViewer from "./components/ThreeDViewer";
import { auth, provider } from "./Login/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import "./Scss/styles.scss";

const App = () => {
  const [items, setItems] = useState([]);
  const [container, setContainer] = useState("20ft");
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        {user ? (
          <>
            <div className="nav-center"></div>{" "}
            {/* Empty to push logout right */}
            <button className="sign-out-button mx-3" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <div className="nav-center">
              <button className="sign-in-button" onClick={handleSignIn}>
                Sign In with Google
              </button>
            </div>
          </>
        )}
      </nav>

      <div style={{ paddingTop: "60px" }}>
        {/* Your app content here, pushed down so navbar doesn't overlap */}
        {user && (
          <>
            <div className="make-grid">
              <ItemForm
                items={items}
                setItems={setItems}
                container={container}
                setContainer={setContainer}
              />
              <LoadSummary items={items} container={container} />
            </div>
            {items.length > 0 && (
              <ThreeDViewer items={items} container={container} />
            )}
          </>
        )}
        {!user && <p className="text-center bg-secondary mx-auto p-5 text-light fw-bold fs-4 rounded" style={{width:"fit-content"}}>Please sign in to use the app.</p>}
      </div>
    </div>
  );
};

export default App;
