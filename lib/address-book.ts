const ADDRESS_BOOK_KEY = "voice-web3-address-book"

interface Contact {
  name: string
  address: string
}

function getContacts(): Record<string, string> {
  if (typeof window === "undefined") {
    return {}
  }

  const stored = localStorage.getItem(ADDRESS_BOOK_KEY)
  if (!stored) {
    return {}
  }

  const contacts: Contact[] = JSON.parse(stored)
  const contactsMap: Record<string, string> = {}
  
  for (const contact of contacts) {
    contactsMap[contact.name] = contact.address
  }
  
  return contactsMap
}

export function replaceContactsInText(text: string): string {
  const contacts = getContacts()
  let result = text
  
  for (const [name, address] of Object.entries(contacts)) {
    const regex = new RegExp(name, "g")
    result = result.replace(regex, address)
  }
  
  return result
}

export function replaceContactsInParams(params: any): any {
  if (!params || typeof params !== "object") {
    return params
  }

  const result = { ...params }
  const fieldsToReplace = ["recipient", "to", "address", "to_address", "target", "receiver"]

  for (const field of fieldsToReplace) {
    if (result[field] && typeof result[field] === "string") {
      result[field] = replaceContactsInText(result[field])
    }
  }

  return result
}
