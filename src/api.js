const BASE_URL = 'https://mate.academy/students-api';

export function getUserByEmail(email) {
  return fetch(`${BASE_URL}/users?email=${email}`)
    .then(res => res.json())
    .then(users => users[0] || null)
    .catch(() => null);
}

export function createUser ({ email, name }) {
  return fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ email, name }),
  })
    .then(res => res.json())
}
