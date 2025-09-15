import { END_POINTS } from './endpoints';

class SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function SignUpAction(signUpPayload: SignUpPayload): Promise<Response> {
  return await fetch(END_POINTS.SIGN_UP, {
    method: 'POST',
    body: JSON.stringify(signUpPayload),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
}