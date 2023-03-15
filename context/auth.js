import { useRouter, useSegments } from "expo-router";
import React, {useEffect} from "react";
import {supabase} from "@lib/supabase";

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/Welcome");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/(hadeeth)");
    }
  }, [user, segments]);
}

export function Provider(props) {
  const [user, setAuth] = React.useState(null);
  const [userLocation, setUserLocation] = React.useState(null);
  const [userPlace, setUserPlace] = React.useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuth(session.user.user_metadata);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user.user_metadata);
      }
    });
  }, []);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: (user) => setAuth(user),
        signOut: () => setAuth(null),
        user,
        setUserLocation: (location) => setUserLocation(location),
        userLocation,
        userPlace,
        setUserPlace: (place) => setUserPlace(place)
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}