import { config } from "../config";

export async function getContributions() {
  const headers = {
    Authorization: `bearer ${config.GITHUB_ACCESS_TOKEN}`,
  };
  const body = {
    query: `query {
      user(login: "${config.GITHUB_USERNAME}") {
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
