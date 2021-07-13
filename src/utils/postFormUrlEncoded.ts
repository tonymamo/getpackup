const encode = (data: { [key: string]: any }) => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
};

export default async (formName: string, values: any) =>
  // use GATSBY_SITE_URL from netlify.toml if available
  fetch(process.env.GATSBY_SITE_URL ? process.env.GATSBY_SITE_URL : 'https://getpackup.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode({
      'form-name': formName,
      ...values,
    }),
  });
