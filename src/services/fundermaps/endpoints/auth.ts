import { get, post } from '../client'

const login = async (email: string, password: string) => {
  return await post({
    endpoint: '/auth/signin',
    body: {
      email,
      password
    },
    requireAuth: false
  })
}

const refresh = async () => {
  return await get({
    endpoint: 'auth/token-refresh',
    requireAuth: true
  })
}

const requestPasswordReset = async (email: string) => {
  return await post({
    endpoint: '/auth/reset-password',
    body: {
      email
    },
    requireAuth: false
  })
}

const resetPassword = async (
  email: string,
  token: string,
  password: string
) => {
  return await post({
    endpoint: '/auth/reset-new-password',
    body: {
      email,
      resetKey: token,
      newPassword: password
    },
    requireAuth: false
  })
}

const changePassword = async function changePassword(
  oldPassword: string,
  newPassword: string
) {
  return await post({
    endpoint: '/auth/change-password',
    body: {
      oldPassword: oldPassword,
      newPassword: newPassword
    },
    requireAuth: true
  })
}

export default {
  login,
  refresh,
  requestPasswordReset,
  resetPassword,
  changePassword
}
