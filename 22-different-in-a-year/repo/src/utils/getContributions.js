export async function getContributions() {
  const headers = {
    Authorization: `bearer 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`,
  };
  const body = {
    query: `query {
      user(login: "chungeric") {
        name
        contributionsCollection {
          contributionCalendar {
            colors
            totalContributions
            weeks {
              contributionDays {
                color
                contributionCount
                date
                weekday
              }
              firstDay
            }
          }
        }
      }
    }`,
  };
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  return data;
}
