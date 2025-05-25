import React, { useState, useEffect, useRef } from "react";
import ItemForm from "./components/ItemForm";
import LoadSummary from "./components/LoadSummary";
import ThreeDViewer from "./components/ThreeDViewer";
import { auth, provider } from "./Login/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { gsap } from "gsap";
import "./Scss/styles.scss";

const App = () => {
  const [items, setItems] = useState([]);
  const [container, setContainer] = useState("20ft");
  const [user, setUser] = useState(null);
  const nameRef = useRef(null);

  // GSAP animation
  useEffect(() => {
    gsap.fromTo(
      nameRef.current,
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      }
    );
  }, []);

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
      <div className="for-bg">
        <nav className="navbar">
          {user ? (
            <>
              <div className="nav-center"></div>
              <button className="sign-out-button mx-3" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <div className="nav-center">
              <button className="sign-in-button" onClick={handleSignIn}>
                Sign In with Google
              </button>
            </div>
          )}
        </nav>

        {/* Animated Name */}
        <h1 ref={nameRef} className="animated-name">
        Conatiner Load Calculator
        </h1>

        <div style={{ paddingTop: "60px" }}>
          {user ? (
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
          ) : (
            <div className="card-overlay mx-auto">
              Please sign in to use the app.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
