import { User } from 'firebase';
import { useEffect, useReducer, useState } from 'react';

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
    // eslint-disable-next-line no-shadow
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
        default:
          return {
            ...state,
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        dispatch({ type: 'auth_state_changed', user: user! });
      },
      (error: firebase.auth.Error): void => {
        dispatch({ type: 'error', error });
      }
    );

    // eslint-disable-next-line consistent-return
    return (): void => {
      unsubscribe();
    };
  }, [auth]);
  return [state.user, state.loading, state.error];
}
