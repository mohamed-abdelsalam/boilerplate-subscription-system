import { END_POINTS } from './endpoints';

export async function SignOutAction() {
  await fetch(END_POINTS.SIGN_OUT, {
    method: 'GET',
    credentials: 'include',
  });
}