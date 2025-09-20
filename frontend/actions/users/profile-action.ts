import { END_POINTS } from '@actions/endpoints';

export async function ProfileAction(): Promise<any> {
  const response = await fetch(END_POINTS.PROFILE_PAGE, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
}