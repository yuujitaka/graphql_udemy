async function fetchGreeting() {
  /* query is the default:
    body: JSON.stringify({
      query: 'query {greeting}',
    }), */

  const response = await fetch('http://localhost:9000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: '{greeting}',
    }),
  });

  const body = await response.json();
  return body.data.greeting;
}

fetchGreeting().then((greeting) => {
  document.getElementById('greetingText').textContent = greeting;
});
