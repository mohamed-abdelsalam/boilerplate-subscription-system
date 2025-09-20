import { END_POINTS } from '@actions/endpoints';

class SignInPayload {
  email: string;
  password: string;
}

export async function SignInAction(signInPayload: SignInPayload): Promise<Response> {
  return await fetch(END_POINTS.SIGN_IN, {
    method: 'POST',
    body: JSON.stringify(signInPayload),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}