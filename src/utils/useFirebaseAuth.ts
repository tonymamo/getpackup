import { useEffect, useReducer, useState } from 'react';
import { User } from 'firebase';

interface FirebaseWithAuth {
  auth: () => firebase.auth.Auth;
}

export default function useAuthState(
  firebase: FirebaseWithAuth
): [User | undefined, boolean, firebase.auth.Error | undefined] {
  const [auth, setAuth] = useState<undefined | firebase.auth.Auth>(undefined);

  interface State {
    user: User | undefined;
    loading: boolean;
    error: firebase.auth.Error | undefined;
  }

  type Action =
    | { type: 'auth_state_changed'; user: User }
    | { type: 'error'; error: firebase.auth.Error };

  const [state, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case 'auth_state_changed':
          return {
            ...state,
            user: action.user,
            loading: false,
          };
        case 'error':
          return {
            ...state,
            error: action.error,
            loading: false,
          };
      }
    },
    {
      user: undefined,
      loading: true,
      error: undefined,
    }
  );
  useEffect(() => {
    setAuth(firebase.auth());
  }, [firebase]);

  useEffect(() => {
    if (auth === undefined) return;

    const unsubscribe = auth.onAuthStateChanged(
      (user): void => {
        dispatch({ type: 'auth_state_changed', user });
      },
      (error: auth.Error): void => {
        dispatch({ type: 'error', error });
      }
    );

    return (): void => {
      unsubscribe();
    };
  }, [auth]);
  return [state.user, state.loading, state.error];
}
