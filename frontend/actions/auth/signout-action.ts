import { END_POINTS } from '@actions/endpoints';

export async function SignOutAction() {
  await fetch(END_POINTS.SIGN_OUT, {
    method: 'GET',
    credentials: 'include',
  });
}