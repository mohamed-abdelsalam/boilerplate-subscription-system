import { END_POINTS } from './endpoints';

export async function GetUserSubscriptionAction() {
  const response = await fetch(END_POINTS.USER_SUPSCRIPTIONS_PAGE, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
}