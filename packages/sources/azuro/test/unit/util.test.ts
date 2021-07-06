import { formatIpfsHash } from '../../src/util'

describe('execute', () => {
  it('ipfs hash', () => {
    const ipfsHash = 'QmX7PPHrh5Yeo8FvLXhrwh3RQKvsNHo5oGZiDBjT86v9he'
    const result = formatIpfsHash(ipfsHash)
    const expected = '0x82534df16c1bbe48ec838455edf891bd5d4eb91291e3e7731936762b8ac0e6cd'
    expect(result).toBe(expected)
  })
})
