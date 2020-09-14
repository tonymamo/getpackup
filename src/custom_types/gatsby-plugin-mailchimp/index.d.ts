declare module 'gatsby-plugin-mailchimp' {
  export interface MailchimpResponse {
    msg: string;
    result: 'success' | 'error';
  }
  export default function addToMailchimp(
    email: string,
    fields?: {
      [key: string]: string;
    },
    endpointOverride?: string
  ): Promise<MailchimpResponse>;
}
