// 测试地址簿功能
const ADDRESS_BOOK_KEY = "voice-web3-address-book"

// 模拟localStorage
const mockLocalStorage = {
  data: {},
  getItem: function(key) {
    return this.data[key] || null
  },
  setItem: function(key, value) {
    this.data[key] = value
  }
}

// 设置测试数据
const testContacts = [
  { name: "张三", address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" },
  { name: "李四", address: "0x8ba1f109551bD432803012645Hac136c22C23e" },
  { name: "王五", address: "0x1234567890123456789012345678901234567890" }
]

mockLocalStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(testContacts))

function getContacts() {
  const stored = mockLocalStorage.getItem(ADDRESS_BOOK_KEY)
  if (!stored) {
    return {}
  }
  
  const contacts = JSON.parse(stored)
  const contactsMap = {}
  
  for (const contact of contacts) {
    contactsMap[contact.name] = contact.address
  }
  
  return contactsMap
}

function replaceContactsInText(text) {
  const contacts = getContacts()
  let result = text
  
  for (const [name, address] of Object.entries(contacts)) {
    const regex = new RegExp(name, "g")
    result = result.replace(regex, address)
  }
  
  return result
}

// 测试函数
function testIntentWithAddressBook(transcript) {
  const processedTranscript = replaceContactsInText(transcript)
  const contacts = getContacts()

  // 构建包含地址簿信息的查询
  let enhancedQuery = processedTranscript
  if (Object.keys(contacts).length > 0) {
    const addressBookInfo = Object.entries(contacts)
      .map(([name, address]) => `${name}: ${address}`)
      .join(", ")
    
    enhancedQuery = `${processedTranscript}

可用地址簿信息：
${addressBookInfo}

注意：你可以使用上述地址簿中的联系人名称来引用对应的地址，这样用户就不需要手动输入完整的地址。`
  }

  return enhancedQuery
}

// 运行测试
console.log("=== 测试地址簿功能 ===")
console.log("\n原始查询: 给张三转100个USDT")
console.log("增强查询:")
console.log(testIntentWithAddressBook("给张三转100个USDT"))

console.log("\n=== 测试多个联系人 ===")
console.log("\n原始查询: 给李四和王五分别转50个ETH")
console.log("增强查询:")
console.log(testIntentWithAddressBook("给李四和王五分别转50个ETH"))

console.log("\n=== 测试无地址簿情况 ===")
// 清空地址簿
mockLocalStorage.data = {}
console.log("\n原始查询: 查询我的余额")
console.log("增强查询:")
console.log(testIntentWithAddressBook("查询我的余额"))









