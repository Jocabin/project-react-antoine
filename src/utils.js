export async function gh_fetch(url) {
  const response = await fetch('https://api.github.com' + url, {
    headers: {
      Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
  });
  return response.json();
}