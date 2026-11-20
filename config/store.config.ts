/**
 * Storefront branding and public business information for this deployment.
 * Customize this file for each client without changing shared UI components.
 */

type StoreConfig = {
  name: string
  description: string
  logo: string | null
  contact: {
    email: string
    phone: string
    address: string
  }
  social: {
    facebook: string
    instagram: string
    youtube: string
  }
}

export const storeConfig: StoreConfig = {
  name: "Your Store",
  description: "Your online shopping destination.",
  // Set this to a file inside /public when the client provides a logo.
  logo: null,
  contact: {
    email: "support@example.com",
    phone: "",
    address: "",
  },
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
}
