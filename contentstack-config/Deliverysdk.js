import * as Contentstack from "contentstack";

console.log("API KEY (browser)", process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY);

export const Contentstack_stack = Contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
});