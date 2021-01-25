const encode = (data: { [key: string]: any }) => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
};

export default async (formName: string, values: any) =>
  // https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables
  // process.env.DEPLOY_PRIME_URL is from Netlify
  fetch(process.env.DEPLOY_PRIME_URL ? process.env.DEPLOY_PRIME_URL : 'https://getpackup.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode({
      'form-name': formName,
      ...values,
    }),
  });
